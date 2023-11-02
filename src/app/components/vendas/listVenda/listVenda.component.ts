import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendaService } from '../../../services/venda.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CheckFiltersDto, PaginationDto, VendaHelperDto, VendasDto } from '../../../models/dto/helpers';
import { NgxSpinnerService } from 'ngx-spinner';
import { Venda } from 'src/app/models/Venda';

@Component({
  selector: 'app-listVenda',
  templateUrl: './listVenda.component.html',
  styleUrls: ['./listVenda.component.scss']
})
export class ListVendaComponent implements OnInit {

  public modal!: BsModalRef;

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  public itemsPorPaginaOptions = [7, 10, 20, 30];
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

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      showWeekNumbers: false
    }
  }

  public vendaHelper: VendaHelperDto = {
    vendaId: 0,
    buscarName: '',
    totalDestaVenda: 0,
    dateRange: [],
  };

  public vendas: VendasDto = {
    list: [],
    filtradas: []
  }

  public checkFilters: CheckFiltersDto = {
    isFiltering: false,
    isFilteringByDate: false
  }

  public get filtroLista(): string {
    return this.vendaHelper.buscarName;
  }

  public set filtroLista(value: string) {
    this.vendaHelper.buscarName = value;

    if (this.vendaHelper.buscarName) {
      this.FiltrarVendas(this.vendaHelper.buscarName);

    } else {
      this.resetFilters();
    }
  }

  constructor(private spinner: NgxSpinnerService,
    private vendaServices: VendaService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService) {
    defineLocale('pt-br', ptBrLocale);
  }

  ngOnInit() {
    this.spinner.show();
    this.getAllVendas()
    this.validation()
    this.getPriceAndQuantity();

    this.localeService.use('pt-br');
  }

  public getAllVendas(): void {
    this.checkFilters.isFiltering = false;
    this.vendaServices.getAllVendas(this.pagination.paginaAtual, this.pagination.itemsPorPagina).subscribe({
      next: (vendas: any) => {

        this.vendas.list = vendas.itens
        this.vendas.filtradas = [...this.vendas.list];
        this.pagination.totalItens = vendas.totalItens;
        this.filterVendadDashboard();
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error ao carregar Vendas', 'Error')
      }
    });

  }

  public FiltrarVendas(name: string, resetPage: boolean = true): void {
    if (!name || name.trim() == '') return;

    this.checkFilters.isFiltering = true;

    this.vendaHelper.dateRange = [];

    if (resetPage) { this.pagination.paginaAtual = 1; }

    this.vendaServices.filterSalesByName(name.toLocaleLowerCase()).subscribe((data: any) => {

      this.vendas.filtradas = data;
      this.pagination.totalItens = this.vendas.filtradas.length;
    });
  }

  public filterVendadDashboard(): void {
    const nomeVenda = localStorage.getItem("vendaFilter");
    if (nomeVenda) {
      localStorage.removeItem("vendaFilter");
      this.filtroLista = nomeVenda;
    }
  }

  public pularPagina(event: any): void {
    this.pagination.paginaAtual = event;

    if (this.checkFilters.isFiltering) {
      this.FiltrarVendas(this.vendaHelper.buscarName, false);

    } else if (this.checkFilters.isFilteringByDate) {
      this.getVendasPorPeriodo(false);

    } else {
      this.getAllVendas();
    }
  }

  public calculateTotalForCurrentPage(): number {
    let total = 0;

    if (this.checkFilters.isFiltering || this.checkFilters.isFilteringByDate) {
      const startIndex = (this.pagination.paginaAtual - 1) * this.pagination.itemsPorPagina;
      const endIndex = Math.min(startIndex + this.pagination.itemsPorPagina, this.vendas.filtradas.length);

      for (let i = startIndex; i < endIndex; i++) {
        total += this.vendas.filtradas[i].totalDaVenda;
      }

    } else {

      for (let i = 0; i < this.vendas.filtradas.length; i++) {
        total += this.vendas.filtradas[i].totalDaVenda;
      }
    }
    return total;
  }

  public getVendasPorPeriodo(resetPage: boolean = true): void {
    this.vendaHelper.buscarName = '';

    if (!this.vendaHelper.dateRange || this.vendaHelper.dateRange.length !== 2) {
      return;
    }

    if (this.vendaHelper.dateRange[0] > this.vendaHelper.dateRange[1]) {
      this.toastr.warning('A data final não pode ser menor que a data inicial!', 'Atenção');
      return;
    }

    if (resetPage) { this.pagination.paginaAtual = 1; }

    this.vendaServices.getSalesByDate(this.vendaHelper.dateRange[0], this.vendaHelper.dateRange[1]).subscribe({
      next: data => {
        this.checkFilters.isFilteringByDate = true;
        this.vendas.filtradas = data;
        this.pagination.totalItens = this.vendas.filtradas.length;
      },
      error: () => {
        this.toastr.error('Erro ao filtrar vendas por período.', 'Erro');
      }
    });
  }

  /* Calcular total da venda no fumulario */
  public getPriceAndQuantity() {
    this.form.get('preco')?.valueChanges.subscribe(() => {
      this.calcularTotalDaVenda();
    });

    this.form.get('quantidadeVendido')?.valueChanges.subscribe(() => {
      this.calcularTotalDaVenda();
    });
  }

  public calcularTotalDaVenda(): void {
    const preco = this.form.get('preco')?.value;
    const quantidade = this.form.get('quantidadeVendido')?.value;

    if (preco) {
      this.vendaHelper.totalDestaVenda = !quantidade ? preco : preco * quantidade;
      this.vendaHelper.totalDestaVenda = isNaN(this.vendaHelper.totalDestaVenda) ? 0 : this.vendaHelper.totalDestaVenda;

    } else {
      this.vendaHelper.totalDestaVenda = 0;
    }
  }
  /* end */

  /* Formulario e Deleção */
  public abrirModal(template: TemplateRef<any>, id: any = null) {
    if (id != null) {
      this.vendaHelper.vendaId = id;

      this.vendaServices.getSaleById(id).subscribe({
        next: (produto: Venda) => {
          this.form.patchValue({ ...produto });
          this.vendaHelper.totalDestaVenda = Number(produto.preco) * Number(produto.quantidadeVendido);
        },
        error: () => {
          this.toastr.error('Ocorreu um erro!', 'Error');
        }
      });
    }
    this.modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  public TotalASerVendido(): Number {
    if (typeof this.vendaHelper.totalDestaVenda === 'number') {
      let value = this.vendaHelper.totalDestaVenda.toFixed(2);
      return Number.parseFloat(value);
    }
    return 0;
  }

  public adicionarVenda() {
    if (this.vendaHelper.vendaId !== 0) {
      this.vendaServices.updateSale(this.vendaHelper.vendaId, this.form.value).subscribe({
        next: () => {
          this.resetForm();
          this.toastr.success('Alterações realizadas com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.toastr.error('Ocorreu um erro ao atualizar!', 'Error');
        }
      });

    } else {
      this.vendaServices.insertSale(this.form.value).subscribe({
        next: () => {
          this.resetForm();
          this.toastr.success('Adiconado com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.toastr.error('Ocorreu um error ao adicionar!', 'Error');
        }
      });
    }
  }

  public confirmDelete(): void {
    if (this.vendaHelper.vendaId != 0) {
      this.vendaServices.deleteSale(this.vendaHelper.vendaId).subscribe({
        next: () => {
          this.resetForm();
          this.toastr.success('Venda deletada com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.resetForm();
          this.toastr.error('Ocorreu um erro ao deletar.', 'Erro');
        }
      });
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      preco: ['', [Validators.required, Validators.pattern('^[0-9.]+$'), Validators.min(0.01), Validators.max(999)]],
      quantidadeVendido: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(999)]],
    }
    );
  }
  /* end form */

  public validateDateRange() {
    if (this.vendaHelper.dateRange && this.vendaHelper.dateRange.length === 2) {
      if (this.vendaHelper.dateRange[0] > this.vendaHelper.dateRange[1]) {

        this.vendaHelper.dateRange = [
          this.vendaHelper.dateRange[1],
          this.vendaHelper.dateRange[0]
        ];
      }
    }
  }

  public alterarNumeroDaPagina(itemsPorPagina: number): void {
    this.pagination.itemsPorPagina = itemsPorPagina;
    this.resetFilters();
    this.getAllVendas();
  }

  public resetForm(): void {
    this.form.reset();
    this.modal.hide();
    this.resetFilters();
  }

  public resetFilters() {
    this.vendaHelper.buscarName = '';
    this.vendaHelper.dateRange = [];
    this.checkFilters.isFiltering = false;
    this.checkFilters.isFilteringByDate = false;
    this.vendaHelper.vendaId = 0;
    this.getAllVendas();
  }
}
