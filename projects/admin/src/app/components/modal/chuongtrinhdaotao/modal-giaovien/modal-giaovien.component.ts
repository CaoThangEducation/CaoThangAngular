import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';
import { BomonService } from '../../../../services/khoa-bomons/bomon.service';
import { GvlhpService } from '../../../../services/gvlhp.service';
import { LopHocPhanService } from '../../../../services/lophocphan.service';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { BacService } from '../../../../services/Bac.service';
import { ToastrService } from 'ngx-toastr';

import { GiaoVien } from '../../../../../models/giaoVien';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-modal-giaovien',
  templateUrl: './modal-giaovien.component.html',
  styleUrls: ['./modal-giaovien.component.css']
})
export class ModalGiaovienComponent implements OnInit {
  public giaoVien:GiaoVien;
  public danhSachGiaoVien:GiaoVien[];
  textSearch;
  trangThai: number = 1;
  selectedMaBoMon: string = '';
  file:File;
  dsGiaoVienExcel: any;

  maGV:string = '';

  dsBoMon: any;
  dsgvLHP: any;
  giaoVienForm:FormGroup;
  updateForm: FormGroup;
  filterForm: FormGroup;
  maGVSelected:string = '';

  //loc lhp
  bacSelected: any;
  hocKiSelected: any = 1;
  maKhoa: any = 17;
  dsLopHPGV: any;
  dsBac: any;
  filterDsLop: any = [];
  public giaoVienFormGroup: FormGroup;
  objectKeys = Object.keys;
  dateValidator(control: FormControl) {
    let checkDate = control.value;
    var objDate,  // date object initialized from the checkDate string
      mSeconds, // checkDate in milliseconds
      day,      // day
      month,    // month
      year;     // year
    if (checkDate.length !== 10) {
      return {
        checkDate:{
          isValid: false
        }
      }
    }
    if (checkDate.substring(2, 3) !== '/' || checkDate.substring(5, 6) !== '/') {
      return {
        checkDate:{
          isValid: false
        }
      }
    }
    day = checkDate.substring(0, 2) - 0; // because months in JS start from 0
    month = checkDate.substring(3, 5) - 1;
    year = checkDate.substring(6, 10) - 0;
    // test year range
    if (year < 1000 || year > 3000) {
        return {
          checkDate:{
            isValid: false
          }
        }
    }
    mSeconds = (new Date(year, month, day)).getTime();
    objDate = new Date();
    objDate.setTime(mSeconds);
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day) {
        return {
          checkDate:{
            isValid: false
          }
        }
    }
    // otherwise return true
    return null;
  }

  constructor(private modalService: ModalService,
    private apiService:ApiService,
    private boMonService:BomonService,
    private gvLHPService: GvlhpService,
    private lopHocPhanService: LopHocPhanService,
    private toastr: ToastrService,
    //loc lop hoc phan
    private bacService: BacService,
    ) {
    this.boMonService.getAll().subscribe(
      data => {
        this.dsBoMon = data
      }
    );
    // Lấy danh sách bậc
    this.bacService.getBac().subscribe(
      data => {
        this.dsBac = data
      }
    )
    // GiaoVienForm
    this.giaoVienForm = new FormGroup({
      ho: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      ten: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      ngaySinh: new FormControl('', [
        Validators.required,
        this.dateValidator
      ]),
      cmnd: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{9,12}')
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$')
      ]),
      sdt: new FormControl('', [
        Validators.required,
        Validators.pattern('(03|07|08|09|01[2|6|8|9])+([0-9]{8})')
      ]),
      diaChiThuongTru: new FormControl(''),
      trinhDoChuyenMon: new FormControl('Thạc sĩ')
    })
    // Update Form
    this.updateForm = new FormGroup({
      hoUpdate: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      tenUpdate: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      ngaySinhUpdate: new FormControl('', [
        Validators.required,
        this.dateValidator
      ]),
      cmndUpdate: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{9,12}')
      ]),
      emailUpdate: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$')
      ]),
      sdtUpdate: new FormControl('', [
        Validators.required,
        Validators.pattern('(03|07|08|09|01[2|6|8|9])+([0-9]{8})')
      ]),
      diaChiThuongTruUpdate: new FormControl(''),
      trinhDoChuyenMonUpdate: new FormControl('Thạc sĩ')
    })
    // Filter Form
      //form loc lop hoc phan
    this.filterForm = new FormGroup({
      bac: new FormControl("-1"),
      hocKi: new FormControl("-1"),
    })
    // Form Lọc LHP
    // this.danhSachLopHocPhan();
    // this.layCookie();
    // this.LaySachLopHocPhan();
    // this.danhSachLopGV();
    // this.layThongtinGV();
    // this.layDanhSachBac();
  }


  //Validation giaoVien form
  get ho(){
    return this.giaoVienForm.get('ho');
  }
  get ten(){
    return this.giaoVienForm.get('ten');
  }
  get ngaySinh(){
    return this.giaoVienForm.get('ngaySinh');
  }
  get cmnd(){
    return this.giaoVienForm.get('cmnd');
  }
  get email(){
    return this.giaoVienForm.get('email');
  }
  get sdt(){
    return this.giaoVienForm.get('sdt');
  }
  get diaChiThuongTru(){
    return this.giaoVienForm.get('diaChiThuongTru');
  }
  get trinhDoChuyenMon(){
    return this.giaoVienForm.get('trinhDoChuyenMon');
  }
  // Validation update form
  get hoUpdate(){
    return this.updateForm.get('hoUpdate');
  }
  get tenUpdate(){
    return this.updateForm.get('tenUpdate');
  }
  get ngaySinhUpdate(){
    return this.updateForm.get('ngaySinhUpdate');
  }
  get cmndUpdate(){
    return this.updateForm.get('cmndUpdate');
  }
  get emailUpdate(){
    return this.updateForm.get('emailUpdate');
  }
  get sdtUpdate(){
    return this.updateForm.get('sdtUpdate');
  }
  get diaChiThuongTruUpdate(){
    return this.updateForm.get('diaChiThuongTruUpdate');
  }
  get trinhDoChuyenMonUpdate(){
    return this.updateForm.get('trinhDoChuyenMonUpdate');
  }

  ngOnInit(): void {
    this.layDanhSachGiaoVien();
  }

  themGiaoVien(){
    let data = {
      ho: this.giaoVienForm.get('ho').value,
      ten: this.giaoVienForm.get('ten').value,
      ngaySinh: this.giaoVienForm.get('ngaySinh').value,
      cmnd: this.giaoVienForm.get('cmnd').value,
      email: this.giaoVienForm.get('email').value,
      sdt: this.giaoVienForm.get('sdt').value,
      diaChiThuongTru: this.giaoVienForm.get('diaChiThuongTru').value,
      trinhDoChuyenMon: this.giaoVienForm.get('trinhDoChuyenMon').value,
      password: '123456',
      trangThai: 1
    };
    if(this.giaoVienForm.valid){
      this.apiService.themGiaoVien(data).subscribe(
        (response) => {
          if(response.status == true){
            this.toastr.success(response.msg, 'Thông báo', { timeOut: 5000 });
            this.layDanhSachGiaoVien();
          }
          else{
            this.toastr.error(response.msg, 'Lỗi', { timeOut: 5000 });
          }
        }
      );
    }
  }

  layMaGVSelected(giaoVien:any){
    this.maGVSelected = giaoVien.maGiaoVien;
  }
  dsLHP(){
    this.bacSelected = this.filterForm.get('bac').value;
    this.hocKiSelected = this.filterForm.get('hocKi').value;
    console.log('bậc', this.bacSelected);
    console.log('học kì', this.hocKiSelected);
  }

  capNhatGiaoVien(){
    let data = {
      ho: this.updateForm.get('hoUpdate').value,
      ten: this.updateForm.get('tenUpdate').value,
      ngaySinh: this.updateForm.get('ngaySinhUpdate').value,
      cmnd: this.updateForm.get('cmndUpdate').value,
      email: this.updateForm.get('emailUpdate').value,
      sdt: this.updateForm.get('sdtUpdate').value,
      diaChiThuongTru: this.updateForm.get('diaChiThuongTruUpdate').value,
      trinhDoChuyenMon: this.updateForm.get('trinhDoChuyenMonUpdate').value,
      maGiaoVien: this.maGVSelected
    };
    if(this.updateForm.valid){
      this.apiService.capNhatGiaoVien(data).subscribe(
        (response) => {
          if(response.status == true){
            this.toastr.success(response.msg, 'Thông báo', { timeOut: 5000 });
            this.layDanhSachGiaoVien();
          }
          else{
            this.toastr.error(response.msg, 'Lỗi', { timeOut: 5000 });
          }
        }
      )
    }
  }

  layDanhSachGiaoVien():void {
    this.trangThai = 1;
    this.apiService.layDanhSachGiaoVien().subscribe(
      data => {
        this.danhSachGiaoVien = data;
        this.danhSachGiaoVien.map(gv => {
          gv.danhSachLopHocPhan = [];
          this.gvLHPService.timGiaoVienLHPTheoMaGV(gv.maGiaoVien).subscribe(
            (res) => {
              const danhSachLHP = res;
              danhSachLHP.map(lhp => {
                this.lopHocPhanService.getLopHocPhanbyMaLopHocPhan(lhp.maLopHocPhan).subscribe(
                  (response) => {
                    gv.danhSachLopHocPhan.push(response[0].tenLopHocPhan);
                  }
                )
              })
            }
          )
        })
      }
    );
  }

  restoreGiaoVien(maGiaoVien: string) {
    this.customConfirm("Bạn muốn phục hồi giáo viên này?", () => {
      this.apiService.setTrangThai(maGiaoVien).subscribe(
        (response) => {
          alert(response.msg);
          if(response.status == true){
            this.layDanhSachGiaoVienTheoTrangThai();
          }
        }
      )
    })
  }

  layDanhSachGiaoVienTheoTrangThai():void {
    this.apiService.layDanhSachGiaoVienTheoTrangThai(this.trangThai).subscribe(
      data => {
        this.danhSachGiaoVien = data;
        this.danhSachGiaoVien.map(gv => {
          gv.danhSachLopHocPhan = [];
          this.gvLHPService.timGiaoVienLHPTheoMaGV(gv.maGiaoVien).subscribe(
            (res) => {
              const danhSachLHP = res;
              danhSachLHP.map(lhp => {
                this.lopHocPhanService.getLopHocPhanbyMaLopHocPhan(lhp.maLopHocPhan).subscribe(
                  (response) => {
                    gv.danhSachLopHocPhan.push(response[0].tenLopHocPhan);
                  }
                )
              })
            }
          )
        })
      }
    );
  }

  changeTrangThai() {
    this.layDanhSachGiaoVienTheoTrangThai();
  }

  changeBoMon(maGV: string, maBoMon: string) {
    this.apiService.capNhatBoMon(maGV, maBoMon).subscribe(
      (response) => {
        alert(response.msg);
        if(response.status == true){
          this.layDanhSachGiaoVien();
        }
      }
    )
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  customConfirm(message: string, oke: Function) {
    let a = confirm(message);
    if (a) {
      oke();
    } else {
      return;
    }
  }

  xoaGiaoVien(maGiaoVien:any){
    this.customConfirm("Bạn có chắc muốn xóa giáo viên này?", () => {
      this.apiService.xoaGiaoVien({maGiaoVien: maGiaoVien}).subscribe(
        (response) => {
          alert(response.msg);
          if(response.status == true){
            this.layDanhSachGiaoVien();
          }
        }
      )
    })
  }

  layThongTinGiaoVien(giaoVien){
    this.updateForm.patchValue({
      'hoUpdate': giaoVien.ho,
      'tenUpdate': giaoVien.ten,
      'ngaySinhUpdate': giaoVien.ngaySinh,
      'cmndUpdate': giaoVien.cmnd,
      'emailUpdate': giaoVien.email,
      'sdtUpdate': giaoVien.sdt,
      'diaChiThuongTruUpdate': giaoVien.diaChiThuongTru,
      'trinhDoChuyenMonUpdate': giaoVien.trinhDoChuyenMon
    });
    this.maGVSelected = giaoVien.maGiaoVien;
  }

  uploadFileExcel(event){
    this.file = event.target.files[0];
  }

  readFileExcel(){
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.dsGiaoVienExcel = fileReader.result;
      var data = new Uint8Array(this.dsGiaoVienExcel);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.dsGiaoVienExcel = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      this.apiService.themDSGiaoVienExcel(this.dsGiaoVienExcel).subscribe(
        (response) => {
          alert(response.msg);
          this.layDanhSachGiaoVien();
        }
      )
    }
    fileReader.readAsArrayBuffer(this.file);
  }
}
