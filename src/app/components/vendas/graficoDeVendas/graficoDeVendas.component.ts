import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import 'chartjs-plugin-datalabels';
import { VendaService } from '../../../services/venda.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-graficoDeVendas',
  templateUrl: './graficoDeVendas.component.html',
  styleUrls: ['./graficoDeVendas.component.css']
})

export class GraficoDeVendasComponent implements OnInit {
  public mediaDeVendaPorDia: number = 0;
  public produtoMaisVendido: string = '';
  public totalDoMaisVendido: number = 0;
  public totalDeTodasAsVendas: number = 0;

  public chartOptionsGraficoVendas: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 13,
          },
          color: '#708090'
        }
      },
      tooltip: {
        callbacks: {
          label: this.graficoFormatPreco
        }
      }
    }
  };

  public chartOptionsProdutosResumo: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins:{
      tooltip: {
        callbacks: {
          label: this.graficoFormatPreco
        }
      }
    }
  };

  public graficoVendasPorDiaLabel: any = [];
  public graficoVendasPorDiaDados = [
    {
      data: [] as any,
      backgroundColor: ['#d22030', '#51bbcb', '#606b6d', '#93b9c6', '#f2d249', '#ccc5a8', '#26867a']
    }
  ];

  public produtosResumoLabels: any = [];
  public produtosResumoDatasets = [
    {
      data: [] as any,
      label: 'Total de Vendas'
    },
    {
      data: [] as any,
      label: 'Quantidade total das vendas do item'
    }
  ];

  constructor(private vendaServices: VendaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  public ngOnInit() {
    this.spinner.show();
    this.carregarDados();
  }

  private carregarDados() {
    forkJoin({
      resumoVendas: this.vendaServices.getSalesSummary(),
      graficoVendas: this.vendaServices.getGroupSalesDay()

    }).subscribe({
      next: results => {
        this.processarResumoVendas(results.resumoVendas);
        this.processarGraficoDeVendas(results.graficoVendas);
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os dados.', 'Error');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  private processarResumoVendas(produto: any) {
    this.mediaDeVendaPorDia = produto.mediaDeVendaPorDia;
    this.produtoMaisVendido = produto.produtoMaisVendido;
    this.totalDoMaisVendido = produto.totalDoMaisVendido;
    this.totalDeTodasAsVendas = produto.totalDeTodasAsVendas;
    this.getProdutosResumoVendas(produto.produtosResumo);
  }

  private processarGraficoDeVendas(produto: any[]) {
    this.graficoVendasPorDiaLabel = produto
    .map((venda: any) => venda.dia);

    this.graficoVendasPorDiaDados[0].data = produto
    .map((venda: any) => venda.total.toFixed(2));
  }

  public getProdutosResumoVendas(produtosResumoVendas: any[]) {
    this.produtosResumoLabels = produtosResumoVendas
    .map(produto => produto.nome);

    this.produtosResumoDatasets[0].data = produtosResumoVendas
    .map(produto => produto.totalDaVenda.toFixed(2));

    this.produtosResumoDatasets[1].data = produtosResumoVendas
    .map(produto => produto.quantidadeTotalVendida);
  }

  public graficoFormatPreco(context: any): string {
    const value = context.parsed.y || context.parsed;
    return `${context.label}: R$ ${value.toFixed(2)}`;
  }
}
