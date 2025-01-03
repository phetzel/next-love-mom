CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."invitation_type" AS ENUM('collaborator', 'owner');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"vault_id" serial NOT NULL,
	"invitor_id" varchar(256) NOT NULL,
	"type" "invitation_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_vault_id_vaults_id_fk" FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON DELETE no action ON UPDATE no action;