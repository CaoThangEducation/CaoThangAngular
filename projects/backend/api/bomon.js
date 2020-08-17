const BoMon = require("../models/bomon.model");
const keHoachDaoTaoModel = require("../models/KeHoachDaoTao.model");
const { check, validationResult, body } = require("express-validator");
const bomonModel = require("../models/bomon.model");

let idIsExist = 0;
let nameIsExist = 0;

const setData = (req) => {
  return {
    maBoMon: req.body.maBoMon,
    tenBoMon: req.body.tenBoMon,
    tenVietTat: req.body.tenVietTat,
    nguoiTao: req.body.nguoiTao,
    nguoiChinhSua: req.body.nguoiChinhSua,
    maLoai: req.body.maLoai,
    maKhoa: req.body.maKhoa,
  };
};

exports.getKhoaBonMon = async (req, res) => {
  try {
    const khoabomon = await BoMon.find({ trangThai: "1" });

    res.json(khoabomon);
  } catch (error) {
    res.json(error);
  }
};
exports.getOneKhoaBoMon = async (req, res) => {
  try {
    const khoaBoMon = await BoMon.find({ _id: req.params.id });
    res.json(khoaBoMon);
  } catch (error) {
    res.json(error);
  }
};
exports.postKhoaBoMon = async (req, res) => {
  try {
    idIsExist = 0;
    nameIsExist = 0;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(422).json(err.errors);
    }
    const khoabomon = await BoMon.find();

    khoabomon.forEach((element) => {
      if (req.body.maBoMon === element.maBoMon) {
        idIsExist++;
      }
      if (req.body.tenBoMon === element.tenBoMon) {

        nameIsExist++;
      }
    });

    if (idIsExist > 0) {
      return res.json({
        status: 200,
        ok: false,
        msg: "Mã khoa này đã tồn tại",
      });
    } else if (nameIsExist > 0) {
      return res.json({
        status: 200,
        ok: false,
        msg: "Tên này đã tồn tại",
      });
    } else {

      let nextNumber = 0;
      await BoMon.findOne(
        { maKhoa: req.body.maKhoa },
        {},

      ).sort({maBoMon: -1})
        .exec()
        .then((bt) => {
          if (bt !== null) {
            nextNumber = parseInt(bt.maBoMon.slice(1, bt.maKhoa.length));

          }
        });
        if(nextNumber > 10){
          req.body.maBoMon = req.body.maKhoa  +''+ (nextNumber + 1);

        }else{
          req.body.maBoMon = req.body.maKhoa  +'0'+ (nextNumber + 1);

        }
      console.log(req.body);
      const khoaBoMon = new BoMon(setData(req));
      const saveKhoa = await khoaBoMon.save();
      res.json({
        status: 200,
        ok: true,
        msg: "Thêm thành công Khoa-Bộ môn vào danh sách",
        data: saveKhoa,
      });
    }
  } catch (error) {
    res.json(error);
  }
};

exports.deleteKhoaBoMon = async (req, res) => {
  // const removeKhoa = await KhoaBoMon.remove({ _id: req.params.id });
  // if (removeKhoa.deletedCount === 0) {
  //   res.json({ status: false, msg: "Id nay khong ton tai" });
  // } else {
  //   res.json({
  //     status: true,
  //     msg: "Deleted successful",
  //   });
  // }

  try {
    const bomon = await bomonModel.findOne({ _id: req.params.id });
    const khdt = await keHoachDaoTaoModel.findOne({ maBoMon: bomon.maBoMon });
    if (khdt) {
      return res.json({
        status: false,
        msg: "Xóa thất bại liên quan tới kế hoạch đào tạo",
      });
    }
    const updateKhoa = await BoMon.updateOne(
      { _id: req.params.id },
      {
        $set: {
          trangThai: 0,
        },
      }
    );

    let result;

    if (updateKhoa.nModified === 0) {
      result = {
        status: false,
        msg: "Xóa thất bại",
      };
    } else {
      result = {
        status: true,
        msg: "Xóa thành công ",
      };
    }
    res.json(result);
  } catch (error) {
    res.json(error);
  }
};

//validation data from request

exports.checkValidate = () => {
  return [
    check("tenBoMon", "MA BO MON is required").notEmpty(),
    check("maKhoa", "MA BO MON is must be at least 10 chars long").isLength({
      max: 50,
    }),

    check("tenBoMon", "TEN BO MON is must be at most 50 chars long ").isLength({
      max: 50,
    }),
    check("tenBoMon", "TEN BO MON is required").notEmpty(),

    check("tenVietTat", "TEN VIET TAT must be at most 15 char long").isLength({
      max: 15,
    }),
    check("tenVietTat", "TEN VIET TAT is required").notEmpty(),

    check("nguoiTao", "NGUOI TAO is required").notEmpty(),

    check("nguoiChinhSua", "NGUOI CHINH SUA is required").notEmpty(),

    check("maLoai", "MA LOAI is required").notEmpty(),
    check("maLoai", "MA LOAI is numberic").isNumeric(),
  ];
};

exports.updateKhoaBoMon = async (req, res) => {
    try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(422).json(err.errors);
    }
  //res.json(req.body)
    const updateKhoa = await BoMon.updateOne(
      { _id: req.params.id },
      {
        $set: {tenBoMon: req.body.tenBoMon, tenVietTat: req.body.tenVietTat},
      }
    );

    let result = {
      status: 200,
      ok: false,
      msg: "",
    };
    if (updateKhoa.nModified === 0) {
      result.msg = "Chưa được cập nhật";
    } else {
      result.ok = true;
      result.msg = "Cập nhật thành công Khoa-Bộ môn";
    }

    res.status(200).json(result);
  } catch (error) {
    res.json(error);
  }
};
