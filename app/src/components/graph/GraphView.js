import {Component, Directive, AfterViewInit, NgZone, ViewChild } from 'angular2/core';
import {NgStyle} from 'angular2/common';

import {Graph} from 'components/graph/Graph';
import {Result} from 'DataMining/Result';
import {Settings} from 'components/graph/Settings';

@Component({
    selector: 'graph-view',
    directives: [ Graph, NgStyle],
    template: `
        <h2>Graph View</h2>
        <div class="left">
            <graph [hidden]="inDetail">
                <button [hidden]="!extended" (click)="reset()" id="back" > Back </button>
            </graph>
            <div [hidden]="!inDetail" class="detail">
                <button (click)="back()">Back</button>
                <h3 *ngIf="inDetail" >{{name}} Detail</h3>
                <img src="{{imgSrc}}" alt="cluster layout "/>
                <h3>Summary</h3>
                <table>
                    <tr *ngFor="#info of detailInfo; #i = index" [ngStyle]="{'background-color':bgColor(i) }">
                        <td class="key">{{info.key}}</td><td>{{info.value}}</td>
                    </tr>
                </table>
                <h3>Summary of RepeatMasker hits</h3>
                <table>
                    <thead>
                        <tr>
                            <td>Class.Family</td><td>hits</td><td>hits[%]</td>
                        </tr>
                    </thead> 
                    <tbody>   
                        <tr *ngFor="#rm of repeatMasker; #i = index" [ngStyle]="{'background-color':bgColor(i) }">
                            <td>{{rm.key}}</td><td>{{rm.value}}</td><td>{{rm.percentage | number:'.1' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div *ngIf="sortedDomains != undefined">
                    <h3>Total number of similarity hits for each lineage</h3>
                    <table class="lineage">
                        <thead>
                            <tr><td>Lineage</td><td><span class="domain-name">Domain</span>Hits</td></tr>
                        </thead>
                        <tr *ngFor="#lineage of domainsByLineage">
                            <td width="20%">{{lineage[0].Lineage}}</td>
                            <td width="80%">
                                <ul>
                                    <li *ngFor="#entry of lineage"><span class="domain-name">{{entry.Domain}}</span><span>{{entry.Hits}}</span><span class="bar" [ngStyle]="{'width': barWidth(entry.Hits) }"></span></li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
                <div *ngIf="domains != undefined">
                    <h3>Summary of TE domain hits from blastx</h3>
                    <table>
                        <thead>
                            <tr>
                                <td>Domain</td>
                                <td>ID</td>
                                <td>Type</td>
                                <td>Lineage</td>
                                <td>Hits</td>
                                <td>MeanScore</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="#domain of domains;  #i = index" [ngStyle]="{'background-color':bgColor(i) }">
                                <td>{{domain.Domain}}</td>
                                <td>{{domain.ID}}</td>
                                <td>{{domain.Type}}</td>
                                <td>{{domain.Lineage}}</td>
                                <td>{{domain.Hits}}</td>
                                <td>{{domain.MeanScore}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="right clusters" *ngIf="extended">
        <h3>Clusters details</h3>
        <table>
            <tr>
                <td>Name (number of reads)</td>
            </tr>
            <tr *ngFor="#node of superCluster.clusters;">
                <td><button (click)="detail(node.name)"><b>{{node.name}}</b> ({{node.size}}) </button></td>
            </tr>
        </table>
        </div>
        <div class="right">  
            <h3>SuperClusters</h3>
            <table class="groups">
                <thead>
                    <tr>
                        <td></td><td>Size</td><td>Classification</td>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="#group of groups; #i = index">
                    <td><button (click)="focus(i)" [ngStyle]="{'background-color': color(i) }"><b>SuperCluster{{i+1}}</b></button></td>
                    <td>{{group.clusters.length}}</td> 
                    <td *ngIf="group.classification">{{group.classification[0].classification}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    repeatMasker: any;
    domains: any;
    maxHits: number;
    
    constructor(zone: NgZone){
        
        const result = Result.getInstance();
        
        console.log('initiating graph view');
        this.zone = zone;
        this.extended = false;       
        this.groups = result.getSuperClusters();
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
        
        const settings = Settings.default();
         
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
        
        var index = postfix-1;
        
        this.name = clusterN;
        this.detailInfo = filterDetailInfo(clusterN);
        this.repeatMasker = result.getRepeatMasker()[index].hits;
        this.domains = result.getDomains()[index];
        this.sortedDomains = result.getSortedDomains()[index];
        this.domainsByLineage = result.getSpecificLineage(index);
  
        
        console.log('maxHits', this.maxHits);
        console.log('domainsByLineage',this.domainsByLineage);
        
        
        if(this.domainsByLineage && this.domainsByLineage[0]){
            this.maxHits = this.domainsByLineage[0][0].Hits; // the first is the biggest
            console.log('max hits', this.maxHits);
        }
       
        this.inDetail = true;
        
        
        function filterDetailInfo(clusterN){
            if(!clusterInfo) return;
            var detailInfo = clusterInfo[clusterN];
            console.log('detail info', detailInfo);
            return detailInfo.filter( (info) => {
                return settings.info.detailKeys.indexOf(info.key) >= 0;
            });
        }
    }
    
    
    bgColor(i){
        if(i%2){
            return 'white';
        } else {
            return '#EEE';
        }
    }
    
    barWidth(hits){
        return (hits/this.maxHits*430) + 'px';
    }
}