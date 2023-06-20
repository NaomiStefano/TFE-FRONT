import { Component } from '@angular/core';
import { MyButton } from 'src/app/models/button';
import { MyColumn } from '../../shared/my-table/myColumn';
import { ApiCallService } from 'src/app/services/api-call.service';
import { Exercise } from 'src/app/models/exercise';
import { StaminaService } from 'src/app/services/stamina.service';
import { Coach } from 'src/app/models/Coach';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ExerciseType } from 'src/app/models/exerciseType';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent {
  
  public button : MyButton[] = [
    {
      text : 'Créer un nouvel exercice',
      click:() => this.createExercise()
    },
  ];
  public exercises : Array<Exercise> = [];
  public isLoading : boolean = true; 
  public columns : Array<MyColumn> = [
    {
      field:"title",
      header:"Titre",
    },
    {
      field:"url",
      header:"Vidéo ?",
      width:"15%",
      format : (val:string) => {
        return val ? `<i class="fa-solid fa-circle-check ml-2"></i>` : `<i class="fa-solid fa-xmark fa-xl" ></i>`
      }
    },
    {
      field:"description",
      width:"25%",
      header:"Description par défaut ? ",
      format : (val:string) => {
        return val ? `<i class="fa-solid fa-circle-check ml-3"></i>` : `<i class="fa-solid fa-xmark fa-xl"></i>`
      }
    },
    {
      field:"exerciseTypes",
      header:"Type(s)",
      format:(val:any)=>{
        return val.map((type: ExerciseType)=>type.title);
      }
    }
  ]
  public menuItem : MenuItem[] = [  
    // { 
    //   label: 'Voir les détails...',  // LATER
    //   icon: 'pi pi-fw pi-search', 
    //   command: () => alert("voir") 
    // },
    { 
      label: 'Modifier...', 
      icon: 'pi pi-fw pi-pencil', 
      command: () => this.updateExercise(this.selectedExercise)
    },
    { label: 'Supprimer', 
    icon: 'pi pi-fw pi-times', 
    command: () => this.deleteExercise(this.selectedExercise) }
  ]
  public selectedExercise !: Exercise ;
  public coaches : Array<Coach> = [];
  public selectedCoach! : Coach;
  constructor(
    private api : ApiCallService,
    public dataService : StaminaService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService

  ){

  }

  ngOnInit(): void {
    this.getCoaches();
    this.getExercises();
  }

  /**
   * Get all the exercises
   */
  public getExercises(coach?:any){
    this.exercises = [];
    this.isLoading = true ; 
    this.api.getAllExercises(coach && coach.value ? coach.value  : null,null ).subscribe(
      (res:any)=>{
        if(res){
          this.exercises = res; 
        }
        this.isLoading = false;
    })
  }
  /**
   * Get all coaches for the dropdown
   */
  getCoaches(){
    this.api.getAllCoaches().subscribe(
      (res:Array<Coach>)=>{
        this.coaches = res;
      }
    )
  }

  /**
   * Create exercicse 
   */
  createExercise(){
    const dialog = this.dialogService.open(ExerciseFormComponent,{
      header:"Créer un exercice",
      width: "40%"
    })
    dialog.onClose.subscribe(
      (value)=>{
        if(value){
          this.api.postExercise(value)
            .subscribe((res:any)=>{
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Création réussie !' });
              this.getExercises();
          })
        }
      }
    )
  }

  /**
   * Update exercise
   * @param event exercise object
   */

  private updateExercise(exercise:Exercise){
    const dialog = this.dialogService.open(ExerciseFormComponent,{
      header:"Modifier un exercice",
      width: "40%",
      data:exercise
    })
    dialog.onClose.subscribe(
      (value)=>{
        if(value){
          this.api.updateExercise(exercise.id,value)
            .subscribe((res:any)=>{
              console.log(res)
              this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie !' });
              this.getExercises();
          })
        }
      }
    )
  }
  /**
   * Delete an exercise
   * @param exercise Exercise to delete
   */
  private deleteExercise(exercise:Exercise){
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l\'exercice " ${exercise.title} " ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.api.deleteExercise(exercise.id).subscribe((res)=>{
          console.log(res)
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
        })
      }
  });
  }
  
  handleSelectedElement(event: Exercise) {
    this.selectedExercise = event;
    
  }
  
}

