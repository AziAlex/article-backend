import { config as dotenvConfig } from 'dotenv'
import { DataSource } from 'typeorm'
import * as process from 'node:process'

dotenvConfig({ path: `.${process.env.NODE_ENV}.env` })

export default new DataSource({
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: +process.env.POSTGRES_PORT,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DB}`,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
})
