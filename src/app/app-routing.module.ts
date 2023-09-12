import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoDeVendasComponent } from './components/graficoDeVendas/graficoDeVendas.component';
import { ListVendaComponent } from './components/listVenda/listVenda.component';

const routes: Routes = [
  { path:'grafico/vendas', component: GraficoDeVendasComponent },
  { path:'vendas', component: ListVendaComponent },
  { path:'', redirectTo: 'vendas', pathMatch:'full' },
  { path:'**', redirectTo: 'vendas', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
