import { Component } from '@angular/core';
import { Client } from 'src/app/models/client';
import { NavLink } from 'src/app/models/navLink';
import { ApiCallService } from 'src/app/services/api-call.service';
import { MyColumn } from '../../shared/my-table/myColumn';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MyButton } from 'src/app/models/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SignupPageComponent } from '../../public/signup-page/signup-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {
  
  public navItems : Array<NavLink> = [];
  public clients : Array<Client> = [];
  public isLoading : boolean = true; 
  public columns : Array<MyColumn> = [
    {
      field:"lastName",
      header:"Nom",
    },
    {
      field:"firstName",
      header:"Prénom",
    },
    {
      field:"phoneNumber",
      header:"Numéro de téléphone",
    },
    {
      field:"createdAt",
      header:"Date d'inscription",
      format : (val:any) => {
        return  this.datePipe.transform((new Date(val)), 'dd/MM/yyyy');
      }
    }, 
    {
      field:"hasDistancial",
      header:"Coaching à distance",
      format : (val:boolean) => {
        return val ? `<i class="fa-solid fa-circle-check ml-3"></i>` : `<i class="fa-solid fa-xmark fa-xl"></i>`
      }
    }
  ]
  public selectedClient !: Client |null  ;
  public buttons : MyButton[] = [
    {
      text : 'Supprimer le coaché',
      click:() => this.deleteClient(this.selectedClient)
    },
    {
      text : '  Programmations  ',
      click:() => this.goToPrograms()      
    }
    
  ];
  public menuItem : MenuItem[] = [  
    { 
      label: 'Voir le profil...',  
      icon: 'pi pi-fw pi-search', 
      command: () =>this.getClientDetails(this.selectedClient)
    },
    { 
      label: 'Supprimer', 
      icon: 'pi pi-fw pi-times', 
      command: () => this.deleteClient(this.selectedClient) 
    }, 
    { 
      label: 'Programmations',  
      icon: 'pi pi-fw pi-shield',
      command: () =>  this.goToPrograms()


    },
  ]
  public clientsMode : boolean = true ; // Am i watching the clients list ? 
  constructor(
    private api : ApiCallService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private dialogService : DialogService,
    private messageService: MessageService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    try {
        const selectedClient = sessionStorage.getItem('client');
        if(selectedClient){
          this.selectedClient = new Client(JSON.parse(selectedClient));
          this.clientsMode = false;
        }else{
          this.clientsMode = true;
          this.getClients();
        }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: `${error}` });
    }
  }
 
  /**
   * Retrieve all clients
   */
  getClients(){
    this.isLoading = true ; 
    this.api.getAllClients().subscribe(
      (res:any)=>{
        if(res){
          this.clients = res.map((x:Client)=>new Client(x)); 
        }
        this.isLoading = false;
    })
  }

  /**
   * Get details of a client
   */

    private getClientDetails(client:Client|null){
      if(client){
        this.clientsMode = false;
         client.hasDistancial == false ? this.buttons.splice(1,1):null;
      }else{
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération du client ! ' });
        this.selectedClient = null;
      }
  }
  /**
   * Update a client
   */

  public updateClientGeneral(client:Client){
    sessionStorage.setItem('profile','true')
    sessionStorage.setItem('client',JSON.stringify(client))
    this.dialogService.open(SignupPageComponent,{
      header:"Modifier le profil du coaché ",
      width: "40%"
    }) 
  }

  /**
   * Delete a client 
   */

  private deleteClient(client:Client|null){
    if(client){
      this.confirmationService.confirm({
        message: `Êtes-vous sûr de vouloir supprimer  ${client.lastName} ${client.firstName} ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteClient(client.id).subscribe((res)=>{
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
            this.getClients();
          })
        }
      });
    }else{
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération du client à supprimer !' });
    }
  }

  /**
   * Go To programmation menu
   * @param event 
   */

    goToPrograms(){
      if(this.selectedClient?.hasDistancial){
        sessionStorage.setItem('client',JSON.stringify(this.selectedClient))
        this.router.navigate([`/private/program`])
      }else{
        this.messageService.add({ severity: 'info', summary: 'Attention', detail: 'Ce coaché ne participe pas aux coachings à distance ! ' });
      }
    }
  
  handleSelectedElement(event: Client) {
    console.log(event)
    this.selectedClient = event;
    
  }

  public backToList(){
    this.selectedClient= null;
    this.clientsMode = true;
    sessionStorage.removeItem('client');
    this.getClients();
  }
}

