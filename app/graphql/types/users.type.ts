import { InputType, Field } from "type-graphql";

@InputType()
export class ModifyUserInfoInput {
	@Field({
		description: "User name",
		nullable: true,
	})
	public name?: string;

	@Field({
		description: "User email",
		nullable: true,
	})
	public email?: string;
}
