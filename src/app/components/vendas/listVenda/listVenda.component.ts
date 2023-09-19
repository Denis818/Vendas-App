import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendaService } from '../../../services/venda.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Venda } from '../../../models/Venda';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listVenda',
  templateUrl: './listVenda.component.html',
  styleUrls: ['./listVenda.component.css']
})
export class ListVendaComponent implements OnInit {
  public modal!: BsModalRef;

  public dateRange!: Date[];

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  public paginaAtual: number = 1;
  public itemsPorPagina: number = 7;
  public totalItens: number = 0;

  public vendaId: number = 0;
  private buscarName: string = '';

  public listVendas: Venda[] = [];
  public vendasFiltradas: Venda[] = [];

  public totalDestaVenda: number = 0;

  public get filtroLista(): string { return this.buscarName; }

  public set filtroLista(value: string) {
    this.buscarName = value;
    if (this.buscarName) {
      this.FiltrarVendas(this.buscarName);
    } else {
      this.vendasFiltradas = this.listVendas;
    }
  }


  constructor(
    private spinner: NgxSpinnerService,
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
    this.localeService.use('pt-br');
    this.getPriceAndQuantity();

  }

  public getAllVendas(): void {
    this.vendaServices.getAllVendas(this.paginaAtual, this.itemsPorPagina).subscribe({
      next: (vendas: any) => {
        this.listVendas = vendas.itens
        this.vendasFiltradas = [...this.listVendas];
        this.totalItens = vendas.totalItens;

        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error ao carregar Vendas', 'Error')
      }
    });

  }

  public FiltrarVendas(filtrarPorName: string): void {
    let name = filtrarPorName.toLocaleLowerCase();
    this.vendaServices.filterSalesByName(name).subscribe((data: any) => {
      this.vendasFiltradas = data;
      this.totalItens = this.vendasFiltradas.length;
      this.paginaAtual = 1;
    });
  }

  public calculateTotalForCurrentPage(): number {
    if (!this.vendasFiltradas) return 0;

    const startIndex = (this.paginaAtual - 1) * this.itemsPorPagina;
    const endIndex = Math.min(startIndex + this.itemsPorPagina, this.vendasFiltradas.length);
    let total = 0;

    for (let i = startIndex; i < endIndex; i++) {
      total += this.vendasFiltradas[i].totalDaVenda;
    }

    return total;
  }


  public getVendasPorPeriodo(): void {
    if (this.dateRange && this.dateRange.length === 2) {
      this.vendaServices.getSalesByDate(this.dateRange[0], this.dateRange[1]).subscribe(data => {
        this.vendasFiltradas = data
      });

    } else {
      this.vendasFiltradas = [...this.listVendas];
    }
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

    console.log(quantidade);
    if (preco) {

      this.totalDestaVenda = !quantidade ? preco : preco * quantidade;
      this.totalDestaVenda = isNaN(this.totalDestaVenda) ? 0 : this.totalDestaVenda;

    } else {
      this.totalDestaVenda = 0;
    }
  }

  public abrirModal(template: TemplateRef<any>, id: any = null) {
    if (id != null) {
      this.vendaId = id;
      this.vendaServices.getSaleById(id).subscribe(produto => {
        this.form.patchValue({
          nome: produto.nome,
          preco: produto.preco,
          quantidadeVendido: produto.quantidadeVendido
        });

        this.totalDestaVenda = produto.preco * produto.quantidadeVendido;
      });
    }
    this.modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  public adicionarVenda() {
    if (this.vendaId != 0) {
      this.vendaServices.updateSale(this.vendaId, this.form.value).subscribe({
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
    if (this.vendaId != 0) {
      this.vendaServices.deleteSale(this.vendaId).subscribe({
        next: () => {
          this.resetForm();
          this.getAllVendas();
          this.toastr.success('O Venda deletada com sucesso!', 'Finalizado!');
        },
        error: () => {
          this.resetForm();
          this.toastr.error('Ocorreu um erro ao deletar.', 'Erro');
        }
      });
    }
  }

  public validateDateRange() {
    if (this.dateRange && this.dateRange.length === 2) {
      if (this.dateRange[0] > this.dateRange[1]) {
        this.toastr.error('A data final não pode ser anterior à data inicial!', 'Atenção');
        this.dateRange = [this.dateRange[1], this.dateRange[0]];
      }
    }
  }

  public validation(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
        preco: ['', [Validators.required, Validators.pattern('^[0-9.]+$'), Validators.min(0.1), Validators.max(999)]],
        quantidadeVendido: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(999)]],
      }
    )
  }

  public resetForm(): void {
    this.form.reset();
    this.modal.hide()
  }
}
