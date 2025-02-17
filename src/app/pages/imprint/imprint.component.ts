import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-imprint',
  imports: [RouterModule],
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
