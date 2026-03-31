import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contact_data')
export class ContactData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
