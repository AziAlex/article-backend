import { MigrationInterface, QueryRunner } from 'typeorm'

export class SchemaUpdate1727609667876 implements MigrationInterface {
  name = 'SchemaUpdate1727609667876'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "banner" TO "banner2"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "banner2" TO "banner"`)
  }
}
