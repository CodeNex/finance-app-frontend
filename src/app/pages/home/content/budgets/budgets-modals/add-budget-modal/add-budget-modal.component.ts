import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { ApiBudgetsService } from '../../api-budgets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-budget-modal.component.html',
  styleUrl: './add-budget-modal.component.scss',
})
export class AddBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
    public baseData: BasedataService = inject(BasedataService);
    public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
    public apiBudgetsService: ApiBudgetsService = inject(ApiBudgetsService);
  
    // closes main modal and its children
    public closeMainModal() {
      this.mainModalService.hideMainModal();
    }
  
    public currentPot: any = {
      id: -1,
      name: '',
      amount: 0,
      maximum: -1,
      theme: '',
      deleted_at: null,
      created_at: null,
      last_spendings: [{}]
    };
  
    // array of all themes
    public themes: any;
    // array of used themes
    public usedBudgetThemes: any;
    // array of unused themes
    public unusedBudgetThemes: any;
    // the current chosen theme
    public chosenTheme: any;
    // boolean to control the theme dropdown
    public isThemeDropdownOpen: boolean = false;
    // the value of the pot name input
    public potNameValue: string = '';
    // the number of characters left for the pot name
    public potNameCharactersLeft: number = 30;
    // the value of the pot target input binded by ngModel
    public potTargetInputValue: string = '0.00';
    // a cached string of the pot target input value
    public potTargetString: string = '0.00';
    // the value of the pot theme input
    public potThemeValue: string = '';
  
    ngOnInit() {
      this.getThemeArrays();
      this.chosenTheme =
        this.unusedBudgetThemes[
          Math.floor(Math.random() * this.unusedBudgetThemes.length)
        ];
      this.currentPot.theme = this.chosenTheme.hex;
    }
  
    // closes or opens theme dropdown
    closeHideThemeDropdown() {
      this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
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
      this.usedBudgetThemes = this.dataStore.budgets().map((budget: any) => {
        if (!budget.deleted_at) return budget.theme;
      });
      this.unusedBudgetThemes = this.themes.filter(
        (theme: any) => !this.usedBudgetThemes.includes(theme.hex)
      );
    }
  
    // choose a theme from the dropdown
    chooseTheme(theme: any) {
      if (this.unusedBudgetThemes.includes(theme)) {
        this.chosenTheme = theme;
        this.closeHideThemeDropdown();
      }
    }
  
    // add a new pot to the pots array in data-store-service, submit the new pot to the API and close the modal
    submitAddPot() {
      this.currentPot.name = this.potNameValue;
      this.currentPot.target = parseFloat(
        this.potTargetInputValue.replace(/,/g, '')
      );
      this.currentPot.theme = this.chosenTheme.hex;
      // this.apiBudgetsService.addNewBudget(this.currentPot);
      this.mainModalService.hideMainModal();
      console.log(this.currentPot);
    }
  }
  