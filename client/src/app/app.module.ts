import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

import {  ApiService,  HomeService,} from './shared';


const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    rootRouting,
    HttpModule,
    HomeModule,
    FormsModule
  ],
  providers: [
    ApiService,
    HomeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
