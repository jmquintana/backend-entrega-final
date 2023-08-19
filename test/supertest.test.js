import chai from "chai";
import supertest from "supertest";
import { generateProduct } from "../src/utils.js";

const expect = chai.expect;
const request = supertest("http://localhost:3000");

describe("Testing /api/products", () => {
	it("GET /api/products", async () => {
		const { _body } = await request.get("/api/products");
		expect(_body.payload.products).to.be.an("array");
	});

	// get a prooduct with the pid as ObjectId Type
	it("GET /api/products/:pid", async () => {
		const { _body } = await request.get(
			"/api/products/6434bd61219c3cecfbedd5c0"
		);
		expect(_body.payload).to.be.an("object");
	});

	it("POST /api/products", async () => {
		const newProduct = generateProduct();

		const { _body } = await request
			.post("/api/products")
			.field("title", newProduct.title)
			.field("description", newProduct.description)
			.field("category", newProduct.category)
			.field("code", newProduct.code)
			.field("price", newProduct.price)
			.field("stock", newProduct.stock)
			.field("thumbnails", newProduct.thumbnails);
		expect(_body.message).to.equal(`Product added`);
	});

	it("PUT /api/products/:pid", async () => {
		// generate random product changes
		const changes = generateProduct();

		const { _body } = await request
			.put("/api/products/643c14145438614667e36dd9")
			.field("title", changes.title)
			.field("description", changes.description)
			.field("category", changes.category)
			.field("code", changes.code)
			.field("price", changes.price)
			.field("stock", changes.stock)
			.field("thumbnails", changes.thumbnails);

		// check status = success
		expect(_body.status).to.equal("Success");
	});

	it("DELETE /api/products/:id", async () => {
		const { _body } = await request.delete(
			"/api/products/643c14145438614667e36de8"
		);
		expect(_body.status).to.equal("Success");
	});
});

describe("Testing /api/carts", () => {
	it("GET /api/carts", async () => {
		const { _body } = await request.get("/api/carts");
		expect(_body.result).to.be.an("array");
	});

	it("GET /api/carts/:id", async () => {
		const { _body } = await request.get("/api/carts/647cc6867a5479330364b480");
		expect(_body.result).to.be.an("object");
	});

	it("POST /api/carts", async () => {
		const { _body } = await request.post("/api/carts");
		expect(_body.message).to.equal(`Cart added`);
	});

	it("PUT /api/carts/:id", async () => {
		const { _body } = await request.put("/api/carts/647cc6867a5479330364b480");
		expect(_body.message).to.equal(`Cart updated`);
	});

	it("DELETE /api/carts/:id", async () => {
		const { _body } = await request.delete(
			"/api/carts/647cc6867a5479330364b480"
		);
		expect(_body.status).to.equal("Success");
	});
});

describe("Testing /api/users", () => {
	it("GET /api/users", async () => {
		const { _body } = await request.get("/api/users");
		expect(_body.payload.users).to.be.an("array");
	});

	it("GET /api/users/:id", async () => {
		const { _body } = await request.get("/api/users/643c14145438614667e36dd9");
		expect(_body.payload).to.be.an("object");
	});

	it("POST /api/users", async () => {
		const { _body } = await request.post("/api/users");
		expect(_body.message).to.equal(`User added`);
	});

	it("PUT /api/users/:id", async () => {
		const { _body } = await request.put("/api/users/643c14145438614667e36dd9");
		expect(_body.status).to.equal("Success");
	});

	it("DELETE /api/users/:id", async () => {
		const { _body } = await request.delete(
			"/api/users/643c14145438614667e36dd9"
		);
		expect(_body.status).to.equal("Success");
	});
});

console.clear();
