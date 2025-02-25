import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPotModalComponent } from './add-pot-modal.component';

describe('AddPotModalComponent', () => {
  let component: AddPotModalComponent;
  let fixture: ComponentFixture<AddPotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
