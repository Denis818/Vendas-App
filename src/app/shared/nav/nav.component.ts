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

  public userEmail: string = '';

  constructor(private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.updateEmail();
  }

  public updateEmail() {
    this.userService.getUserEmail().subscribe(emailUser => {
      this.userEmail = emailUser;
      this.cdRef.detectChanges(); //Força o angular a verificar se naquele componente teve mudanças.
    });
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
