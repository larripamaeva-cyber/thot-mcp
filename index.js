import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const THOT_API_KEY = process.env.THOT_API_KEY;

function createServer() {
  const server = new McpServer({
    name: "thot-seo-mcp",
    version: "1.0.0"
  });

  server.tool(
    "thot_maillage_interne",
    "Maillage interne SEO",
    {
      query: z.string(),
      urlactuelle: z.string()
    },
    async ({ query, urlactuelle }) => {
      const res = await fetch("https://api.thot-seo.fr/maillage_interne_suggest_api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          urlactuelle,
          apikey: THOT_API_KEY
        })
      });

      const data = await res.text();

      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

  return server;
}

app.all("/mcp", async (req, res) => {
  const server = createServer();

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID()
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(PORT, () => {
  console.log("MCP server running");
});
