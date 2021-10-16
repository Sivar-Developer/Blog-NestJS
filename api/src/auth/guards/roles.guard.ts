import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user.user
        const hasRoles = () => roles.indexOf(user.role) > -1
        let hasPermission: boolean = false
        if (hasRoles()) { hasPermission = true }
        return user && hasPermission
    }

}