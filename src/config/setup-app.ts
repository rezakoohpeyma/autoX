import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { useContainer } from "class-validator";
import { AllConfigType } from "./config.type";

export function setupApp(app: NestFastifyApplication) {
	const configService = app.get(ConfigService<AllConfigType>);

	app.enableCors({
		origin: configService.get("CorsOrigin"),
	});
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.enableShutdownHooks();
	app.setGlobalPrefix(
		configService.getOrThrow("ApiPrefix", { infer: true }),
		{ exclude: ["/"] },
	);
}
