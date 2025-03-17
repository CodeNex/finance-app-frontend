import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationNavcontrolComponent } from './pagination-navcontrol.component';

describe('PaginationNavcontrolComponent', () => {
  let component: PaginationNavcontrolComponent;
  let fixture: ComponentFixture<PaginationNavcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationNavcontrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationNavcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
