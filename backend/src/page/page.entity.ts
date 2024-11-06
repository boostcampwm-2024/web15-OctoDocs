import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Node } from '../node/node.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column('json') //TODO: Postgres에서는 jsonb로 변경
  content: JSON | null;

  // TODO:추가적인 메타데이터 컬럼들 (예: 작성일, 수정일 등)
  // @Column()
  // createdAt: Date;

  @OneToOne(() => Node, (node) => node.page, { cascade: true })
  @JoinColumn()
  node: Node;
}
