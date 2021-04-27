import { Resolver, Query } from "type-graphql";

@Resolver((_of) => String)
export class PingResolver {
	@Query((_returns) => String, {
		nullable: true,
		description: "Ping pong test",
	})
	async ping(): Promise<String> {
		return "pong";
	}
}
