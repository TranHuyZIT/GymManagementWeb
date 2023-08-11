const { default: mongoose } = require("mongoose");
const { addDays } = require("~/utils/common.util");

const KhachModel = require("~/models/khach.model").model;
const HoaDonModel = require("~/models/hoadon.model").model;
const DkyTapModel = require("~/models/dkytap.model").model;
const DkyPTModel = require("~/models/dkypt.model").model;
const GoiTapModel = require("~/models/goitap.model").model;
const GoiPTModel = require("~/models/goipt.model").model;
class HoaDonController {
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async duyetHoaDon(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const mahoadon = req.params.id;
			console.log(mahoadon);
			let hoadon = await HoaDonModel.findById(
				mahoadon
			);
			if (!hoadon)
				throw new Error(
					"Không tồn tại hóa đơn này"
				);
			hoadon = hoadon.toJSON();
			if (hoadon.isChecked)
				throw new Error(
					"Hóa đơn này đã được duyệt trước đó!"
				);
			for (const dkytap of hoadon.dkytap) {
				await DkyTapModel.findOneAndUpdate(
					{ _id: dkytap._id },
					{ ...dkytap, isChecked: true }
				).session(session);
				await KhachModel.updateOne(
					{
						id: hoadon.khach.id,
						"dkytap._id": dkytap._id,
					},
					{
						$set: {
							"dkytap.$.isChecked": true,
						},
					}
				).session(session);
				await HoaDonModel.updateOne(
					{
						_id: hoadon._id,
						"dkytap._id": dkytap._id,
					},
					{
						$set: {
							"dkytap.$.isChecked": true,
						},
					}
				).session(session);
			}
			console.log(hoadon);
			for (const dkypt of hoadon.dkypt) {
				await DkyPTModel.findOneAndUpdate(
					{ _id: dkypt._id },
					{ ...dkypt, isChecked: true }
				).session(session);
				await KhachModel.updateOne(
					{
						id: hoadon.khach.id,
						"dkypt._id": dkypt._id,
					},
					{ $set: { "dkypt.$.isChecked": true } }
				).session(session);
				await HoaDonModel.updateOne(
					{
						_id: hoadon._id,
						"dkypt._id": dkypt._id,
					},
					{ $set: { "dkypt.$.isChecked": true } }
				).session(session);
			}
			hoadon = await HoaDonModel.findById(
				mahoadon
			).session(session);
			await session.commitTransaction();
			return res.status(200).json(hoadon);
		} catch (error) {
			await session.abortTransaction();
			res.status(500).send({
				message: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async taohoadonKhach(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const currentUser = req.currentUser;
			const { dkytap, dkypt, ...info } = req.body;
			const khach = await KhachModel.findOne({
				user: currentUser._id,
			}).session(session);
			if (!khach)
				throw new Error(
					"Không tìm thấy khách hàng với mã " +
						currentUser._id
				);
			let tongtien = 0;
			const dkyTapRecords = [];
			for (const dky of dkytap) {
				const { magoitap, ...dkyInfo } = dky;
				const goitap = await GoiTapModel.findById(
					magoitap
				);
				if (!goitap)
					throw new Error(
						"Không tìm thấy gói tập với mã " +
							magoitap
					);
				tongtien += goitap.gia;
				const ngayhethan = addDays(
					dkyInfo.ngaydk,
					goitap.songay
				);
				const newDky = new DkyTapModel({
					makhach: khach._id,
					...dkyInfo,
					goitap,
					ngayhethan: ngayhethan,
					isChecked: false,
				});
				const newDkyRecord = await newDky.save({
					session,
				});
				dkyTapRecords.push(newDkyRecord);
				khach.dkytap.push(newDkyRecord);
			}
			const dkyPTRecords = [];
			for (const dky of dkypt) {
				const { magoipt, ...dkyInfo } = dky;
				const goipt = await GoiPTModel.findById(
					magoipt
				);
				if (!goipt)
					throw new Error(
						"Không tồn tại gói pt với mã " +
							magoipt
					);
				const ngayhethan = addDays(
					dkyInfo.ngaydk,
					goipt.songay
				);
				const newDky = new DkyPTModel({
					makhach: khach._id,
					...dkyInfo,
					goipt,
					ngayhethan,
					isChecked: false,
				});
				const newDkyRecord = await newDky.save({
					session,
				});
				tongtien += goipt.gia;
				dkyPTRecords.push(newDkyRecord);
				khach.dkypt.push(newDkyRecord);
			}
			const newHoaDon = new HoaDonModel(
				{
					khach,
					info,
					dkytap: dkyTapRecords,
					dkypt: dkyPTRecords,
					tongtien,
					ngaylap: info.ngaylap,
				},
				{
					session,
				}
			);
			await newHoaDon.save({ session });
			await khach.save({ session });

			await session.commitTransaction();
			return res.status(200).json(newHoaDon);
		} catch (error) {
			await session.abortTransaction();
			res.status(500).send({
				message: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async taohoadon(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const { dkytap, dkypt, makhach, ...info } =
				req.body;
			const khach = await KhachModel.findById(
				makhach
			).session(session);
			if (!khach)
				throw new Error(
					"Không tìm thấy khách hàng với mã " +
						makhach
				);
			let tongtien = 0;
			const dkyTapRecords = [];
			for (const dky of dkytap) {
				const { magoitap, ...dkyInfo } = dky;
				const goitap = await GoiTapModel.findById(
					magoitap
				);
				if (!goitap)
					throw new Error(
						"Không tìm thấy gói tập với mã " +
							magoitap
					);
				console.log(goitap);
				tongtien += goitap.gia;
				const ngayhethan = addDays(
					dkyInfo.ngaydk,
					goitap.songay
				);
				console.log(ngayhethan);
				const newDky = new DkyTapModel({
					makhach: khach._id,
					...dkyInfo,
					goitap,
					ngayhethan: ngayhethan,
					isChecked: true,
				});
				const newDkyRecord = await newDky.save({
					session,
				});
				dkyTapRecords.push(newDkyRecord);
				khach.dkytap.push(newDkyRecord);
			}
			const dkyPTRecords = [];
			for (const dky of dkypt) {
				const { magoipt, ...dkyInfo } = dky;
				const goipt = await GoiPTModel.findById(
					magoipt
				);
				if (!goipt)
					throw new Error(
						"Không tồn tại gói pt với mã " +
							magoipt
					);
				const ngayhethan = addDays(
					dkyInfo.ngaydk,
					goipt.songay
				);
				const newDky = new DkyPTModel({
					makhach: khach._id,
					...dkyInfo,
					goipt,
					ngayhethan,
					isChecked: true,
				});
				const newDkyRecord = await newDky.save({
					session,
				});
				tongtien += goipt.gia;
				dkyPTRecords.push(newDkyRecord);
				khach.dkypt.push(newDkyRecord);
			}
			const newHoaDon = new HoaDonModel(
				{
					khach,
					info,
					dkytap: dkyTapRecords,
					dkypt: dkyPTRecords,
					tongtien,
					ngaylap: info.ngaylap,
				},
				{
					session,
				}
			);
			await newHoaDon.save({ session });
			await khach.save({ session });

			await session.commitTransaction();
			return res.status(200).json(newHoaDon);
		} catch (error) {
			await session.abortTransaction();
			res.status(500).send({
				message: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async laytatcahoadon(req, res) {
		try {
			const offset = req.query.offset || 0;
			const pageSize = req.query.pageSize || null;
			const tenKhach = req.query.name || null;
			let where = {};
			if (tenKhach) {
				where["khach.ten"] = {
					$regex: tenKhach,
					$options: "i",
				};
			}
			const allHoaDons = await HoaDonModel.find(
				where,
				"",
				{
					skip: offset,
					limit: pageSize,
				}
			).select("-khach.dkytap -khach.dkypt");
			const totalRows = await HoaDonModel.count(
				where
			);
			return res.status(200).json({
				data: allHoaDons,
				totalRows,
			});
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async laymothoadon(req, res) {
		try {
			const id = req.params.id;
			const hoadon = await HoaDonModel.findById(id);
			return res.status(200).json(hoadon);
		} catch (error) {
			res.send({
				message: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async xoamothoadon(req, res) {
		try {
			const id = req.params.id;
			const result = await HoaDonModel.deleteOne({
				_id: id,
			});
			return res.status(200).json(result);
		} catch (error) {
			res.send({
				message: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async luuhoadon(req, res) {
		try {
			return res.status(200).json();
		} catch (error) {
			res.send({
				message: error.message,
			});
		}
	}
}

module.exports = new HoaDonController();
