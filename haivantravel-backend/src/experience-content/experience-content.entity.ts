import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('experience_content')
export class ExperienceContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  big_image_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  small_image_1_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_image_1_name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  small_image_2_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_image_2_name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  small_image_3_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_image_3_name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  small_image_4_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_image_4_name: string | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

