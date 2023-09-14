import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoDeVendasComponent } from './components/vendas/graficoDeVendas/graficoDeVendas.component';
import { ListVendaComponent } from './components/vendas/listVenda/listVenda.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { NaoAutorizadoComponent } from './components/user/naoAutorizado/naoAutorizado.component';
import { authGuard } from './guards/auth.guard';
import { VendaComponent } from './components/vendas/venda.component';

const routes: Routes = [
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },

  { path: 'venda', component: VendaComponent, canActivate: [authGuard],
    children: [
      { path: 'list-vendas', component: ListVendaComponent, canActivate: [authGuard] },
      { path: 'grafico', component: GraficoDeVendasComponent, canActivate: [authGuard] }
    ]
  },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
