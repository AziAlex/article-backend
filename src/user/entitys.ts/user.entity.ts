import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Token } from './token.entity';
import { Article } from 'src/article/entites.ts/article.entity';
import { VerifiedUser } from './verified-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  login?: string;

  @Column()
  mail: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  userImage?: string;

  @Column({ nullable: true })
  banedReason?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',  name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Token, ({ user }) => user, { onDelete: 'CASCADE' })
  tokens: Token[]

  @OneToOne(() => VerifiedUser, ({ user }) => user, { onDelete: 'CASCADE' })
  verifiedUser: VerifiedUser

  @OneToMany(() => Article, ({ user }) => user, { onDelete: 'CASCADE' })
  articles: Article[];
}