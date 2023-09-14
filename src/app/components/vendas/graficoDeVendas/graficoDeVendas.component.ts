import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import 'chartjs-plugin-datalabels';
import { VendaService } from '../../../services/venda.service';


@Component({
  selector: 'app-graficoDeVendas',
  templateUrl: './graficoDeVendas.component.html',
  styleUrls: ['./graficoDeVendas.component.css']
})

export class GraficoDeVendasComponent implements OnInit {
  public pieChartLabels = [];
  public pieChartLegend = true;
  public pieChartDatasets = [
    {
      data: [],
      label: 'Vendas Por Dia',
      font: {
        size: 500
      },
      backgroundColor: ['#6A5ACD', '#4169E1', '#708090', '#8A2BE2', '#228B22', '#2F4F4F', '#4682B4']
    }
  ];
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 20
          }
        }
      }
    }
  };

  public mediaDeVendaPorDia: number = 0;
  public produtoMaisVendido: string = '';
  public totalDoMaisVendido: number = 0;
  public totalDeTodasAsVendas: number = 0;

  constructor(private vendaServices: VendaService,
    private toastr: ToastrService) {
  }

  public ngOnInit() {
    this.graficoDeVendas();
    this.getResumoVendas();
  }

  public getResumoVendas(){
    this.vendaServices.getSalesSummary().subscribe(data => {
      this.mediaDeVendaPorDia = data.mediaDeVendaPorDia;
      this.produtoMaisVendido = data.produtoMaisVendido;
      this.totalDoMaisVendido = data.totalDoMaisVendido;
      this.totalDeTodasAsVendas = data.totalDeTodasAsVendas;
    });
  }

  public graficoDeVendas(): void {
    this.vendaServices.getGroupSalesDay().subscribe({
      next: data => {
        this.pieChartLabels = data.map((venda: any) => venda.dia);
        this.pieChartDatasets[0].data = data.map((venda: any) => venda.total);
      },
      error: () =>{
        this.toastr.error('Erro ao carregar gráfico de Vendas.', 'Error');
      }
    });
  }
}
