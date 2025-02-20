import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule, ThrottlerGuard} from "@nestjs/Throttler"
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [AuthModule,
     UserModule,
     ConfigModule.forRoot({isGlobal:true}),
     PrismaModule,
     ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
