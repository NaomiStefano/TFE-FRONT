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
  public selectedClient !: Client ;
  public buttons : MyButton[] = [
    {
      text : 'Supprimer le coaché',
      click:() => this.deleteClient(this.selectedClient)
    },
    // {
    //   text : '  Programmations  ',
    //   click:() => alert("prooogra")
    // }
    
  ];
  public menuItem : MenuItem[] = [  
    { 
      label: 'Voir le profil...',  
      icon: 'pi pi-fw pi-search', 
      command: () => this.getClientDetails(this.selectedClient)
    },
    { 
      label: 'Supprimer', 
      icon: 'pi pi-fw pi-times', 
      command: () => this.deleteClient(this.selectedClient) 
    }
  ]
  public clientsMode : boolean = true ; // Am i watching the clients list ? 
  constructor(
    private api : ApiCallService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private dialogService : DialogService,
    private messageService: MessageService,
  ){

  }

  ngOnInit(): void {
  

    this.getClients();

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

  private getClientDetails(client:Client){
    this.clientsMode = false;
    // client.hasDistancial == false ? this.buttons.splice(1,1):null;
  }
  /**
   * Update a client
   */

  public updateClientGeneral(client:Client){
    localStorage.setItem('profile','true');
    localStorage.setItem('client',JSON.stringify(client))
    this.dialogService.open(SignupPageComponent,{
      header:"Modifier le profil du coaché ",
      width: "40%"
    }) 
  }

  /**
   * Delete a client 
   */

  private deleteClient(client:Client){
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
  }

  
  
  handleSelectedElement(event: Client) {
    console.log(event)
    this.selectedClient = event;
    
  }

  public backToList(){
    this.clientsMode = true;
    this.buttons = [];
    this.buttons = [
      {
        text : 'Supprimer le coaché',
        click:() => this.deleteClient(this.selectedClient)
      },
      // {
      //   text : '  Programmations  ',
      //   click:() => alert("prooogra")
      // }
      
    ];
  }
}

