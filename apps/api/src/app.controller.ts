import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorator/public.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @SkipThrottle({short:true})
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  getHello(): string {
    return this.appService.getHello();
  }
}
