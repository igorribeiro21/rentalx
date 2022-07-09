import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../../../config/upload';
import { CreateCarController } from '../../../../modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpeficiationController } from '../../../../modules/cars/useCases/createCarSpecification/CreateCarSpeficiationController';
import { ListAvailableCarsController } from '../../../../modules/cars/useCases/listAvailableCars/listAvailableCarsController';
import { UploadCarImagesController } from '../../../../modules/cars/useCases/uploadImages/UploadCarImagesController';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpeficiationController = new CreateCarSpeficiationController();
const uploadCarImagesController = new UploadCarImagesController();

const upload = multer(uploadConfig);

carsRoutes.post("/", ensureAuthenticated, ensureAdmin, createCarController.handle);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post("/specifications/:id", ensureAuthenticated, ensureAdmin, createCarSpeficiationController.handle);

carsRoutes.post(
    "/images/:id",
    ensureAuthenticated,
    ensureAdmin,
    upload.array("images"),
    uploadCarImagesController.handle);

export { carsRoutes }