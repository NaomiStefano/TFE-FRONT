import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Coach } from 'src/app/models/Coach';
import { Client } from 'src/app/models/client';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  public profileMode: boolean = false;
  public readonlyMode: boolean = false;
  public coach !: Coach;
  public client!: Client;
  public signupForm : FormGroup = new FormGroup({
    lastName : new FormControl("",[Validators.required]),
    firstName : new FormControl("",[Validators.required]),
    login : new FormControl("",[Validators.required]),
    birthDate : new FormControl("",[Validators.required]),
    phoneNumber : new FormControl("",[Validators.required]),
    password : new FormControl("",[Validators.required,this.checkPasswordStrength]),
    confirmPass : new FormControl("",[Validators.required,this.checkPasswordStrength]),
    needAccessGym: new FormControl(false)
  })


  constructor(
    private api : ApiCallService,
    private router: Router ,
    private messageService: MessageService,
    private meService : StaminaService
      ){
    
  }
  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    if ('userConnected' in localStorage && 'profile' in localStorage && 'client' in localStorage == false ) {
      this.handleProfileMode();
      this.handleCoachMode();
    } else if ('client' in localStorage) {
      this.handleProfileMode();
      this.handleClientMode();
    } else {
      this.handleError();
    }
    if ('profileReadOnly' in localStorage) {
      this.handleReadOnlyMode();
    }
  }
  
  private handleProfileMode(): void {
    this.profileMode = true;
    this.signupForm.removeControl('password');
    this.signupForm.removeControl('confirmPass');
    localStorage.removeItem('profile');
  }
  
  private handleClientMode(): void {
    const client = localStorage.getItem('client');
    localStorage.removeItem('client');
  
    if (client) {
      this.client = new Client(JSON.parse(client));
      this.signupForm.removeControl('needAccessGym');
      this.signupForm.patchValue({
        lastName: this.client.lastName,
        firstName: this.client.firstName,
        login: this.client.login,
        birthDate: this.convertFromDB(this.client.birthDate),
        phoneNumber: this.client.phoneNumber,
      });
    } else {
      this.handleError();
    }
  }
  
  private handleCoachMode(): void {
    const coach = localStorage.getItem('userConnected');
  
    if (coach) {
      this.coach = new Coach(JSON.parse(coach));
      this.signupForm.patchValue({
        lastName: this.coach.lastName,
        firstName: this.coach.firstName,
        login: this.coach.login,
        birthDate: this.convertFromDB(this.coach.birthDate),
        phoneNumber: this.coach.phoneNumber,
        needAccessGym: this.coach.needAccessGym 
      });
    } else {
      this.handleError();
    }
  }
  
  private handleError(): void {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Un problème est survenu lors de la récupération du profil...' });
  }
  
  private handleReadOnlyMode(): void {
    localStorage.removeItem('profileReadOnly');
    this.readonlyMode = true;
  }
  

/**
 * Check if password match Validator
 * @param control 
 * @returns 
 */
  checkPasswordStrength(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
    return regex.test(password) ? null : { 'invalidPassword': true };
  }

  checkPasswordMatch(){
    let error = false;
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      const confirmPassControl = this.signupForm.get('confirmPass'); 
      if (confirmPassControl && confirmPassControl.value) {
        if (password && password !== confirmPassControl.value) {
          this.displayErrorMessMatching()
          confirmPassControl.setErrors({ 'notMatching': true });
        } else {
          confirmPassControl.setErrors(null);
        }
      }
    });
    
    this.signupForm.get('confirmPass')?.valueChanges.subscribe((confirmPass) => {
      const passwordControl = this.signupForm.get('password');
      if (passwordControl && passwordControl.value) {
        if (confirmPass && confirmPass !== passwordControl.value) {
          this.displayErrorMessMatching()
          passwordControl.setErrors({ 'notMatching': true });
         
        } else {
          passwordControl.setErrors(null);
        }
      }
    });
    
  }

  displayErrorMessMatching(){
    this.messageService.add({
      severity: 'error',
      summary: 'Attention',
      detail: 'Veuillez introduire deux mots de passe identiques'
    });
  }


  signup(){
    this.messageService.add({ severity: 'info', summary: 'Patience', detail: 'Création en cours...' });
    this.signupForm.removeControl('confirmPass');
    this.signupForm.get('birthDate')?.setValue(this.convertDateToDB(this.signupForm.value.birthDate));
    this.api.postCoach(this.signupForm.value).subscribe((res:any)=>{
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Création réussie !' });
        var coach = new Coach(res)
        this.meService.setMe(coach);
        this.router.navigate(['/private/session']);
      
    })
  }

  convertDateToDB(date:string):Date{
    const birthDate = date;
    console.log(birthDate)
    const parts = birthDate.split('/');
    const formattedBirthDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return formattedBirthDate;
  }

  convertFromDB(date:Date):string{
    const birthDate = new Date(date);
    const day = birthDate.getDate().toString().padStart(2, '0');
    const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
    const year = birthDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  updateMe(){
    this.messageService.add({ severity: 'info', summary: 'Patience', detail: 'Modification en cours...' });
    this.signupForm.get('birthDate')?.setValue(this.convertDateToDB(this.signupForm.value.birthDate));
    this.api.updateCoach(this.coach.id,this.signupForm.value).subscribe((res:any)=>{
      if(res){
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie !' });
        var coach = new Coach(res)
        this.meService.setMe(coach);
      }
    })
  }

  updateClient(){
    this.messageService.add({ severity: 'info', summary: 'Patience', detail: 'Modification en cours...' });
    this.signupForm.get('birthDate')?.setValue(this.convertDateToDB(this.signupForm.value.birthDate));
    this.api.updateBaseClient(this.client.id,this.signupForm.value).subscribe((res:any)=>{
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie !' });
    })
  }
}
