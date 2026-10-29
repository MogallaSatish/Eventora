import { randomUUID } from "node:crypto";
import { MongoClient, type Db } from "mongodb";
import type { EventRecord, RegistrationRecord } from "@shared/types";

let dbPromise: Promise<Db | null> | null = null;
let seedPromise: Promise<void> | null = null;

export const demoEvents: EventRecord[] = [
  {
    id: "afterglow-sessions",
    slug: "afterglow-sessions",
    title: "Afterglow Sessions",
    category: "Music",
    shortDescription: "An intimate night of live electronic sets, soft lights, and new city sounds.",
    description:
      "Afterglow is a listening room for artists who make the city feel a little stranger and a lot more alive. Three live sets, one late-night conversation, and a room built for finding your people.",
    date: "2026-11-14",
    time: "7:30 PM – 11:00 PM",
    venue: "The Glasshouse",
    location: "Lower Parel, Mumbai",
    city: "Mumbai",
    price: 1200,
    currency: "INR",
    capacity: 240,
    registeredCount: 184,
    imageTone: "#E88C6A",
    tags: ["Live music", "Late night", "Limited seats"],
    host: "Eventora Music Club",
    featured: true,
  },
  {
    id: "slow-sunday-studio",
    slug: "slow-sunday-studio",
    title: "Slow Sunday Studio",
    category: "Wellness",
    shortDescription: "A reset morning with breathwork, pottery, and a long-table brunch.",
    description:
      "Put your phone away and let the morning unfold. Slow Sunday Studio combines guided breathwork, a hands-on clay session, and a generous brunch from the people behind Sunday Social.",
    date: "2026-11-22",
    time: "9:00 AM – 1:30 PM",
    venue: "Makers Yard",
    location: "Indiranagar, Bengaluru",
    city: "Bengaluru",
    price: 1800,
    currency: "INR",
    capacity: 80,
    registeredCount: 51,
    imageTone: "#99D8C7",
    tags: ["Morning", "Hands-on", "Brunch"],
    host: "Sunday Social",
    featured: false,
  },
  {
    id: "the-new-local",
    slug: "the-new-local",
    title: "The New Local",
    category: "Community",
    shortDescription: "A one-day neighborhood festival for makers, food, and good conversations.",
    description:
      "The New Local turns a familiar street into a living room. Browse small-batch goods, taste dishes from first-time founders, and meet the neighbors making the next chapter of the city.",
    date: "2026-12-05",
    time: "11:00 AM – 8:00 PM",
    venue: "The Old Mill District",
    location: "Hauz Khas, New Delhi",
    city: "New Delhi",
    price: 650,
    currency: "INR",
    capacity: 500,
    registeredCount: 287,
    imageTone: "#F1C45C",
    tags: ["Markets", "Food", "All ages"],
    host: "Local Assembly",
    featured: false,
  },
  {
    id: "brand-after-dark",
    slug: "brand-after-dark",
    title: "Brand After Dark",
    category: "Business",
    shortDescription: "A sharp, informal salon for people building brands with a point of view.",
    description:
      "No keynotes. No lanyards. Brand After Dark is a small-room salon for founders, creative leads, and curious operators who want practical stories about building work people remember.",
    date: "2026-12-11",
    time: "6:00 PM – 9:00 PM",
    venue: "Studio 18",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    price: 2200,
    currency: "INR",
    capacity: 120,
    registeredCount: 72,
    imageTone: "#A7A1F4",
    tags: ["Founders", "Talks", "Networking"],
    host: "Good Signal Studio",
    featured: false,
  },
  {
    id: "small-plates-big-stories",
    slug: "small-plates-big-stories",
    title: "Small Plates, Big Stories",
    category: "Food & drink",
    shortDescription: "Six chefs, six plates, one long table, and the stories behind the menu.",
    description:
      "Pull up a chair for a guided tasting that brings together six independent chefs and the dishes that started it all. Expect generous pours, a little kitchen gossip, and no rushed courses.",
    date: "2026-12-18",
    time: "7:00 PM – 10:30 PM",
    venue: "Common Ground Kitchen",
    location: "Alwarpet, Chennai",
    city: "Chennai",
    price: 2600,
    currency: "INR",
    capacity: 60,
    registeredCount: 44,
    imageTone: "#F39D9B",
    tags: ["Tasting menu", "Chef-led", "Long table"],
    host: "Common Ground",
    featured: false,
  },
  {
    id: "open-form",
    slug: "open-form",
    title: "Open Form",
    category: "Design",
    shortDescription: "A live critique night for unfinished ideas, rough prototypes, and useful feedback.",
    description:
      "Open Form is a low-pressure stage for work in progress. Bring a prototype, a question, or simply your curiosity. Leave with a clearer next move and a room full of generous peers.",
    date: "2027-01-09",
    time: "4:00 PM – 8:00 PM",
    venue: "The Reading Room",
    location: "Koregaon Park, Pune",
    city: "Pune",
    price: 900,
    currency: "INR",
    capacity: 150,
    registeredCount: 93,
    imageTone: "#8ECAE6",
    tags: ["Critique", "Prototypes", "Creative"],
    host: "Open Form Collective",
    featured: false,
  },
];

