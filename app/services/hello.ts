import { Service } from "typedi";

@Service()
export class HelloService {
	create(name: string) {
		return `Hello World, ${name}`;
	}
}
