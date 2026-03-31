import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PageType = 'home' | 'blog';
export type SectionType =
  | 'gallery'
  | 'statistics'
  | 'emotion_creator'
  | 'company_overview'
  | 'about_us';

@Entity('website_contents')
export class WebsiteContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  page: PageType;

  @Column({ type: 'varchar', length: 50 })
  section: SectionType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({ type: 'jsonb', nullable: true })
  extra_data: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
