const {
	laytatcahoadon,
	taohoadon,
	laymothoadon,
	xoamothoadon,
	duyetHoaDon,
	taohoadonKhach,
} = require("~/controllers/hoadon.controller");

const router = require("express").Router();

router.route("/").get(laytatcahoadon).post(taohoadon);
router.route("/:id").get(laymothoadon).delete(xoamothoadon);
router.route("/khach").post(taohoadonKhach);
router.route("/duyet/:id").post(duyetHoaDon);

module.exports = router;
