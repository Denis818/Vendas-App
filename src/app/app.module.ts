import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { ListVendaComponent } from './components/listVenda/listVenda.component';
import { NavComponent } from './shared/nav/nav.component';
import { GraficoDeVendasComponent } from './components/graficoDeVendas/graficoDeVendas.component';

import { VendaService } from './services/venda.service';
import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ListVendaComponent,
    NavComponent,
    GraficoDeVendasComponent,
    DateTimeFormatPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgChartsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    })
  ],
  providers: [
    VendaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
