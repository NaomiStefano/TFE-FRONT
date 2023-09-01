import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyColumn } from './myColumn';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit{


  @ViewChild('contm') contextMenu: any;

  @Input() data: any = [];
  @Input() columns: MyColumn[] = [];
  @Input() tableStyle: string = "";
  @Input() menuItems : MenuItem[] = [];
  @Input() pageSize : number = 0;
  @Input() totalCount : number =0; 
  @Input() showCurrentPage : boolean = false; 
  @Input() paginator : boolean = false;
  @Output() selectedElement: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLazyLoad: EventEmitter<number> = new EventEmitter<number>();
  @Input() currentPage: number = 1; 

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


  formatData(rowData: any, column: MyColumn): string {
    const value = this.getColumnValue(rowData, column);
    if (typeof column.format === 'function') {
      return column.format(value) || '';
    }
    return value;
  }

  getItemValue(event:any){
    this.selectedElement.emit(event.data);
  }

  onLazyLoadCall(event: any): void {
    const pageNumber = event.first / event.rows + 1;
    this.onLazyLoad.emit(pageNumber);
    
  }
  
}
