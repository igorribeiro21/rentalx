import { ICreateUserDTO } from "./ICreateUserDTO";


interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<void>;
}

export { IUsersRepository };