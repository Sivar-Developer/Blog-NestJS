import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { map, Observable, switchMap } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";
import { Blog } from "../model/blog.interface";
import { BlogService } from "../service/blog.service";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private blogService: BlogService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const params = request.params
        const blogId: number = Number(params.id)
        const user: User = request.user

        return this.userService.findOne(user.id).pipe(
            switchMap((user: User) => this.blogService.findOne(blogId).pipe(
                map((blog: Blog) => {
                    let hasPermission = false
                    if(user.id === blog.author.id) {
                        hasPermission = true
                    }
                    return user && hasPermission;
                })
            ))
        )
    }

}