import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySkeletonComponent } from './my-skeleton.component';

describe('MySkeletonComponent', () => {
  let component: MySkeletonComponent;
  let fixture: ComponentFixture<MySkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
