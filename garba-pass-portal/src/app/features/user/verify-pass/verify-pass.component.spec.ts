import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPassComponent } from './verify-pass.component';

describe('VerifyPassComponent', () => {
  let component: VerifyPassComponent;
  let fixture: ComponentFixture<VerifyPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
