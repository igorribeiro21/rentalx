import { injectable, inject } from "tsyringe";
import { sign, verify } from "jsonwebtoken";
import auth from "../../../../config/auth";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokenRepository") private usersTokenRepository: IUsersTokenRepository,
        @inject("DayjsDateProvider") private dateProvider: IDateProvider
    ) { }

    async execute(token: string): Promise<string> {
        const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

        const user_id = sub;

        const userToken = await this.usersTokenRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!userToken) {
            throw new AppError("Refresh Token does not exists!");
        }

        await this.usersTokenRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: sub,
            expiresIn: auth.expires_refresh_token_days
        });

        const refresh_token_expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days);

        await this.usersTokenRepository.create({
            expires_date: refresh_token_expires_date,
            refresh_token,
            user_id
        });

        return refresh_token;
    }

}

export { RefreshTokenUseCase };