import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  key: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  subject_template: string;

  @Column({ type: 'text' })
  html_template: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
