import { Component } from '@angular/core';
import jsonData from '../../../shared/data/financeapp.basedata.json';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public readonly navData = jsonData.financeapp.navbar.links;
}
