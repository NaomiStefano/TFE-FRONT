import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyColumn } from './myColumn';
import { TableModule } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';


@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit{

  @ViewChild('cmm') contextMenu: any;
  
  @Input() data: any[] = [];
  @Input() columns: MyColumn[] = [];
  @Input() tableStyle: string = "";
  @Input() loading : boolean = true; 
  @Input() menuItems : MenuItem[] = [];
  @Output() selectedElement: EventEmitter<any> = new EventEmitter<any>();
  selectedItem!: any;



  constructor() {}
  

  ngOnInit(): void {
        
  }

  getColumnValue(rowData: any, column: MyColumn): string {
    return rowData[column.field];
  }

  getTooltip(rowData: any, column: MyColumn): string {
    if (column.tooltip) {
      return column.tooltip(rowData[column.field], rowData);
    }
    return '';
  }

  exportColumnValue(rowData: any, column: MyColumn): void {
    if (column.export) {
      column.export(rowData[column.field], rowData);
    }
  }

  formatData(rowData: any, column: MyColumn): string {
    const value = this.getColumnValue(rowData, column);
    if (typeof column.format === 'function') {
      return column.format(value) || '';
    }
    return value;
  }

  getItemValue(event:any){
    this.selectedElement.emit(event);
  }
}
