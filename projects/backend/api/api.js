const router = require('express').Router()
const LopHocPhanRoutes = require('./LopHocPhan')
const GiaoVienRoutes = require('./GiaoVien')
const cnttTinTucRoute = require('./cnttTinTuc')
const ttthTinTucRoute = require('./ttthTinTuc')
const cnttCrawlingRoutes = require('./cnttCrawling');


router.use('/lophocphan', LopHocPhanRoutes)
router.use('/giaovien', GiaoVienRoutes)
//cnttRoute
router.use('/cnttTinTuc', cnttTinTucRoute)
router.use('/crawling', cnttCrawlingRoutes)
//end cntt
//ttthRoutes
router.use('/ttthTinTuc', ttthTinTucRoute)
//ttth
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
