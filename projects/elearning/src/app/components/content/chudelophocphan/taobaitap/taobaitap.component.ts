import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import saveAs from 'file-saver';

//Services
import { FileService } from '../../../../services/file.service';
import { BaiTapService } from '../../../../services/bai-tap.service';
import { LopHocPhanService } from '../../../../services/lophocphan.service'
import { ChuDeService } from '../../../../services/chu-de.service';
import { ActivityService } from '../../../../services/activity.service';

//Interfaces
import { BaiTap } from '../../../../models/BaiTap.inteface';
import { LopHocPhan } from '../../../../models/lophocphan.interface';
import { ChuDe } from '../../../../models/chu-de.interface';

const uri = 'https://localhost:4100/api/baitap/uploads';

@Component({
  selector: 'app-taobaitap',
  templateUrl: './taobaitap.component.html',
  styleUrls: ['./taobaitap.component.css'],
  providers: [FileService, BaiTapService]
})
export class TaobaitapComponent implements OnInit {

  public dsLHP: LopHocPhan[];
  public dsChuDe: ChuDe[];
  private _maLopHocPhan: number;

  public baitap: BaiTap = {
    tieuDe: "",
    huongDan: "",
    deadLine: "null",
    diem: 10,
    lopHocPhan: "null",
    file: [],
    chuDe: "null",
  }

  checked: boolean = false;

  toppings = new FormControl();

  EndDateChange(today: any) {
    if (today.value === null) {
      return;
    }
    let dd = String(today.value.getDate()).padStart(2, '0');
    let mm = String(today.value.getMonth() + 1).padStart(2, '0');
    let yyyy = today.value.getFullYear();
    this.baitap.deadLine = mm + '/' + dd + '/' + yyyy;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  changeLHP(maLopHocPhan: string) {
    this._chuDeService.layTheo_maLopHocPhan(parseInt(maLopHocPhan)).subscribe(res => {
      this.dsChuDe = res.data;
    })
  }

  saveBaiTap() {
    if (this.uploader.queue.length !== 0) {
      this.uploader.uploadAll();
    } else {
      this._baiTapService.addBaiTap(this.baitap).subscribe(res => {
        alert(res.message);
        this._setActivity(res.maDoiTuong);
      })
    }
  }

  private _setActivity(maDoiTuong) {
    this._activityService.themActivity(this.baitap.lopHocPhan, maDoiTuong, "BT", this.baitap.tieuDe, "đăng").subscribe(res => {
      console.log(res);
    })
  }

  // Upload file

  uploader: FileUploader = new FileUploader({
    url: uri,
    maxFileSize: 2048, // Max 2kB
    queueLimit: 3, // Max files can upload
  });

  attachmentList: string[] = [];

  download() {
    // var filename = this.attachmentList[index].uploadname;
    this._fileService.downloadFile("yasuo.png")
      .subscribe(
        data => saveAs(data, "yasuo.png"),
        error => console.error(error)
      );
  }

  constructor(
    private _fileService: FileService,
    private _chuDeService: ChuDeService,
    private _baiTapService: BaiTapService,
    private _activityService: ActivityService,
    private _lopHocPhanService: LopHocPhanService,
    private _router: Router,) {
      this._maLopHocPhan = parseInt(this._router.url.split('/')[2][0]);
  }

  ngOnInit(): void {
    this._lopHocPhanService.layLopHocPhanCungGV(this._maLopHocPhan).subscribe(res => {
      this.dsLHP = res;
    })

    this.uploader.onCompleteAll = () => {
      this.baitap.file = this.attachmentList;
      this._baiTapService.addBaiTap(this.baitap).subscribe(res => {
        if (res.status === 200) {
          alert('Chuan bi cap nhat chuc nang sau khi them thanh cong se clear du lieu cu');
          this._setActivity(res.maDoiTuong);
        }
      })
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.attachmentList.push(JSON.parse(response));
    }

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
  }
}

