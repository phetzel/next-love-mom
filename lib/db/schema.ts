import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  audioUrl: text("audio_url").notNull(),
  vaultId: serial("vault_id")
    .references(() => vaults.id)
    .notNull(),
  depositorId: varchar("depositor_id", { length: 256 }).notNull(), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vaultContributors = pgTable("vault_contributors", {
  id: serial("id").primaryKey(),
  vaultId: serial("vault_id")
    .references(() => vaults.id)
    .notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
