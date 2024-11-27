import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  workspaceId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.id, {
    onDelete: 'CASCADE',
  })
  workspace: Workspace;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  // 'owner' 또는 'guest'
  // 저 중 하나로 제한 필요함 -> service에서 관리해야됨
  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
