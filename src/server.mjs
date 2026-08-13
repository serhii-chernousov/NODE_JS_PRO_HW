import Fastify from "fastify";
import pg from "pg";
import { fileURLToPath } from "node:url";

export function buildApp() {
  const app = Fastify({ logger: false });
  const pool = process.env.DATABASE_URL
    ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
    : null;

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/users", async (req, reply) => {
    if (!pool) return reply.code(503).send({ error: "DATABASE_URL не задано" });
    const { rows } = await pool.query("select id, name from users order by id");
    return rows;
  });

  return { app, pool };
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const { app, pool } = buildApp();

  for (const sig of ["SIGTERM", "SIGINT"]) {
    process.on(sig, async () => {
      console.log(`\n[${sig}] закриваюсь коректно…`);
      await app.close();
      await pool?.end();
      process.exit(0);
    });
  }

  await app.listen({ port: 3000, host: "0.0.0.0" });
  console.log(
    `слухаю :3000  ·  hostname=${process.env.HOSTNAME}  ·  uid=${process.getuid?.()}`,
  );
}
