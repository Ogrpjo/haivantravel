import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Check,
} from 'typeorm';

@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_1, '')), '\\s+'), 1) <= 10`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_2, '')), '\\s+'), 1) <= 10`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_3, '')), '\\s+'), 1) <= 10`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_4, '')), '\\s+'), 1) <= 10`,
)
@Entity('statistic')
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  small_text: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  big_text: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  number_1: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_1: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  number_2: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_2: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  number_3: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_3: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  number_4: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_4: string | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
