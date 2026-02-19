import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedMembers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
  });

  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, "socios_ipa_xerez.json");
    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const members = JSON.parse(jsonData);

    console.log(`Found ${members.length} members to import...`);

    // Insert members into the database
    let inserted = 0;
    let skipped = 0;

    for (const member of members) {
      try {
        const query =
          "INSERT INTO ipa_members (member_number, full_name, status, join_date) VALUES (?, ?, ?, NOW())";
        await connection.execute(query, [
          member.memberNumber,
          member.fullName,
          "active",
        ]);
        inserted++;
        console.log(`✓ Inserted: ${member.memberNumber} - ${member.fullName}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          skipped++;
          console.log(
            `⊘ Skipped (duplicate): ${member.memberNumber} - ${member.fullName}`
          );
        } else {
          console.error(
            `✗ Error inserting ${member.memberNumber}:`,
            error.message
          );
        }
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Total members: ${members.length}`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped: ${skipped}`);

    // Verify the import
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM ipa_members"
    );
    console.log(`\nTotal members in database: ${rows[0].count}`);
  } catch (error) {
    console.error("Error during import:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedMembers();
