const express = require("express");
const router = express.Router();

const {
	userAuth,
} = require("~/middlewares/authentication");

router.get("", (req, res) => {
	res.render("index.html");
});
router.use("/auth", require("~/routes/auth.route"));
router.use("/khach", require("~/routes/khach.route"));
router.use("/pt", userAuth, require("~/routes/pt.route"));
router.use(
	"/goitap",
	userAuth,
	require("~/routes/goitap.route")
);
router.use(
	"/goipt",
	userAuth,
	require("~/routes/goipt.route")
);
router.use(
	"/hoadon",
	userAuth,
	require("~/routes/hoadon.route")
);

module.exports = router;
