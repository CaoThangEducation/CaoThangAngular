import { Component, OnInit,AfterViewInit } from '@angular/core';
import { DangkidotthiService } from '../../services/dangkidotthi.service';
import { ttthDangKiDotThi } from '../../models/ttthDangKiDotThi';
declare var $: any;
@Component({
  selector: 'app-page-dangkidotthi',
  templateUrl: './page-dangkidotthi.component.html',
  styleUrls: ['./page-dangkidotthi.component.css']
})
export class PageDangkidotthiComponent implements OnInit,AfterViewInit {
  DotThi: any[];
  success= false;
  error= false;
  DangKiDotThi: ttthDangKiDotThi[];
  constructor(private DangkidotthiService: DangkidotthiService ) {}

  ngOnInit(): void {
    this.getDotThi();
  }
  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('.ttth__select2').select2();
    });
  }
  getDotThi(){
    this.DangkidotthiService.getDotThi().subscribe(data => this.DotThi = data);
  }
  // add
  dangkidotthi(mssv: string,hoten: string,ngaysinh: string,noisinh: string,sodienthoai: string,lophoc: string): void {
    if (!mssv || !hoten || !ngaysinh|| !noisinh|| !sodienthoai|| !lophoc) {
     this.error=true;
    }
    else{
      const newItem: ttthDangKiDotThi = new ttthDangKiDotThi();
      newItem.mssv = mssv;
      newItem.hoten = hoten;
      newItem.ngaysinh = ngaysinh;
      newItem.noisinh = noisinh;
      newItem.sodienthoai = sodienthoai;
      newItem.lophoc = lophoc;
      newItem.trangthai = true;
      newItem.created_at = (new Date);
      this.DangkidotthiService.add(newItem)
        .subscribe(data => {
          this.DangKiDotThi.push(data);
        });
      this.success=true;
    }

  }

}