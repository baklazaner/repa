/* global d3 */

// angular2 
import {Component, NgZone, Directive, Attribute, ElementRef, OnInit, AfterViewInit, ViewChild } from 'angular2/core';

// other
/// <reference path="/components/DataMining/Result.ts" />

import {Result} from 'DataMining/Result';
import {Settings} from 'components/graph/Settings';


@Directive({
    selector: 'graph',
})

export class Graph {    
    
    elementRef: ElementRef;
    
    constructor(elementRef: ElementRef){
        console.log('elementRef', elementRef);
        console.info('Graph Directive Mounted Successfully');        
        this.elementRef = elementRef;
        this.renderData = () => {};
        this.focus = () => {};
        
        window.dispatch.on('unfocus.graph', () => { 
            this.renderData(
                Result.getInstance().getGraphData(),
                false
            );
         });
         
         window.dispatch.on('focus.graph', (clusterIndex) => {
            this.focus(clusterIndex);      
         });
    }
    
    ngOnInit(){
        console.log('on init');
        const el = this.elementRef.nativeElement;
        this.displayResult(el);   
    }
    
    render() {
        console.log('calling render');
    }
    
    displayResult(el){
        
        const result = Result.getInstance();
        console.log('result', result);
        
        var settings = Settings.adapted(result.result);
        console.log('settings', settings);
        
        var tick; // updates graph elements
        
        var color = settings.color;

        var size = d3.scale.log()
            .range(settings.size.range)
            .domain(settings.size.domain);
   
        var linkColor = createLinkColor();
       
        var force = createForceLayout();
        
        var drag = force.drag();    
            
        var zoom = d3.behavior.zoom()
            .scaleExtent(settings.zoom.extent);
       
        var d3el = d3.select(el);
        console.log('d3el', d3el);
        
        var svg = d3el.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        var pane = svg.append('rect')
            .attr({
                width: '100%',
                height: '100%',
                opacity: 0
            })
            .call(zoom);

        var layer = svg.append('g')
            .attr('class','disableLabel'); 
       
        this.graph = result.getGraphData();
        tick = renderData(this.graph, false);
        
        function createLinkColor() {
            var strengthColor = d3.interpolateRgb('#0000FF', '#FF0000');
            var strength = d3.scale.log()
                .range(settings.strength.range)
                .domain(settings.strength.domain);

            return function(value) {
                var s = strength(value);   
                return strengthColor(s);
            };
        }
        
        function createForceLayout(){
            return d3.layout.force()
            .charge(settings.force.charge)  
            .gravity(settings.force.gravity)
            .linkDistance(settings.force.linkDistance)
            .size([settings.width, settings.height]);
        }
        
        this.focus = focus;
        function focus(clusterIndex){
         
            // focusing one super cluster
            var filteredNodes = this.graph.nodes.filter(function(node){
                return node.group === clusterIndex;    
            }).map( function(node){
                return node;        
            });
            
            var filteredLinks = this.graph.links.filter(function(link){
                // console.log('link',link);
                return link.group === clusterIndex;    
            });
            
            
        
            renderData({
                nodes: filteredNodes,
                links: filteredLinks
            }, true);
            
           
        }

        this.renderData = renderData;
        function renderData(graph, extented){
            
            console.log('Rendering data', graph.nodes, graph.links);
            
            // graph.links.forEach(function(link, index, list) {
            //     if (typeof graph.nodes[link.source] === 'undefined') {
            //          console.log('undefined source', link);
            //     }
            //     if (typeof graph.nodes[link.target] === 'undefined') {
            //          console.log('undefined target', link);
            //     }
            // });

            
            // clear layer
            layer.selectAll('*').remove();            
      
           
            var nodes = graph.nodes.filter(function(node){
                return node.group !== undefined;
            });
            
            force.nodes(graph.nodes)
                .links(graph.links).start();
            
            var linkUpdate = layer.selectAll('.link')
                    .data(graph.links);
              
            linkUpdate.exit().remove();    
                    
            var link = linkUpdate.enter()
                    .append('g')
                    .attr('class', 'link');
                    
               
                    
            var linkLine = linkUpdate.insert('line')
                    .style('stroke-width', function(d) { return 8; })
                    .style('stroke', function(d){ return linkColor(d.value); });
                    
            var linkLabel = linkUpdate.append('text')
                .attr('class','label')
                .attr('text-anchor', 'middle')
                .attr('dx', 0)
                .attr('dy', '0.35em')
                .text(function(d) { return d.value; });
           
            
            var nodeUpdate = layer.selectAll('g.circle')
                    .data(graph.nodes);
                    
            nodeUpdate.exit().remove();   
                    
            var node = nodeUpdate.enter().append('g')
                        .attr('id', function(d){ return (''+d.name).trim(); })
                        .attr('class', function(d){ return  'circle sc'+d.group });
                        
                    nodeUpdate.call(drag)
                        .on('dblclick', function(d){
                            console.log('Double click',d);
                            if(!extented){
                                window.dispatch.focus(d.group);
                            }                            
                        });
            

            var circle = nodeUpdate.append('circle');
            circle.attr('class', 'node')
                .attr('r', function(d){ return size(d.size); })
                .style('fill', function(d) { return color(d.group); });
            
            var text = nodeUpdate.append('text')
                .attr('text-anchor','middle')
                .attr('dx', 0)
                .attr('dy', '.35em')
                .text(function(d) { return d.name; });
                
            // tick();    
            // extented = false;  
            var anchorLayer = layer.append('g');
            
            if(extented){                
                  
                var labelAnchors = [];
                var labelAnchorLinks = [];
                
                var i = 0;
                graph.nodes.forEach( (node) => {
                    
                    labelAnchors.push({
                        node: node
                    });
                    
                    labelAnchors.push({
                        node: node
                    });
                    
                    labelAnchorLinks.push({
                        source : i * 2,
                        target : i * 2 + 1,
                        weight : 1
                    });
                    
                    i++;
                });  
                
                var force2 = d3.layout.force()
                    .nodes(labelAnchors)
                    .links(labelAnchorLinks)
                    .gravity(0)
                    .linkDistance(20)
                    .linkStrength(8)
                    .charge(-150)
                    .size([ settings.width, settings.height ]);
                    
                force2.start();
                force.on('start', () => {
                    force2.start(); 
                });
                
                var anchorLink = anchorLayer.selectAll("line.anchorLink")
                    .data(labelAnchorLinks);//.enter();//.append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

                var anchorNode = anchorLayer.selectAll("g.anchorNode")
                    .data(force2.nodes())
                    .enter()
                        .append("svg:g")
                        .attr("class", "anchorNode");
                        
                var anchorGroup = anchorNode.append('g');
                var anchorText = anchorGroup.selectAll("text")
                    .data( function(d,i){
                            if(i%2 == 0){
                                return [];
                            } else {
                                if(d.node && d.node.trueDomains && d.node.trueDomains[0]){   
                                    return [ d.node.trueDomains[0][0].Lineage ,d.node.trueDomains[0].map( domain => domain.Domain ).join(', ')];
                                } else {
                                    return [];
                                }
                            }                            
                    })
                    .enter()
                    .append('text')
                        .attr('y', function(d,i){ return i*20; }) // height of a text
                        .text( function(d,i){
                             return d ? d : ""; 
                        });
                        
                 drag.on('dragstart', function(d) {
                     console.log('dragstart extended');
                     force2.start();
                 });       
                
            } else {
                // not extented
            }  
          
            zoom.on('zoom', () => { onZoom(); tick(); });            
            force.on('tick',tick);       
            force.start();
            
            // this.onZoom = onZoom;
            onZoom();
            
            updateReferencies();
          
            function onZoom(){
                // enalarge everything           
                layer.attr('transform', 'translate( '+ zoom.translate()[0] +',' + zoom.translate()[1] + ' ) scale(' + zoom.scale() + ')');
                // display label only after some zooming is done
                layer.classed('disableLabel', zoom.scale() < settings.zoom.zoomed);              
                anchorLayer.classed('disableLabel', zoom.scale() < settings.zoom.zoomed);  
            }
            
           
           
            function updateLink (){
                
                var threshold = 2.3; // zoom threshold
                
                this.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });
                if(zoom.scale() > threshold){
                    this.style('stroke-width', (8*threshold)/zoom.scale() +'px');
                } else {
                    this.style('stroke-width','8px');
                }   
            }    
            
