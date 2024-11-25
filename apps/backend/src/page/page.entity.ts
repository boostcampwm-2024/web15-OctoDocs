import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Node } from '../node/node.entity';
import { Snowflake } from '@theinternetfolks/snowflake';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index()
  snowflakeId: string = Snowflake.generate();

  @Column()
  title: string;

  @Column('json') //TODO: Postgres에서는 jsonb로 변경
  content: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ nullable: true })
  emoji: string | null;

  @OneToOne(() => Node, (node) => node.page, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  node: Node;
}
