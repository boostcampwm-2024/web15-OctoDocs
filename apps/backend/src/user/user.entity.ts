// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { Snowflake } from '@theinternetfolks/snowflake';

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

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateSnowflakeId() {
    this.snowflakeId = Snowflake.generate();
  }
}
