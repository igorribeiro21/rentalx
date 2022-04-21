import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../repositories/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from 'bcrypt';
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
class CreateUserUseCase {
    constructor(@inject("UsersRepository") private usersRepository: IUsersRepository) {

    }

    async execute({ name, password, email, driver_license }: ICreateUserDTO): Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if(userAlreadyExists){
            throw new AppError("User Already exists");
        }
        const passwordHash = await hash(password, 8);

        await this.usersRepository.create({
            name,
            password: passwordHash,
            email,
            driver_license
        });
    }
}

export { CreateUserUseCase };