import { classToPlain, Exclude } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt-nodejs';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  static passwordMinLength: number = 7;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  salt: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'role_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];

  @BeforeInsert()
  passwordHashInsert(): void {
    this.salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, this.salt);
  }

  @BeforeUpdate()
  passwordHashUpdate(): void {
    this.salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, this.salt);
  }

  validatePassword(password: string): boolean {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.password;
  }

  toJSON(): any {
    return classToPlain(this);
  }

  rolesString: string[];
  prefix: string;
}
