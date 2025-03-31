import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MainModalService } from '../../../../../../services/main-modal.service';
import { ApiTransactionService } from '../../../transactions/api-transaction.service';

@Component({
  selector: 'app-recurring-delete-modal',
  imports: [CommonModule],
  templateUrl: './recurring-delete-modal.component.html',
  styleUrl: './recurring-delete-modal.component.scss'
})
export class RecurringDeleteModalComponent {

  public mainModalService: MainModalService = inject(MainModalService);
  public apiTransactionService: ApiTransactionService = inject(ApiTransactionService);
  
    // closes main modal and its children
    public closeMainModal() {
      this.mainModalService.hideMainModal();
    }
  
    public currentBudgetToDelete: string = 'CurrentBudget';
  
    @Input() public modalObject: any = {};
    @Input() public recurringIndex: number = -1;
  
    public currentBudgetIndex: number = -1;
  
    ngOnInit() {
      this.currentBudgetIndex = this.recurringIndex;
      if (this.modalObject.name) {this.currentBudgetToDelete = this.modalObject.name} ;
    }
  
    deleteCurrentBudget() {
      // this.apiBudgetsService.deleteBudget(this.modalObject, this.currentBudgetIndex);

      console.log('deleteCurrentBudget', this.modalObject, this.currentBudgetIndex);
      
    }

}
