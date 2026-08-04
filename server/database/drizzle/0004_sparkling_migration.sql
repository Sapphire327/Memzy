ALTER TABLE "users" DROP COLUMN "hasActivated";
ALTER TABLE "users" RENAME COLUMN "email" TO "login";
ALTER TABLE "users" ALTER COLUMN "login" TYPE varchar(50);
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";
ALTER TABLE "users" ADD CONSTRAINT "users_login_unique" UNIQUE("login");