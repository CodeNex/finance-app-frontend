import { Component, inject, Input } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-pot-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-pot-modal.component.html',
  styleUrl: './edit-pot-modal.component.scss',
})
export class EditPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public baseData: BasedataService = inject(BasedataService);

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
  public isThemeDropdownOpen: boolean = false;
  public potNameValue: string = '';
  public potNameCharactersLeft: number = 30;
  public potTargetValue: string = '';
  public potThemeValue: string = '';

  ngOnInit() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    this.potNameValue = this.currentPot.name;
    this.potNameCharactersLeft = 30 - this.currentPot.name.length;
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
}
