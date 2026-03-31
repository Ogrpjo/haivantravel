import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_overview')
export class CompanyOverview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description1: string | null;

  @Column({ type: 'text', nullable: true })
  description2: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  big_image_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  small_image_url: string | null;
}
