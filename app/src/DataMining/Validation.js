export class Validation {
    
    constructor(result){
        this.result = result;
    }
    
    validate(className, cluster){
        
        if(className === 'LTR/Copia'){
            
            console.log('validating Copia');
          
            return this.validateByModel(cluster, ['GAG','PROT','INT','RT','RH']);
            
        }
        
        if(className === 'LTR/Gypsy'){
            
            console.log('validating Gypsy');
            
            return this.validateByModel(cluster, ['GAG','PROT','RT','RH','INT']);
           
        }
        
        return null;
    }
    
    validateByModel(cluster, model, startNode){
        
        var isValid = false;
        
        var modelIndex = 0; // first
        
        // find first model domain in cluster graph
        
        var node;
        var found = false;
        var clusterLength = cluster.length;
        
       
        if(startNode === undefined ){
            for(var i=0; i < clusterLength; i++){
                
                node = cluster[i];
            
                var lineage =  this.result.getSpecificLineage(node.clIndex-1);
                if(lineage){
                    const domains = lineage[0];
                    
                    checkDomain(domains);
                    
                    if(found === true){
                        clusterLength = 0; // break for
                        console.log('found in', node);
                        console.log('modelIndex', modelIndex);
                    }
                } else {
                    console.log('node has no lineage');
                }
                
            }
            
            if(!found){
                // if we haven't found the first one a this point, its invalid
                return false;
            }
            
        } else {
            console.log('starting at', startNode);
            node = startNode;
        }
        
        // continue with closest neighboursg    
        console.log('node', node);
        
        found = false;
        
        node.links.forEach( (link) => {
            if(found){
                return;
            }
            
            console.log('looking in neighbour');
        
            var closest = link.to;
            var domains = this.result.getSpecificLineage(closest.clIndex-1)[0];
            
            checkDomain(domains); 
            if(found){
                console.log('found in neighbour');
                node = closest;
            }
            
        });
        
        if(!found){
            // we haven't found anything in closest neighbours
            return false;
        } 
        
        if(isValid){
            return true;
        }
        
        console.log('continue');
        
        var newModel = model.filter( (e,i) => i>=modelIndex );
        
        return this.validateByModel(cluster, newModel, node);
        
        function checkDomain(domains){
            
            var simpleDomains = domains.map( d => d.Domain );
            console.log('simpleDomains', simpleDomains);
            
            var length = simpleDomains.length;
            
            for(var j=0, l=0; j < length*length; j++, l=j%length){
               
               var lookingFor =  model[modelIndex];
               
               if(lookingFor === simpleDomains[l].substring(4)){
                   console.log('found', lookingFor);
                   modelIndex++;
                   found = true;
                   
                   if(modelIndex === (model.length)){
                       console.warn('~~~ MODEL VALID ~~~');
                       isValid = true;;
                       return true;
                   }
               }
            }
        }
    }
    
}