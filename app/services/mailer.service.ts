import nodemailer from "nodemailer";

const sendEmail = (email: string, subject: string, html: string) => {
	const transporter = nodemailer.createTransport({
		host: "smtpdm.aliyun.com",
		port: 465,
		secure: true,
		auth: {
			user: "noreply@email.snapodcast.com", // user name
			pass: "EkV7UNYikx3Tf9T2w9tG", // password
		},
	});

	const mailOptions = {
		from: "Snapod<noreply@email.snapodcast.com>",
		to: email,
		subject,
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log("Message sent: " + info.response);
	});
};

export default sendEmail;
