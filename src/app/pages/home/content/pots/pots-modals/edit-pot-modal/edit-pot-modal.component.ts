import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
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
    createdAt: null,
    deletedAt: null,
  };

  public currentPotIndex: number = -1;

  public themes: any;
  public usedPotThemes: any;
  public unusedPotThemes: any;
  public chosenTheme: any;
  public isThemeDropdownOpen: boolean = false;
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;
  public potTargetInputValue: number = 0;
  public potThemeValue: string = '';

  ngOnInit() {
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.potNameValue = this.currentPot.name;
    this.potNameCharactersLeft = 30 - this.currentPot.name.length;
    this.potTargetInputValue = this.currentPot.target;
    this.getThemeArrays();
    
  }

  // closes or opens theme dropdown
  closeHideThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  // controls the maximum length of the pot name
  controlNameLength() {
    if (this.potNameValue.length > 30) {
      let potNameSliced = this.potNameValue.slice(0, 30);
      setTimeout(() => {
        this.potNameValue = potNameSliced;
        this.potNameCharactersLeft = 30 - this.potNameValue.length;
      }, 10);
    } else {
      this.potNameCharactersLeft = 30 - this.potNameValue.length;
    }
  }

  formatTargetInput(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  // controls the maximum amount of the pot target
  controlMaxTarget(event: any) {

    if (!/[0-9]/.test(event.data) || event.inputType === 'deleteContentBackward') {
      event.preventDefault();
    }

    if (this.potTargetInputValue > 999999999) {
      setTimeout(() => {
        this.potTargetInputValue = 999999999;
        
      }, 10);
    } else {
     console.log(this.formatTargetInput(this.potTargetInputValue));
     
    }
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
      // this.closeHideThemeDropdown();
    }
  }

  // submit the changed pot to the pots array in data-store-service, submit the changed pot to the API and close the modal 
  submitEditPot() {

    console.log(this.currentPot);
  }
  
}
