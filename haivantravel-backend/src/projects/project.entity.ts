import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  short_description: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  project_type: string | null;

  @Column({ type: 'int', nullable: true })
  duration_days: number | null;

  @Column({ type: 'int', nullable: true })
  guest_count: number | null;

  @Column({ type: 'int', nullable: true })
  artist_count: number | null;

  // DB column is `imge_url` (legacy typo), but we expose it as `image_url`.
  @Column({ name: 'imge_url', type: 'text' })
  image_url: string;

  @Column({ type: 'text' })
  link_url: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  html_content: string | null;

  @Column({ type: 'text', nullable: true })
  css_content: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seo_title: string | null;

  @Column({ type: 'text', nullable: true })
  seo_keywords: string | null;

  @Column({ type: 'text', nullable: true })
  seo_description: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
