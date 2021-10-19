import { Blog } from "src/blog/model/blog.dto";

export interface User {
    id?: number
    name?: string
    username?: string
    email?: string
    password?: string
    role?: UserRole
    profileImage?: string
    blogs?: Blog[]
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}