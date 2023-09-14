import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed: boolean = true;

  public userEmail: string = 'Email'

  constructor(private router: Router,
    private userService: UserService) {
      this.getUserEmail();
  }
  ngOnInit() {}

  public getUserEmail() {
    this.userService.getUserEmail().subscribe({
      next: user => {
        this.userEmail = user;
      },
      error: () =>{
        throw new Error();
      }
    })
  }

  public ShowMenu(): boolean {
    return this.router.url != '/login' &&
    this.router.url != '/register' &&
    this.router.url != '/nao-autorizado';
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
