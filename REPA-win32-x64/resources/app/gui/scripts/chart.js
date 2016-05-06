/* global d3 */

var width = 780,
    height = 680,
    padding = 10;

var color = d3.scale.category20c();

var size = d3.scale.log()
    .range([0, 30])
    .domain([1,2000000]);

var strength = d3.scale.log()
    .range([0,1])
    .domain([1, 160000]);

var strengthColor = d3.interpolateRgb('#0000FF', '#FF0000');

var linkColor = function(value) {
   
    var s = strength(value);   
    return strengthColor(s);
};

var force = d3.layout.force()
     .charge(-80)  
     .gravity(0.02)
     .linkDistance(60)
    .size([width, height]);
    
var onZoom = function(){
    layer.attr('transform', 'translate( '+ zoom.translate()[0] +',' + zoom.translate()[1] + ' ) scale(' + zoom.scale() + ')');
};

var zoom = d3.behavior.zoom()
    .scaleExtent([0.5,5])        
    .on("zoom", onZoom);

//Set up tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-2, 0])
    .html(function (d) {
    return  "Link strength: " + d.value;
});

var svg = d3.select('svg')
    .attr("width", width)
    .attr("height", height);

var pane = svg.append('rect')
    .attr({
        width: '100%',
        height: '100%',
        opacity: 0
    })
    .call(zoom);

var layer = svg.append('g');    

svg.call(tip);

loadData();

function loadData(){

    d3.json("../output/clusters.json", function (error, graph) {
      
        if (error){
            throw error;
        }
        
        graph.links.forEach(function(link, index, list) {
            if (typeof graph.nodes[link.source] === 'undefined') {
                console.log('undefined source', link);
            }
            if (typeof graph.nodes[link.target] === 'undefined') {
                console.log('undefined target', link);
            }

            // if ( typeof graph.nodes[link.source].connections === 'undefined') {
            //     graph.nodes[link.source].connections = [];
            // }

            // if ( typeof graph.nodes[link.target].connections === 'undefined') {
            //     graph.nodes[link.target].connections = [];
            // }

            // // map connection from node to node
            // graph.nodes[link.source].connections.push(link.target);
            // graph.nodes[link.target].connections.push(link.source);

        });
        
        force.nodes(graph.nodes)
            .links(graph.links)
            .start();
        
        var link = layer.selectAll(".link")
                .data(graph.links)
            .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return 8; })
                .style('stroke', function(d){ return linkColor(d.value); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide); //Added  
        
        var node = layer.selectAll(".node")
                .data(graph.nodes)
                .enter().append('g')
                    .attr('id', function(d){ return (''+d.name).trim(); })
                    .attr('class','circle');

        var circle = node.append('circle');
        circle.color = 1;      
        circle.attr('class', 'node')
            .attr('r', function(d){ return size(d.size); })
            .style('fill', function(d) { return color(1); })
            .on('click', function(d){   
                focusCluster(this, d, graph.nodes);   
               // console.log('clicked', this);
            })
            .call(force.drag);
        
        node.append("text")
          .attr("dx", 10)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; })
          .style("stroke", "black");    
      
        
        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            //node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

            circle.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            d3.selectAll("text").attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });    

        });

        // create table and append it
        var html = createTable(clusters);
        d3.select('#table-content').html(html);

        function createTable(clusters){

            var html;

            var keys = Object.keys(clusters);
            for(var i = 0; i < keys.length; i++){
                var key = keys[i];

                html += '<tr';
                if(i %2 === 0){
                    html += ' class="dark"';
                }

                var list = clusters[key];
                var nodes = [];

                list.forEach(function(n){

                    nodes.push(
                        graph.nodes[n].name
                    );

                });

                html += '><td><button onclick="displayCluster(\'' + key + '\')">' + key + '</button></td><td>' + nodes + '</td>';
                html += '</tr>';
            }

            return html;
        }
       
    });

}

function saveSvg(){
    saveSvgAsPng(document.getElementById('chart'), 'diagram.png');
}

function focusCluster( el, focusNode, nodes){
    console.log('focusing', focusNode);
    if(focusNode.connections !== undefined){

        focusNode.connections.forEach(function (connection){
            var connected = nodes[connection];
            console.log(connected.name, 'connection');
        });

    } else{

        console.warn('Node', focusNode, ' has no connections');
    }


}

function detectSuperClusters (){

}

function findNext( node, nodes ){

   // nodes[node]
}

function displayCluster(key){
    //console.log(clusters);
    console.log(clusters[key]);

    var nodes = clusters[key];
    d3.selectAll('g.circle')
        .attr('display','none');

    var ids = '';
    
    nodes.forEach(function(node){
        
        ids += '#CL' + node + ', ';
    });    

    ids = ids.substring(0, ids.length - 2)

    console.log(ids);

    d3.selectAll(ids)
        .attr('display','block');
}
