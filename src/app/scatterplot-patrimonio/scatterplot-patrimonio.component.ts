import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { UtilsService } from '../services/utils.service';

interface Patrimonio {
  patrimonio_eleicao_1: Number;
  patrimonio_eleicao_2: Number;
  nome_urna: String;
  unidade_eleitoral: String;
}

@Component({
  selector: 'app-scatterplot-patrimonio',
  templateUrl: './scatterplot-patrimonio.component.html',
  styleUrls: ['./scatterplot-patrimonio.component.css']
})
export class ScatterplotPatrimonioComponent implements OnInit {

  private height: any;
  private width: any;
  private margin: any;
  private x: any;
  private y: any;
  private z: any;
  private xAxis: any;
  private yAxis: any;
  private data: any;
  private maior_patrimonio_eleicao1: any;
  private svg: any;  

  constructor(private utilsService: UtilsService) {
    this.height = 600;
    this.width = 900;
    this.margin = ({top: 20, right: 30, bottom: 30, left: 40});
  }

  ngOnInit() {
    this.recuperaDados();
  }

  private parseData(data: any[]): Patrimonio[] {
    return data.map(v => <Patrimonio>{patrimonio_eleicao_1: v.patrimonio_eleicao_1, patrimonio_eleicao_2: v.patrimonio_eleicao_2, nome_urna: v.nome_urna, unidade_eleitoral: v.unidade_eleitoral});
  }

  plot(){      
    this.initX();
    this.initY();
    this.initZ();
    this.initAxes();
    this.initScatterplot();
}

  private recuperaDados(){
    let dadosBD;    
    this.utilsService.recuperaPatrimonios("PB", "2016", "PREFEITO").subscribe(
      data => {
        dadosBD = data;        
        this.data = this.parseData(dadosBD);              
        this.maior_patrimonio_eleicao1 = d3.max(this.data, (d: any) => d.patrimonio_eleicao_1);           
      }, err => {
        console.log(err);
      }
    );
  }

  private initX() {
    this.x = d3.scaleLinear()
    .domain([0, this.maior_patrimonio_eleicao1]).nice()
    .range([this.margin.left, this.width - this.margin.right]);
  }

  private initY() {
    this.y = d3.scaleLinear()
    .domain([0, d3.max(this.data, (d: any) => Math.max(d.patrimonio_eleicao_1, d.patrimonio_eleicao_2))]).nice()
    .range([this.height - this.margin.bottom, this.margin.top]);
  }

  private initZ(){
    function zFunction(){
      return d3.scaleSequential(d3.interpolateRdBu).domain([-1e6, 1e6]);
    }
    this.z = zFunction();    
  }

  private initAxes(){
    this.xAxis = g => g
    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
    .call(d3.axisBottom(this.x).ticks(this.width / 80))
    .call(g => g.select(".domain").remove())

    this.yAxis = g => g
    .attr("transform", `translate(${this.margin.left},0)`)
    .call(d3.axisLeft(this.y).ticks(null, "+"))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .filter(d => d === 0)
      .clone()
        .attr("x2", this.width - this.margin.right - this.margin.left)
        .attr("stroke", "#ccc"))
    .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", this.margin.top)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Patrimônio em 2016"))
  }

  private initScatterplot() {
    this.svg = d3.select('svg');        
      
    this.svg.append("g")
        .call(this.xAxis);
    
    this.svg.append("g")
        .call(this.yAxis);
  
    // referência
    this.svg.append("line")          
      .style("stroke", "grey")  
      .attr("x1", this.x(0))     
      .attr("y1", this.y(0))      
      .attr("x2", this.x(this.maior_patrimonio_eleicao1 + 1e3))    
      .attr("y2", this.y(this.maior_patrimonio_eleicao1 + 1e3));
    
    const g = this.svg.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
    
    g.selectAll("rect")
      .data(this.data)
      .enter().append("rect")
        .attr("x", (d: any) => this.x(d.patrimonio_eleicao_1 - .5))
        .attr("width", 1)
        .attr("y", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2) : this.y(d.patrimonio_eleicao_1))
        .attr("height", (d: any) => {if(d.patrimonio_eleicao_2 >= d.patrimonio_eleicao_1){return this.y(d.patrimonio_eleicao_1) - this.y(d.patrimonio_eleicao_2)} else {return this.y(d.patrimonio_eleicao_2) - this.y(d.patrimonio_eleicao_1)}})
        .attr("fill", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("opacity", 0.5)
  
      g.selectAll("circle")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", (d: any) => this.x(d.patrimonio_eleicao_1))
        .attr("cy", (d: any) => this.y(d.patrimonio_eleicao_2))
        .attr("fill", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("opacity", 0.7)
        .attr("r", 6)
        .append("title").text((d: any) => d.nome_urna + ", " + d.unidade_eleitoral);
  
      
    return this.svg.node();
  }

}