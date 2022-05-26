import { Request, Response } from "express";

class DevolutionRentalController {
    async handle(req: Request, res: Response): Promise<Response> {
        return res.send();
    }   
}

export { DevolutionRentalController };