import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyColumn } from 'src/app/components/shared/my-table/myColumn';
import { Client } from 'src/app/models/client';
import { Program } from 'src/app/models/program';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  public isLoading : boolean = true;
  public client !:Client; 
  public programs : Array<Program> = [];
  public columns : Array<MyColumn> = [
    {
      field:"title",
      header:"Titre",
    },
    {
      field:"numberOfSessions",
      header:"Nombre de séances",
    },
    {
      field:"lastDate",
      header:"Date de fin",
      format : (val:any) => {
        return  this.datePipe.transform((new Date(val)), 'dd/MM/yyyy');
      }
    }
  ]
  constructor(
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router : Router,
    private api : ApiCallService,
  ){

  }

  ngOnInit(){
   this.initData();
  }

  initData(){
    try {
      this.isLoading = true;
      const clientData = sessionStorage.getItem('client');
      if (clientData) {
        this.client = new Client(JSON.parse(clientData));
        this.getHistory(this.client.id);
      }
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération du client...' });
      this.goBackToProgram();
    }
  }

  private getHistory(clientId:number){
    this.api.getProgramHistory(clientId).subscribe((res)=>{
      if(res){
        this.programs = res.map((program:Program)=>new Program(program));
      }
      this.isLoading=false;
    })
  }

  public goBackToProgram(){
    this.router.navigate([`/private/program`])
  }

}
