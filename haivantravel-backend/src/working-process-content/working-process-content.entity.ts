import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type WorkingProcessCard = {
  number: string | null;
  title: string | null;
  description: string | null;
  is_active?: boolean | null;
};

@Entity('working_process_content')
export class WorkingProcessContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', nullable: true })
  cards: WorkingProcessCard[] | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

