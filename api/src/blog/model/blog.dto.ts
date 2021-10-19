import { IsBoolean, IsDate, IsEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/user/models/user.interface";

export class Blog {
    id?: number

    @IsString()
    title: string

    @IsOptional()
    @IsString()
    slug?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    body?: string

    @IsOptional()
    @IsDate()
    createdAt?: Date

    @IsOptional()
    @IsDate()
    updatedAt?: Date

    @IsOptional()
    @IsNumber()
    likes?: number

    author?: User
 
    @IsOptional()
    @IsEmpty()
    headerImage?: string

    @IsOptional()
    @IsDate()
    publishedDate?: Date

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean
}