import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiginDialogComponent } from './sigin-dialog.component';

describe('SiginDialogComponent', () => {
  let component: SiginDialogComponent;
  let fixture: ComponentFixture<SiginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiginDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
