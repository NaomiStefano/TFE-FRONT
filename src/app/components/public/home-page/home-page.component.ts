import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Coach } from 'src/app/models/Coach';
import { LoginData } from 'src/app/models/loginData';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit{

  public loginForm = new FormGroup({
    login : new FormControl("",[Validators.required]),
    password : new FormControl("",[Validators.required])
  })

  constructor(
    private router: Router,
    private api : ApiCallService,
    private messageService: MessageService,
    private meService : StaminaService
    ){}

  ngOnInit(): void {
    
  }

  public checkLogin(){
    this.messageService.add({ severity: 'info', summary: 'Patience', detail: 'Connexion en cours...' });
    const loginData: LoginData = { // match type login data
      login: this.loginForm.value.login as string,
      password: this.loginForm.value.password as string,
    };
    this.api.checkLoginCoach(loginData).subscribe((res:any)=>{
      if(res){
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Connexion réussie !' });
        var coach = new Coach(res)
        this.meService.setMe(coach);
        this.router.navigate(['/private/session']);
      }
    })
  }
  
}
