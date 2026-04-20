import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type EventProviderCard = {
  type: string | null;
  title: string | null;
  description: string | null;
  is_active?: boolean | null;
};

@Entity('event_provider')
export class EventProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'text', nullable: true })
  right_text: string | null;

  @Column({ type: 'jsonb', nullable: true })
  cards: EventProviderCard[] | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

