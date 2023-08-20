import { Router } from "express";
import {
	checkRegistered,
	checkLogin,
	checkSession,
	checkAdmin,
	checkUser,
} from "../middlewares/auth.js";
import {
	renderPaginatedProducts,
	renderProduct,
} from "../controllers/products.controller.js";
import {
	renderCartById,
	editProductQuantity,
	renderCarts,
} from "../controllers/carts.controller.js";
import { renderUsers } from "../controllers/users.controller.js";
import {
	passportCall,
	handlePolicies,
	validateTokenJwt,
	checkRoles,
} from "../middlewares/authorization.js";

const viewsRouter = Router();

viewsRouter.get("/", passportCall("jwt"), renderPaginatedProducts);

viewsRouter.get(
	"/carts",
	passportCall("jwt"),
	(req, res, next) => checkRoles(req, res, next, ["admin"]),
	renderCarts
);
viewsRouter.get("/product/:pid", passportCall("jwt"), renderProduct);
viewsRouter.put("/:cid", editProductQuantity);
viewsRouter.get("/cart/:cid", passportCall("jwt"), renderCartById);
viewsRouter.get("/register", checkRegistered, (req, res) => {
	res.render("register");
});
viewsRouter.get("/login", checkSession, (req, res) => {
	res.render("login");
});
viewsRouter.get("/profile", passportCall("jwt"), (req, res) => {
	console.log(req.user);
	res.render("profile", { user: req.user });
});
viewsRouter.get("/restore", (req, res) => {
	res.render("restore");
});
viewsRouter.get("/reset", validateTokenJwt, (req, res) => {
	res.render("reset");
});
viewsRouter.get(
	"/users",
	passportCall("jwt"),
	(req, res, next) => checkRoles(req, res, next, ["admin"]),
	renderUsers
);

export default viewsRouter;
