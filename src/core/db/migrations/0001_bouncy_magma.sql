CREATE TYPE "public"."admin_role" AS ENUM('admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."admin_status" AS ENUM('pending', 'accepted', 'revoked', 'rejected');--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" DEFAULT 'admin' NOT NULL,
	"permissions" text[] NOT NULL,
	"token" text NOT NULL,
	"status" "admin_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"invited_by" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitation_email_unique" UNIQUE("email"),
	CONSTRAINT "invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;