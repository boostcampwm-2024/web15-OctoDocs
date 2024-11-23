// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Snowflake } from '@theinternetfolks/snowflake';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index() // 인덱스 추가
  snowflakeId: string = Snowflake.generate(); // Snowflake ID 사용

  @Column({ unique: true })
  providerId: string; // 네이버/카카오 ID

  @Column()
  provider: string; // 'naver' 또는 'kakao'

  @Column()
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;
}
