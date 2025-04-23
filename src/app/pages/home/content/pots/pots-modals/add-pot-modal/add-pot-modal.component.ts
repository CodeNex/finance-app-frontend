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

  /**
   * @description - This function closes the main modal and add pot modal within it. Its called when the user clicks on the close button in the modal, outside the modal or submit the new pot.
   */
  public closeMainModal(): void {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  // #region Name & Target Input
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;

  /**
   * @description - This function is used to control the length of the pot name input. It prevents the user from typing more than 30 characters in the input field.
   * It also updates the potNameCharactersLeft variable to show the remaining characters left.
   * @param event - The event that is triggered when the user types in the input field.
   */
  public controlNameLength(event: KeyboardEvent): void {
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

  /**
   * @description - This function is used to format the amount input value.
   * @param event - The event that is triggered when the user types in the input field.
   */
  public controlMaxTarget(event: KeyboardEvent): void {
    const inputValue = this.potTargetInputValue;
    this.potTargetInputValue = this.formatAmountInputService.formatAmountInput(
      event,
      inputValue
    );
  }
  // #endregion

  // #region Themes
  public themes: Theme[] = [];
  public usedPotThemes: string[] = [];
  public unusedPotThemes: Theme[] = [];
  public chosenTheme: Theme = { name: '', hex: '' };
  public potThemeValue: string = '';

  /**
   * @description - This function is used to get an inital theme from the unusedPotThemes array.
   * @returns - A random theme in the format of { name: string, hex: string }
   */
  private getInitialTheme(): Theme {
    return this.unusedPotThemes[
      Math.floor(Math.random() * this.unusedPotThemes.length)
    ];
  }

  /**
   * @description - This function is used to get the themes from the base data. It sets the themes, usedPotThemes and unusedPotThemes arrays.
   */
  private getThemeArrays(): void {
    this.themes = Object.values(this.baseData.colors);
    this.usedPotThemes = this.dataStore
      .pots()
      .filter((pot: PotsObject) => !pot.deleted_at)
      .map((pot: PotsObject) => pot.theme);
    this.unusedPotThemes = this.themes.filter(
      (theme: Theme) => !this.usedPotThemes.includes(theme.hex)
    );
  }

  /**
   * @description - This function is used to choose a theme from the dropdown. It sets the chosenTheme to the selected theme and closes the dropdown.
   * @param theme - The theme to be chosen.
   */
  public chooseTheme(theme: Theme): void {
    if (this.unusedPotThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.toggleThemeDropdown();
    }
  }
  // #endregion

  // #region Submit
  /**
   * @description - This function is used to complete the pot object with the values from the input fields.
   * It sets the name, target and theme of the pot object.
   */
  private completePotObject(): void {
    this.currentPot.name = this.potNameValue;
    this.currentPot.target = parseFloat(
      this.potTargetInputValue.replace(/,/g, '')
    );
    this.currentPot.theme = this.chosenTheme.hex;
  }

  /**
   * @description - This function is called when the user clicks the save button in the modal.
   */
  public submitAddPot(): void {
    this.completePotObject();
    this.apiPotsService.addNewPot(this.currentPot);
    this.closeMainModal();
  }
  // #endregion
}
