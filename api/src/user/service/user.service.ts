import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authservice: AuthService
    ) {}

    create(user: User): Observable<User> {
        return this.authservice.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity()
                newUser.name = user.name
                newUser.username = user.username
                newUser.email = user.email
                newUser.role = UserRole.USER
                newUser.password = passwordHash
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach((user) => {delete user.password})
                return users
            })
        )
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(function (v) { delete v.password })
                return usersPageable
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(id)).pipe(
            map((user: User) => {
                const { password, ...result } = user
                return result
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email
        delete user.password
        return from(this.userRepository.update(id, user))
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                console.log(user)
                if(user) {
                    return this.authservice.generateJwt(user).pipe(map((jwt: string) => jwt))
                } else {
                    return 'Wrong credentials'
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => {
                return this.authservice.comparePassword(password, user.password).pipe(
                    map((match: string) => {
                        if(match) {
                            const { password, ...result } = user
                            return result
                        } else {
                            throw Error
                        }
                    })
                )
            })
        )
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ email: email }))
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
         return from(this.userRepository.update(id, user))
    }

}
