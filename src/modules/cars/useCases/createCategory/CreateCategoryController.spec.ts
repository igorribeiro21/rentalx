import request from 'supertest';
import { app } from '../../../../shared/infra/http/app';

describe("Create Category Controller", () => {
    it("should be able to createw a new category",async () => {
        const response = await request(app).post("/categories")
        .send({
            name: "Category Supertest",
            description: "Category Supertest Description"
        });

        expect(response.status).toBe(201);
    
    });
});