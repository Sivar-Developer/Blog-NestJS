import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { BlogEntity } from '../model/blog.entity';
import { Blog } from '../model/blog.interface';
const slugify = require('slugify')

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<Blog>,
        private userService: UserService
    ) {}

    findAll(): Observable<Blog[]> {
        return from(this.blogRepository.find({
            relations: ['author']
        }))
    }

    findByUser(userId: number): Observable<Blog[]> {
        return from(this.blogRepository.find({
            where: {
                author: userId
            },
            relations: ['author']
        })).pipe(map((blogs: Blog[]) => blogs))
    }

    findOne(id: number): Observable<Blog> {
        return from(this.blogRepository.findOne(id, { relations: ['author'] }))
    }

    create(user: User, blog: Blog): Observable<Blog> {
        blog.author = user
        return this.generateSlug(blog.title).pipe(
            switchMap((slug: string) => {
                blog.slug = slug
                return from(this.blogRepository.save(blog))
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title))
    }

    update(id: number, blog: Blog): Observable<Blog> {
        return from(this.blogRepository.update(id, blog)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    delete(id: number): Observable<any> {
        return from(this.blogRepository.delete(id))
    }
}
