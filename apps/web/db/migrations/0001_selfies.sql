CREATE TABLE "selfie" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"file_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "selfie" ADD CONSTRAINT "selfie_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "selfie_user_id_idx" ON "selfie" USING btree ("user_id");