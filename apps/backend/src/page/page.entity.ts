import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Node } from '../node/node.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  // TODO:추가적인 메타데이터 컬럼들(user 기능 추가할때)
  // @Column('created_by')
  // createdBy: string;

  // @Column('updated_by')
  // updatedBy: string;

  @OneToOne(() => Node, (node) => node.page, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  node: Node;
}
