import { Component } from '@angular/core';
import { Helper } from './models/utils/helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battleship';
  helper = Helper;
}
