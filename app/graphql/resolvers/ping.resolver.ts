import { Resolver, Query, Arg, Ctx, UnauthorizedError } from "type-graphql";
import { Context } from "koa";
import { ProfileInterface } from "../../services/login.service";

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

const authentication = (ctx: JWTContext, email: string) => {
	if (ctx.state.user.email !== email) {
		throw new UnauthorizedError();
	}
};

@Resolver((_of) => String)
export class PingResolver {
	@Query((_returns) => String, {
		nullable: true,
		description: "Ping pong test",
	})
	async ping(): Promise<String> {
		return "pong";
	}

	@Query((_returns) => String, {
		nullable: true,
		description: "Authorized ping pong test",
	})
	async pingAuth(@Arg("email") email: string, @Ctx() ctx: JWTContext) {
		authentication(ctx, email);
		return "pong";
	}
}
