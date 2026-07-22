import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { useContainer } from "class-validator";
import { AllConfigType } from "./config.type";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import validationOptions from "@/utils/validation-option";
import { Reflector } from "@nestjs/core";
import { ResolvePromisesInterceptor } from "@/utils/serializer.interceptor";
import helmet from "@fastify/helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
export async function setupApp(app: NestFastifyApplication) {
	const configService = app.get(ConfigService<AllConfigType>);

	app.enableCors({
		origin: configService.get("CORS_ORIGIN"),
	});
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.enableShutdownHooks();
	app.setGlobalPrefix(configService.getOrThrow("API_PREFIX", { infer: true }), {
		exclude: ["/"],
	});
	app.useGlobalPipes(new ValidationPipe(validationOptions));
	await app.register(helmet);
	app.useGlobalInterceptors(
		// ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
		// https://github.com/typestack/class-transformer/issues/549
		new ResolvePromisesInterceptor(),
		new ClassSerializerInterceptor(app.get(Reflector)),
	);
	const config = new DocumentBuilder()
		.setTitle("AutoX API")
		.setDescription("The AutoX API descriptio")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, documentFactory);
}
