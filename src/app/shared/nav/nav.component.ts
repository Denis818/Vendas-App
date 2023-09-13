import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed: boolean = true;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  public ShowMenu(): boolean {
    return this.router.url != '/login'
  }
}
