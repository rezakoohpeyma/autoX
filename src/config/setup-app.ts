import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

export function setupApp(app : NestFastifyApplication) {
        const configService = app.get(ConfigService);
    
app.enableCors({
		origin: configService.get<string>("CORS_ORIGIN"),
	});
}