import { Router } from "express";
import passport from "passport";
import {
	restorePasswordProcess,
	updatePassword,
	failRegister,
	gitHubLogin,
	login,
	logout,
	register,
	getUsers,
	deleteUser,
	deleteInactiveUsers,
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post(
	"/register",
	passport.authenticate("register", {
		session: false,
		failureRedirect: "/api/users/failRegister",
	}),
	register
);
usersRouter.get("/failRegister", failRegister);
usersRouter.post("/login", login);
usersRouter.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] }),
	async (req, res) => {}
);
usersRouter.get(
	"/githubcallback",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/login",
	}),
	gitHubLogin
);
usersRouter.post("/logout", logout);
usersRouter.post("/restore", restorePasswordProcess);
usersRouter.put("/resetPassword", updatePassword);

usersRouter.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	getUsers
);

// endpoint for deleting an specific user
usersRouter.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	deleteUser
);

// endpoint that delete all user have been logged out in the last 30 minutes
usersRouter.delete("/", deleteInactiveUsers);

export default usersRouter;
