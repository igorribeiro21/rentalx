import { inject, injectable } from "tsyringe";
import { v4 as uuidV4, v4 } from "uuid";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository,
        @inject("UsersTokenRepository") private usersTokenRepository: IUsersTokenRepository,
        @inject("DayjsDateProvider") private dateProvider: IDateProvider,
        @inject("EtherealMailProvider") private mailProvider: IMailProvider,
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("User does not exists!");
        }

        const token = v4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usersTokenRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date
        });

        await this.mailProvider.sendMail(email, "Recuperação de Senha", `O link para o reset é ${token}`);
    }
}

export { SendForgotPasswordMailUseCase };