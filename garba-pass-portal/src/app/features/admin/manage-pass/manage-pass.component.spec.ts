import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePassComponent } from './manage-pass.component';

describe('ManagePassComponent', () => {
  let component: ManagePassComponent;
  let fixture: ComponentFixture<ManagePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
