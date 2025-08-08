import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from '@ui/table';

@Pipe({
  name: 'tableFormatter',
  standalone: true
})
export class TableFormatterPipe<T> implements PipeTransform {

  transform(item: T, columnDef: TableColumn<T>): string {
    if(!columnDef?.valueFormatter){
      return '';
    }

    return columnDef.valueFormatter(item, columnDef);
  }

}
