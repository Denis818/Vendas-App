import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { VendaService } from 'src/app/services/venda.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
    responsive: false, // Desativa o redimensionamento responsivo
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: {
      tooltip: { callbacks: { label: this.produtoFormatPreco } },
      legend: {
        position: 'top',
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
      backgroundColor: ['#606b6d'],
      borderColor: ['#fff'],
      borderWidth: 1
    },
    {
      data: [] as any,
      label: 'Quantidade Vendida',
      backgroundColor: ['#51bbcb']

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

  public toggleTabela(): void {
    this.exibirTabela = !this.exibirTabela;
  }

  private carregarDados() {
    forkJoin({
      resumoVendas: this.vendaServices.getSalesSummary(),
      graficoVendas: this.vendaServices.getGroupSalesDay(),
      vendasDeHoje: this.vendaServices.getSalesCurrentDay()

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

  public getProdutosResumoVendas(produtosResumoVendas: any[]) {
    this.produtosResumoLabels = produtosResumoVendas
      .map(produto => produto.nome);

    this.produtosResumoDatasets[0].data = produtosResumoVendas
      .map(produto => produto.totalDaVenda.toFixed(2));

    this.produtosResumoDatasets[1].data = produtosResumoVendas
      .map(produto => produto.quantidadeTotalVendida);
  }

  public vendasFormatPreco(context: any): string {
    return `R$ ${context.parsed.toFixed(2)}`;
  }

  public produtoFormatPreco(context: any): string {
    if (context.dataset.label === 'Total de Vendas') {
      return `R$ ${context.parsed.y.toFixed(2)}`;
    } else {
      return `Total de vendas: ${context.parsed.y}`;
    }
  }
}
