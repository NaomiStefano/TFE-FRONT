import { Component, ElementRef  } from '@angular/core';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {


  constructor(
    public dataService : StaminaService,
    ){
    }

  

  
  updateCoach(){
    alert("update coach!!!")
  }
}
