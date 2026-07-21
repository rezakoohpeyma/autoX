import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	const configService = app.get(ConfigService);
	
	app.enableCors({
		origin: configService.get<string>("CORS_ORIGIN"),
	});
	const port = configService.get<number>("PORT")!;
	const host = configService.get<string>("HOST")!;
	await app.listen(port, host);
}
bootstrap();
