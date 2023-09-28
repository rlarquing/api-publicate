import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../persistence/entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Activación de su cuenta de usuario.',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.username,
        code: user.codeActivation,
      },
    });
  }

  async sendRequestResetPassword(user: UserEntity) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Recuperación de la contraseña de su cuenta de usuario.',
      template: 'request-password', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.username,
        code: user.resetPasswordCode,
      },
    });
  }
}
