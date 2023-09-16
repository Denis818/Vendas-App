import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import 'chartjs-plugin-datalabels';
import { VendaService } from '../../../services/venda.service';
import { NgxSpinnerService } from 'ngx-spinner';


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
      }
    }
  };

  public graficoVendasPorDiaLabel = [];
  public graficoVendasPorDiaDados = [
    {
      data: [],
      backgroundColor: ['#d22030', '#51bbcb', '#606b6d', '#93b9c6','#f2d249', '#ccc5a8', '#26867a' ]
    }
  ];


  chartOptionsProdutosResumo: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


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

  public chart3Labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
  public chart3Datasets = [
    {
      data: [65, 59, 80, 81, 56, 55],
      label: 'Vendas',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false
    }
  ];

  constructor(private vendaServices: VendaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  public ngOnInit() {
    this.spinner.show();
    this.graficoDeVendas();
    this.getResumoVendas();
  }

  public getResumoVendas() {
    this.vendaServices.getSalesSummary().subscribe({
      next: data => {
        this.mediaDeVendaPorDia = data.mediaDeVendaPorDia;
        this.produtoMaisVendido = data.produtoMaisVendido;
        this.totalDoMaisVendido = data.totalDoMaisVendido;
        this.totalDeTodasAsVendas = data.totalDeTodasAsVendas;
        this.getProdutosResumoVendas(data.produtosResumo);

      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar resumo das Vendas.', 'Error');
      }
    });
  }

  public getProdutosResumoVendas(produtosResumoVendas: any[]){
    this.produtosResumoLabels = produtosResumoVendas.map(produto => produto.nome);
    this.produtosResumoDatasets[0].data = produtosResumoVendas.map(produto => produto.totalDaVenda.toFixed(2));
    this.produtosResumoDatasets[1].data = produtosResumoVendas.map(produto => produto.quantidadeTotalVendida);
  }

  public graficoDeVendas(): void {
    this.vendaServices.getGroupSalesDay().subscribe({
      next: data => {
        this.graficoVendasPorDiaLabel = data.map((venda: any) => venda.dia);
        this.graficoVendasPorDiaDados[0].data = data.map((venda: any) => venda.total.toFixed(2));
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar gráfico de Vendas.', 'Error');
      }
    });
  }
}
