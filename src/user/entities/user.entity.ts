import { PrimaryGeneratedColumn, Column, Index, Entity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { hash } from 'bcryptjs';

/**
 * @author Raul E. Aguirre H.
 * @ysp0lur
 * @description Entity from table users
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '30', nullable: true, default: null })
  user: string;

  @Column({ type: 'varchar', length: '150', nullable: true, default: null })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: '150', nullable: true, default: null })
  lastName: string;

  @Column({ type: 'varchar', length: '150', nullable: true, default: null })
  email: string;

  @Column({ type: 'varchar', length: '255', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: '20', nullable: true, default: null })
  tel: string;

  @Column({ nullable: true, default: null })
  status: boolean;

  @Column({ type: 'simple-array' })
  roles: string[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<any> {
    if (!this.password) {
      return;
    }
    this.password = await hash(this.password, 10);
  }
}
