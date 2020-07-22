const router = require("express").Router();
const LopHocPhanRoutes = require("./LopHocPhan");
const GiaoVienRoutes = require("./GiaoVien");
const { check, validationResult } = require("express-validator");

router.use("/lophocphan", LopHocPhanRoutes);
router.use("/giaovien", GiaoVienRoutes);
const router = require('express').Router()
const LopHocPhanRoutes = require('./LopHocPhan')
const GiaoVienRoutes = require('./GiaoVien')
const MonHoc = require('./MonHoc');

router.use('/lophocphan', LopHocPhanRoutes)
router.use('/giaovien', GiaoVienRoutes)
router.use('/', MonHoc);


const khoabomonController = require("../api/khoabomon");
const loaidonviController = require("../api/loaidonvi");
//
const validate = khoabomonController.checkValidate();

//nganhnghe bac
const NganhNgheRoutes = require('./NganhNghe')
const BacRoutes = require('./Bac')
//nganhnghe
router.use('/', NganhNgheRoutes)
//bac
router.use('/', BacRoutes)
//Route KhoaBoMon
router.get("/khoabomon", khoabomonController.getKhoaBonMon);

router.post("/khoabomon", validate, khoabomonController.postKhoaBoMon);

router.delete("/khoabomon/:id", khoabomonController.deleteKhoaBoMon);

router.put("/khoabomon/:id",validate, khoabomonController.updateKhoaBoMon);

//Routes LoaiDonVi
router.get("/loaidonvi", loaidonviController.getLoaiDonVi);

module.exports = router;
