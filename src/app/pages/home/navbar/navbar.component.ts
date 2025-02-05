import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import jsonData from '../../../shared/data/financeapp.basedata.json';
import { IconsComponent } from '../../../components/icons/icons.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, IconsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public readonly navData = jsonData.financeapp.navbar.links;
}
