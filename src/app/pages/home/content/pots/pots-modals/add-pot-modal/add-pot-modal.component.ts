import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '@content/pots/api-pots.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';

/**
 * * * AddPotModalComponent
 * * This component is responsible for displaying the add pot modal.
 * * It allows the user to add a new pot with a name, target, and theme.
 * * It uses the MainModalService to manage the modal state and the ApiPotsService to interact with the backend.
 */
@Component({
  selector: 'app-add-pot-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './add-pot-modal.component.html',
  styleUrl: './add-pot-modal.component.scss',
})
export class AddPotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public apiPotsService = inject(ApiPotsService);
  public formatAmountInputService = inject(FormatAmountInputService);

  public currentPot: PotsObject = {
    id: -1,
    name: '',
    target: -1,
    total: 0,
    theme: '',
    created_at: null,
    deleted_at: null,
  };
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.getThemeArrays();
    this.chosenTheme = this.getInitialTheme();
    this.currentPot.theme = this.chosenTheme.hex;
  }
  // #endregion

  // #region Dropdowns & Modal
  public isThemeDropdownOpen: boolean = false;

  public toggleThemeDropdown(): void {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  public closeMainModal(): void {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  // #region Name & Target Input
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;

  public controlNameLength(event: any): void {
    const deleteKeys = ['Backspace', 'Delete'];
    if (deleteKeys.includes(event.key)) {
      if (this.potNameCharactersLeft < 30)
        this.potNameCharactersLeft = 30 - (this.potNameValue.length - 1);
      return;
    } else if (this.potNameValue.length >= 30) {
      event.preventDefault();
    } else {
      setTimeout(() => {
        this.potNameCharactersLeft = 30 - this.potNameValue.length;
      }, 1);
    }
  }

  // the value of the pot target input binded by ngModel
  public potTargetInputValue: string = '0.00';

  public controlMaxTarget(event: KeyboardEvent): void {
    const inputValue = this.potTargetInputValue;
    this.potTargetInputValue = this.formatAmountInputService.formatAmountInput(
      event,
      inputValue
    );
  }
  // #endregion

  // #region Themes
  public themes!: Theme[];
  public usedPotThemes!: string[];
  public unusedPotThemes!: Theme[];
  public chosenTheme: Theme = { name: '', hex: '' };
  public potThemeValue: string = '';

  private getInitialTheme(): Theme {
    return this.unusedPotThemes[
      Math.floor(Math.random() * this.unusedPotThemes.length)
    ];
  }

  private getThemeArrays(): void {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedPotThemes = this.dataStore
      .pots()
      .filter((pot: PotsObject) => !pot.deleted_at)
      .map((pot: PotsObject) => pot.theme);
    this.unusedPotThemes = this.themes.filter(
      (theme: Theme) => !this.usedPotThemes.includes(theme.hex)
    );
  }

  // choose a theme from the dropdown
  public chooseTheme(theme: Theme): void {
    if (this.unusedPotThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.toggleThemeDropdown();
    }
  }
  // #endregion

  /**
   * @description - This function is called when the user clicks the save button in the modal.
   * It sets the current pot to the new pot and submits the new pot to the API server sides and
   * adds the new pot to the pots array in the data-store-service.
   * It also sets the pot name and target to the values from the input fields.
   * It also closes the modal.
   */
  public submitAddPot(): void {
    this.currentPot.name = this.potNameValue;
    this.currentPot.target = parseFloat(
      this.potTargetInputValue.replace(/,/g, '')
    );
    this.currentPot.theme = this.chosenTheme.hex;
    this.apiPotsService.addNewPot(this.currentPot);
    this.closeMainModal();
    console.log(this.currentPot);
  }
}
