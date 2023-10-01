import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(-25%)' })),
      state('*', style({ transform: 'translateY(0)' })),
      transition(':enter', animate('300ms ease-in')),
      transition(':leave', animate('300ms ease-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;
  public hiddenStates: boolean[] = [];

  public listVendas: any[] = [];
  public exibirTabela: boolean = false;

  vendasDoDia: number = 0;
  produtosVendidos: number = 0;

  public resumoVendas: any = {
    mediaDeVendaPorDia: 0,
    produtoMaisVendido: '',
    totalDeTodasAsVendas: 0,
    totalVendasHoje: 0
  }

  public chartOptionsGraficoVendas: ChartOptions = {
    responsive: false,
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
          label: this.vendasFormatPreco
        }
      }
    }
  };

  public chartOptionsProdutosResumo: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: {
      tooltip: { callbacks: { label: this.produtoFormatPreco } },
      legend: {
        position: 'top',
        align: 'start',
        onClick: (event, legendItem) => this.legendOnClick(legendItem),
        labels: {
          font: { size: 13, },
          color: '#708090'
        }
      },
    }
  };

  public graficoVendasPorDiaLabel: any = [];
  public graficoVendasPorDiaDados = [
    {
      data: [] as any,
      backgroundColor: ['#d22030', '#51bbcb', '#606b6d', '#93b9c6', '#f2d249', '#ccc5a8', '#26867a'],
      borderColor: ['#fff'],
      borderWidth: 2
    }
  ];

  public produtosResumoLabels: any = [];
  public produtosResumoDatasets = [
    {
      data: [] as any,
      label: 'Total de Vendas',
      backgroundColor: ['#51bbcb'],
      borderColor: ['#51bbcb'],
    },
    {
      data: [] as any,
      label: 'Quantidade Vendida',
      backgroundColor: ['#606b6d'],
      borderColor: ['#606b6d'],
    }
  ];

  constructor(private dashboardServices: DashboardService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  public ngOnInit() {
    this.spinner.show();
    this.carregarDados();
  }

  public toggleTabela(): void {
    this.exibirTabela = !this.exibirTabela;
  }

  private carregarDados() {
    forkJoin({
      resumoVendas: this.dashboardServices.getSalesSummary(),
      graficoVendas: this.dashboardServices.getGroupSalesDay(),
      vendasDeHoje: this.dashboardServices.getSalesCurrentDay()

    }).subscribe({
      next: results => {
        this.processarResumoVendas(results.resumoVendas);
        this.processarGraficoDeVendas(results.graficoVendas);
        this.processarVendasDeHoje(results.vendasDeHoje);
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

  private processarVendasDeHoje(vendas: any[]) {
    this.listVendas = vendas;
  }

  private processarResumoVendas(produto: any) {
    this.resumoVendas.mediaDeVendaPorDia = produto.mediaDeVendaPorDia;
    this.resumoVendas.produtoMaisVendido = produto.produtoMaisVendido;
    this.resumoVendas.totalDeTodasAsVendas = produto.totalDeTodasAsVendas;
    this.resumoVendas.totalVendasHoje = produto.totalVendasHoje;
    this.getProdutosResumoVendas(produto.produtosResumo);
  }

  private processarGraficoDeVendas(produto: any[]) {
    this.graficoVendasPorDiaLabel = produto
      .map((venda: any) => venda.dia);

    this.graficoVendasPorDiaDados[0].data = produto
      .map((venda: any) => venda.total.toFixed(2));
  }

  private getProdutosResumoVendas(produtosResumoVendas: any[]) {
    this.produtosResumoLabels = produtosResumoVendas
      .map(produto => produto.nome);

    this.produtosResumoDatasets[0].data = produtosResumoVendas
      .map(produto => produto.totalDaVenda.toFixed(2));

    this.produtosResumoDatasets[1].data = produtosResumoVendas
      .map(produto => produto.quantidadeTotalVendida);

    this.hiddenStates = new Array(this.produtosResumoDatasets.length).fill(false);

  }

  private vendasFormatPreco(context: any): string {
    return `R$ ${context.parsed.toFixed(2)}`;
  }

  private produtoFormatPreco(context: any): string {
    if (context.dataset.label === 'Total de Vendas') {
      return `R$ ${context.parsed.y.toFixed(2)}`;
    } else {
      return `Total de vendas: ${context.parsed.y}`;
    }
  }

  public legendOnClick(legendItem: any) {
    let chart = this.chart.chart;
    if (chart) {
      let hidden = this.hiddenStates[legendItem.datasetIndex];
      this.hiddenStates[legendItem.datasetIndex] = !hidden;
      chart.data.datasets[legendItem.datasetIndex].hidden = this.hiddenStates[legendItem.datasetIndex];
      chart.update();
    }
  }

  public chartClicked(e: any): void {
    if (this.chart && this.chart.chart) {
      const activePoints = this.chart.chart.getElementsAtEventForMode(e.event, 'nearest', { intersect: true }, true);

      if (activePoints && activePoints.length > 0) {
        const clickedDatasetIndex = activePoints[0].datasetIndex;

        const dataset = this.chart.chart.data.datasets[clickedDatasetIndex];

        if (dataset) {
          this.hiddenStates[clickedDatasetIndex] = !this.hiddenStates[clickedDatasetIndex];
          dataset.hidden = this.hiddenStates[clickedDatasetIndex];
          this.chart.chart.update();
        }
      }
    }
  }
}
