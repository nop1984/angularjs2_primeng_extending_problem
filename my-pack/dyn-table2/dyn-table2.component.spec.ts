import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynTable2Component } from './dyn-table2.component';

describe('DynTable2Component', () => {
  let component: DynTable2Component;
  let fixture: ComponentFixture<DynTable2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynTable2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
