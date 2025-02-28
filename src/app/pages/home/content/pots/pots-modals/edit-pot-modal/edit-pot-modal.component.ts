import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { BasedataService } from '../../../../../../services/basedata.service';


@Component({
  selector: 'app-edit-pot-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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

  ngOnInit() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);

    this.currentPot = this.modalObject;
    this.currentPotIndex = this.potIndex;
    console.log(this.currentPot);
    console.log(this.potIndex);
    
  }
}
