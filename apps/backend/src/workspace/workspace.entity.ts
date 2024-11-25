import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Snowflake } from '@theinternetfolks/snowflake';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  snowflakeId: string = Snowflake.generate();

  @ManyToOne(() => User, { nullable: false })
  owner: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'private' })
  visibility: 'public' | 'private';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  thumbnailUrl: string;
}
