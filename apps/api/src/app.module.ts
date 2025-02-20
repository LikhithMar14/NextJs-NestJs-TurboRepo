import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule, ThrottlerGuard, seconds, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [AuthModule,
     UserModule,
     ConfigModule.forRoot({isGlobal:true}),
     PrismaModule,
    ThrottlerModule.forRoot({throttlers:[        {
      name: 'short',
      ttl: seconds(4),
      limit: 3,
      blockDuration: minutes(10),
    },
    {
      name: 'medium',
      ttl: seconds(30),
      limit: 10,
    },
    {
      name: 'long',
      ttl: seconds(60),
      limit: 20,
    },
  ],
  errorMessage: 'Wow! Slow down.',
  }),
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
