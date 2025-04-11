import { Component, Input, } from '@angular/core';

/**
 * * IconsComponent
 * This component is responsible for displaying icons in the application.
 * It takes an icon name as input and returns the icon as svg.
 */
@Component({
  selector: 'app-icons',
  imports: [],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss'
})
export class IconsComponent {
  @Input("iconName") public iconName: string = "";
}
