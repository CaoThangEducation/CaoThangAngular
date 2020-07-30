import { SinhVienService } from './../../../../services/sinh-vien.service';
import { SinhVien } from './../../../../interfaces/SinhVien.interface';
import { Subject } from 'rxjs';
import { LopHocService } from './../../../../services/lop-hoc.service';
import { BacService } from './../../../../services/Bac.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { NganhNgheService } from '../../../../services/NganhNghe.service';
import * as XLSX from 'xlsx';

// Yasuo start
import { LopHocPhan } from './../../../../interfaces/lophocphan.interface';
import { LopHocPhanService } from '../../../../services/lophocphan.service';

// Yasuo end

@Component({
  selector: 'app-modal-chitieudaotao',
  templateUrl: './modal-chitieudaotao.component.html',
  styleUrls: ['./modal-chitieudaotao.component.css'],
  providers: [LopHocPhanService],
})
export class ModalChitieudaotaoComponent implements OnInit {
  public loaiHinhList = [
    { maLoai: '1', tenLoai: 'Chính quy' },
    { maLoai: '2', tenLoai: 'Liên thông' },
  ];
  public hocKis = [
    {
      maHK: 1,
      tenHK: 'HK1',
    },
    {
      maHK: 2,
      tenHK: 'HK2',
    },
    {
      maHK: 3,
      tenHK: 'HK3',
    },
    {
      maHK: 4,
      tenHK: 'HK4',
    },
    {
      maHK: 5,
      tenHK: 'HK5',
    },
    {
      maHK: 6,
      tenHK: 'HK6',
    },
  ];
  //Khai bao list
  public nganhList: any;
  public bacList: any;
  public nganhtamlist: any;
  //Khai bao Form
  addForm: FormGroup;

  chiTieuList = new FormArray([]);
  hocKiForm: FormGroup;

  //khai bao trang thai
  public isBtnHocPhanDisplay = false;

  //Khai bao Array
  public lops = [];
  public lopHocs: any;
  public lopTams: any;
  public lopHocPhans: LopHocPhan[];

  //Khai bao thong bao
  msg = '';
  public msgList = [];
  public resetResult;
  public soChiTieu = [];

  //Gan gia tri cho Objsect Lop
  setLop = (
    maNganh,
    maLopHoc,
    tenLop,
    tenVietTat,
    linkFBLopHoc,
    maBac,
    khoa
  ) => {
    return {
      maNganh: maNganh,
      maLopHoc: maLopHoc,
      tenLop: tenLop,
      tenVietTat: tenVietTat,
      linkFBLopHoc: linkFBLopHoc,
      nguoiTao: 'TranDinhHuy',
      nguoiChinhSua: 'TranDinhHuy',
      maBac: maBac,
      khoa: khoa,
    };
  };

