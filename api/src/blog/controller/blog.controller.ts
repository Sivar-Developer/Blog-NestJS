import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { Blog } from '../model/blog.interface';
import { BlogService } from '../service/blog.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Image } from '../model/image.interface';


export const storage = {
    storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extension: string = path.parse(file.originalname).ext
            cb(null, `${filename}${extension}`)
        }
    })
}

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

    @Get('paginated')
    indexPaginated(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<Blog>> {
        limit = limit > 100 ? 100 : limit
        
        return this.blogService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: 'http://localhost:3000/blogs/paginated'
        })
    }

    @Get('paginated/:user')
    indexPaginatedByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number
    ): Observable<Pagination<Blog>> {
        limit = limit > 100 ? 100 : limit
        
        return this.blogService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: 'http://localhost:3000/blogs/paginated'
        })
    }

    @Get(':id')
    show(@Param('id') id: number): Observable<Blog> {
        return this.blogService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('headerImage', storage))
    store(@UploadedFile() file: Image, @Body() blog: Blog, @Request() req): Observable<Blog> {
        const user = req.user
        if(file) blog.headerImage = file.filename
        return this.blogService.create(user, blog)
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() blog: Blog): Observable<Blog> {
        return this.blogService.update(Number(id), blog)
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<any> {
        return this.blogService.delete(Number(id))
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return of(file)
    }

}
