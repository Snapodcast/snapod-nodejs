export const print = {
	log: (text: string) => console.log("\x1b[37m%s \x1b[2m%s\x1b[0m", ">", text),
	error: (text: string) =>
		console.log("\x1b[31m%s \x1b[31m%s\x1b[0m", ">", text),
	success: (text: string) =>
		console.log("\x1b[32m%s \x1b[32m%s\x1b[0m", ">", text),
};
