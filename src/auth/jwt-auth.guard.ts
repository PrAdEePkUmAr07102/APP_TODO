import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
// Adjust the path according to your project structure

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const request = super.getRequest(context);
        return request;
    }

    async validate(payload: JwtPayload) {
        // You can add any additional validation logic here if needed
        return { userId: payload.userId }; // Ensure this matches your JWT structure
    }
}
