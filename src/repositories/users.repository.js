import { usersModel } from "../models/users.model.js";
import { ObjectId } from "mongodb";

export default class UsersRepository {
	constructor() {}
	getUsers = async () => {
		try {
			const users = await usersModel
				.find(
					{},
					{
						first_name: 1,
						last_name: 1,
						email: 1,
						role: 1,
					}
				)
				.lean();
			return users;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	getUser = async ({ email }) => {
		try {
			const user = await usersModel.findOne({ email });
			return user;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	addUser = async (user) => {
		try {
			const createdUser = usersModel.create(user);
			return createdUser;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	getUserById = async (userId) => {
		try {
			const user = await usersModel
				.findOne({ _id: new ObjectId(userId) })
				.lean();
			return user;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	updateUser = async (email, user) => {
		try {
			const updatedUser = await usersModel.updateOne({ email }, user);
			return updatedUser;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	deleteUser = async (userId) => {
		try {
			const deletedUser = await usersModel.deleteOne({
				_id: new ObjectId(userId),
			});
			return deletedUser;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	deleteInactiveUsers = async () => {
		try {
			const deletedUsers = await usersModel.deleteMany({
				last_login: { $lt: new Date(Date.now() - 30 * 60000) },
			});
			return deletedUsers;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
}
