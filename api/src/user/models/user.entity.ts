import { compare, hash } from "bcrypt";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name: string

    @Column({ unique: true, nullable: false })
    username: string

    @Column()
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ nullable: true })
    profileImage: string

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase()
    }

}