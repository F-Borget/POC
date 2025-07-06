import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagemanagerComponent } from './pagemanager.component';

describe('PagemanagerComponent', () => {
  let component: PagemanagerComponent;
  let fixture: ComponentFixture<PagemanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagemanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
