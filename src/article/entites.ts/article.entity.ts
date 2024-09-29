import { User } from 'src/user/entitys.ts/user.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  articleImage?: string

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column('simple-array')
  tags: string[]

  @Column()
  markup: string

  @Column('simple-array')
  images: string[]

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.articles)
  user: User
}
