import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyButton } from 'src/app/models/button';

@Component({
  selector: 'app-my-title',
  templateUrl: './my-title.component.html',
  styleUrls: ['./my-title.component.scss']
})
export class MyTitleComponent {
  @Input() text : string = "";
  @Input() showReturn : boolean = false;
  @Input() buttons: MyButton[] = [];
  @Output() iconClick: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onIconClick() {
    this.iconClick.emit(true);
  }

}
