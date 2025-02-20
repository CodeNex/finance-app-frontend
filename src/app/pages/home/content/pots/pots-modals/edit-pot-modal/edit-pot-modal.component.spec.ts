import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPotModalComponent } from './edit-pot-modal.component';

describe('EditPotModalComponent', () => {
  let component: EditPotModalComponent;
  let fixture: ComponentFixture<EditPotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
