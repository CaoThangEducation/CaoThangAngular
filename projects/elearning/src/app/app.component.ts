import { Component, OnInit } from '@angular/core';
import { setCookie, getCookie } from '../../../common/helper';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'elearning';

  displayName: string = '';
  ngOnInit(): void {
    if(getCookie('token') && getCookie('role') == 'admin'){
      alert('Bạn không có quyền cập vào trang elearning');
      window.location.href = "https://localhost:4200";
    }
    else{
      this.displayName = getCookie('displayName');
    }
  }

  onLogout(): void {
    console.log('logout');
    setCookie('token', '', '0');
    setCookie('role', '', '0');
    window.location.href = "https://localhost:4200";
  }

}
