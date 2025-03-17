import { Component, inject, Input} from '@angular/core';

import { BasedataService } from '../../../../../services/basedata.service';

@Component({
  selector: 'app-single-transaction',
  imports: [],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss'
})
export class SingleTransactionComponent {

  public baseData: BasedataService = inject(BasedataService);

  @Input() transaction: any;

}
