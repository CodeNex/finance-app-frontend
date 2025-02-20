import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmoneyPotModalComponent } from './addmoney-pot-modal.component';

describe('AddmoneyPotModalComponent', () => {
  let component: AddmoneyPotModalComponent;
  let fixture: ComponentFixture<AddmoneyPotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmoneyPotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmoneyPotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
