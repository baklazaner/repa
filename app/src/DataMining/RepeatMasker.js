var threshold = 5; // only 5% hits and above

export class RepeatMasker {
    // RM stands for Repeat Masker
    
    
    
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
               console.log('path to RM summary table', path);
           }
           
           console.log('reading RM summary in async');
           
           const csv = require('csv');
           const fs = require('fs');
           
           var parser = csv.parse({ columns: true, delimiter:'\t' }, function(err, data){
              
               
               var rm = [];
               // each cluster has 3 lines of information in this table
               // hits, content, mean
               var clusterRm = {};
               
               data.forEach( (line, i) => {
                   var index = i%3;
                   if(index === 0){
                       // first line
                       clusterRm = {};
                       clusterRm.size = parseInt( line.All_Reads_Number.trim(), 10);
                       clusterRm.hits = filterLine(line, clusterRm.size);
                       
                   } else if(index === 1){
                       // second line
                       //clusterRm.content = filterLine(line);
                   } else if(index === 2){
                       // third line
                       // clusterRm.mean = filterLine(line);
                       rm.push(clusterRm);
                   }
               });
               
                console.log('RM data', rm);
               resolve(rm);
           });
            
           fs.createReadStream(path).pipe(parser);
        });
        
        return promise;
        
        
        function filterLine(line, size){
            // line is object
            // list of reserved keys
            var reserved = ['class/fammily ','All_Reads_Length','All_Reads_Number'];
            
            var filtered = [];
            
            Object.keys(line).forEach( (key) => {
                if(reserved.indexOf(key) < 0){ // key not found in reserved
                    var value = parseInt( line[key].trim(), 10);
                    var percentage = value/size*100;
                    if(value > 0 && percentage > threshold){
                        filtered.push({
                           key: key,
                           value: value,
                           percentage: percentage
                        });
                    }
                }    
            });
            
           
            
            return filtered;
            
        }
    }
    
}