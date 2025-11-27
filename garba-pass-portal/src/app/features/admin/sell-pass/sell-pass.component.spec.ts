import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPassComponent } from './sell-pass.component';

describe('SellPassComponent', () => {
  let component: SellPassComponent;
  let fixture: ComponentFixture<SellPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
