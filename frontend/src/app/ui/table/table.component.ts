import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '@ui/table/models';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { TableFormatterPipe } from '@ui/table/pipes/table-formatter.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTableModule, TableFormatterPipe],
  providers: [CdkColumnDef],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  @Input() config?: TableConfig<T>;
  @Input() items?: T[];
  @Output() itemSelected = new EventEmitter<T>();

  columnsDefs: Record<string, TableColumn<T>> = {};
  columns: string[] = [];
  show = false;

  ngOnInit(): void {
    this.prepareTable();
  }

  rowClick(ev: MouseEvent, item: T) {
    if (this.config?.clickable) {
      this.itemSelected.emit(item);
    }
  }

  private prepareTable() {
    if (!this.config?.columns?.length) {
      return;
    }
    this.columnsDefs = {};
    this.columns = this.config.columns.map((column: TableColumn<T>) => {
      this.columnsDefs[column.field as string] = column;
      return column.field;
    }) as string[];
    this.cdr.markForCheck();
  }
}
