import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogAcesso } from 'src/app/models/LogAcesso';
import { AdminService } from 'src/app/services/admin.service';
import { Venda } from 'src/app/models/Venda';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(-25%)' })),
      state('*', style({ transform: 'translateY(0)' })),
      transition(':enter', animate('300ms ease-in')),
      transition(':leave', animate('300ms ease-out'))
    ])
  ]
})
export class AdminComponent implements OnInit {

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  public paginaAtual: number = 1;
  public itemsPorPagina: number = 7;
  public totalItens: number = 0;

  public listLogs: LogAcesso[] = [];
  public logsFiltrados: LogAcesso[] = [];
  public buscarName: string = '';
  public isFiltering: boolean = false;

  public venda!: Venda;
  public exibirTabela: boolean = false;

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
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getAllLogs();
    this.idValidation();
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

  public getById(idVenda: number){
    this.spinner.show();
    this.adminService.getSaleById(idVenda).subscribe({
      next: venda => {
        this.exibirTabela = true ? true : false

        this.venda = venda;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error ao carregar Venda', 'Error')
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

  public idValidation(): void {
    this.form = this.fb.group({
      idLogAcesso: ['0',
      [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.min(0),
        Validators.max(99999)
      ]],
    }
    );
  }
}
