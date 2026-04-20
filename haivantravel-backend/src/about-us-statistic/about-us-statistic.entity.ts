import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Check,
} from 'typeorm';

@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_1, '')), '\\s+'), 1) <= 5`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_2, '')), '\\s+'), 1) <= 5`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_3, '')), '\\s+'), 1) <= 5`,
)
@Check(
  `array_length(regexp_split_to_array(trim(COALESCE(name_4, '')), '\\s+'), 1) <= 5`,
)
@Entity('about_us_statistic')
export class AboutUsStatistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  number_1: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_1: string | null;

  @Column({ type: 'int', default: 0 })
  number_2: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_2: string | null;

  @Column({ type: 'int', default: 0 })
  number_3: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_3: string | null;

  @Column({ type: 'int', default: 0 })
  number_4: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name_4: string | null;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
