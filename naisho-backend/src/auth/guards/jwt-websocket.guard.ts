import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtWebsocketGuard extends AuthGuard('jwtWs') {
    constructor() {
        super();
    }

    getRequest(context: ExecutionContext) {
        return context.switchToWs().getClient().handshake;
    }
}
