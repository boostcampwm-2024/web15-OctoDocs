// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index()
  snowflakeId: string;

  @Column({ unique: true })
  providerId: string; // 네이버/카카오 ID

  @Column()
  provider: string; // 'naver' 또는 'kakao'

  @Column()
  email: string;

  @Column({
    default: '#FF8A8A',
  })
  cursorColor: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
