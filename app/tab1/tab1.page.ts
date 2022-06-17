import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';
import { IonSlides} from '@ionic/angular';

//Graficos
import Chart from 'chart.js/auto';
import ChartType from 'chart.js/auto';


const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

// const doughnut:ChartType = "doughnut";

const config = {
  // type:doughnut,
  data:data,
};

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
//Declaração da classe
export class Tab1Page implements AfterViewInit{
  @ViewChild('barCanvas') private barCanvas: ElementRef;

  barChart: any;

  constructor() {}

  ngAfterViewInit() {
    // this.lineChartMethod();
  }
  

  // lineChartMethod() {
  //   this.barChart = new Chart(this.barCanvas.nativeElement, config);
  // }
}