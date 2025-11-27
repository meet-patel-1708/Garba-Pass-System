import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockPassComponent } from './block-pass.component';

describe('BlockPassComponent', () => {
  let component: BlockPassComponent;
  let fixture: ComponentFixture<BlockPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
