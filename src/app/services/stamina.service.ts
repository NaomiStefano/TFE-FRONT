import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Coach } from '../models/Coach';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StaminaService {
  public apiBaseUrl: string = "";
  public fullName : string = "";
  public type : string = "";
  public publisherId : number = 0;
  public connected : boolean = false;
  public coach !: Coach ; 
  constructor(
        private router: Router,
  ) { 
    this.apiBaseUrl = "http://localhost:7101/api/"    
      const storedUser = localStorage.getItem('userConnected');
      if (storedUser) {
        const coach = JSON.parse(storedUser);
        this.fullName = coach.fullName;
        this.type = "Coach";
        this.publisherId = coach.id;
        this.connected = true;
        this.coach = coach;
      }
    }
    
  

    setMe(coach: Coach) {
      this.fullName = coach.fullName ? coach.fullName : "";
      this.type = "Coach";
      this.publisherId = coach.id;
      this.connected = true;
      localStorage.setItem('userConnected', JSON.stringify(coach));
    }

  disconnect(){
    this.fullName = '';
    this.type = "";
    this.publisherId =0; 
    this.connected = false;
    localStorage.removeItem('userConnected');
    this.router.navigate(['/public/home']);
  }
  

}