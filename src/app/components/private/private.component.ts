import { Component, ViewChild  } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';
import { SignupPageComponent } from '../public/signup-page/signup-page.component';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
  providers : [ConfirmationService]
})
export class PrivateComponent {

  public profileMode !: boolean;

  constructor(
    public dataService : StaminaService,
    private api : ApiCallService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService : ConfirmationService
    ){
    }


    askConfirmation(event:any){
      this.confirmationService.confirm({
        key: "disconnection",
        message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
        header: 'Confirmation de déconnexion',
        acceptLabel: 'Confirmer',
        rejectLabel: 'Annuler',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dataService.disconnect();
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Déconnecté avec succès !' });
        }
      });
    }
  
  updateCoach(){
    this.profileMode = true;
    localStorage.setItem('profile','true');
    this.dialogService.open(SignupPageComponent,{
      header:"Modifier mon profil",
      width: "40%"
    }) 
  }

  seeCoachProfile(){
    localStorage.setItem('profile','true');
    localStorage.setItem('profileReadOnly','true');
    this.dialogService.open(SignupPageComponent,{
      header:"Consulter mon profil",
      width: "40%"
    }) 
  }
}
