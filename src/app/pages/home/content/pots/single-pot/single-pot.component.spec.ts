import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePotComponent } from './single-pot.component';

describe('SinglePotComponent', () => {
  let component: SinglePotComponent;
  let fixture: ComponentFixture<SinglePotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
