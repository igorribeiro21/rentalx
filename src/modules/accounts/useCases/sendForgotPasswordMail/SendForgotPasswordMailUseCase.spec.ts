import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersReposityInMemory } from "../../repositories/in-memory/UsersReposityInMemory";
import { UsersTokenRepositoryInMemory } from "../../repositories/in-memory/UsersTokenRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";


let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersReposityInMemory;
let dateProvider: DayjsDateProvider;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;

describe("Send Forgot Mail", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersReposityInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
        mailProviderInMemory = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokenRepositoryInMemory,
            dateProvider,
            mailProviderInMemory
        );
    });

    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProviderInMemory, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "128299",
            email: "mid@owior.pm",
            name: "Myrtle Baldwin",
            password: "1234"
        });

        await sendForgotPasswordMailUseCase.execute("mid@owior.pm");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if user does not exists", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("ake@wi.me")
        ).rejects.toEqual(new AppError("User does not exists!"))
    });

    it("should be able to create a usersToken", async () => {
        const generateTokenMail = jest.spyOn(usersTokenRepositoryInMemory, "create");
        
        await usersRepositoryInMemory.create({
            driver_license: "041742",
            email: "ne@jebnefbec.st",
            name: "Clyde Allison",
            password: "1234"
        });

        await sendForgotPasswordMailUseCase.execute("ne@jebnefbec.st");

        expect(generateTokenMail).toHaveBeenCalled();
    });
});