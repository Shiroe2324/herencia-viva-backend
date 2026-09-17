import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddAuthSessionLogs1787416434197 implements MigrationInterface {
  name = 'AddAuthSessionLogs1787416434197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."auth_session_logs_status_enum" AS ENUM('success', 'failed')`);
    await queryRunner.query(`CREATE TYPE "public"."auth_session_logs_failure_reason_enum" AS ENUM('invalid_password', 'invalid_mfa_token')`);
    await queryRunner.query(
      `CREATE TABLE "auth_session_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid, "status" "public"."auth_session_logs_status_enum" NOT NULL, "failure_reason" "public"."auth_session_logs_failure_reason_enum", "ip_address" character varying(45), "user_agent" text, "browser" character varying(100), "os" character varying(100), "device_type" character varying(50), "country" character varying(100), "city" character varying(100), "revoked_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_5ec788bd24725fbb88b8d61b1f0" PRIMARY KEY ("id")); COMMENT ON COLUMN "auth_session_logs"."id" IS 'Unique session log identifier (UUID format)'; COMMENT ON COLUMN "auth_session_logs"."session_id" IS 'Stable session identifier shared with the access/refresh token pair created on a successful login'; COMMENT ON COLUMN "auth_session_logs"."status" IS 'Outcome of the login attempt (SUCCESS or FAILED)'; COMMENT ON COLUMN "auth_session_logs"."failure_reason" IS 'Reason the login attempt failed (null when the attempt succeeded)'; COMMENT ON COLUMN "auth_session_logs"."ip_address" IS 'IP address the login attempt originated from'; COMMENT ON COLUMN "auth_session_logs"."user_agent" IS 'Raw User-Agent header sent by the client'; COMMENT ON COLUMN "auth_session_logs"."browser" IS 'Browser parsed from the User-Agent header'; COMMENT ON COLUMN "auth_session_logs"."os" IS 'Operating system parsed from the User-Agent header'; COMMENT ON COLUMN "auth_session_logs"."device_type" IS 'Device type parsed from the User-Agent header (mobile, tablet, desktop, etc.)'; COMMENT ON COLUMN "auth_session_logs"."country" IS 'Country resolved from the IP address'; COMMENT ON COLUMN "auth_session_logs"."city" IS 'City resolved from the IP address'; COMMENT ON COLUMN "auth_session_logs"."revoked_at" IS 'ISO 8601 timestamp when this session was closed (null while active)'; COMMENT ON COLUMN "auth_session_logs"."created_at" IS 'ISO 8601 timestamp of the login attempt'; COMMENT ON COLUMN "auth_session_logs"."updated_at" IS 'ISO 8601 timestamp of last update to this log'; COMMENT ON COLUMN "auth_session_logs"."deleted_at" IS 'ISO 8601 timestamp of soft deletion (null if active)'; COMMENT ON COLUMN "auth_session_logs"."user_id" IS 'Unique user identifier (UUID format)'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d099a1d28dce69535a1273175a" ON "auth_session_logs" ("session_id") `);
    await queryRunner.query(
      `COMMENT ON TABLE "auth_session_logs" IS 'Entity that persists login attempts with client/network metadata and session lifecycle state'`,
    );
    await queryRunner.query(`ALTER TABLE "auth_tokens" ADD "session_id" uuid NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "auth_tokens"."session_id" IS 'Stable session identifier shared by an access/refresh token pair, preserved across refresh rotations'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b60a8ecb2c667a3fbad37cadd5" ON "auth_tokens" ("session_id") `);
    await queryRunner.query(
      `ALTER TABLE "auth_session_logs" ADD CONSTRAINT "FK_d5364eec638eb069689286e9049" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_session_logs" DROP CONSTRAINT "FK_d5364eec638eb069689286e9049"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b60a8ecb2c667a3fbad37cadd5"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "auth_tokens"."session_id" IS 'Stable session identifier shared by an access/refresh token pair, preserved across refresh rotations'`,
    );
    await queryRunner.query(`ALTER TABLE "auth_tokens" DROP COLUMN "session_id"`);
    await queryRunner.query(`COMMENT ON TABLE "auth_session_logs" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d099a1d28dce69535a1273175a"`);
    await queryRunner.query(`DROP TABLE "auth_session_logs"`);
    await queryRunner.query(`DROP TYPE "public"."auth_session_logs_failure_reason_enum"`);
    await queryRunner.query(`DROP TYPE "public"."auth_session_logs_status_enum"`);
  }
}
