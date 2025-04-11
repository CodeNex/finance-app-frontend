import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '@components/icons/icons.component';

import { MainModalService } from '@services/main-modal.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { ApiPotsService } from '../../api-pots.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-pot-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './edit-pot-modal.component.html',
  styleUrl: './edit-pot-modal.component.scss',
})
export class EditPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public baseData: BasedataService = inject(BasedataService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public apiPotsService: ApiPotsService = inject(ApiPotsService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};
  @Input() public potIndex: number = -1;

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    created_at: null,
    deleted_at: null,
  };

  public currentPotIndex: number = -1;

  public themes: any;
  public usedPotThemes: any;
  public unusedPotThemes: any;
  public chosenTheme: any;
  public isThemeDropdownOpen: boolean = false;
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;
  public potTargetInputValue: string = '0.00';
  public potTargetString: string = '0.00';
  public potThemeValue: string = '';

  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.potNameValue = this.currentPot.name;
    this.potNameCharactersLeft = 30 - this.currentPot.name.length;
    this.potTargetInputValue = this.currentPot.target.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
    this.potTargetString = this.potTargetInputValue;
    this.getThemeArrays();
  }

  // closes or opens theme dropdown
  closeHideThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  // controls the maximum length of the pot name
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

  // controls the maximum amount of the pot target
  controlMaxTarget(event: any) {
    const deleteKeys = ['Backspace', 'Delete'];
    const otherKeys = ['ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumberKey = /^[0-9]$/.test(event.key);

    if (isNumberKey) {
      event.preventDefault();
      this.addNumberToTargetInput(event);
    } else if (deleteKeys.includes(event.key)) {
      event.preventDefault();
      this.deleteNumberFromTargetInput();
    } else if (otherKeys.includes(event.key)) {
      return;
    } else {
      event.preventDefault();
      return;
    }
  }

  // add a number to the target input
  addNumberToTargetInput(event: any) {
    let currentTarget = this.potTargetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.potTargetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.potTargetInputValue = this.potTargetString;
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.potTargetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.potTargetInputValue = this.potTargetString;
    }
  }

  // delete a number from the target input
  deleteNumberFromTargetInput() {
    let currentTarget = this.potTargetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.potTargetString = parseFloat(numbersArray.join('')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
    this.potTargetInputValue = this.potTargetString;
  }

  // get all the themes from the data-store-service and split them into used and unused theme arrays
  getThemeArrays() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);

    this.usedPotThemes = this.dataStore.pots().map((pot: any) => pot.theme);
    this.unusedPotThemes = this.themes.filter(
      (theme: any) => !this.usedPotThemes.includes(theme.hex)
    );
    this.themes.forEach((theme: any) => {
      if (this.currentPot.theme === theme.hex) this.chosenTheme = theme;
    });
  }

  // choose a theme from the dropdown
  chooseTheme(theme: any) {
    if (this.unusedPotThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.closeHideThemeDropdown();
    }
  }

  // submit the changed pot to the pots array in data-store-service, submit the changed pot to the API and close the modal
  submitEditPot() {
    let potObject = this.currentPot;
    potObject.name = this.potNameValue;
    potObject.target = parseFloat(this.potTargetInputValue.replace(/,/g, ''));
    potObject.theme = this.chosenTheme.hex;
    this.apiPotsService.updatePot(
      'pots',
      'editPot',
      this.currentPotIndex,
      potObject
    );
    this.mainModalService.hideMainModal();
    console.log(potObject);
  }
}
