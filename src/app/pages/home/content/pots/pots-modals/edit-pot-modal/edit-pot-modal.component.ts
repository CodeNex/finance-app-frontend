import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '@content/pots/api-pots.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';

/**
 * * * * EditPotModalComponent
 * * This component is responsible for displaying the edit pot modal.
 * * It allows the user to edit an existing pot's name, target, and theme.
 * * It uses the MainModalService to manage the modal state and the ApiPotsService to interact with the backend.
 * * It also uses the FormatAmountInputService to format the input value.
 */
@Component({
  selector: 'app-edit-pot-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './edit-pot-modal.component.html',
  styleUrl: './edit-pot-modal.component.scss',
})
export class EditPotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public baseData = inject(BasedataService);
  public dataStore = inject(DataStoreServiceService);
  public apiPotsService = inject(ApiPotsService);
  public formatAmountInputService = inject(FormatAmountInputService);

  @Input() public modalObject!: PotsObject;
  @Input() public potIndex: number = -1;

  public currentPot: PotsObject = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  };

  public currentPotIndex: number = -1;
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.initializePotAndModal();
    this.getThemeArrays();
  }

  private initializePotAndModal(): void {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.potNameValue = this.currentPot.name;
    this.potNameCharactersLeft = 30 - this.currentPot.name.length;
    this.potTargetInputValue = this.currentPot.target.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
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
  controlNameLength(event: any) {
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
   * @description - This function is used to get the themes from the base data. It sets the themes, usedPotThemes and unusedPotThemes arrays.
   */
  getThemeArrays() {
    this.themes = Object.values(this.baseData.colors);
    this.usedPotThemes = this.dataStore
      .pots()
      .map((pot: PotsObject) => pot.theme);
    this.unusedPotThemes = this.themes.filter(
      (theme: Theme) => !this.usedPotThemes.includes(theme.hex)
    );
    this.themes.forEach((theme: Theme) => {
      if (this.currentPot.theme === theme.hex) this.chosenTheme = theme;
    });
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
   * @description - Submit the changed pot to the pots array in data-store-service, submit the changed pot to the API and close the modal
   */
  public submitEditPot(): void {
    this.completePotObject();
    this.apiPotsService.updatePot(
      'pots',
      'editPot',
      this.currentPotIndex,
      this.currentPot
    );
    this.mainModalService.hideMainModal();
  }
  // #endregion
}
