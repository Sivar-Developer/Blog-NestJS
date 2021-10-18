import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogEntity } from './model/blog.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity]),
        AuthModule,
        UserModule
    ]
})
export class BlogModule {}
