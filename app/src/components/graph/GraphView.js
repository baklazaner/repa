import {Component, Directive, AfterViewInit, NgZone, ViewChild } from 'angular2/core';
import {NgStyle} from 'angular2/common';

import {Graph} from 'components/graph/Graph';
import {Result} from 'DataMining/Result';
import {Settings} from 'components/graph/Settings';

@Component({
    selector: 'graph-view',
    directives: [ Graph, NgStyle],
    templateUrl: 'components/graph/GraphView.html',
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
        
       
        this.allRMData = result.getRepeatMasker();
        
        
        this.color = Settings.default().color;
        
        
        
        window.dispatch.on('unfocus.view', () => {
            console.log('unfocusing');
        });
        
        window.dispatch.on('focus.view', (clusterIndex) => {
            
            console.log('focusing', clusterIndex);   
             
            this.zone.run( () => {
                
                this.nodeToIndex = result.nodeToIndex;
                
                this.superCluster = this.groups[clusterIndex]; 
                console.log('superCluster',this.superCluster );
                
                this.extended = true;  
            });
        });
    }
    
    // focusing on one super cluster
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