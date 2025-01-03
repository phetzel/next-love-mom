ALTER TABLE "public"."invitations" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."invitation_type";--> statement-breakpoint
CREATE TYPE "public"."invitation_type" AS ENUM('contributor', 'owner');--> statement-breakpoint
ALTER TABLE "public"."invitations" ALTER COLUMN "type" SET DATA TYPE "public"."invitation_type" USING "type"::"public"."invitation_type";