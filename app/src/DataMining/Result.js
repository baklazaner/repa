
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
        
        this.result = new ResultData();
        this.graph = new GraphData();
        this.clusterInfo;
        this.summaryPath;
        this.superClusters = [];
        this.classification;
        this.repeatMasker;
        this.domains;
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
    
    getGraphData(){
        
        
        if( this.graph.nodes === undefined || this.graph.links === undefined ){
            // convert result to graph data
            // and store it 
            var nodes = this.result.nodes;
            var nodeOrder = {};
            
            this.graph.nodes = [];
            this.graph.links = [];
            
            const nodeToCluster = convertClusters(this.result.clusters);
            
            // convert nodes
            var i = 0;
            
            for(var name in nodes){
                // get cluster index, and call it a group                
                var group = nodeToCluster[name];
                if(group !== undefined){                
                    // create graph node
                    this.graph.nodes.push({
                        name: name,
                        size: nodes[name],
                        group: group,
                        info: this.clusterInfo[name], 
                        repeatMasker: this.repeatMasker[group],
                        domains: this.domains ? this.domains[group] : undefined,
                        fixed: false                                       
                    });
                    
                    nodeOrder[name] = i;                
                    i++;
                 }
            }
            
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
                cluster.clusters.forEach( (node) => {
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
        this.domains = data;
    }
    
    getDomains(){
        return this.domains;
    }
    
} 