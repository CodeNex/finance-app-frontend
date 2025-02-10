import { Component } from '@angular/core';
import { LoadingScreenComponent } from '../../../login/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../../login/warning-screen/warning-screen.component';

@Component({
  selector: 'app-overview',
  imports: [LoadingScreenComponent, WarningScreenComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
