import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Globals } from './Globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService) {
    console.log(Globals.user);
  }
}
