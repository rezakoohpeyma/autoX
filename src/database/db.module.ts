import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DB_CONNECTION', 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL'); 

        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: true, 
        });

        return drizzle({ client: pool });
      },
    },
  ],
  exports: ['DB_CONNECTION'], 
})
export class DatabaseModule {}