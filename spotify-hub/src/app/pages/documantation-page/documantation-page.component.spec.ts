import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumantationPageComponent } from './documantation-page.component';

describe('DocumantationPageComponent', () => {
  let component: DocumantationPageComponent;
  let fixture: ComponentFixture<DocumantationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumantationPageComponent]
    });
    fixture = TestBed.createComponent(DocumantationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
