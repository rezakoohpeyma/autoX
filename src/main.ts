import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { setupApp } from "./config/setup-app";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	
	setupApp(app)
	
	const configService = app.get(ConfigService);
	const port = configService.get<number>("PORT")!;
	const host = configService.get<string>("HOST")!;
	await app.listen(port, host);
}
bootstrap();
