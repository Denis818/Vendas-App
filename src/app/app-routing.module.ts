import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoDeVendasComponent } from './components/graficoDeVendas/graficoDeVendas.component';
import { ListVendaComponent } from './components/listVenda/listVenda.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { NaoAutorizadoComponent } from './components/user/naoAutorizado/naoAutorizado.component';

const routes: Routes = [
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },

  { path:'grafico/vendas', component: GraficoDeVendasComponent },
  { path:'vendas', component: ListVendaComponent },
  { path:'login', component: LoginComponent },
  { path:'register', component: RegisterComponent },
  { path:'', redirectTo: 'vendas', pathMatch:'full' },
  { path:'**', redirectTo: 'vendas', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
