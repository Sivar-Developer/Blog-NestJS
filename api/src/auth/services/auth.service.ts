import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    generateJwt(user: User): Observable<string> {
        return from(this.jwtService.signAsync({ user: user }))
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    comparePassword(password: string, passwordHash: string): Observable<any|boolean> {
        return of<any|boolean>(bcrypt.compare(password, passwordHash))
    }

}
