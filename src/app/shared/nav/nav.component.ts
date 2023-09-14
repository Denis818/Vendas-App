import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed: boolean = true;

  constructor(private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
  }

  public getUserEmail(): string {
    return this.userService.getUserEmail();
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
