import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendaService } from '../../../services/venda.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CheckFilters, Pagination, VendaHelper, Vendas } from '../../../models/dto/helper';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listVenda',
  templateUrl: './listVenda.component.html',
  styleUrls: ['./listVenda.component.css']
})
export class ListVendaComponent implements OnInit {

  public modal!: BsModalRef;

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  @ViewChild('selectAllCheckbox') selectAllCheckbox!: ElementRef<HTMLInputElement>;

  public pagination: Pagination = {
    paginaAtual: 1,
    itemsPorPagina: 7,
    totalItens: 0
  }

  public vendaHelper: VendaHelper = {
    vendaId: 0,
    buscarName: '',
    totalDestaVenda: 0,
    dateRange: [],
    selectedItems: [],
  };

  public vendas: Vendas = {
    list: [],
    filtradas: []
  }

  public checkFilters: CheckFilters = {
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

  public pularPagina(event: any): void {
    this.pagination.paginaAtual = event;
    this.vendaHelper.selectedItems = [];
    this.selectAllCheckbox.nativeElement.checked = false;


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

  public abrirModal(template: TemplateRef<any>, id: any = null) {
    if (id != null) {
      this.vendaHelper.selectedItems = [];
      this.vendaHelper.vendaId = id;

      this.vendaServices.getSaleById(id).subscribe(produto => {
        this.form.patchValue({
          nome: produto.nome,
          preco: produto.preco,
          quantidadeVendido: produto.quantidadeVendido
        });

        this.vendaHelper.totalDestaVenda = produto.preco * produto.quantidadeVendido;
      });
    }

    this.modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  public adicionarVenda() {
    this.vendaHelper.selectedItems = [];
    if (this.vendaHelper.vendaId != 0) {
      this.vendaServices.updateSale(this.vendaHelper.vendaId, this.form.value).subscribe({
        next: () => {
          this.resetForm();
          this.getAllVendas();
          this.toastr.success('Alterações realizadas com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.toastr.error('Ocorreu um error ao atualizar!', 'Error');
        }
      });

    } else {
      this.vendaServices.insertSale(this.form.value).subscribe({
        next: () => {
          this.resetForm();
          this.getAllVendas();
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
          this.getAllVendas();
          this.toastr.success('Venda deletada com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.resetForm();
          this.toastr.error('Ocorreu um erro ao deletar.', 'Erro');
        }
      });
    }else{
      this.deleteSelected()
    }
  }

  public isSelected(id: number): boolean {
    return this.vendaHelper.selectedItems.includes(id);
  }

  public toggleItemSelection(id: number): void {
    const index = this.vendaHelper.selectedItems.indexOf(id);
    if (index === -1) {
      this.vendaHelper.selectedItems.push(id);
    } else {
      this.vendaHelper.selectedItems.splice(index, 1);
    }
  }

  public toggleAllSelections(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.checked) {
      this.vendaHelper.selectedItems = this.vendas.filtradas.map(venda => venda.id);
    } else {
      this.vendaHelper.selectedItems = [];
    }
  }

  public deleteSelected(): void {
    if (this.vendaHelper.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado para deletar.', 'Atenção');
      return;
    }

    this.vendaServices.deleteAllSale(this.vendaHelper.selectedItems).subscribe({
      next: () => {
        this.vendaHelper.selectedItems = [];
        this, this.getAllVendas();
        this.toastr.success('Vendas deletadas com sucesso!', 'Finalizado!');
        this.resetForm();
      },
      error: () => {
        this.resetForm();
        this.toastr.error('Ocorreu um erro ao deletar.', 'Erro');
      }
    });
  }

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

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      preco: ['', [Validators.required, Validators.pattern('^[0-9.]+$'), Validators.min(0.1), Validators.max(999)]],
      quantidadeVendido: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(999)]],
    }
    );
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
    this.getAllVendas();
  }
}