  constructor(
    private modalService: ModalService,
    private nganhngheservice: NganhNgheService,
    private bacservice: BacService,
    private lopHocService: LopHocService,
    private lopHocPhanSerivce: LopHocPhanService,
    private SinhVienService: SinhVienService
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
    this.hocKiForm = new FormGroup({
      hocKi: new FormControl(''),
    });
  }
  //Lay tat ca tu DB LOP HOC
  getLopHoc() {
    this.lopHocService.getAll().subscribe(
      (lop) => {
        this.lopHocs = lop;
        this.lopTams = this.lopHocs;
      },
      (err) => (this.msg = err)
    );
    this.isBtnHocPhanDisplay = false;
  }
  getbac() {
    this.bacservice.getBac().subscribe(
      (bac) => {
        this.bacList = bac;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getNganhNghe() {
    this.nganhngheservice.getNganhnghe().subscribe(
      (data) => {
        this.nganhList = data;
        this.nganhtamlist = this.nganhList;

        this.nganhList.forEach((element) => {
          this.tinhSoChiTieu(element.maNganhNghe);

          this.convertToChiTieu(element.maNganhNghe);

          this.chiTieuList.push(
            new FormGroup({
              maBac: new FormControl(element.maBac),
              maNganh: new FormControl(element.maNganhNghe),
              tenVietTat: new FormControl(element.tenVietTat),
              soChiTieu: new FormControl(''),
            })
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Lay ten BAC tu ma BAC
  convertToTenBacVietTat(maBac: string) {
    let ten = 'TKT';
    this.bacList.forEach((element) => {
      if (element.maBac == maBac) ten = element.tenVietTat;
    });
    return ten;
  }
  convertTenNganhVietTat(maNganh: string) {
    let ten = 'TKT';
    this.nganhList.forEach((element) => {
      if (element.maNganhNghe == maNganh) ten = element.tenVietTat;
    });
    return ten;
  }
  convertToTenNganh(maNganh: string) {
    let ten = 'TKT';
    this.nganhList.forEach((element) => {
      if (element.maNganhNghe == maNganh) ten = element.tenNganhNghe;
    });
    return ten;
  }
  convertToTenBac(maBac: string) {
    let ten = 'TKT';
    this.bacList.forEach((element) => {
      if (element.maBac == maBac) ten = element.tenVietTat;
    });
    return ten;
  }
  convertToChiTieu(maNganh: string) {
    let chiTieu = 1;

    this.soChiTieu.forEach((el) => {
      if (el.maNganh == maNganh) {
        chiTieu = el.chiTieu;
        console.log(chiTieu);
      }
    });

    return chiTieu;
  }
  addLopHoc(data) {
    this.lopHocService.create(data).subscribe(
      (res) => {
        // let { msg, status} = res;
        //this.msgList.push(data.tenLop);
      },
      (err) => {
        //this.msgList.push(err);
      }
    );
  }
  //Khai bao su kien click

  onClickCreate() {
    if (!this.addForm.value.khoa || !this.addForm.value.loaiHinhDaoTao) {
      this.msg = 'Vui lòng chọn Loại hình đào tạo và nhập khóa học';
    } else {
      this.taoLopHoc();
      this.msg = 'Danh sách lớp được tạo trong cơ sở dữ liệu';
    }
  }
  onClickResetLopHoc(maNganh: string) {
    this.deleteLopHoc(maNganh);
    this.taoLopHoc();
    this.getLopHoc();
  }
  /**
   * XepLopTheoMaNganh
   */
  public onClickLopTheoNganh(maNganh: string) {
    //this.getLopHoc();
    this.xepLoptheoMaNganh(maNganh);
    this.isBtnHocPhanDisplay = true;
  }

  deleteLopHoc(maNganh: string) {
    this.lopHocService.deleteMaNganh(maNganh).subscribe(
      (data) => {},
      (error) => console.log(error)
    );
  }

  public tinhSoChiTieu(maNganh: string) {
    this.lopHocService.getAllFor(maNganh).subscribe((data: number) => {
      let tam = { chiTieu: data, maNganh: maNganh };
      this.soChiTieu.push(tam);
    });
    console.log(this.soChiTieu);
  }

  resetLopHoc(maNganh: string) {
    this.lopHocService.getAllFor(maNganh).subscribe((data) => {
      if (data > 0) {
        this.msgList.push({
          msg:
            `Ngành "${this.convertToTenNganh(maNganh)} "` +
            ' đã tồn tại danh sách lớp, Bạn có muốn tạo danh sách mới không ? ',
          trangThai: true,
          maNganh: maNganh,
        });
      } else {
        this.msgList.push({
          msg:
            `Ngành "${this.convertToTenNganh(maNganh)}"` +
            ' đã tạo danh sách lớp thànhh công ',
          trangThai: false,
          maNganh: maNganh,
        });
      }
    });
  }

  public xepLoptheoMaNganh(maNganh: string) {
    let LopTam = [];
    this.lopHocs.forEach((element) => {
      if (element.maNganh === maNganh) LopTam.push(element);
    });
    this.lopTams = LopTam;
  }

  private getMaNTenLopHoc(): Object[] {
    let arrMaNTen = [];
    this.lopTams.forEach((lop) => {
      let temp = { tenLop: lop.tenLop, maLopHoc: lop.maLopHoc };
      arrMaNTen.push(temp);
    });
    return arrMaNTen;
  }

  generateLopHocPhan(): void {
    if (this.hocKiForm.value.hocKi === '') {
      alert('loi');
      return;
    }
    let hocKi = this.hocKiForm.value.hocKi;
    let dsMaNTen: Object[] = this.getMaNTenLopHoc();
    if (dsMaNTen.length === 0) {
      alert('chua co lop');
      return;
    }
    this.lopHocPhanSerivce
      .addDSLopHocPhan(dsMaNTen, hocKi)
      .subscribe((status) => {
        if (status.success) {
          alert(status.success);
        } else if (status.error) {
          alert(status.error);
        } else alert(status.message);
      });
  }

  public layLopHocPhan(maLop: string) {
    this.lopHocPhanSerivce.layLopHocPhantheoMaLop(maLop).subscribe(
      (res) => {
        this.lopHocPhans = res;
      },
      (err) => console.log(err)
    );
  }

  public taoLopHoc() {
    let index = 1;
    this.chiTieuList.value.forEach((el) => {
      let len = el.soChiTieu;
      if (el.soChiTieu > 0) {
        this.resetLopHoc(el.maNganh);
      }

      // Bac + Nganh + Khóa  + STT
      for (let i = 0; i < len; i++) {
        index++;
        var tenLop =
          this.convertToTenBacVietTat(el.maBac) +
          ' ' +
          this.convertTenNganhVietTat(el.maNganh) +
          ' ' +
          this.addForm.value.khoa +
          String.fromCharCode(97 + i).toUpperCase();
        var maLop =
          Number.parseInt(el.maBac) +
          '' +
          el.maNganh +
          '' +
          this.addForm.value.khoa +
          this.addForm.value.loaiHinhDaoTao +
          (i + 1);
        this.lops.push(tenLop);
        this.addLopHoc(
          this.setLop(
            el.maNganh,
            maLop,
            tenLop,
            tenLop,
            'facebook.com',
            el.maBac,
            this.addForm.value.khoa
          )
        );
      }
      this.getLopHoc();
      this.lops = [];
    });
    this.msgList = [];
  }
  //bắt sự kiện show môn theo ngành
  changed(e) {
    //  this.nganhList.array.forEach(element => {
    //    this
    //  });
    this.nganhtamlist = [];
    if (this.addForm.value.bac !== '') {
      this.nganhList.forEach((element) => {
        if (element.maBac == this.addForm.value.bac) {
          this.nganhtamlist.push(element);
        }
      });
    } else {
      this.nganhtamlist = this.nganhList;
    }
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  ///Import Excel SinhVien
  spinnerEnabled = false;
  keys: string[];
  dsSinhVien: SinhVien[];
  dataSheet = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  maLopThem: string;

  onClickThemDSSV(maLop: string) {
    this.maLopThem = maLop;
  }
  onChangeSinhVien(evt) {
    let data;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
        console.log(data);
        this.dsSinhVien = data;
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        // console.log(this.dsMonHoc);
        this.dataSheet.next(data);
      };
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }
  private importExcel() {
    let index = 0;
    this.dsSinhVien.forEach((sv) => {
      index++;
      sv.maLopHoc = this.maLopThem;
      sv.maSinhVien = 0 + sv.maLopHoc.slice(0, sv.maLopHoc.length - 1) + index;
      this.SinhVienService.themSinhVien(sv).subscribe(
        (response) => {
          console.log(response);
          this.msgList.push({
            msg: `Thêm thành công "${sv.ten}" có mã <${sv.maSinhVien}>`,
            status: true,
          });
        },
        (error) => {
          this.msgList.push({
            msg: `Thêm thất bại "${sv.ten}" có mã <${sv.maSinhVien}>`,
            status:false
          });
        }
      );
    });
  }
  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
    this.dsSinhVien = undefined;
  }
  public onClickImportExeclSinhVien() {
    this.msgList = [];
    if (this.dsSinhVien) {
      this.msg = 'Danh sách sinh viên';
      this.importExcel();
    } else {
      this.msg = 'Danh sách sinh viên trống, không có sinh viên nào được thêm vào';
    }
    console.log(this.msgList);
  }
  public tongSoSinhVien = [];
  public tinhTongSinhVien(maLop:string){
    this.SinhVienService.tinhTongSinhVien(maLop).subscribe((res) => {

    })
  }
}
