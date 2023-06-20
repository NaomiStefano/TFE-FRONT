import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTitleComponent } from './my-title.component';

describe('MyTitleComponent', () => {
  let component: MyTitleComponent;
  let fixture: ComponentFixture<MyTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
