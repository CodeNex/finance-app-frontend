import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePotModalComponent } from './delete-pot-modal.component';

describe('DeletePotModalComponent', () => {
  let component: DeletePotModalComponent;
  let fixture: ComponentFixture<DeletePotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePotModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
