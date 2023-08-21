const KhachModel = require("~/models/khach.model").model;
const mongoose = require("mongoose");
const PasswordUtil = require("~/utils/password.util");
const UserModel = require("~/models/users.model").model;
class KhachController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async dkykhach(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			// Tạo user
			const { mk, tk, ...rest } = req.body.user;
			const availableUser = await UserModel.findOne({
				tk,
			});
			if (availableUser)
				throw new Error("Tài Khoản Đã Tồn Tại");
			const hashedPassword = await PasswordUtil.hash(
				mk
			);

			const newUser = await UserModel.create(
				[
					{
						...rest,
						mk: hashedPassword,
						tk,
					},
				],
				{ session }
			);

			const newKhach = await KhachModel.create(
				[
					{
						...req.body.khach,
						user: new UserModel(newUser[0])._id,
					},
				],
				{
					session,
				}
			);
			await session.commitTransaction();
			return res.status(200).json(newKhach[0]);
		} catch (error) {
			await session.abortTransaction();
			res.status(400).send({
				msg: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laymot(req, res) {
		try {
			const id = req.params.id;
			const khach = await KhachModel.findById(
				id
			).sort([]);
			const dkytap = khach.dkytap.sort((a, b) => {
				return (
					new Date(b.ngayhethan) -
					new Date(a.ngayhethan)
				);
			});
			const dkypt = khach.dkypt.sort((a, b) => {
				return (
					new Date(b.ngayhethan) -
					new Date(a.ngayhethan)
				);
			});
			const result = {
				...khach.toJSON(),
				dkypt,
				dkytap,
				ngayHetHanTap: "",
				ngayHetHanPT: "",
			};
			if (dkytap.length > 0) {
				for (const dky of dkytap) {
					if (dky.isChecked) {
						result["ngayHetHanTap"] =
							dky.ngayhethan;
						break;
					}
				}
			}
			if (dkypt.length > 0) {
				for (const dky of dkypt) {
					if (dky.isChecked) {
						result["ngayHetHanPT"] =
							dky.ngayhethan;
						break;
					}
				}
			}
			console.log(result);
			return res.status(200).json(result);
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laytatca(req, res) {
		try {
			const offset = req.query.offset || 0;
			const pageSize = req.query.pageSize || null;
			const term = req.query.term || null;
			const searchBy = req.query.searchBy || null;
			const filter = {};
			if (term) {
				filter[searchBy] = {
					$regex: term,
					$options: "i",
				};
			}
			const allKhachs = await KhachModel.find(
				filter,
				"",
				{
					skip: offset,
					limit: pageSize,
				}
			);
			const totalRows = await KhachModel.count(
				filter
			);
			return res.status(200).json({
				totalRows,
				data: allKhachs,
			});
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async xoa(req, res) {
		try {
			const id = req.params.id;
			const result = await KhachModel.updateOne(
				{
					_id: id,
				},
				{
					isDeleted: true,
				}
			);
			return res.status(200).json(result);
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async capnhat(req, res) {
		try {
			const id = req.params.id;
			const result = await KhachModel.updateOne(
				{
					_id: id,
				},
				req.body
			);
			return res.status(200).json(result);
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
}

module.exports = new KhachController();
