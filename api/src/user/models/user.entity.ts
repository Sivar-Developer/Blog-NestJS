import { compare, hash } from "bcrypt";
import { BlogEntity } from "src/blog/model/blog.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ unique: true })
    email: string

    @Column({ nullable: false, select: false })
    password: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ nullable: true })
    profileImage: string

    @OneToMany(type => BlogEntity, blog => blog.author)
    blogs: BlogEntity[]

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase()
    }

}