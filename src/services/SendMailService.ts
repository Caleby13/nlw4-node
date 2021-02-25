import nodemailer, {
  Transporter,
  TestAccount,
  TransportOptions,
} from "nodemailer";

import handlebars from "handlebars";
import fs from "fs";

class SendMailService {
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport(
        this.getTransporterOptions(account)
      );

      this.client = transporter;
    });
  }
  private getTransporterOptions(account: TestAccount) {
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "dev") {
      const transportOption = {
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      };
      return transportOption;
    }
    const secure = process.env.SECURE_MAIL === "true";
    const transportOption: any = {
      host: process.env.HOST_MAIL,
      port: process.env.PORT_MAIL,
      secure,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL,
      },
    };
    return transportOption;
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);
    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>",
    });
    console.log("Message sent: %s", message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
