export class SummaryTable {
    
    constructor(path){
        this.path = path;
    }
    
    process(){
        return this.readFile(this.path);
    }
    
    readFile(path){
        
        let promise = new Promise((resolve, reject) => {
           
           if(!path){
               reject('Wrong path!');
               return;
           } else {
               console.log('path to summary table', path);
           }
           
           console.log('reading Summary Table in async');
           
           const csv = require('csv');
           const fs = require('fs');
           
           var parser = csv.parse({ columns: true, delimiter:'\t' }, function(err, data){
               console.log('STdata',data);
               
               var clusterInfo = {};
               
               data.forEach( (cluster) => {
                   clusterInfo[cluster.cluster] = cluster;
               });
               
               resolve(clusterInfo);
           });
            
           fs.createReadStream(path).pipe(parser);
        });
        
        return promise;
        
    }
    
}