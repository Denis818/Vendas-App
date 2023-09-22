import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public paginaAtual: number = 1;
  public itemsPorPagina: number = 7;
  public totalItens: number = 0;

  public listLogs: any[] = [];
  public logsFiltrados: any[] = [];
  public buscarName: string = '';
  public isFiltering: boolean = false;

  public get filtroLista(): string {
    return this.buscarName;
  }

  public set filtroLista(value: string) {
    this.buscarName = value;

    if (this.buscarName) {
      this.filtrarAcessos(this.buscarName);

    } else {
      this.resetFilters();
    }
  }

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getAllLogs()
  }

  public getAllLogs(): void {
    this.isFiltering = false;

    this.adminService.getLogAcessos(this.paginaAtual, this.itemsPorPagina).subscribe({
      next: (acessos: any) => {

        this.listLogs = acessos.itens;
        this.logsFiltrados = [...this.listLogs];
        this.totalItens = acessos.totalItens;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error ao carregar Acessos', 'Error')
      }
    });
  }

  public filtrarAcessos(nameFilter: string, resetPage: boolean = true): void {
    this.isFiltering = true;

    if (resetPage) { this.paginaAtual = 1; }

    this.adminService.filterUserName(nameFilter.toLocaleLowerCase()).subscribe((data: any) => {

      this.logsFiltrados = data;
      this.totalItens = this.logsFiltrados.length;
    });
  }

  public pularPagina(event: any): void {
    this.paginaAtual = event;

    if (this.isFiltering) {
      this.filtrarAcessos(this.buscarName, false);

    } else {
      this.getAllLogs();
    }
  }

  public resetFilters() {
    this.buscarName = '';
    this.isFiltering = false;
    this.getAllLogs();
  }
}
