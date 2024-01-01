import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogVenda } from 'src/app/models/LogVenda';
import { AdminService } from 'src/app/services/admin.service';
import { Venda } from 'src/app/models/Venda';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PaginationDto } from 'src/app/models/dto/helpers';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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

  public modal!: BsModalRef;
  public userEmail: string = '';
  public permission: string = '';

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  public pagination: PaginationDto = {
    paginaAtual: 1,
    itemsPorPagina: 7,
    totalItens: 0,
  }

  get paginator(): any {
    return {
      itemsPerPage: this.pagination.itemsPorPagina,
      currentPage: this.pagination.paginaAtual,
      totalItems: this.pagination.totalItens
    }
  }

  public listLogs: LogVenda[] = [];
  public logsFiltrados: LogVenda[] = [];
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
      this.filtrarLogVenda(this.buscarName);

    } else {
      this.resetFilters();
    }
  }

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
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

    this.adminService.getLogVendas(this.pagination.paginaAtual, this.pagination.itemsPorPagina).subscribe({
      next: (logVendas: any) => {

        this.listLogs = logVendas.itens;
        this.logsFiltrados = [...this.listLogs];
        this.pagination.totalItens = logVendas.totalItens;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error ao carregar Acessos', 'Error')
      }
    });
  }

  public getById(idVenda: number) {
    this.spinner.show();
    this.adminService.getSaleById(idVenda).subscribe({
      next: venda => {
        this.exibirTabela = true ? true : false

        this.venda = venda;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        if (err?.error?.mensagens?.length > 0) {
          this.toastr.error(err.error.mensagens[0].descricao, 'Falha');
        } else {
          this.toastr.error('Error ao carregar Venda', 'Error');
        }
      }
    });
  }

  public filtrarLogVenda(nameFilter: string, resetPage: boolean = true): void {
    this.isFiltering = true;

    if (resetPage) { this.pagination.paginaAtual = 1; }

    this.adminService.filterUserEmail(nameFilter.toLocaleLowerCase()).subscribe((data: any) => {

      this.logsFiltrados = data;
      this.pagination.totalItens = this.logsFiltrados.length;
    });
  }

  public pularPagina(event: any): void {
    this.pagination.paginaAtual = event;

    if (this.isFiltering) {
      this.filtrarLogVenda(this.buscarName, false);

    } else {
      this.getAllLogs();
    }
  }

  public addPermissao() {
    this.adminService.addPermissionToUser(this.userEmail, this.permission).subscribe({
      next: () => {
        this.toastr.success(`Permissão adicionada ao usuário ${this.userEmail}`, 'Sucesso');
      },
      error: (err) => {
        if (err?.error?.mensagens?.length > 0) {
          this.toastr.error(err.error.mensagens[0].descricao, 'Falha');
        } else {
          this.toastr.error("Ocorreu um erro interno.", 'Error');
        }
      }
    })
  }

  public removePermissao() {
    this.adminService.removePermissionFromUser(this.userEmail, this.permission).subscribe({
      next: () => {
        this.toastr.success(`Permissão removida do usuário ${this.userEmail}`, 'Sucesso');

      },
      error: (err) => {
        if (err?.error?.mensagens?.length > 0) {
          this.toastr.error(err.error.mensagens[0].descricao, 'Falha');
        } else {
          this.toastr.error("Ocorreu um erro interno.", 'Error');
        }
      }
    })
  }

  abrirModalPermissao(template: TemplateRef<any>) {
    this.modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  fecharModalPermissao() {
    this.modal.hide();
  }

  public resetFilters() {
    this.buscarName = '';
    this.isFiltering = false;
    this.getAllLogs();
  }

  public idValidation(): void {
    this.form = this.fb.group({
      idLogVenda: ['0',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ]],
    }
    );
  }
}
