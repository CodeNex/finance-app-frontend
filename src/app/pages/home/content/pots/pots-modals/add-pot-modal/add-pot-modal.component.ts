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
  selector: 'app-add-pot-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-pot-modal.component.html',
  styleUrl: './add-pot-modal.component.scss',
})
export class AddPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public baseData: BasedataService = inject(BasedataService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};

  public themes: any; 

  ngOnInit() {
    this.themes = Object.values(this.baseData.financeApp.basics.colors);
    console.log(this.themes);
    
  }
}
