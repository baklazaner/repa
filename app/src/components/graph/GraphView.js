import {Component, Directive, AfterViewInit, NgZone, ViewChild } from 'angular2/core';
import {NgStyle} from 'angular2/common';

import {Graph} from 'components/graph/Graph';
import {Result} from 'DataMining/Result';
import {Settings} from 'components/graph/Settings';


@Directive({
    selector: 'my-dear'
})

export class MyDear {
    constructor(){
        console.log('Oh my dear!');
    }
    
    test(){
        console.log('test method');
    }
    
}


@Component({
    selector: 'graph-view',
    directives: [ Graph, MyDear, NgStyle],
    template: `
        <h2>Graph View</h2>
        <div class="left">
            <graph [hidden]="inDetail">
                <button [hidden]="!extended" (click)="reset()" id="back" > Back </button>
            </graph>
            <div [hidden]="!inDetail" class="detail">
                <button (click)="back()">Back</button>
                <h3 *ngIf="inDetail" >{{detailInfo[0].value}} Detail</h3>
                <img src="{{imgSrc}}" alt="cluster layout "/>
                <table>
                    <tr *ngFor="#info of detailInfo; #i = index" [ngStyle]="{'background-color':bgColor(i) }">
                        <td class="key">{{info.key}}</td><td>{{info.value}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="right" *ngIf="extended">
        <h3>Clusters details</h3>
        <table>
            <tr *ngFor="#node of superCluster.clusters;">
                <td><button (click)="detail(node.name)">{{node.name}}</button></td>
            </tr>
        </table>
        </div>
        <br clear="all"/>        
        <h3>SuperClusters</h3>
        <table class="groups">
            <thead>
                <tr>
                    <td>Select</td><td>Size</td><td>Classification</td>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="#group of groups; #i = index">
                   <td><button (click)="focus(i)" [ngStyle]="{'background-color': color(i) }"><b>SuperCluster{{i}}</b></button></td>
                   <td>{{group.clusters.length}}</td> 
                   <td>{{group.classification[0].classification}}</td>
                </tr>
            </tbody>
        </table>
        <my-dear #dear></my-dear>    
    `,
    
})

export class GraphView {
  
    mydear: any;
    extended: boolean;
    inDetail: boolean;
    groups: any;
    color: any;
    cluster: any;
    superCluster: any;
    detailInfo: any;
    imgSrc: string;
    
    constructor(zone: NgZone){
        
        const result = Result.getInstance();
        
        console.log('initiating graph view');
        this.zone = zone;
        this.extended = false;       
        this.groups = result.getResult().clusters;
        this.info = result.getClusterInfo();
      
        
        this.color = Settings.default().color;
        
        window.dispatch = d3.dispatch('unfocus','focus');
        
        window.dispatch.on('unfocus.view', () => {
            console.log('unfocusing');
        });
        
        window.dispatch.on('focus.view', (clusterIndex) => {
            console.log('focusing', clusterIndex);   
             
            this.zone.run( () => {
                
                this.superCluster = this.groups[clusterIndex]; 
                console.log('superCluster',this.superCluster );
                
                this.extended = true;  
            });
        });
    }
    
    focus(clusterIndex){
        console.log('focusing cluster @', clusterIndex);
        this.inDetail = false;
        window.dispatch.focus(clusterIndex);
        window.scrollTo(0,0);
    }
    
    reset(){
        window.dispatch.unfocus();
        this.extended = false;
    }
    
    ngAfterViewInit(){
        console.log('done');
        console.log(this.mydear);
    }
    
    back(){
        this.inDetail = false;
    }
    
    detail(clusterN){
        console.log('Showing detail about', clusterN);
        
         
        const result = Result.getInstance();
        const clusterInfo = result.getClusterInfo();
        const summaryPath = result.getSummaryPath();
        console.log('summary path', result.getSummaryPath());
        const prefix = clusterN.substring(0,2); // CL
        const postfix = clusterN.substring(2, clusterN.length); // 
        const numberOfZeros = 4; // we need to get this format CL0023
        const format = prefix + ('0'.repeat(numberOfZeros-postfix.length) ) + postfix; 
        console.log('format', format);
        
        this.imgSrc = summaryPath + '/' + format + '/graphLayout.png';
        
        this.detailInfo = clusterInfo[clusterN];
        this.inDetail = true;
    }
    
    bgColor(i){
        if(i%2){
            return 'white';
        } else {
            return '#EEE';
        }
    }
}