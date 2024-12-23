ALTER TABLE "vaults" ALTER COLUMN "owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vaults" ADD COLUMN "creator_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "vaults" ADD COLUMN "owner_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vaults" ADD COLUMN "is_claimed" boolean DEFAULT false NOT NULL;