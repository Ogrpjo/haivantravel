import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('request_phone')
export class RequestPhone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  phone: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
