import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('passwordInput') passwordInput!: ElementRef;

  public password!: string;
  public showPassword: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  public togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordInput.nativeElement.setAttribute('type', 'text');
    } else {
      this.passwordInput.nativeElement.setAttribute('type', 'password');
    }
  }
}
