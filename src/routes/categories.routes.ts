import { Router, Request, Response } from 'express';
import createCategoryController from '../modules/cars/useCases/createCategory';
import { listCategoriesController } from '../modules/cars/useCases/listCategories';
import multer from 'multer';
import { importCategoryController } from '../modules/cars/useCases/importCategory';

const categoriesRoutes = Router();
const upload = multer({
    dest: "./tmp"
});


categoriesRoutes.post("/", (req, res) => createCategoryController().handle(req, res));

categoriesRoutes.get("/", (req, res) => listCategoriesController.handle(req, res));

categoriesRoutes.post("/import", upload.single("file"), (req, res) => importCategoryController.handle(req,res));

export { categoriesRoutes };