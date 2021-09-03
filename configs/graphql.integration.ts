import path from "path";
import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { print } from "../utilities/print";

export async function useGraphQL(
	app: Koa<Koa.DefaultState, Koa.DefaultContext>
) {
	// create Apollo GraphQL server
	const server = new ApolloServer({
		schema: await buildSchema({
			resolvers: [path.resolve(__dirname + "/../app/graphql/resolvers/*")],
		}),
		introspection: true,
		context: ({ ctx }) => ctx,
	});

	// wait for server to start
	await server.start();

	// register GraphQL middleware and start serving
	server.applyMiddleware({
		app,
		path: `/v${process.env.SERVICE_VERSION}/api/graphql`,
	});

	print.success(
		`GraphQL API route: /v${process.env.SERVICE_VERSION}/api/graphql`
	);

	return server;
}
