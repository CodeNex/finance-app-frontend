import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawmoneyPotModalComponent } from './withdrawmoney-pot-modal.component';

describe('WithdrawmoneyPotModalComponent', () => {
  let component: WithdrawmoneyPotModalComponent;
  let fixture: ComponentFixture<WithdrawmoneyPotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawmoneyPotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawmoneyPotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
