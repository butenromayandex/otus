import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsers1724500000000 implements MigrationInterface {
  name = 'CreateUsers1724500000000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "age" integer NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
