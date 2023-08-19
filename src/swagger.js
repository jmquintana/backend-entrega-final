import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "./utils.js";

const options = {
	swaggerOptions: {
		basePath: "/api",
	},
	swaggerDefinition: {
		openapi: "3.0.1",
		info: {
			title: "Documentación del poder y del saber",
			version: "1.0.0",
			description: "API pensada para desafío #11 del curso de Backend de Coder",
		},
	},
	apis: [`${__dirname}./../**/*.yaml`],
};

const swaggerSpecs = swaggerJSDoc(options);

export const swaggerConfig = (app) => {
	app.use(
		"/apidocs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpecs, { swaggerOptions: { basePath: "/api" } })
	);
};
