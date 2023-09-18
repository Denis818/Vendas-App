import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public darkMode: boolean = false;

  public isCollapsed: boolean = true;

  public localStorage = localStorage;

  constructor(private router: Router,
    private userService: UserService,
    private renderer: Renderer2, @Inject(DOCUMENT)
    private document: Document) {
  }

  ngOnInit() {
  }

  public showMenu(): boolean {
    return this.router.url != '/login' &&
      this.router.url != '/register' &&
      this.router.url != '/nao-autorizado';
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }

  public setDarkMode(isDarkMode: boolean): void {
    this.darkMode = isDarkMode;
    localStorage.setItem('DARK_MODE', isDarkMode.toString());

    if (isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark');
      this.renderer.removeClass(this.document.body, 'light');

    } else {
      this.renderer.removeClass(this.document.body, 'dark');
      this.renderer.addClass(this.document.body, 'light');
    }
  }
}
