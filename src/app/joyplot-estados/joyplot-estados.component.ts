import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FilterService } from '../services/filter.service';

import * as d3 from 'd3';

import {View, Parse, parse, Spec} from 'vega';
declare var vega: any;


@Component({
  selector: 'app-joyplot-estados',
  templateUrl: './joyplot-estados.component.html',
  styleUrls: ['./joyplot-estados.component.css']
})
export class JoyplotEstadosComponent implements OnInit {
  @Input() id: any;
  @Output() outgoingData = new EventEmitter<any>();
  @Input() pathToData: string;
  view: View;
    
  public vegaInit(spec: Spec) {
    this.view = new vega.View(vega.parse(spec))
      .renderer('svg')          // set renderer (canvas or svg)
      .initialize('#' + this.id)// initialize view within parent DOM container
      .width(500)               // set chart width 
      .height(500)              // set chart height
      .hover()                  // enable hover encode set processing
      .run();
  }


  ngOnInit() {
    vega.loader().load(this.pathToData)
    .then((data) => { this.vegaInit(JSON.parse(data)); });
    
  }
}

//   private height: any;
//   private width: any;
//   private margin: any;
//   private x: any;
//   private y: any;
//   private z: any;
//   private xAxis: any;
//   private yAxis: any;
//   private svg1: any;
//   private line: any;
//   private g: any;
//   private estadoScale: any;

//   private data: any;
//   private menorGanho: any;
//   private maiorGanho: any;
//   private estados = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];


//   private overlap = 0.6;

//   constructor(private filterService: FilterService) {
//     this.margin = ({ top: 20, right: 30, bottom: 20, left: 0 });
//     this.height = 580;
//     this.width = 380;
//   }

//   // ngOnInit() {
//   //   this.svg1 = d3.select("#joyplot").select('svg');
//   // }


  


//   private initX() {
//     this.x = d3.scaleLog()
//       .domain([this.menorGanho, this.maiorGanho])
//       .range([this.margin.left, this.width - this.margin.right]);
//   }

//   private initY() {
//     this.y = d3.scaleLinear()
//       .range([this.height - this.margin.bottom, this.margin.top]);

//     this.estadoScale = d3.scaleBand()
//       .range([this.height - this.margin.bottom, this.margin.top]);

//   }



//   private initAxes() {
//     this.xAxis = g => g
//       .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
//       .call(d3.axisBottom(this.x).tickFormat(d3.format(".1")))
//       .call(g => g.select(".domain").remove())
//       .call(g => g.append("text")
//         .attr("fill", "#000")
//         .attr("x", this.width / 2)
//         .attr("y", this.margin.bottom * 1.5)
//         .attr("dy", "0.32em")
//         .attr("text-anchor", "middle")
//         .attr("font-weight", "bold")
//         .text("Mudança relativa"));

//     this.yAxis = g => g
//       .attr("transform", `translate(${this.margin.left},0)`)
//       .call(d3.axisLeft(this.y))
//       .call(g => g.select(".domain").remove())
//       .call(g => g.append("text")
//         .attr("fill", "#000")
//         .attr("x", 5)
//         .attr("y", this.margin.top)
//         .attr("dy", "0.32em")
//         .attr("text-anchor", "start")
//         .attr("font-weight", "bold")
//         .text("Estado"));

//   }


//   plotJoyplot() {
//     // this.initX();
//     // this.initY();
//     // this.initAxes();
//     this.initJoyplot();
//   }


//   // private initJoyplot(){

//   //   this.svg1.selectAll("*").remove();

//   //   this.svg1.append("g")
//   //       .call(this.xAxis);

//   //   this.svg1.append("g")
//   //       .attr("id", "y-axis")
//   //       .call(this.yAxis);

//   //   const g = this.svg1.append("g")
//   //       .attr("stroke", "#000")
//   //       .attr("stroke-opacity", 0.2);



//   // }

//   private initJoyplot() {
//     var margin = { top: 30, right: 20, bottom: 30, left: 30 },
//       width = 380,
//       height = 580 - margin.top - margin.bottom;

//     this.svg1.selectAll("*").remove();


//     // Percent two area charts can overlap
//     var overlap = 0.6;

//     this.svg1 = d3.select("#joyplot").select('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height + margin.top + margin.bottom)
//       .append('g')
//       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//     var x = function (d) { return d.ganho_relativo; },
//       xScale = d3.scaleLog().domain([this.menorGanho, this.maiorGanho])
//         .range([this.margin.left, this.width - this.margin.right]),
//       xValue = function (d) { return xScale(x(d)); },
//       xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".1"));

//     var y = function (d) { return d.values; },
//       yScale = d3.scaleLinear(),
//       yValue = function (d) { return yScale(y(d)); };

//     var state = function (d) { return d.key; },
//       stateScale = d3.scaleBand().range([0, height]),
//       stateValue = function (d) { return stateScale(state(d)); },
//       stateAxis = d3.axisLeft(stateScale);

//     // ========= O problema pode estar aqui! =========
  
//     var area = d3.area()
//       .x1((d : any) => d.key)
//       .y1((d : any) => d.values.length);
//       // .y0(y(0));

//     var line = area.lineY1();


//     function row(d) {
//       return {
//         estado: d.estado,
//         ganho_relativo: d.ganho_relativo,
//         nome: d.nome_urna
//       };
//     }

//     this.filterService.dadosPatrimonio.subscribe(data => this.data = data);

//     this.menorGanho = d3.min(this.data, (d: any) => d.ganho_relativo);
//     this.menorGanho = d3.max(this.data, (d: any) => d.ganho_relativo);

//     var dataFlat = this.data;

//     dataFlat.sort(function (a, b) { return a.ganho_relativo - b.ganho_relativo; });

//     var data = d3.nest()
//       .key((d: any) => d.estado)
//       .key((d: any) => d.ganho_relativo)
//       .entries(dataFlat);


//     data.sort(function (a, b) { return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0); });


//     stateScale.domain(data.map(function (d) { return d.key; }));

//     var areaChartHeight = (1 + overlap) * (height / stateScale.domain().length);

//     yScale.range([areaChartHeight, 0]);

//     //area.y0(yScale(0));

//     this.svg1.append('g').attr('class', 'axis axis--x')
//       .attr('transform', 'translate(0,' + height + ')')
//       .call(xAxis);

//     this.svg1.append('g').attr('class', 'axis axis--state')
//       .call(stateAxis);

//     var gstate = this.svg1.append('g').attr('class', 'states')
//       .selectAll('.state').data(data)
//       .enter().append('g')
//       .attr('class', function (d) { return 'state state--' + d.key; })
//       .attr('transform', function (d) {
//         var ty = stateValue(d) - stateScale.bandwidth() + 5;
//         return 'translate(0,' + ty + ')';
//       });

//     gstate.append('path').attr('class', 'area')
//       .datum(function (d) { return d.values; })
//       .attr('d',  area);

//     gstate.append('path').attr('class', 'line')
//       .datum(function (d) { return d.values; })
//       .attr('d', line);


//     return this.svg1.node();

//   }



// }

