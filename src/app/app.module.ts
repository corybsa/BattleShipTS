import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BattleshipComponent} from './battleship/battleship.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    BattleshipComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
