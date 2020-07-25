const router = require('express').Router()
const LopHocPhanRoutes = require('./LopHocPhan')
const GiaoVienRoutes = require('./GiaoVien')
const cnttBaiVietRoute = require('./cnttBaiViet')
const cnttLoaiBaiVietRoutes = require('./cnttLoaiBaiViet')
const cnttCrawlingRoutes = require('./cnttCrawling')

router.use('/lophocphan', LopHocPhanRoutes)
router.use('/giaovien', GiaoVienRoutes)
//cnttRoute
router.use('/cnttBaiViet', cnttBaiVietRoute)
router.use('/loaibaiviet', cnttLoaiBaiVietRoutes)
router.use('/crawling', cnttCrawlingRoutes)
//end cntt

const khoabomonController = require("../api/khoabomon");
const loaidonviController = require("../api/loaidonvi");
//

//Route KhoaBoMon
router.get("/khoabomon", khoabomonController.getKhoaBonMon);

router.post("/khoabomon", khoabomonController.postKhoaBoMon);

router.delete("/khoabomon/:id", khoabomonController.deleteKhoaBoMon);

router.put("/khoabomon/:id", khoabomonController.updateKhoaBoMon);

//Routes LoaiDonVi
router.get("/loaidonvi", loaidonviController.getLoaiDonVi);



module.exports = router;
