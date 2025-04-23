import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '@content/pots/api-pots.service';
import { FormatAmountInputService } from '@src/services/format-amount-input.service';


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
  private formatAmountInputService = inject(FormatAmountInputService);

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
  ngOnInit() {
    this.getThemeArrays();
    this.chosenTheme =
      this.unusedPotThemes[
        Math.floor(Math.random() * this.unusedPotThemes.length)
      ];
    this.currentPot.theme = this.chosenTheme.hex;
  }
  // #endregion

  // #region Dropdowns & Modal
  public isThemeDropdownOpen: boolean = false;

  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  // #region Name & Target Input
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;

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

  public controlMaxTarget(event: KeyboardEvent) {
    const inputValue = this.potTargetInputValue;
    this.potTargetInputValue = this.formatAmountInputService.formatAmountInput(event, inputValue);
  }
  // #endregion

  // #region Themes
  public themes: any;
  public usedPotThemes: any;
  public unusedPotThemes: any;
  public chosenTheme: any;
  public potThemeValue: string = '';

  getThemeArrays() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedPotThemes = this.dataStore.pots().map((pot: PotsObject) => {
      if (!pot.deleted_at) return pot.theme;
      return;
    });
    this.unusedPotThemes = this.themes.filter(
      (theme: any) => !this.usedPotThemes.includes(theme.hex)
    );
  }

  // choose a theme from the dropdown
  chooseTheme(theme: any) {
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
  submitAddPot() {
    this.currentPot.name = this.potNameValue;
    this.currentPot.target = parseFloat(
      this.potTargetInputValue.replace(/,/g, '')
    );
    this.currentPot.theme = this.chosenTheme.hex;
    this.apiPotsService.addNewPot(this.currentPot);
    this.mainModalService.hideMainModal();
    console.log(this.currentPot);
  }
}
