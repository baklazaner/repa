export class Classification {
    
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
                console.log('path to Classification table', path);
            }
            
            console.log('reading Classification in async');
            
            const csv = require('csv');
            const fs = require('fs');
            
            var parser = csv.parse({ columns: true, delimiter:'\t' }, function(err, data){
                
                var superClusters = {};             
                
                data.forEach(function(line){
                    
                    if(superClusters[line.super_cluster] === undefined ){
                        superClusters[line.super_cluster] = new Array();
                    }
                    
                    superClusters[line.super_cluster].push(line);              
                });               
                
                resolve(superClusters);
            });
                
            fs.createReadStream(path).pipe(parser);
        });
        
    return promise;
        
    }
    
}