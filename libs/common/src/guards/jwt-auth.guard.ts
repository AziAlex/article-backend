import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization;

    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    if (!validateUuid(token)) {
      throw new ForbiddenException('Invalid token format');
    }
    // доработать это код когда-нибудь а именно добавить логику сравнения всех refresh токенов с token и если равен пропускать его дальше как-то так :)

    return true;
  }
}



// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";

// @Injectable()
// export class JwtAuthGuard implements CanActivate {

//     constructor(
//         private jwtService: JwtService,

//     ) { }


//     canActivate(context: ExecutionContext): boolean | Promise<boolean> {
//         const req = context.switchToHttp().getRequest()
//         try {
//             const authHeader = req.headers.authorization;
//             const bearer = authHeader.split(' ')[0]
//             const token = authHeader.split(' ')[1]
            
//             if (bearer !== 'Bearer' || !token) {
//                 throw new UnauthorizedException({ message: 'User is not authorized' })
//             }

//             const user = this.jwtService.verify(token);
//             req.user = user;
//             return true;

//         } catch (err) {
//             throw new UnauthorizedException({ message: "User is not authorized" })
//         }


//     }
// }