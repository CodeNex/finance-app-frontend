import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningScreenComponent } from './warning-screen.component';

describe('WarningScreenComponent', () => {
  let component: WarningScreenComponent;
  let fixture: ComponentFixture<WarningScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
