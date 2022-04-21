import { AppError } from "../../../../errors/AppError";
import { ICreateUserDTO } from "../../repositories/ICreateUserDTO";
import { UsersReposityInMemory } from "../../repositories/in-memory/UsersReposityInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersReposityInMemory: UsersReposityInMemory;
let createUserUseCase : CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersReposityInMemory = new UsersReposityInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersReposityInMemory);
        createUserUseCase = new CreateUserUseCase(usersReposityInMemory);
    });

    it("should be able to authenticate a user",async () => {
        const user: ICreateUserDTO = {
            driver_license: "000123",
            email: "user@teste.com",
            password: "1234",
            name: "User Test"
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate an none existent user",() => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate with incorrect password",() => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: "9999",
                email: "teste@teste.com",
                password: "1234",
                name: "User Test Error"
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123456"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});