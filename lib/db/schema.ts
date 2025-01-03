import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const invitationTypeEnum = pgEnum("invitation_type", [
  "contributor",
  "owner",
]);

// Tables
export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: varchar("owner_id", { length: 256 }), // Clerk user ID (nullable until claimed)
  creatorId: varchar("creator_id", { length: 256 }).notNull(), // Clerk user ID who created the vault
  ownerEmail: text("owner_email").notNull(), // Email of intended owner
  isClaimed: boolean("is_claimed").default(false).notNull(), // Whether the owner has claimed the vault
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

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  status: invitationStatusEnum("status").default("pending").notNull(),
  vaultId: serial("vault_id")
    .references(() => vaults.id)
    .notNull(),
  invitorId: varchar("invitor_id", { length: 256 }).notNull(), // Clerk user ID
  type: invitationTypeEnum("type").notNull(),
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
