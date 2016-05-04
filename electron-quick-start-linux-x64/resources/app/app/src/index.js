/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

// angular2
import {Component, bind, provide, ViewChild} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS,RouteConfig, ROUTER_DIRECTIVES,APP_BASE_HREF,LocationStrategy, HashLocationStrategy} from 'angular2/router';

// Repas
import {Intro} from 'components/intro/intro';
import {MyDear, GraphView} from 'components/graph/GraphView';




@Component({
    selector: 'main',
    directives: [Intro, ROUTER_DIRECTIVES, MyDear],
    template: `
        <h1>REPA</h1> 
        <nav>
            > <a [routerLink]="['Intro']">Intro</a>
            > <a [routerLink]="['Graph']">Graph</a>
            > <a [routerLink]="['Graph']">Export</a>
        </nav>
        <mydear></mydear>   
        <hr>
        <router-outlet></router-outlet>
    `
})

@RouteConfig([
    { path: '/', redirectTo: ['Intro'] },
    { path:'/intro', name: 'Intro', component: Intro, useAsDefault: true },
    { path:'/graph', name: 'Graph', component: GraphView }    
])

export class Main { 
    @ViewChild(MyDear) mydear:MyDear;   
    
    constructor(){
        console.log('App start');
        console.log('location.pathname',location.pathname);
    }
    
    refresh(){
        console.log('Refreshing');
        console.log('mydear', this.mydear);
      
    }
    
}

bootstrap(Main, [
    ROUTER_PROVIDERS, 
    bind(APP_BASE_HREF).toValue('/'),
     provide( LocationStrategy, { useClass:HashLocationStrategy })
]);
