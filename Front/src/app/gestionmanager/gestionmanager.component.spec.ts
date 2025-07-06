import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionmanagerComponent } from './gestionmanager.component';

describe('GestionmanagerComponent', () => {
  let component: GestionmanagerComponent;
  let fixture: ComponentFixture<GestionmanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionmanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
