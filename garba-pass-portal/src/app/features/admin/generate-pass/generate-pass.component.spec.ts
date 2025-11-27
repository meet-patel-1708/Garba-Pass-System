import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePassComponent } from './generate-pass.component';

describe('GeneratePassComponent', () => {
  let component: GeneratePassComponent;
  let fixture: ComponentFixture<GeneratePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratePassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
