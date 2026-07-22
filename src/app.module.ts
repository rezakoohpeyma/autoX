import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envValidation } from "./config/env.validation";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			validationSchema: envValidation,
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000,
					limit: 10,
				},
			],
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
