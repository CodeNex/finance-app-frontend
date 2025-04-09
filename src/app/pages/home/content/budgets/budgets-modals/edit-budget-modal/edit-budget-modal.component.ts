import { Component, inject, Input } from '@angular/core';

import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { ApiBudgetsService } from '../../api-budgets.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../../../../../../components/icons/icons.component';

@Component({
  selector: 'app-edit-budget-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './edit-budget-modal.component.html',
  styleUrl: './edit-budget-modal.component.scss',
})
export class EditBudgetModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public apiBudgetsService: ApiBudgetsService = inject(ApiBudgetsService);
  public baseData: BasedataService = inject(BasedataService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public budgetIndex: number = 1;
  @Input() public modalObject: Object = {};

  public currentBudget: any = {
    id: -1,
    name: '',
    amount: -1,
    maximum: -1,
    theme: '',
    time_frame: '',
    deleted_at: null,
    created_at: null,
    last_spendings: [
      {
        id: -1,
        user: -1,
        name: '',
        amount: -1,
        recurring: null,
        theme: '',
        budget_id: null,
        deleted_at: null,
        created_at: null,
        category: '',
        budget: {
          category: '',
        },
      },
    ],
  };

  public currentBudgetIndex: number = -1;

  // boolean to control the budget dropdown
  public isBudgetDropdownOpen: boolean = false;
  // array of all categories in the application
  public categories: any = [];
  // array of used categories in budgets
  public usedBudgetCategories: any;
  // array of unused categories
  public unusedBudgetCategories: any;
  // current chosen category
  public chosenCategory: string = '';

  // the value of the pot target input binded by ngModel
  public maxBudgetInputValue: string = '0.00';
  // a cached string of the pot target input value
  public maxBudgetString: string = '0.00';
  // boolean to control the theme dropdown
  public isThemeDropdownOpen: boolean = false;
  // array of all themes in the application
  public themes: any;
  // array of used themes in budgets
  public usedBudgetThemes: any;
  // array of unused themes
  public unusedBudgetThemes: any;
  // the current chosen theme
  public chosenTheme: any;
  // the value of the pot theme input
  public potThemeValue: string = '';

  ngOnInit() {
    this.currentBudget = this.modalObject;
    this.currentBudgetIndex = this.budgetIndex;
    this.getCategoryArrays();
    this.getThemeArrays();
    this.maxBudgetInputValue = this.currentBudget.maximum.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
    this.maxBudgetString = this.maxBudgetInputValue;
    this.chosenCategory = this.currentBudget.name;

    console.log(this.currentBudget, this.currentBudgetIndex);
  }

  getCategoryArrays() {
    Object.values(this.baseData.financeApp.budgets.categories).forEach(
      (category: any) => {
        this.categories.push(category.name);
      }
    );
    this.usedBudgetCategories = this.dataStore.budgets().map((budget: any) => {
      if (!budget.deleted_at) return budget.name;
    });
    this.unusedBudgetCategories = this.categories.filter(
      (category: any) => !this.usedBudgetCategories.includes(category)
    );
  }

  // choose a category by click from the dropdown
  chooseCategory(category: string) {
    if (this.unusedBudgetCategories.includes(category)) {
      this.chosenCategory = category;
      this.currentBudget.name = this.chosenCategory;
      this.closeHideBudgetDropdown();
    }
  }

  // closes or opens budget dropdown
  closeHideBudgetDropdown() {
    this.isBudgetDropdownOpen = !this.isBudgetDropdownOpen;
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
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    if (numbersArray.length === 3 && numbersArray[0] === '0') {
      numbersArray.shift();
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    } else if (
      numbersArray.length >= 3 &&
      numbersArray.length < 11 &&
      numbersArray[0] !== '0'
    ) {
      numbersArray.push(event.key);
      numbersArray.splice(numbersArray.length - 2, 0, '.');
      this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
        }
      );
      this.maxBudgetInputValue = this.maxBudgetString;
    }
  }

  // delete a number from the target input
  deleteNumberFromTargetInput() {
    let currentTarget = this.maxBudgetString;
    let numbersArray = currentTarget.replace(/[.,]/g, '').split('');
    numbersArray.pop();
    numbersArray.splice(numbersArray.length - 2, 0, '.');
    this.maxBudgetString = parseFloat(numbersArray.join('')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
      }
    );
    this.maxBudgetInputValue = this.maxBudgetString;
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
    this.chosenTheme = this.themes.find((theme: any) => {
      return theme.hex === this.currentBudget.theme;
    })
    console.log(this.chosenTheme);
    
  }

  // choose a theme by click from the dropdown
  chooseTheme(theme: any) {
    if (this.unusedBudgetThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.closeHideThemeDropdown();
    }
  }

  // add a new pot to the pots array in data-store-service, submit the new pot to the API and close the modal
  submitEditedBudget() {
    this.currentBudget.maximum = parseFloat(
      this.maxBudgetInputValue.replace(/,/g, '')
    );
    this.currentBudget.theme = this.chosenTheme.hex;
    this.apiBudgetsService.updateBudget('budgets', 'editBudget', this.currentBudgetIndex, this.currentBudget);
    this.mainModalService.hideMainModal();
    console.log(this.currentBudget);
  }
}
