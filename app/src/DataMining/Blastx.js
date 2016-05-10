
require('events').EventEmitter.prototype._maxListeners = 200;

var threshold = 5; // only 5 hits and above

export class Blastx {
   
    
    constructor(path){
        this.path = path;
    }
    
    process(){
        return this.readFiles(this.path);
    }
    
    readFiles(path){
        
        console.log('blastx path', path);
        
        let promise = new Promise((resolve, reject) => {
           
            if(!path){
                reject('Wrong path!');
                return;
            } else {
                console.log('path to blastx folder', path);
            }
           
            console.log('reading blastx tables in async');
            
            const csv = require('csv');
            const fs = require('fs');
            const async = require('async');
    
            var domains = [];
            
            fs.readdir(path, function (err, files) {
                
                
                
                console.log('files',files);
                async.eachSeries(files, function (file, callback) {
                   
                    if(file.endsWith('_domains.csv')){
                         var parser = csv.parse({ columns: true, delimiter:'\t' }, function(err, data){
                            domains[nameToIndex(file)-1] = filterLine(data);
                         });
                         
                         fs.createReadStream(path + '/' + file).pipe(parser);
                    }
                    
                    // parse next file
                    async.setImmediate(function(){
                        callback(null);
                    });
                    
                }, function done(){
                    console.log('blastx done');
                    console.log('domains', domains);
                    resolve(domains);
                });
            });    
            
            function nameToIndex(name){
                return parseInt(name.substring(2), 10);
            }
            
            function filterLine(data){
                // data is an array
                
                var filtered;
                
                if(data.length === 1 && data[0].x === 'no hits'){
                    filtered = undefined;
                } else {
                    filtered = data;
                }
                
                return filtered;
            }
        });
        
        return promise;
    }
    
}