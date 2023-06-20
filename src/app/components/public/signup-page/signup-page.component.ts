import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Coach } from 'src/app/models/Coach';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {

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
    this.signupForm.get('confirmPass')?.valueChanges.subscribe((res)=>{
      console.log(this.signupForm.get('confirmPass'))
      if(this.signupForm.get('password')?.valid && this.signupForm.get('password')?.dirty && res === this.signupForm.get('password')?.value){
        this.signupForm.get('confirmPass')?.setErrors(null)
      } else if(this.signupForm.get('confirmPass')?.valid && res !== this.signupForm.get('password')?.value ){
        this.signupForm.get('confirmPass')?.setErrors({'notMaching': true})
        this.messageService.add({severity:'error', summary:"Attention", detail:" Veuillez introduire deux mots de passe identiques"});
      }
    })
  }

  signup(){
    this.messageService.add({ severity: 'info', summary: 'Patience', detail: 'Création en cours...' });
    this.signupForm.removeControl('confirmPass');
    this.signupForm.get('birthDate')?.setValue(this.convertDate(this.signupForm.value.birthDate));
    this.api.postCoach(this.signupForm.value).subscribe((res:any)=>{
      if(res){
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Création réussie !' });
        var coach = new Coach(res)
        this.meService.setMe(coach);
        this.router.navigate(['/private/session']);
      }
    })
  }

  convertDate(date:string):Date{
    const birthDate = date;
    const parts = birthDate.split('/');
    const formattedBirthDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return formattedBirthDate;
  }
}
