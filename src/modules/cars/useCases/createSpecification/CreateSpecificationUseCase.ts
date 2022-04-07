import { ISpecificationsRepository } from "../../repositories/implementations/ISpecificationsRepository";
import { inject, injectable } from 'tsyringe';
import { AppError } from "../../../../errors/AppError";

interface IRequest {
    name: string;
    description: string
}
@injectable()
class CreateSpecificationUseCase {
    constructor(@inject("SpecificationsRepository") private specificationRepository: ISpecificationsRepository) {

    }

    async execute({ name, description }: IRequest): Promise<void> {
        const specificationAlreadyExists = await this.specificationRepository.findByName(name);

        if (specificationAlreadyExists)
            throw new AppError("Specification Already Exists!");

        await this.specificationRepository.create({
            name,
            description
        });

    }
}

export { CreateSpecificationUseCase };