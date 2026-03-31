import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('blog_details')
export class BlogDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 120 })
  slug: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  demo_image: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_title: string | null;

  @Column({ type: 'text', nullable: true })
  meta_keywords: string | null;

  @Column({ type: 'text', nullable: true })
  meta_description: string | null;

  @CreateDateColumn({ name: 'date' })
  date: Date;
}
