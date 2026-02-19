import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { privateDocuments } from "./drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const docs = await db.select().from(privateDocuments);
console.log(JSON.stringify(docs, null, 2));

await connection.end();
