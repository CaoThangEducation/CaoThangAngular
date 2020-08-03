const router = require('express').Router()
const ttthlophoc = require('../models/ttthlophoc.model');
const multer = require('multer')

// get
router.get('/', async (req, res) => {
  try {
    const danhsach = await ttthlophoc.find({ trangthai: true });
    res.json(danhsach);
  } catch (error) {
    res.json([]);
  }
})
// add
router.post('/add', (req, res) => {
  var add = new ttthlophoc({
    makhoahoc: req.body.makhoahoc,
    dot: req.body.dot,
    lop: req.body.lop,
    buoihoc: req.body.buoihoc,
    giohoc: req.body.giohoc,
    ngaykhaigiang: req.body.ngaykhaigiang,
    hocphi: req.body.hocphi,
    trangthai: req.body.trangthai,
    nguoitao: req.body.nguoitao,
    nguoisua: req.body.nguoisua,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  })
  add.save((err, data) => {
    if (err) {
      return next(err)
    }
    res.json(data)
  })
})

// sua
router.post('/update', async (req, res) => {
  await ttthlophoc.findOneAndUpdate({
    _id: req.body._id
  }, {
    makhoahoc: req.body.makhoahoc,
    dot: req.body.dot,
    lop: req.body.lop,
    buoihoc: req.body.buoihoc,
    giohoc: req.body.giohoc,
    ngaykhaigiang: req.body.ngaykhaigiang,
    hocphi: req.body.hocphi,
    trangthai: req.body.trangthai,
    nguoitao: req.body.nguoitao,
    nguoisua: req.body.nguoisua,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  });
})
// xoa tin tuc
router.post('/delete', async (req, res) => {
  await ttthlophoc.findOneAndUpdate({
    _id: req.body._id
  }, {
    trangthai: false
  });
})
module.exports = router
