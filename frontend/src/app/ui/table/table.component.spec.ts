import { TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { TableConfig } from '@ui/table/models';
import { By } from '@angular/platform-browser';

const tableConfig: TableConfig<any> = {
  clickable: true,
  columns: [
    {
      field: 'field1',
      label: 'Field 1',
    },
    { field: 'field2', label: 'Field 2' },
    { field: 'field3', label: 'Field 3' },
  ],
};

const mockObject = (field1: string, field2: any) => {
  return {
    field1,
    field2,
  };
};

const mockItems = [mockObject('abc', 1234), mockObject('xyz', 9876)];

describe('TableComponent', () => {
  const given = (
    data?: Partial<{
      config: TableConfig<any>;
      items: unknown[];
    }>
  ) => {
    TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TableComponent);
    const componentRef = fixture.componentRef;

    if (data?.config) {
      componentRef.setInput('config', data.config);
    }
    if (data?.items) {
      componentRef.setInput('items', data.items);
    }
    fixture.detectChanges();

    return {
      fixture,
      componentRef,
      component: fixture.componentInstance,
      debug: fixture.debugElement,
    };
  };

  it('should show table if has columns and data', () => {
    const { componentRef, component, fixture, debug } = given({config: tableConfig});

    const tableExists = !!debug.query(By.css('table'));
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    expect(component.columns).toEqual(tableConfig.columns.map( c => c.field));
    expect(tableExists).toBeFalsy();
    expect(debug.query(By.css('table')).nativeElement).toBeDefined();
  });

  it('should emit on row click if table clickable', () => {
    const { fixture, debug, component, componentRef} = given({config: tableConfig, items: mockItems});

    const clickSpy  = jest.spyOn(component.itemSelected, 'emit');
    const row = debug.query(By.css('table .mat-row'));
    row.nativeElement.dispatchEvent(new Event('click'));
    componentRef.setInput('config', {...tableConfig, clickable: false});
    component.ngOnInit();
    fixture.detectChanges();
    const row2 = debug.query(By.css('table .mat-row'));
    row2.nativeElement.dispatchEvent(new Event('click'));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });


});
