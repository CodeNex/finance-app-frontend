import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotsSummaryComponent } from './pots-summary.component';

describe('PotsSummaryComponent', () => {
  let component: PotsSummaryComponent;
  let fixture: ComponentFixture<PotsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
