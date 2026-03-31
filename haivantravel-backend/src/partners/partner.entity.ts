import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  business_type: string;

  @Column()
  icon: string;

  @Column()
  icon_size: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  is_active: boolean;
}
