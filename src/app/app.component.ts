import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * * * AppComponent
 * This component is the root component of the application.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'finance-app-frontend';

  public isConstructionNoticeVisible: boolean = false; // Set to true to show the construction notice

  public closeConstructionNotice(): void {
    this.isConstructionNoticeVisible = false;
  }
}
