import { MigrationInterface, QueryRunner } from 'typeorm'

export class SchemaUpdate1727610055345 implements MigrationInterface {
  name = 'SchemaUpdate1727610055345'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banner2"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "banner2" character varying NOT NULL`)
  }
}
