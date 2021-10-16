import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(): any {
        return {}
    }

    @Get('protected')
    getHello(): any {
        return this.authService.getHello()
    }
}
