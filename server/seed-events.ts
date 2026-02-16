import { drizzle } from "drizzle-orm/mysql2";
import { events } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const initialEvents = [
  {
    title: "Police Week 2026",
    description: "Vive una experiencia única con IPA Málaga e IPA Xerez. Honra, hermandad y orgullo policial internacional. Washington D.C.",
    date: new Date("2026-05-11"),
    location: "Washington D.C., USA",
    eventType: "police-week",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/bspODVNHZxCvOkZg.PNG",
    registrationUrl: "https://policeweek.org",
  },
  {
    title: "Puy du Fou",
    description: "3 días / 2 noches en el mayor espectáculo del mundo. Incluye autocar, hotel, entrada Puy du Fou y Sueño de Toledo. Precio: 360€ por persona.",
    date: new Date("2026-04-17"),
    location: "Torrejón de Ardoz, Francia",
    eventType: "puy-du-fou",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/rSrxZOWeehjBrPoF.jpeg",
    registrationUrl: "https://selmaviajes.com/17-04-26-puy-du-fou-especial-ipa/",
  },
];

async function seed() {
  try {
    console.log("Inserting initial events...");
    await db.insert(events).values(initialEvents);
    console.log("✅ Events inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting events:", error);
    process.exit(1);
  }
}

seed();
