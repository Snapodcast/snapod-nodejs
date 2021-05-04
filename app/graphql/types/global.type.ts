import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class VoidOutput {
	@Field({
		description: "Void return status",
		nullable: false,
	})
	public status: boolean;

	@Field({
		description: "Void return message",
		nullable: false,
	})
	public message: string;

	@Field({
		description: "Void return name",
		nullable: true,
	})
	public name: string;
}
