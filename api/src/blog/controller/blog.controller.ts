import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Blog } from '../model/blog.interface';
import { BlogService } from '../service/blog.service';

@Controller('blogs')
export class BlogController {

    constructor(private blogService: BlogService) {}

    @Get()
    index(@Query('userId') userId: number): Observable<Blog[]> {
        if(userId == null) {
            return this.blogService.findAll()
        } else {
            return this.blogService.findByUser(userId)
        }
    }

    @Get(':id')
    show(@Param('id') id: number): Observable<Blog> {
        return this.blogService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    store(@Body() blog: Blog, @Request() req): Observable<Blog> {
        const user = req.user.user
        return this.blogService.create(user, blog)
    }

}
