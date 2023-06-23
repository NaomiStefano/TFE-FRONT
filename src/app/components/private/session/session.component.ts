import { Component, OnInit } from '@angular/core';
import { MyButton } from 'src/app/models/button';
import { TimeSlot } from 'src/app/models/timeslot';
import { ApiCallService } from 'src/app/services/api-call.service';
import { Coach } from 'src/app/models/Coach';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SessionFormComponent } from './session-form/session-form.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit{

  public buttons : MyButton[] = [
    {
      text : 'Historique des séances',
      click:() => {
        this.pastSessionMode = true;
        this.getPastSess();
      }
    },
    {
      text : 'Ajouter une disponibilité',
      click:() => this.createSession() 
    }
  ];
  public upcomingTs : Array<TimeSlot> = [];
  public pastTs : Array<TimeSlot> = [];
  public isLoading : boolean = true; 
  public columns : Array<any> = [
    {
      field:"startingDateTime",
      header:"Début",
      format : (val:any) => {
        return  this.datePipe.transform((new Date(val)), 'dd/MM/yyyy HH:mm');
      }
     
    },
    {
      field:"endDateTime",
      header:"Heure de fin",
      format : (val:any) => {
        return  this.datePipe.transform((new Date(val)), 'dd/MM/yyyy HH:mm');

      }
    },
    {
      field:"isCollective",
      header:"Type de séance",
      format : (val:boolean) => {
        return val ? 'Collective' : 'Privée'
      }
    },
    {
      field:"maxParticipants",
      header:"Participants max",
      format : (val:number) => {
        return val
      }
    },
    {
      field:"coach",
      header:"Coach ",
      format : (val:Coach) => {
        return val.lastName + ' ' + val.firstName
      }
    },
  ]
  public pastSessionMode : boolean = false; 
  public selectedTimeslot !: TimeSlot ;
  public menuItem : MenuItem[] = [  
    // { 
    //   label: 'Voir les détails...',  // LATER
    //   icon: 'pi pi-fw pi-search', 
    //   command: () => alert("voir") 
    // },
    { 
      label: 'Modifier...', 
      icon: 'pi pi-fw pi-pencil', 
      command: () => this.updateSession(this.selectedTimeslot)
    },
    { 
      label: 'Supprimer', 
      icon: 'pi pi-fw pi-times', 
      command: () => this.deleteTimeslot(this.selectedTimeslot) 
    }
  ]
  constructor(
    private api : ApiCallService,
    private datePipe: DatePipe,
    private readonly router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

    ){

  }

  ngOnInit(): void {
    this.getIncomingSess();    
  }

  private getIncomingSess(){
    this.isLoading = true ; 
    this.upcomingTs = [];
    this.api.getAllUpcomingTimeslot().subscribe(
      (res:any)=>{
        if(res){
          console.log(res)
          this.upcomingTs = res; 
        }
        this.isLoading = false;
    })
  }

  private getPastSess(){
    this.pastTs = []
    this.isLoading = true ; 
    this.api.getAllPastTimeslot().subscribe(
      (res:any)=>{
        if(res){
          this.pastTs = res; 
        }
        this.isLoading = false;
    })
  }

  /**
   *Crete session
   */
  public createSession(){
    const dialog = this.dialogService.open(SessionFormComponent,{
      header:"Ajouter une disponibilité",
      width: "35vw"
    })
    dialog.onClose.subscribe(
      (session:TimeSlot)=>{
        if(session){
          this.api.postTimeslot(session)
            .subscribe({
              next: (res: any) => {
                 if(res){
                  this.getIncomingSess();
                  this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Création réussie !' });
                }
              },
              error: (error: any) => {
                const overLapping = error.error.toString().trim() === 'overlapping'
                  this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erreur', 
                    detail: overLapping ? 'Vous ne pouvez pas prévoir deux séances en même temps..':'Une erreur est survenue...' });
              }
            });
        }
      }
    )
  }

  
    /**
     * Update session
     * @param event session object
     */
  
    private updateSession(session:TimeSlot){
      if(this.pastSessionMode){
        this.messageService.add({ severity: 'info', summary: 'Action impossible', detail: 'Impossible de modifier une séance dans le passé' });
      }else{
        const dialog = this.dialogService.open(SessionFormComponent,{
          header:"Modifier une disponibilité",
          width: "35vw",
          data:session
        })
        dialog.onClose.subscribe(
          (value)=>{
            if(value){
              this.api.updateTimeslot(session.id,value)
                .subscribe((res:any)=>{
                  console.log(res)
                  this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie !' });
                  this.getIncomingSess();
              })
            }
          }
        )
      }
    }
    /**
     * Delete a session
     * @param session session to delete
     */
    private deleteTimeslot(session:TimeSlot){
    const date = moment(session.startingDateTime).toDate();
    const formattedDate = moment(date).locale('fr').format('DD MMMM YYYY [à] HH[h]mm');
      this.confirmationService.confirm({
        message: `Êtes-vous sûr de vouloir supprimer la séance du ${formattedDate}  ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteTimeslot(session.id).subscribe((res)=>{
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
            this.getIncomingSess();
          })
        }
    });
    }

    handleSelectedElement(event: TimeSlot) {
      this.selectedTimeslot = event;
      
    }
}
  

