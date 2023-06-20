import { MenuItem } from "primeng/api";

export interface MyColumn {
    field:string 
    header:string 
    align?:"left"|"center"|"right"
    type?:"string"|"date"|"integer"|"float"|"money"|"boolean"|"number"|"html"
    sub?:any
    width?:string 
    tooltip?:Function 
    tooltip_th?:string
    format?:Function|object
    sortable?:Boolean
    filterable?:Boolean
    style?:object
    sort?:Function
    guid?:string
    _hover?:boolean
    label?:string
    value?:string
    typeFormat?:string
    menu?:MenuItem[],
    export?:Function
    click?:Function, 
    visible?:boolean
}