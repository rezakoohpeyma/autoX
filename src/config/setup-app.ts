import { AppModule } from "@/app.module";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { useContainer } from "class-validator";
import { AllConfigType } from "./config.type";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import validationOptions from "@/utils/validation-option";
import { Reflector } from "@nestjs/core";
import { ResolvePromisesInterceptor } from "@/utils/serializer.interceptor";
import helmet from '@fastify/helmet'
export async function setupApp(app: NestFastifyApplication) {
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
	app.useGlobalPipes(new ValidationPipe(validationOptions));
	await app.register(helmet)
	  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
