import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-imprint',
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  public route: ActivatedRoute = inject(ActivatedRoute);

  public location: string = '';

  ngOnInit() {
    this.getImprintLocation();
  }

  getImprintLocation() {
    this.route.data.subscribe(data => {
      this.location = data['location'];
    })
  }

}
