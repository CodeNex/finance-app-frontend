import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * * * AppComponent
 * This component is the root component of the application.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'finance-app-frontend';
}
