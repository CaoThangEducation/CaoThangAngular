import { LopHocService } from './../../../../services/lop-hoc.service';
import { nganhnghe } from './../../../../interfaces/NganhNghe.interface';
import { BacService } from './../../../../services/Bac.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { NganhNgheService } from '../../../../services/NganhNghe.service';

@Component({
  selector: 'app-modal-chitieudaotao',
  templateUrl: './modal-chitieudaotao.component.html',
  styleUrls: ['./modal-chitieudaotao.component.css'],
})
export class ModalChitieudaotaoComponent implements OnInit {
  bacList: any;
  loaiHinhList = [
    { maLoai: '1', tenLoai: 'Chính quy' },
    { maLoai: '2', tenLoai: 'Liên thông' },
  ];
  nganhList: any;

  addForm: FormGroup;
  chiTieuGroup: FormGroup;
  chiTieuList = new FormArray([]);
  lops = [];
  lopHocs: any;

  msg = '';

  setLop = (maLopHoc, tenLop, tenVietTat, linkFBLopHoc) => {
    return {
      maLopHoc: maLopHoc,
      tenLop: tenLop,
      tenVietTat: tenVietTat,
      linkFBLopHoc: linkFBLopHoc,
      nguoiTao: 'TranDinhHuy',
      nguoiChinhSua: 'TranDinhHuy',
    };
  };
  lopNganh: {
    maNganhNghe: '';
    dsLop: any;
  };
  lopNganhs = [];

  constructor(
    private modalService: ModalService,
    private nganhngheservice: NganhNgheService,
    private bacservice: BacService,
    private lopHocService: LopHocService
  ) {}

  ngOnInit(): void {
    this.addForm = new FormGroup({
      bac: new FormControl('', [Validators.required]),
      loaiHinhDaoTao: new FormControl('', [Validators.required]),
      khoa: new FormControl(17, [Validators.required]),
    });
    this.getNganhNghe();
    this.getbac();
    this.getLopHoc();
  }
  getLopHoc() {
    this.lopHocService.getAll().subscribe(
      (lop) => {
        this.lopHocs = lop;
      },
      (err) => (this.msg = err)
    );
  }
  getbac() {
    this.bacservice.getBac().subscribe(
      (bac) => {
        this.bacList = bac;
        console.log(this.bacList);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getNganhNghe() {
    this.nganhngheservice.getNgangnghe().subscribe(
      (data) => {
        this.chiTieuGroup = new FormGroup({
          maNganh: new FormControl(''),
          soChiTieu: new FormControl(''),
        });
        this.nganhList = data;
        this.nganhList.forEach((element) => {
          this.chiTieuList.push(
            new FormGroup({
              maBac: new FormControl(element.maBac),
              maNganh: new FormControl(element.maNganhNghe),
              tenVietTat: new FormControl(element.tenVietTat),
              soChiTieu: new FormControl(''),
            })
          );
        });
        console.log(this.nganhList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  convertTenBac(maBac: string) {
    let ten = 'TKT';
    this.bacList.forEach((element) => {
      if (element.maBac == maBac) ten = element.tenVietTat;
    });
    return ten;
  }
  convertTenNganh(maNganh: string) {
    let ten = 'TKT';
    this.nganhList.forEach((element) => {
      if (element.maNganhNghe == maNganh) ten = element.tenVietTat;
    });
    return ten;
  }
  addLopHoc(data) {
    this.lopHocService.create(data).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
  onClickCreate() {
    if (!this.addForm.value.khoa || !this.addForm.value.loaiHinhDaoTao) {
      this.msg = 'Vui lòng chọn Loại hình đào tạo và nhập khóa học';
    } else {
      this.createClassModal();
      this.msg = 'Tạo thành công danh sách Lớp theo Ngành';
    }
  }
  createClassModal() {
    this.lopNganhs = [];
    let index = 1;
    this.chiTieuList.value.forEach((el) => {
      console.log(el);

      let len = el.soChiTieu;

      // Bac + Nganh + Khóa  + STT
      for (let i = 0; i < len; i++) {
        index++;
        var tenLop =
          this.convertTenBac(el.maBac) +
          ' ' +
          this.convertTenNganh(el.maNganh) +
          ' ' +
          this.addForm.value.khoa +
          String.fromCharCode(97 + i).toUpperCase();
        var maLop =
          el.maBac +
          '' +
          el.maNganh +
          '' +
          this.addForm.value.loaiHinhDaoTao +
          this.addForm.value.khoa +
          (i + 1);
        this.lops.push(tenLop);
        this.addLopHoc(this.setLop(maLop, tenLop, tenLop, 'facebook.com'));
      }
      this.lopNganh = { maNganhNghe: el.maNganh, dsLop: this.lops };
      this.lopNganhs.push(this.lopNganh);
      this.lops = [];
    });
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
}