const demoRegistrations: RegistrationRecord[] = [
  {
    id: "demo-registration-1",
    eventId: "afterglow-sessions",
    eventTitle: "Afterglow Sessions",
    name: "Maya Patel",
    email: "maya@example.com",
    phone: "+91 98765 43210",
    tickets: 2,
    notes: "Vegetarian snack preference.",
    status: "confirmed",
    createdAt: "2026-10-20T10:15:00.000Z",
    updatedAt: "2026-10-20T10:15:00.000Z",
  },
];

export async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3500 });
      await client.connect();
      const database = client.db("eventora");
      await database.command({ ping: 1 });
      return database;
    })().catch(error => {
      console.warn("[MongoDB] Atlas connection unavailable; using preview fallback data.", error instanceof Error ? error.message : error);
      return null;
    });
  }
  return dbPromise;
}

async function ensureSeedData(db: Db) {
  if (!seedPromise) {
    seedPromise = Promise.all(
      demoEvents.map(event =>
        db.collection<EventRecord>("events").updateOne(
          { id: event.id },
          { $setOnInsert: event },
          { upsert: true },
        ),
      ),
    ).then(() => undefined);
  }
  await seedPromise;
}

export async function listEvents(): Promise<EventRecord[]> {
  const db = await getMongoDb();
  if (!db) return demoEvents;
  await ensureSeedData(db);
  return db
    .collection<EventRecord>("events")
    .find({}, { projection: { _id: 0 } })
    .sort({ featured: -1, date: 1 })
    .toArray();
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const db = await getMongoDb();
  if (!db) return demoEvents.find(event => event.id === id) ?? null;
  await ensureSeedData(db);
  return db.collection<EventRecord>("events").findOne({ id }, { projection: { _id: 0 } });
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const db = await getMongoDb();
  if (!db) return demoRegistrations;
  return db
    .collection<RegistrationRecord>("registrations")
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function createRegistration(input: Omit<RegistrationRecord, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const record: RegistrationRecord = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
  const db = await getMongoDb();
  if (!db) {
    demoRegistrations.unshift(record);
    return record;
  }
  await db.collection<RegistrationRecord>("registrations").insertOne(record);
  await db.collection<EventRecord>("events").updateOne({ id: input.eventId }, { $inc: { registeredCount: input.tickets } });
  return record;
}

export async function updateRegistration(id: string, input: Omit<RegistrationRecord, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const db = await getMongoDb();
  if (!db) {
    const index = demoRegistrations.findIndex(item => item.id === id);
    if (index === -1) return null;
    demoRegistrations[index] = { ...demoRegistrations[index], ...input, updatedAt: now };
    return demoRegistrations[index];
  }
  const existing = await db.collection<RegistrationRecord>("registrations").findOne({ id });
  if (!existing) return null;
  await db.collection<RegistrationRecord>("registrations").updateOne({ id }, { $set: { ...input, updatedAt: now } });
  if (existing.tickets !== input.tickets) {
    await db.collection<EventRecord>("events").updateOne(
      { id: existing.eventId },
      { $inc: { registeredCount: input.tickets - existing.tickets } },
    );
  }
  return { ...existing, ...input, updatedAt: now };
}

export async function deleteRegistration(id: string) {
  const db = await getMongoDb();
  if (!db) {
    const index = demoRegistrations.findIndex(item => item.id === id);
    if (index === -1) return false;
    demoRegistrations.splice(index, 1);
    return true;
  }
  const existing = await db.collection<RegistrationRecord>("registrations").findOne({ id });
  if (!existing) return false;
  await db.collection<RegistrationRecord>("registrations").deleteOne({ id });
  await db.collection<EventRecord>("events").updateOne({ id: existing.eventId }, { $inc: { registeredCount: -existing.tickets } });
  return true;
}
