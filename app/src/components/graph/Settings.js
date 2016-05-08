var settings = {
    width   : 780,
    height  : 680,
    padding : 10,
    size    : {
        range   : [0, 30 ],
        domain  : [1, 2000000 ],    
    },
    strength : {
        range   : [0, 1],
        domain  : [1, 160000 ]
    },
    force   : {
        charge  : -80,
        gravity : 0.02,
        linkDistance : 60    
    },
    zoom: {
        extent: [0.5,5],
        zoomed: 1.5
    },
    color: d3.scale.category20(),
    info:{
        priorityKeys: [],
        detailKeys: ["cluster","total length [bp]","number of reads","Genome proportion[%]","Super cluster","All missing mates [%]","Missing mates with no similarity hit [%]", "Portion of similarity hits to other clusters[%]"]
    }                           
};

export class Settings {
    
    static default(){       
        return settings;
    }   
    
    static adapted(result){
        
        var nodes = result.nodes;
        var connections = result.connections;
       
        // find max size
        var max = 0;
        Object.keys(nodes).forEach( (key)=>{
            if(nodes[key] > max ){
                max = nodes[key];
            }    
        });
        
        // find max strengh
        var linkMax = 0;
        connections.forEach( (con) => {
            if(con.strength > linkMax ){
                linkMax = con.strength;
            }
        });
        
        var copy = JSON.parse(JSON.stringify(settings));
        copy.size.domain = [1,max];
        copy.strength.domain = [1,linkMax];
        copy.color = settings.color;
        return copy;
    }
}