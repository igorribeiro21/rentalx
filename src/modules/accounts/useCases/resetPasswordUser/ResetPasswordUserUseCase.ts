import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";
import { hash } from "bcrypt";

interface IRequest {
    refresh_token: string;
    password: string;
}

@injectable()
class ResetPasswordUserUseCase {
    constructor(
        @inject("UsersTokenRepository") private usersTokenRepository: IUsersTokenRepository,
        @inject("DayjsDateProvider") private dateProvider: IDateProvider,
        @inject("UsersRepository") private usersRepository: IUsersRepository,
    ) { }

    async execute({ refresh_token, password }: IRequest): Promise<void> {
        const userToken = await this.usersTokenRepository.findByRefreshToken(refresh_token);

        if (!userToken) {
            throw new AppError("Token invalid!");
        }

        if (this.dateProvider.compareIfBefore(userToken.expires_date, this.dateProvider.dateNow())) {
            throw new AppError("Token expired!");
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password, 8);

        await this.usersRepository.create(user);

        await this.usersTokenRepository.deleteById(userToken.id);

    }
}

export { ResetPasswordUserUseCase };