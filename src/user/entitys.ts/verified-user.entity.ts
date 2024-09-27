import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class VerifiedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.verifiedUser)
  @JoinColumn()
  user: User;
}