import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('about_us')
export class AboutUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;
}
