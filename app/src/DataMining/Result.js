var domainHitsThreshold = 10; // min 10 hits, or domain is not registered

class ResultData {
    // public connections: any;
    // public nodes: any;
    // public clusters: any;
}

class GraphData {
    // public nodes: any;
    // public links: any;
}

export class Result {
    
    result: ResultData;
    graph: any;
    
    static instance;
    
    constructor(){
        console.log('creating instance of Results');
        
        this.isResult = false;
        
        this.result = new ResultData();
        this.graph = new GraphData();
        
        this.clusterInfo;
        this.summaryPath;
        this.superClusters = [];
        this.classification;
        this.repeatMasker;
        this.domains;
        this.sortedDomains;
        this.domainsByLineage;
        this.nodeToIndex;
    }
    
    static getInstance(){
        
        if(!Result.instance){
            Result.instance = new Result();
        }
        
        return Result.instance;
    }
    
    setResult(result){
        console.log('setting result', result);
        
       
        this.result.connections = result.connections;
        this.result.nodes = result.nodes;
        this.result.clusters = result.clusters;
        this.updateSuperClusters();
        
        this.isResult = true;
    }
    
    updateSuperClusters(){ 
            
        var r = [];
        this.result.clusters.forEach( (cluster, i) => {
            
            var domains = [];
            cluster.forEach( (node) => {
                
                var family = this.getSpecificLineage(node.clIndex-1);
                if( family && family[0]){
                    
                    domains.push(
                        family[0]
                    );
                }       
            });
            
            // flattern array
            var merged = [].concat.apply([], domains).filter( onlyUnique );
            
            r.push({
                clusters: cluster,
                domains: merged,
                // classification: this.classification[i+1]
            });
        });    
        this.superClusters = r;
        
        
        function onlyUnique(value, index, self) { 
            var found = false;
            self.forEach( (val) => {
                // found = val.Domain = value.Domain;    
            });  (value) === index;
        }
        
    }
    
    getResult(){
        return this.result;
    }
    
    setClassification(classification){
        console.log('setting classification', classification);
        this.classification = classification;
    }
    
    setClusterInfo(clusterInfo){
        
        var filtered = {};
       
        // remove every entry where is only 0 => no valuable information
        Object.keys(clusterInfo).forEach( (cluster) => {
            
            var info = clusterInfo[cluster];
            filtered[cluster] = [];
            
            Object.keys( info ).forEach( (key) => {
                
                // filter out empty properties
                if( info[key] != "0" && info[key] != ""){
                 
                    filtered[cluster].push({
                        key: key,
                        value: info[key]
                    });
                }
            });
            
            // create super clusters
            var index = parseInt(info['Super\ncluster'],10)-1;
            
            if(this.superClusters[index] === undefined ){
               
                this.superClusters[index] = {
                    classification: this.classification[index+1],
                    clusters: []
                };
            }
            
            this.superClusters[index].clusters.push({
                name: info.cluster,
                size: info['number of reads']
                // info: info                
            });
            
        });
        
        console.log('filtered', filtered);
        console.log('superClusters', this.superClusters);
        this.result.clusters = this.superClusters;
        
        this.clusterInfo = filtered;
    }
    
    getClusterInfo(){
        return this.clusterInfo;
    }
    
    getSuperClusters(){
        return this.superClusters;
    }
    
    getGraphData(){
        
        
        if( true || this.graph.nodes === undefined || this.graph.links === undefined ){
            // convert result to graph data
            // and store it 
            var nodes = this.result.nodes;
            var nodeOrder = {};
            
            this.graph.nodes = [];
            this.graph.links = [];
            
            const nodeToCluster = convertClusters(this.result.clusters);
            
            var nameToIndex = function(clName){
                return  parseInt( clName.substring(2), 10);    
            }
            
            // convert nodes
            var i = 0;
            
            for(var name in nodes){
                // get cluster index, and call it a group                
                var group = nodeToCluster[name];
                if(group !== undefined){                
                    // create graph node
                    var index = nameToIndex(name);
                    
                    this.graph.nodes.push({
                        name: name,
                        size: nodes[name],
                        group: group,
                        info: this.clusterInfo ? this.clusterInfo[name] : undefined, 
                        // repeatMasker: this.repeatMasker[group],
                        // domains: this.domains ? this.domains[group] : undefined,
                        // sortedDomains: this.sortedDomains[group],
                        trueDomains: this.getSpecificLineage(index-1),
                        fixed: false                                       
                    });
                    
                    nodeOrder[name] = i;                
                    i++;
                 }
            }
            
            this.nodeToIndex = nodeOrder;
            
            // convert connections
            this.result.connections.forEach( (con) => {
                
                if(nodeOrder[con.node2] === undefined || nodeOrder[con.node1] === undefined){
                    return;
                }
                
                this.graph.links.push({
                    source: nodeOrder[con.node1],
                    target: nodeOrder[con.node2],
                    value: con.strength,
                    group: nodeToCluster[con.node1],
                    weight: 1
                });
                    
            });
        } 
        
        return this.graph;
        
        function convertClusters(clusters){
            
            var nameToCluster = {};
            var counter = 0;
            
            clusters.forEach( (cluster) => {                
                cluster.forEach( (node) => {
                    nameToCluster[node.name] = counter;            
                });
                counter++;
            });
            
            return nameToCluster;
            
        }
        
    }
    
    setSummaryPath(path){
        this.summaryPath = path;
    }
    
    getSummaryPath(){
        return this.summaryPath;
    }
    
    setRepeatMasker(data){
        this.repeatMasker = data;
    }
    
    getRepeatMasker(){
        return this.repeatMasker;
    }
    
    setDomains(data){
        
        var _ = require('underscore');
        var sortedDomains = [];
        var domainsByLineage = [];
        
        data.forEach( (domains) => {
            
            var res = undefined;
            
            if(domains !== undefined ){
                
                res = _.chain(domains)
                .groupBy(function(d){
                    return d.Domain + '#' + d.Lineage;
                })
                .map(function(d){
                    
                    var hits = _.reduce(d, function(memo, obj){ 
                            return memo + parseInt(obj.Hits, 10);
                         }, 0);
                    
                    if(hits >= domainHitsThreshold){        
                    
                        return {
                            Domain: d[0].Domain, 
                            Lineage: d[0].Lineage,
                            Hits: hits     
                        };
                    } else {
                        return null;
                    }
                })
                .without(null)
                .value();
                
                domainsByLineage.push(_.groupBy(res,'Lineage'));
            } else {
                domainsByLineage.push(undefined);
            }
            
            sortedDomains.push(res);
           
        });
        
        console.log('sortedDomains', sortedDomains);
        console.log('domainsByLineage', domainsByLineage);
        
        this.domains = data;
        this.sortedDomains = sortedDomains;
        this.domainsByLineage = domainsByLineage;
    }
    
    getDomains(){
        return this.domains;
    }
    
    getSortedDomains(){
        return this.sortedDomains;
    }
    
    getDomainsByLineage(){
        return this.domainsByLineage;
    }
    
    getSpecificLineage(n){
    
        var value = this.domainsByLineage[n];
        if(!value){
            return value;
        }
        
        var lineages = Object.keys(value)
            .map( (key) => value[key] );
        
        // sort by Hits
        lineages.forEach( (entry) => {
            entry.sort( (a,b) =>  
                 b.Hits - a.Hits
            );
        });
        return lineages;    
            
    }
    
} 