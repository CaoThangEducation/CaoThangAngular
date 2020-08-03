const router = require("express").Router();
const LopHocPhan = require("../models/LopHocPhan.model");
const KHDT = require("../models/KeHoachDaoTao.model");
const MonHoc = require("../models/MonHoc.model");
const GVLHP = require("../models/GiaoVienLopHocPhan.model");

//GET LHP, loaimonhoc, giaovienlhp by maCTDT and hocKi with loaiMonHoc
router.get("/ctdt/:maCTDT/hocKi/:hocKi", async (req, res) => {
  const maChuongTrinhDaoTao = req.params.maCTDT;
  const hocKi = parseInt(req.params.hocKi);

  let resultView = [];
  let dsMaLoaiMonHoc = [];
  //danh sach lop hoc phan
  let dsLHP = await LopHocPhan.find({
    trangThai: { $ne: 0 },
    maLopHoc: { $regex: maChuongTrinhDaoTao },
    hocKi,
  }).catch((err) => {
    return res.json({ message: err });
  });

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }

  //danh sach loai mon hoc kem theo lhp
  await asyncForEach(dsLHP, async (lhp, index) => {
    let maMonHoc = lhp.maDaoTao.slice(lhp.maDaoTao.length - 4);
    await MonHoc.findOne({ maMonHoc })
      .then((mh) => {
        if (mh !== null) {
          dsMaLoaiMonHoc.push(mh.maLoaiMonHoc);
        } else {
          dsMaLoaiMonHoc.push("null mh");
        }
      })
      .catch((err) => {
        return res.json({ message: err });
      });
  });

  //danh sach giao vien lhp kem theo lhp
  await asyncForEach(dsLHP, async (lhp, index) => {
    await GVLHP.findOne({ maLopHocPhan: lhp.maLopHocPhan }).then((gvlhp) => {
      let a = { maGiaoVien: "null", ghiChu: "" };
      if (gvlhp !== null) {
        a = { maGiaoVien: gvlhp.maGiaoVien, ghiChu: gvlhp.ghiChu };
      }
      let result = lhp.toObject();
      result.maLoaiMonHoc = dsMaLoaiMonHoc[index];
      result.maGiaoVien = a.maGiaoVien;
      result.ghiChu = a.ghiChu;
      resultView.push(result);
    });
  });

  return res.json(resultView);
});

router.get("/", async (req, res) => {
  return res.json("haha");
});

//POST LopHocPhan
router.post("/", async (req, res) => {
  let hocKi = req.body[0];
  let dsLopHoc = req.body[1];
  let nextNumber = 1;

  //get NextNumber
  await LopHocPhan.findOne({}, {}, { sort: { ngayTao: -1 } })
    .exec()
    .then((lastLHP) => {
      if (lastLHP !== null) {
        nextNumber = lastLHP.maLopHocPhan + 1;
      }
    });

  //Tra ve thong bao chua co lop hoc
  if (dsLopHoc === undefined || hocKi === undefined) {
    return res.json({ error: "Chua co Lop hoc" });
  }

  //Cat maChuongTrinhDaoTao tu ma lop hoc
  const maChuongTrinhDaoTao = dsLopHoc[0].maLopHoc.slice(0, 7);

  await KHDT.find({ maChuongTrinhDaoTao, hocKi, trangThai: { $ne: 0 } })
    .then((ds) => (dsKHDT = ds))
    .catch((err) => {
      return res.json({ message: err });
    });
  //neu dsKHDT rong?
  if (dsKHDT.length === 0) {
    return res.json({
      error: "Chuong trinh dao tao nay chua co ke hoach dao tao",
    });
  }

  let dsLHP = [];
  let lophocphan;
  let soLopHocPhan = dsLopHoc.length * dsKHDT.length;

  //tao danh sach lop hoc phan chua co maLopHocPhan va tenLopHocPhan
  dsLopHoc.forEach((lh) => {
    dsKHDT.forEach((khdt) => {
      lophocphan = {
        tenLopHocPhan: lh.tenLop,
        maLopHoc: lh.maLopHoc,
        maDaoTao: khdt.maDaoTao,
        hocKi,
      };
      dsLHP.push(lophocphan);
    });
  });

  // return res.json(dsLHP);

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }

  //kiem tra da ton tai trong database
  await asyncForEach(dsLHP, async (lhp, index) => {
    await LopHocPhan.findOne({
      maDaoTao: lhp.maDaoTao,
      maLopHoc: lhp.maLopHoc,
    }).then((data) => {
      if (data === null) {
        lhp.maLopHocPhan = nextNumber;
        nextNumber++;
        let maMonHoc = lhp.maDaoTao.slice(lhp.maDaoTao.length - 4);
        MonHoc.findOne({ maMonHoc }).then((mh) => {
          lhp.tenLopHocPhan = lhp.tenLopHocPhan + " - " + mh.tenMonHoc;
          LopHocPhan.create(lhp)
            .then(console.log("added " + lhp.maDaoTao))
            .catch((err) => {
              return res.json({ message: err });
            });
        });
      } else {
        soLopHocPhan--;
        // Future Features -- Truong hop neu tao it hon so lan tao lan truoc
        // LopHocPhan.updateOne({ maDaoTao: LopHocPhan.maDaoTao },
        //   {$set: {trangThai: 1, hocKi, maBoMon: LopHocPhan.maBoMon,
        //     loaiTienThu: LopHocPhan.loaiTienThu, donViHocTrinh: LopHocPhan.donViHocTrinh,
        //     soTietHoc: LopHocPhan.soTietHoc, soTuan: LopHocPhan.soTuan,
        //     tinh: LopHocPhan.tinh, xet: LopHocPhan.xet } } )
        // .then(console.log("updated " + LopHocPhan.maDaoTao))
        // .catch(err => {
        //   return res.json( {message: err});
        // });
      }
    });
  });
  if (soLopHocPhan === dsLHP.length) {
    return res.json({
      success: `Them moi thanh cong ${soLopHocPhan} lop hoc phan`,
    });
  } else if (soLopHocPhan === 0) {
    return res.json({ success: "Khong co gi thay doi" });
  } else {
    return res.json({ success: `Cap nhat them ${soLopHocPhan} lop hoc phan` });
  }
});

//SPECIFIC LopHocPhan
// router.get('/:maDaoTao', async (req, res) => {
//   // try {
//   //   const item = await MonHoc.findOne({ maLopHocPhan: req.params.maLopHocPhan });
//   //   if (item === null) {
//   //     res.json({status: "null"});
//   //   } else {
//   //     res.json(item);
//   //   }
//   // } catch (err) {
//   //   res.json({message: err});
//   // }
//   res.json('oke');
// })

//DELETE LopHocPhan
router.delete("/:maDaoTao", async (req, res) => {
  res.json("oke");
});

//UPATE LopHocPhan
router.put("/:maDaoTao", async (req, res) => {
  res.json("oke");
});

router.patch("/:maDaoTao", async (req, res) => {
  res.json("oke");
});

router.get('/malophocphan/:maLopHocPhan', async (req, res) => {
  const maLopHocPhan = parseInt(req.params.maLopHocPhan);
  await LopHocPhan.findOne({ maLopHocPhan })
    .then(lhp => {
      console.log(lhp);
      return res.json(lhp);
    })
    .catch(err => {
      return res.json({ status: 501, data: [], message: err });
    })
});
//SEARCH theo maNganh
router.get("/:maLop/search", async (req, res) => {
  try {
    const lopHocPhans = await LopHocPhan.find({ maLopHoc : req.params.maLop});
    res.json(lopHocPhans);
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
