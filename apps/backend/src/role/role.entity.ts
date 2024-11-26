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

  @Column({ type: 'enum', enum: ['owner', 'guest'] })
  role: 'owner' | 'guest';

  @CreateDateColumn()
  createdAt: Date;
}
