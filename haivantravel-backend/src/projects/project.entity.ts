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

  // DB column is `imge_url` (legacy typo), but we expose it as `image_url`.
  @Column({ name: 'imge_url', type: 'text' })
  image_url: string;

  @Column({ type: 'text' })
  link_url: string;

  @CreateDateColumn()
  createdAt: Date;
}
