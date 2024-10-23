import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNoLoginComponent } from './navbar-no-login.component';

describe('NavbarNoLoginComponent', () => {
  let component: NavbarNoLoginComponent;
  let fixture: ComponentFixture<NavbarNoLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarNoLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarNoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
