import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../services/main-modal.service';

@Component({
  selector: 'app-main-modal',
  imports: [],
  templateUrl: './main-modal.component.html',
  styleUrl: './main-modal.component.scss'
})
export class MainModalComponent {

  private mainModalService: MainModalService = inject(MainModalService);

  public hideMainModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.mainModalService.hideMainModal();
    }
  }

}
