import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendaService } from '../../services/venda.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Venda } from 'src/app/models/Venda';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

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
  public totalDasVendas: number = 0;
  private buscarName: string = '';

  public listVendas: Venda[] = [];
  public vendasFiltradas: Venda[] = [];
  public get filtroLista(): string { return this.buscarName; }

  public set filtroLista(value: string) {
    this.buscarName = value;
    if (this.buscarName) {
      this.FiltrarVendas(this.buscarName);
    } else {
      this.vendasFiltradas = this.listVendas;
    }
  }

  public get vendidoPorPagina(): number {
    return this.vendasFiltradas.reduce((total, venda) => {
      total += venda.totalDaVenda
      return total;
    }, 0);
  };

  constructor(private vendaServices: VendaService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService) {
    defineLocale('pt-br', ptBrLocale);
  }

  ngOnInit() {
    this.getVendas()
    this.validation()
    this.localeService.use('pt-br');
  }

  public getVendas(): void {
    this.vendaServices.getVendas(this.paginaAtual, this.itemsPorPagina).subscribe((data: any) => {
      this.listVendas = data.paginatedResult.itens
      this.vendasFiltradas = [...this.listVendas];

      this.totalItens = data.paginatedResult.totalItens;
      this.totalDasVendas = data.totalVendido
    });
  }

  public FiltrarVendas(filtrarPorName: string): void {
    let name = filtrarPorName.toLocaleLowerCase();
    this.vendaServices.getFilterVendas(name).subscribe((data: any) => {
      this.vendasFiltradas = data;
    });
  }

  public getVendasPorPeriodo(): void {
    if (this.dateRange && this.dateRange.length === 2) {
      const dataInicio = this.dateRange[0];
      const dataFim = this.dateRange[1];
      this.vendaServices.getVendasPorPerildo(dataInicio, dataFim).subscribe(data => {
        this.vendasFiltradas = data
      })
    } else {
      this.vendasFiltradas = [...this.listVendas];
    }
  }

  public abrirModal(template: TemplateRef<any>, id: any = null) {
    if (id != null) {
      this.vendaId = id;
      this.vendaServices.getVendaById(id).subscribe(produto => {
        this.form.patchValue({
          produto: produto.produto,
          preco: produto.preco,
          quantidade: produto.quantidadeVendido
        });
      });
    }
    this.modal = this.modalService.show(template, { class: 'modal-sm' });
  }

  public adicionarVenda() {
    if (this.vendaId != 0) {
      console.log(this.form.value);
      this.vendaServices.editar(this.vendaId, this.form.value).subscribe(() => {
        this.resetForm();
        this.getVendas();
        this.toastr.success('Alterações realizadas com sucesso!', 'Finalizado!');
      });

    } else {
      this.vendaServices.adicionar(this.form.value).subscribe(() => {
        this.resetForm();
        this.getVendas();
        this.toastr.success('Adiconado com sucesso!', 'Finalizado!');
      });
    }
  }

  public confirmDelete(): void {
    if (this.vendaId != 0) {
      this.vendaServices.deleteVenda(this.vendaId).subscribe(() => {

        this.resetForm();
        this.getVendas();
        this.toastr.success('O Venda deletada com sucesso!', 'Finalizado!');
      }, error => {
        console.error("Ocorreu um error: ", error)
        this.toastr.error('Ocorreu um erro ao deletar a venda.', 'Erro');
      });
    }
  }

  public validateDateRange() {
    if (this.dateRange && this.dateRange.length === 2) {
      if (this.dateRange[0] > this.dateRange[1]) {
        alert('A data final não pode ser anterior à data inicial!');
        this.dateRange = [this.dateRange[1], this.dateRange[0]]; // Inverte as datas
      }
    }
  }

  public validation(): void {
    this.form = this.fb.group(
      {
        produto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        preco: ['', [Validators.required, Validators.pattern('^[0-9.]+$')]],
        quantidadeVendido: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      }
    )
  }

  public resetForm(): void {
    this.form.reset();
    this.modal.hide()
  }
}
