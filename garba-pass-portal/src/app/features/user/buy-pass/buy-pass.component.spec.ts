import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPassComponent } from './buy-pass.component';

describe('BuyPassComponent', () => {
  let component: BuyPassComponent;
  let fixture: ComponentFixture<BuyPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
