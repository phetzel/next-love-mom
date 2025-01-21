ALTER TABLE "vaults" RENAME COLUMN "is_claimed" TO "is_owner_claimed";--> statement-breakpoint
ALTER TABLE "vaults" ADD COLUMN "is_owner_invited" boolean DEFAULT false NOT NULL;