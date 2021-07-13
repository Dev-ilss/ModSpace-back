import { UserEntity } from '@src/user/entities';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

/**
 * @author Raul E. Aguirre H.
 * @ysp0lur
 * @description Entity from table ai_questions
 */
@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'title', type: 'varchar', length: '80', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'image_name', type: 'varchar', length: '50', nullable: false })
  imageName: string;

  @Column({ name: 'image_path', type: 'varchar', length: '250', nullable: false })
  imagePath: string;

  @ManyToOne(() => UserEntity, (user) => user.games)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
