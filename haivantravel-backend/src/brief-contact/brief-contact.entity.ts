import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('brief_contact')
export class BriefContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'text' })
  company_name: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  event_type: string;

  @Column({ type: 'text' })
  attendee_scale: string;

  @Column({ type: 'text' })
  budget: string;

  @Column({ type: 'text' })
  expected_time: string;

  @Column({ type: 'text' })
  requirements: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}

