import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { constant } from 'src/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: constant.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    // The `payload` is the JWT's decoded data
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  }
}
