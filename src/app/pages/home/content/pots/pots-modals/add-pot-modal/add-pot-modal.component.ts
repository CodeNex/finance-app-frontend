import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../../../services/data-store-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-pot-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './add-pot-modal.component.html',
  styleUrl: './add-pot-modal.component.scss',
})
export class AddPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public baseData: BasedataService = inject(BasedataService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    createdAt: null,
    deletedAt: null,
  };

  public themes: any;
  public usedPotThemes: any;
  public unusedPotThemes: any;
  public chosenTheme: any;
  public isThemeDropdownOpen: boolean = false;
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;
  public potTargetInputValue: number = 0;
  public potTargetValue: string = '';
  public potThemeValue: string = '';

  ngOnInit() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.usedPotThemes = this.dataStore.pots().map((pot: any) => pot.theme);
    this.unusedPotThemes = this.themes.filter(
      (theme: any) => !this.usedPotThemes.includes(theme.hex)
    );
    this.chosenTheme =
      this.unusedPotThemes[
        Math.floor(Math.random() * this.unusedPotThemes.length)
      ];
    console.log(this.usedPotThemes);
    console.log(this.unusedPotThemes);
    console.log(this.chosenTheme);
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

  // controls the maximum amount of the pot target
  controlMaxTarget() {
    if (this.potTargetInputValue > 999999999) {
      setTimeout(() => {
        this.potTargetInputValue = 999999999;
        this.potTargetValue = this.potTargetInputValue.toLocaleString('en-US', {
          maximumFractionDigits: 0,
        });
      }, 10);
    } else {
      this.potTargetValue = this.potTargetInputValue.toLocaleString('en-US', {
        maximumFractionDigits: 0,
      });
    }
  }

  // choose a theme from the dropdown
  chooseTheme(theme: any) {
    if (this.unusedPotThemes.includes(theme)) {
      this.chosenTheme = theme;
      this.closeHideThemeDropdown();
    }
  }
}
