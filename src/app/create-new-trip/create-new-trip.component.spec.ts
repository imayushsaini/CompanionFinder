import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTripComponent } from './create-new-trip.component';

describe('CreateNewTripComponent', () => {
  let component: CreateNewTripComponent;
  let fixture: ComponentFixture<CreateNewTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
