import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  MessageService } from 'primeng/api';
import { Session, SessionDetails } from 'src/app/models/Session';
import { Client } from 'src/app/models/client';
import { Program } from 'src/app/models/program';
import { ApiCallService } from 'src/app/services/api-call.service';
import { MyColumn } from '../../shared/my-table/myColumn';
import { MyButton } from 'src/app/models/button';
import { Workout } from 'src/app/models/workout';
import { catchError } from 'rxjs';
import { WorkoutExercises } from 'src/app/models/workoutExercise';
import { ExerciseType } from 'src/app/models/exerciseType';
import { Exercise } from 'src/app/models/exercise';
@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  public client : Client | null = null ; 
  public creationMode : boolean = false;
  public historyMode: boolean = false;
  public program : Program | any = null ; 
  public sessions : Array<Session>  = [];
  public isLoading : boolean = true; 
  public activeSessionNumber : number = 1;
  public currentSession: Session  = new Session();
  public sessionsAmount : number = 2;
  public workouts : Array<Workout> = [];
  public workoutExercises: any= [];
  public exerciseTypes : Array<ExerciseType> =[];
  public mainTitle : string = ""
  public steps : any = [];
  public activeStep : number = 0;
  public columns : Array<MyColumn> = [
    {
      field:"typeName",
      header:"Catégorie",
      
    },
    {
      field:"exerciseTitle",
      header:"Exercice",
    },
    {
      field:"reps",
      header:"Série(s)",
    },
    {
      field:"repUnit",
      header:"Répétition(ss)",
    },
    {
      field:"restSeconds",
      header:"Temps de repos",
      format:(value:number)=>{
        return `${value} s`
      }
    }
  ]
  public button : Array<MyButton> = [
    {
      text : 'Historique des programmations',
      click:() =>       this.router.navigate([`/private/program-history`])

    }
  ]
  public WorkoutExerciseTypes : Array<any> = [];

  constructor(
    private messageService: MessageService,
    private router : Router,
    private api : ApiCallService,
  ){

  }

  ngOnInit(){
   this.initData();
   this.getAllWorkouts();
   this.getAllExerciseTypes();
  }

  initData(){
    try {
      this.isLoading = true;
      const clientData = sessionStorage.getItem('client');
      if (clientData) {
        this.client = new Client(JSON.parse(clientData));
        this.mainTitle = `Programmation de ${this.client.fullName}`
        this.getCurrentProgram(this.client.id);
      }
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération du client...' });
      this.goBackToClient();
    }
  }


  /**
   * Returns either a program or null , so you have to create one
   */
  public getCurrentProgram(clientId:number){
    this.api.getClientCurrentProgram(clientId).subscribe((res)=>{
      if(res){
        this.creationMode= false;
        this.setActiveSession()
        this.program = new Program(res);
      }else{
        if(this.client){
          this.mainTitle = `Créer une programmation : ${this.client?.fullName}`
          this.program = new Program() 
          this.setSessionsArray(this.client.numSessions);
          this.creationMode=true;
        }
      }
      this.isLoading=false;
    })
  }

  /**
   * Method load on click on session
   */
  public setActiveSession(event?: any): void {
    if (event !== undefined) {
      this.activeSessionNumber = event;
    }
  
    let session = this.program?.sessions.find(
      (session:Session) => session.numOrder === this.activeSessionNumber
    ) ?? undefined;
    
    if(session){
      this.currentSession = new Session(session)
    }
  }
  
  /**
   * Create the sessions empty elements to navigate to 
   * @param numSessions 
   */
   public setSessionsArray(numSessions:number):any{
        this.program.numberOfSessions = numSessions;
      for(let i=1; i<=numSessions;i++){
        let session = {
          numOrder:i
        }
        this.program.sessions.push( new Session(session))
        this.setActiveSession()

      }
  }

  /**
   * Add a session page
   */
 public addSession(){
  if(this.program.numberOfSessions <7){
    this.program.numberOfSessions++
    this.program.sessions.push({
      numOrder:this.program.numberOfSessions
    })
  }
  }

  /**
   * Remove a session 
   * @param numOrder 
   */
  public removeSession(numOrder: number): void {
    if (this.program.numberOfSessions > 1) {
      const indexToRemove = this.program.sessions.findIndex((session: any) => session.numOrder === numOrder);
      if (indexToRemove !== -1) {
        this.program.sessions.splice(indexToRemove, 1);
        this.program.numberOfSessions--;
      }
      // reset numOrder after delete 
      this.program.sessions.forEach((session: any, index: number) => {
        session.numOrder = index + 1;
      });
    }
  }
  

  /**
   * Get all workouts
   */
  public getAllWorkouts() {
    this.api.getAllWorkouts().pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération des entraînements...' });
        return []; 
      })
    ).subscribe((res: any) => {
      if (res) {
        this.workouts = res.map((wk:Workout)=> new Workout(wk));
      }
    });
  }

  /**
   * Get all exercise types
   */

  public getAllExerciseTypes(){
    this.api.getAllExerciseTypes().pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la récupération des entraînements...' });
        return []; 
      })
    ).subscribe((res: any) => {
      if (res) {
        this.exerciseTypes = res.map((type:ExerciseType)=> new ExerciseType(type));
      }
    });
  }
  /**
   * Event triggered when change made on workoutDropdown
   */
  public selectWorkout(event:any){
    this.currentSession.workoutId= event.value;
    this.workoutExercises = this.workouts.filter(wk=>wk.id == event.value)[0].exercises;
    this.buildStepper();
  
  }

  /**
   * Build stepper based on selected Workout
   */

  private buildStepper(){
    this.steps=[];
    this.currentSession.sessionDetails = [];
    let i=0;

    this.exerciseTypes.forEach((type:ExerciseType) => {
      let index = this.workoutExercises.findIndex((ex:any)=>ex.typeId == type.id)
      if(index>=0){
        this.steps = [...this.steps,
          {
            label:type.title,
            id: JSON.stringify(type.id),
            command:(event:any)=>{
              this.setActiveIndex(event)
            },
            index: i
          }
        ]
        i++;
      }
    });
    
    this.currentSession.sessionDetails.push(new SessionDetails())
  }

  public setActiveIndex(event:any){
    this.activeStep = event.index
  }
  public  goBackToClient(){
    this.router.navigate([`/private/client`])
  }

}

