import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-skeleton',
  templateUrl: './my-skeleton.component.html',
  styleUrls: ['./my-skeleton.component.scss']
})
export class MySkeletonComponent {
  @Input() columns : any = [];
  skeletonLines: any[] = [1, 2, 3,4,5];

}
