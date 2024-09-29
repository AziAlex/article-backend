import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  token: string

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @Column()
  userAgent: string

  @ManyToOne(() => User, (user) => user.tokens)
  user: User
}
