const remote = require('remote');
const app = remote.require('app'); 
const dialog = remote.require('dialog');
const electron = require('electron');
electron.app = app;
const storage = remote.require('electron-json-storage');



import {Component, View, NgZone } from 'angular2/core';
import {Router} from 'angular2/router';

import {Analyzer} from 'DataMining/Analyzer';
import {SummaryTable} from 'DataMining/SummaryTable';
import {Classification} from 'DataMining/Classification';
import {SmartPath} from 'DataMining/SmartPath';
import {Result} from 'DataMining/Result';
import {RepeatMasker} from 'DataMining/RepeatMasker';


@Component({
    selector: 'intro',
    templateUrl: 'components/intro/intro.html',     
})

export class Intro {
    
    loading: boolean;
    threshold: number;
    
    constructor(zone: NgZone, router: Router) {
        console.info('Intro Component Mounted Successfully');
        console.info('user data dir', app.getPath('userData'));
        
        this.threshold = 10; // default mates threshold    
        this.zone = zone;
        this.router = router;
        this.loading = false;  
        this.updateLoading = (value) => {         
            this.zone.run(() => {
                this.loading = value;    
            });                
        };
        
        storage.has('history', function(error, hasKey) {
            if(!hasKey){
                console.log('no history key');
                storage.set('history', { history: true, paths: []}, function(error) {
                    if(error) throw error;        
                });
            }    
        });    
        
        storage.get('history', (error, data) => {
            console.log('history', data);
            if(error) throw error;
            this.zone.run(() => {
                this.history = data;
            });                     
        });                 
    } 
   
    openDialog() {
        
        dialog.showOpenDialog({properties: ['openDirectory']}, (paths) => {
    
            if(!paths){
                console.warn('No path selected');
                return;
            }
            
            var path = paths[0];    
            console.log('path:', path);
           
            
            // update UI
            this.zone.run(() => {
                this.loading = true;               
            });    
            
            this.mineData(path);
        });
    }
    
    selectPath(path){
        console.log('path selected', path);
        this.mineData(path);
    }
    
    mineData(path){
        // run analyzer    
        const smartPath = new SmartPath(path);
        const pathToCC = smartPath.getClusterConnectionsPath();
        const pathToST = smartPath.getSummaryTablePath();
        const pathToCLSV = smartPath.getClassificationPath();
        const pathToSummary = smartPath.getSummaryPath();
        const pathToRM = smartPath.getRMPath();
       
        
        // only update history on successful search
        if(pathToCC){
            this.updateHistory(path);   
        }
        
        const summary = new SummaryTable(pathToST);
        const classification = new Classification(pathToCLSV);
        
        const analyzer = new Analyzer(pathToCC);
        analyzer.setThreshold(this.threshold);
        
        const perResult = Result.getInstance();
        perResult.setSummaryPath(pathToSummary);
        
        const rm = new RepeatMasker(pathToRM);
        
        Promise.all([
            analyzer.process(), summary.process(), classification.process(), rm.process()
            ]).then( (values) =>{
                
                var result = values[0];
                var clusterInfo = values[1];
                var classification = values[2];
                var rmTable = values[3];
                
                perResult.setClassification(classification);
                perResult.setResult(result);
                perResult.setClusterInfo(clusterInfo);
                perResult.setRepeatMasker(rmTable);
                
                console.log('DataMining', values);
                
                this.updateLoading(false);   
                this.router.parent.navigate(['Graph']);         
                
                console.log('values', values);
                
            }).catch( (error) => {
                
                console.error('Erorr at processing file in Analyzer', error);
                this.updateLoading(false);   
                   
            });
    }
    
    updateHistory(path){
        console.log('updating history');
        
        var newHistory = {
            paths: processHistory(path, this.history.paths)    
        };
        
        // store path in history            
        // Write
        storage.set('history', newHistory, function(error) {
            if(error) throw error;
        });
        
        // update UI
        this.zone.run(() => {
            this.history = newHistory;               
        });    
        
        function processHistory(newPath, paths) {           
        
        
            if(paths === undefined){
                return [newPath];
            }
            
            const index = paths.indexOf(newPath);
            if(index !== -1){
                // move it to the front
                moveInArray(paths, index, 0);                
            } else {
                paths = [newPath].concat(paths);
            }
            
            // show only last X items of history
            return paths.splice(0, 10);
            
            function moveInArray(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            }
        }                    
    }
    
    // end of class Intro    
}

