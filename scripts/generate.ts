/**
 * Generate src/tools/*.ts from the consolidated OpenAPI spec.
 *
 * For each operation in the spec, emit a TypeScript module with:
 *   - a zod schema for the input
 *   - a `registerXxx(server)` function that calls server.registerTool(...)
 *
 * Tool naming: `vturb_<category>_<rest_of_path>` (globally unique, self-identifying).
 * Modules are grouped by first path segment.
 *
 * Run with:  npm run generate
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type OpenAPISchema = {
  type?: string;
  format?: string;
  description?: string;
  enum?: unknown[];
  default?: unknown;
  example?: unknown;
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
};

type Operation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: {
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: OpenAPISchema;
  }[];
  requestBody?: {
    required?: boolean;
    content?: { "application/json"?: { schema?: OpenAPISchema } };
  };
};

type Param = {
  name: string;
  required: boolean;
  schema: OpenAPISchema;
  description: string;
};

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SPEC_PATH = join(ROOT, "specs", "vturb-openapi.json");
const TOOLS_DIR = join(ROOT, "src", "tools");

const RESERVED = new Set([
  "default",
  "function",
  "class",
  "type",
  "interface",
  "delete",
  "new",
  "in",
  "of",
  "for",
  "while",
  "do",
  "if",
  "else",
  "return",
  "this",
  "void",
]);

function safeName(name: string): string {
  return RESERVED.has(name) ? `${name}_` : name;
}

function snake(s: string): string {
  return s
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[-\s]/g, "_");
}

function category(path: string): string {
  const parts = path.split("/").filter((p) => p && !p.startsWith("{"));
  return snake(parts[0] ?? "misc");
}

function funcName(path: string): string {
  const parts = path.split("/").filter((p) => p && !p.startsWith("{"));
  return `vturb_${snake(parts.join("_"))}`;
}

function zodFor(schema: OpenAPISchema): string {
  const t = schema.type ?? "string";
  switch (t) {
    case "integer":
      return "z.number().int()";
    case "number":
      return "z.number()";
    case "boolean":
      return "z.boolean()";
    case "array": {
      const inner = schema.items ? zodFor(schema.items) : "z.string()";
      return `z.array(${inner})`;
    }
    case "object":
      return "z.record(z.unknown())";
    default: {
      if (schema.enum && schema.enum.length) {
        const lits = schema.enum.map((v) => JSON.stringify(v)).join(", ");
        return `z.enum([${lits}] as const)`;
      }
      return "z.string()";
    }
  }
}

function paramDoc(p: Param): string {
  const extras: string[] = [];
  if (p.schema.enum) extras.push(`Values: ${p.schema.enum.join(", ")}`);
  if (p.schema.format) extras.push(`Format: ${p.schema.format}`);
  if (p.schema.default !== undefined)
    extras.push(`Default: ${p.schema.default}`);
  if (p.schema.example !== undefined)
    extras.push(`Example: ${p.schema.example}`);
  const cleanDesc = (p.description || "").replace(/\s+/g, " ").trim();
  const tag = p.required ? "required" : "optional";
  return `  - \`${p.name}\` (${tag}): ${cleanDesc}${extras.length ? ` [${extras.join("; ")}]` : ""}`;
}

function collectParams(method: string, op: Operation): Param[] {
  if (method === "POST") {
    const schema = op.requestBody?.content?.["application/json"]?.schema;
    if (!schema || schema.type !== "object" || !schema.properties) return [];
    const required = new Set(schema.required ?? []);
    return Object.entries(schema.properties).map(([name, prop]) => ({
      name,
      required: required.has(name),
      schema: prop,
      description: prop.description?.trim() ?? "",
    }));
  }
  return (op.parameters ?? []).map((p) => ({
    name: p.name,
    required: !!p.required,
    schema: p.schema ?? {},
    description: p.description?.trim() ?? "",
  }));
}

function emitTool(path: string, method: "GET" | "POST", op: Operation): string {
  const fname = funcName(path);
  const params = collectParams(method, op);
  const sorted = [...params].sort(
    (a, b) =>
      Number(!a.required) - Number(!b.required) || a.name.localeCompare(b.name),
  );

  const schemaLines = sorted.map((p) => {
    let line = `    ${JSON.stringify(p.name)}: ${zodFor(p.schema)}`;
    if (!p.required) line += `.optional()`;
    const desc = (p.description || "").replace(/\s+/g, " ").trim();
    if (desc) line += `.describe(${JSON.stringify(desc)})`;
    return `${line},`;
  });

  const summary = (op.summary || "").trim();
  const description = (op.description || "").trim();
  const docLines = [summary || `${method} ${path}`, "", `${method} ${path}`];
  if (description && description !== summary) docLines.push("", description);
  if (sorted.length) {
    docLines.push("", "Args:");
    sorted.forEach((p) => docLines.push(paramDoc(p)));
  }
  const docstring = docLines.join("\n");

  // Build the request body / params object from validated input keys.
  // Reserved-word safety isn't strictly needed because we destructure by literal key
  // strings, but we keep the `args` value pattern simple.
  const callExpr =
    method === "POST"
      ? `await vturbPost(${JSON.stringify(path)}, args as Record<string, unknown>)`
      : `await vturbGet(${JSON.stringify(path)}, args as Record<string, unknown>)`;

  return `export function register_${fname}(server: McpServer): void {
  server.registerTool(
    ${JSON.stringify(fname)},
    {
      description: ${JSON.stringify(docstring)},
      inputSchema: {
${schemaLines.join("\n")}
      },
    },
    async (args) => {
      try {
        const result = ${callExpr};
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        const e = err as { message?: string; status?: number; details?: unknown };
        return {
          isError: true,
          content: [{ type: "text", text: \`VTurb error (\${e.status ?? 0}): \${e.message ?? String(err)}\` }],
        };
      }
    },
  );
}
`;
}

function header(cat: string): string {
  return `/**
 * Auto-generated VTurb Analytics tools — ${cat}.
 *
 * Do not edit by hand. Regenerate with:
 *   npm run generate
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { vturbGet, vturbPost } from "../client.js";

`;
}

function main(): void {
  const spec = JSON.parse(readFileSync(SPEC_PATH, "utf8")) as {
    paths: Record<string, Record<string, Operation>>;
  };

  // Wipe existing generated modules but keep an index.ts placeholder
  try {
    for (const f of readdirSync(TOOLS_DIR)) {
      if (f !== "index.ts" && f.endsWith(".ts")) unlinkSync(join(TOOLS_DIR, f));
    }
  } catch {
    mkdirSync(TOOLS_DIR, { recursive: true });
  }
  mkdirSync(TOOLS_DIR, { recursive: true });

  const byCategory = new Map<string, string[]>();
  const allRegistrars: { cat: string; fname: string }[] = [];

  const sortedPaths = Object.keys(spec.paths).sort();
  for (const path of sortedPaths) {
    const methods = spec.paths[path];
    for (const [methodLower, op] of Object.entries(methods)) {
      const method = methodLower.toUpperCase() as "GET" | "POST";
      if (method !== "GET" && method !== "POST") continue;
      const cat = category(path);
      const fname = funcName(path);
      const src = emitTool(path, method, op);
      byCategory.set(cat, [...(byCategory.get(cat) ?? []), src]);
      allRegistrars.push({ cat, fname });
    }
  }

  for (const [cat, funcs] of byCategory) {
    const file = join(TOOLS_DIR, `${cat}.ts`);
    writeFileSync(file, header(cat) + funcs.join("\n"));
  }

  const indexLines = [
    `/** Auto-generated tools index. Regenerate with: npm run generate */`,
    `import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";`,
    "",
  ];
  const categoriesSeen = [...new Set(allRegistrars.map((r) => r.cat))].sort();
  for (const cat of categoriesSeen) {
    indexLines.push(`import * as ${cat} from "./${cat}.js";`);
  }
  indexLines.push(
    "",
    "export function registerAllTools(server: McpServer): number {",
    "  let n = 0;",
  );
  for (const reg of allRegistrars) {
    indexLines.push(`  ${reg.cat}.register_${reg.fname}(server); n++;`);
  }
  indexLines.push("  return n;", "}");
  writeFileSync(join(TOOLS_DIR, "index.ts"), indexLines.join("\n") + "\n");

  // eslint-disable-next-line no-console
  console.log(
    `Generated ${allRegistrars.length} tools across ${categoriesSeen.length} modules:`,
  );
  for (const cat of categoriesSeen) {
    const n = allRegistrars.filter((r) => r.cat === cat).length;
    // eslint-disable-next-line no-console
    console.log(`  ${cat}: ${n}`);
  }
}

main();
