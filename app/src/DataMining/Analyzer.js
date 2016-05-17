class Node2 {
    
    static nameToIndex(clName){
        return  parseInt( clName.substring(2), 10);    
    }
    
    constructor(name){
        
        this.name = name;
        this.clIndex = Node2.nameToIndex(name);
        this.links = new Array();
        this.visited = false;
    }
    
    linkTo(strength, node){
      
        this.links.push(
            new Link2(strength, node)
        );
    }
    
    static createPair(nodeName1, nodeName2, strength){        
        
        let node1 = new Node2(nodeName1);        
        let node2 = new Node2(nodeName2);
        
        node1.linkTo( strength, node2 );
        node2.linkTo( strength, node1 );
        
        return [ node1, node2 ];        
    }
}

class Link2 {
    constructor(strength, toNode){
        this.strength = strength;
        this.to = toNode;
    }
}

class Cluster2 {
    constructor(){       
        this.list = []; // 
    }
    
    addPair(name1, name2, strength){
        // check if there is already node with such name
        let node1;
        let node2;
        
        this.list.forEach( (node) => {
            
            if(node.name === name1){
                node1 = node;
            } 
            if(node.name === name2){
                node2 = node;
            }
        });
        
        if(node1 !== undefined && node2 !== undefined){           
                        
            // both nodes are already in cluster
            node1.linkTo(strength ,node2);
            node2.linkTo(strength, node1);
            
        } else if(node1 === undefined && node2 !== undefined){            
           
            let nd1 = new Node2(name1);
            nd1.linkTo(strength, node2);
            node2.linkTo(strength, nd1);
            this.list.push(nd1);
            
        } else if(node1 !== undefined && node2 === undefined){            
            
            let nd2 = new Node2(name2);
            nd2.linkTo(strength, node1);
            node1.linkTo( strength, nd2 );
            this.list.push(nd2);            
            
        } else if(node1 === undefined && node2 === undefined){            
            
            var pair = Node2.createPair(name1, name2, strength);
            this.list.push(pair[0]);
            this.list.push(pair[1]);                        
            
        } else {
            console.error('Unexpected state when adding pair!');
        }
    }
    
    // goes through graph as nodes as linked together
    // calls function fnx on each visited note, only once    
    each(nodeFnx, clusterFnx){
        
        var cluster = [];
        
        console.info('cluster each');
        if(nodeFnx === undefined){
            // nodeFnx = (n) => { console.log( 'node:', n.name )};
        }
        
        this.list.forEach( (node) => {            
            if(node.visited === false){                
                cluster = [];
                step(node);
                clusterFnx ? clusterFnx(cluster) : '';
            }
        });
        
        function step(node){           
            // mark already visited node
            node.visited = true;
            // call function on each node if any
            nodeFnx ? nodeFnx(node) : '';
            
            cluster.push(node);
            
            node.links.forEach( (link) => {
                let linkedNode = link.to;
                if(linkedNode.visited !== true){
                    step(linkedNode);
                }
            });
        }
        
        // reset visited flag
        this.list.forEach( (node) => {
            node.visited = false;
        });
    }
    
    printList(){
        
        let print = '';
        
        this.list.forEach( (node) => {
            print += 'node ' + node.name + '\t links[';
            node.links.forEach( (link) => {
                print += link.to.name + ',';    
            });
            print += ']\n';
        });
        
        
        
        return print;        
    }
}


export class Analyzer {  
    
    // threshold: number; 
    
    constructor(path){
        console.log('Analyzer is getting ready', path);
   
        this.limit = 200;
        this.path = path;   
        
        this.threshold = 10; // default value
    }
    
    /**
     * limits number of clusters registered
     */
    setClusterLimit(limit){
        this.limit = limit; 
    }
    
    /**
     * Automaticly finds cluster limits, by looking throught output files
     */
    findoutClusterLimit(){
        if(!this.clusterFolder)
            return;
            
         const fs = require('fs'); 
         this.limit = fs.readdirSync(this.clusterFolder).length;
         
         console.log('Cluster limit:', this.limit);
           
         return this.limit;
    }
    
    /**
     * sets path to cluster folder, and finds limit
     */
    setClusterPath(path){
        this.clusterFolder = path;
    }
    
    setThreshold(t){
        console.log('Analyzer setting threshold', t);
        this.threshold = t;
    }
    
    process(){
        return this.readFile(this.path);
    }
        
    readFile(path){
        
        const limit = this.limit;
        
        console.log('analyzer threshold');
        const threshold = this.threshold;
        
        const connections = [];
        const nodes = {};
        const cluster = new Cluster2(); // cluster of nodes
                
        const options = this.options;
        
        let promise = new Promise((resolve, reject) => {
            
            if(!path){
                reject('Wrong path!');
                return;
            }
            
            console.log('reading file async:', path);
        
            const lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(this.path)    
            });
            
            lineReader.on('line', processLine);
            
            lineReader.on('close', () => {
                
                let clusters = [];
                
                cluster.each(
                    undefined,
                    (c) => {
                        clusters.push(c);                        
                });
                
                resolve({
                    connections: connections,
                    nodes: nodes,
                    clusters: clusters 
                });
            });
            
        });
        
        function processLine(line){
                     
            let connection = line.split(' ');
            let strength = parseInt(connection[2],10);
            let node1 = connection[0];
            let node2 = connection[1];
         
            if(strength > threshold){    
                // link between two
                if(node1 !== node2){
                    
                    // create linked pair of nodes from connection
                    cluster.addPair(node1, node2, strength);
                
                    connections.push({
                        node1: node1,
                        node2: node2,
                        strength: strength
                    });
                } else {               
                // size of one
                    if(strength > 10){
                        
                        var id = Node2.nameToIndex(node1);
                        if(id <= limit){
                            nodes[node1] = strength;
                        }
                    }
                }
            }
            
        }
   
        return promise;
    }
    
}