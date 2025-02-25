import { Component, inject, Input } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmoney-pot-modal',
  imports: [CommonModule],
  templateUrl: './addmoney-pot-modal.component.html',
  styleUrl: './addmoney-pot-modal.component.scss',
})
export class AddmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  @Input() public modalObject: Object = {};

  public currentPot: any = {
    id: -1,
    name: '',
    target: -1,
    total: -1,
    theme: '',
    createdAt: null,
    deletedAt: null,
  };

  ngOnInit() {
    this.currentPot = this.modalObject;
    console.log(this.currentPot);
  }
}
