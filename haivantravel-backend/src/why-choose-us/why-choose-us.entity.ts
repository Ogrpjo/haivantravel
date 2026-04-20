import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('why_choose_us')
export class WhyChooseUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tick_1: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tick_2: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tick_3: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tick_4: string | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

