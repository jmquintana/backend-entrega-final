import { usersService, cartsService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isValidPassword } from "../utils.js";

const {
	jwt: { cookieName, secret },
} = config;

export const register = async (req, res) => {
	try {
		const response = req.user;
		return res.send(response);
	} catch (error) {
		return res.status(500).send({
			ok: false,
			status: "Error",
			message: "Failed to register user",
			error: `${error}`,
		});
	}
};

export const failRegister = async (req, res) => {
	try {
		console.log("Failed Register");
		return res.send({
			ok: false,
			status: "Error",
			message: "Failed to register user",
			error: "authentication error",
		});
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await usersService.getUser({ email });

		if (!user)
			return res
				.status(401)
				.send({ status: "Error", error: "Invalid Credentials" });

		if (!isValidPassword(user, password))
			return res
				.status(401)
				.send({ status: "Error", error: "Invalid Credentials" });

		const cartCount =
			user.role === "admin"
				? 0
				: await cartsService.getCartCount(user.cart?._id);

		const jwtUser = {
			first_name: user.first_name,
			last_name: user.last_name,
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
			age: user.age,
			cart: user.cart,
			role: user.role,
			cartCount,
		};
		const token = jwt.sign(jwtUser, secret, { expiresIn: "24h" });

		const last_connection = usersService.updateLastConnectionDate(email);

		return res.cookie(cookieName, token, { httpOnly: true }).send({
			status: "Success",
			message: "Login successful",
		});
	} catch (error) {
		console.log(error);
	}
};

export const gitHubLogin = async (req, res) => {
	try {
		const jwtUser = {
			name: req.user.first_name,
			email: req.user.email,
			cart: req.user.cart,
		};

		const token = jwt.sign(jwtUser, secret, { expiresIn: "24h" });

		return res.cookie(cookieName, token, { httpOnly: true }).redirect("/");
	} catch (error) {
		console.log(error);
	}
};

export const logout = async (req, res) => {
	try {
		return res
			.clearCookie(cookieName)
			.send({ status: "Success", message: "log out successful" });
	} catch (error) {
		console.log(error);
	}
};

export const restorePasswordProcess = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).send({
				status: "Error",
				error: "Incomplete values",
			});
		}

		await usersService.restorePasswordProcess(email);

		return res.status(200).send({
			status: "Success",
			message: "Password reset email sent",
		});
	} catch (error) {
		req.logger.error(`Failed to send password reset email: ${error}`);
		return res.status(500).send({ status: "error", error: `${error}` });
	}
};

export const updatePassword = async (req, res) => {
	try {
		const { password, token } = req.body;

		console.log({ password, token });

		if (!password || !token) {
			return res.status(400).send({
				status: "Error",
				error: "Incomplete values",
			});
		}

		const passwordUpdate = await usersService.updatePassword(token, password);

		if (!passwordUpdate) {
			return res
				.status(500)
				.send({ status: "Error", error: "Failed to update password" });
		}

		return res.status(200).send({
			status: "Success",
			message: "Successfully updated password",
		});
	} catch (error) {
		req.logger.error(`Failed to restore user password: ${error}`);
		return res.status(500).send({ status: "error", error: `${error}` });
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await usersService.getUsers();
		return res.send(users);
	} catch (error) {
		console.log(error);
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await usersService.deleteUser(id);
		return res.status(200).send({
			ok: true,
			status: "Success",
			message: "User deleted",
			payload: user,
		});
	} catch (error) {
		return res.status(500).send({
			ok: false,
			status: "Error",
			message: "Failed to delete user",
			error: `${error}`,
		});
	}
};

export const deleteInactiveUsers = async (req, res) => {
	try {
		const users = await usersService.deleteInactiveUsers();
		return res.send({
			status: "Success",
			message: "Inactive users deleted",
			payload: users,
		});
	} catch (error) {
		return res
			.status(500)
			.send({ status: "Error", error: "Failed to delete inactive users" });
	}
};

export const renderUsers = async (req, res) => {
	try {
		const result = {};
		result.user = req.user;
		result.user.isAdmin = req.user.role === "admin" ? true : false;
		const users = await usersService.getUsers();
		result.users = users;
		return res.render("users", result);
	} catch (error) {
		return res.send({
			status: "Error",
			error: "Something went wrong while rendering users",
		});
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		console.log({
			id,
			role,
		});

		const user = await usersService.updateUserRole(id, role);
		return res.send({
			ok: true,
			status: "Success",
			message: "User role updated",
			payload: user,
		});
	} catch (error) {
		return res.status(500).send({
			ok: false,
			status: "Error",
			message: "Failed to update user role",
			error: `${error}`,
		});
	}
};
