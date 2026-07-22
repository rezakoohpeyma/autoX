import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { setupApp } from "./config/setup-app";
import { AllConfigType } from "./config/config.type";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	await setupApp(app);
	const configService = app.get(ConfigService<AllConfigType>);
	const port = configService.get("PORT")!;
	const host = configService.get("HOST")!;
	await app.listen(port, host);
}
bootstrap();
