import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    
    handleRequest(err, user, info){
        
        if(err || !user){
            throw err || new UnauthorizedException('Operación no Autorizada') // TODO: Usar constante
        }
        return user;
    }
}