import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MainModalService } from '../../../../../../services/main-modal.service';


@Component({
  selector: 'app-add-pot-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-pot-modal.component.html',
  styleUrl: './add-pot-modal.component.scss',
})
export class AddPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};
}