            function updateNode () {
                 // update circles positions    
                this.attr('cx', function(d) {
                        if(isNaN(d.x)) return 0;
                        return d.x; })
                    .attr('cy', function(d) {
                        if(isNaN(d.y)) return 0;
                        return d.y; })
                    .attr('r', function(d) {
                        return size(d.size)/zoom.scale();     
                    });    
            }      
            
            function updateReferencies(){
                circle = layer.selectAll('circle');
            }  
           
            function tick (onlyZoom) {                
               
                    
                    
                // update nodes
                circle.attr('cx', function(d) {
                        if(isNaN(d.x)) return 0;
                        return d.x; })
                    .attr('cy', function(d) {
                        if(isNaN(d.y)) return 0;
                        return d.y; })
                    .attr('r', function(d) {
                        return size(d.size)/zoom.scale();     
                    });    

                // update text position & scale   
                text
                    .attr('transform', function(d){
                        return 'translate(' + d.x +',' + d.y + ') scale(' + 1/zoom.scale() +')';
                    });
                    
                // update link label position & scale    
                linkLabel
                    .attr('transform', function(d){
                        var nx = (d.source.x + d.target.x)/2;
                        var ny = (d.source.y + d.target.y)/2;
                        return 'translate(' + nx +',' + ny + ') scale(' + 1/zoom.scale() +')';
                    }); 
                
               
                if(extented){
                    
                    // force2.start();
                
                    anchorNode.each(function(d, i) {
                        if(i % 2 == 0) {
                            d.x = d.node.x;
                            d.y = d.node.y;
                        } else {
                            var child = 0;
                            // console.log('this.childNodes[0]',this.childNodes[child]);
                            var b = this.childNodes[child].getBBox();
                            
                            var diffX = d.x - d.node.x;
                            var diffY = d.y - d.node.y;

                            var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                            var shiftX = b.width * (diffX - dist) / (dist * 2);
                            shiftX = Math.max(-b.width, Math.min(0, shiftX));
                            var shiftY = 5;
                            this.childNodes[child].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                        }
                    });

                    anchorGroup.attr('transform', function(d){
                        return 'translate(' + d.x +',' + d.y + ') scale(' + 1/zoom.scale() +')';
                    });
                    //anchorLink.call(updateLink);
                }     
                
                 // update links
                linkLine.call(updateLink);   
                  
                    
                onZoom();    
            }  
            
            
            return tick;

        }

        // function saveSvg(){
        //     saveSvgAsPng(document.getElementById('chart'), 'diagram.png');
        // }
        
    }
}