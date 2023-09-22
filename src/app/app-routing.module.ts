import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListVendaComponent } from './components/vendas/listVenda/listVenda.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { authGuard } from './guards/auth.guard';
import { VendaComponent } from './components/vendas/venda.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'venda', component: VendaComponent,  canActivate: [authGuard],
    children: [ { path: 'lista', component: ListVendaComponent, } ]
  },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'admin', component: AdminComponent },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
