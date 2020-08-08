import { Component, OnInit,Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GvlhpService } from '../../../../../../../admin/src/app/services/gvlhp.service'
import { ApiService } from '../../../../../../../admin/src/app/services/api.service';
import { GVLHP } from '../../../../../../../admin/src/app/interfaces/gvlhp.interface';
import { from } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-moigv',
  templateUrl: './moigv.component.html',
  styleUrls: ['./moigv.component.css']
})
export class MoigvComponent implements OnInit {
  constructor(private gvlhpService: GvlhpService,
    private apiService: ApiService,
    private router: ActivatedRoute, private route: Router,
    public dialog: MatDialog,private cookie:CookieService) { }
  data: any
  emailGV: any;
  dsGiaoVien: any;
  gvLophp: any;
  malophocphan: any;
  maGiaoVien: any;
  maLopHocPhan:any;
  ngOnInit(): void {
    this.moiGiaoVien();
    this.malophocphan = this.router.snapshot.paramMap.get('id');
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  moiGiaoVien() {
    this.maLopHocPhan = this.cookie.get("maLophocPhan");
    this.apiService.layDanhSachGiaoVien().subscribe(
      dsGiaoVien => {
        this.dsGiaoVien = dsGiaoVien;
        this.dsGiaoVien.filter(x => {
          if (x.email == this.emailFormControl.value) {
            this.data = {
              maGiaoVien: x.maGiaoVien,
              maLopHocPhan: this.maLopHocPhan
            }
            this.gvlhpService.themGiaoVienLhp(this.data).subscribe(
              gvLophp=>(
                this.gvLophp=this.data
              
              )
            )
            alert("Mời Thành Công");
            this.dialog.closeAll();
          }
        })
      },

      (error) => {
        console.log(error)
      }
    )
  }
}






