import { Component, Input } from '@angular/core';

/**
 * * IconsComponent
 * This component is responsible for displaying icons in the application.
 * It takes an icon name as input and returns the icon as svg.
 */
@Component({
  selector: 'app-icons',
  imports: [],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
})
export class IconsComponent {
  @Input('iconName') public iconName: string = '';

  private iconNames: string[] = [
    'overview',
    'transactions',
    'budgets',
    'pots',
    'potsTransparentGreen',
    'recurringBills',
    'settings',
    'imprint',
    'logout',
    'slideButton',
    'openedEye',
    'closedEye',
    'checked',
    'backArrowWhite',
    'dotsThree',
    'dropOpen',
    'dropClose',
    'themeCheck',
    'entertainment',
    'bills',
    'groceries',
    'diningOut',
    'transportation',
    'personalCare',
    'education',
    'lifestyle',
    'shopping',
    'general',
    'billsIcon',
    'searchLensIcon',
    'smallArrowRight',
    'searchIcon',
    'trashCan',
    'categoryFilter',
    'sortByFilter',
    'transaction'
  ];

  ngOnInit(): void {
    if (!this.iconNames.includes(this.iconName)) {
      console.warn(
        `Icon name "${this.iconName}" is not recognized. Please check the icon name.`
      );
      this.iconName = 'noAviableIcon';
    }
  }
}
