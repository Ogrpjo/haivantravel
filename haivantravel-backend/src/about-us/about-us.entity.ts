import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';

@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(small_text, '')), '\\s+'), 1) <= 15`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(big_text, '')), '\\s+'), 1) <= 8`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(description, '')), '\\s+'), 1) <= 150`,
)
@Entity('about_us')
export class AboutUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  image_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
