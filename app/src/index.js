/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

// angular2
import {Component, bind, provide, NgZone} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS,RouteConfig, ROUTER_DIRECTIVES,APP_BASE_HREF,LocationStrategy, HashLocationStrategy} from 'angular2/router';

// Repas
import {Intro} from 'components/intro/intro';
import {GraphView} from 'components/graph/GraphView';
import {Result} from 'DataMining/Result';



@Component({
    selector: 'main',
    directives: [Intro, ROUTER_DIRECTIVES],
    template: `
        <h1>REPA</h1> 
        <nav>
            > <a [routerLink]="['Intro']">Intro</a>
            <span [hidden]="!graphAvailable()">
            > <a [routerLink]="['Graph']">Graph</a>
            > <a [routerLink]="['Graph']">Save</a>
            </span>
            <span [hidden]="graphAvailable()" class="fake">
            > Graph > Save
            </span>
            | <a [routerLink]="['Help']">Help</a>
        </nav>
        <hr>
        <router-outlet></router-outlet>
    `
})

@RouteConfig([
    { path: '/', redirectTo: ['Intro'] },
    { path:'/intro', name: 'Intro', component: Intro, useAsDefault: true },
    { path:'/graph', name: 'Graph', component: GraphView },
    { path: '/help', name: 'Help',  component: GraphView }    
])

export class Main {
    
    constructor(zone: NgZone){
    
        this.menu = false;
        
        console.log('App start');
        console.log('location.pathname',location.pathname);
        
        window.dispatch = d3.dispatch('unfocus','focus','menu');
        window.dispatch.on('menu', () => {
            console.log('enabling menu');    
            this.menu = true;  
        });
    }
    
    graphAvailable(){
        return this.menu;
    }
}

bootstrap(Main, [
    ROUTER_PROVIDERS, 
    bind(APP_BASE_HREF).toValue('/'),
     provide( LocationStrategy, { useClass:HashLocationStrategy })
]);
