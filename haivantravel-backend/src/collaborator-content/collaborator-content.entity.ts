import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('collaborator_content')
export class CollaboratorContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  blue_text_1: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  blue_text_2: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_text: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
