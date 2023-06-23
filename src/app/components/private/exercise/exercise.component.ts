import { ChangeDetectorRef, Component } from '@angular/core';
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
  public isModalOpen: boolean = false;
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
    { 
      label: 'Voir les détails...',  // LATER
      icon: 'pi pi-fw pi-search', 
      command: () => this.seeExercise(this.selectedExercise) 
    },
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
  public result: any = {};
  public previousPageNumber !: number;
   
  constructor(
    private api : ApiCallService,
    public dataService : StaminaService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef


  ){

  }

  ngOnInit(): void {
    this.result.pageSize=2;
    this.result.pageNumber=1;
    this.result.totalCount = 0;
    this.getCoaches();
    this.getExercises();
  }

  onLazyLoad(event: any) {
      this.result.pageNumber = event;
      this.getExercises(this.selectedCoach ? this.selectedCoach : null);
    
  }
  
  public getExercises(coach?: any) {
    
    if (this.result.pageNumber !== this.previousPageNumber || coach) {
      this.exercises = []; 
      this.isLoading = true;

            this.api.getAllExercises(coach && coach.value ? coach.value : null,null,this.result.pageSize,this.result.pageNumber)
              .subscribe((res: any) => {
                if (res) {
                  console.log(res);
                  this.exercises = res.results;
                  this.result.pageSize = res.pageSize;
                  this.result.pageNumber = res.pageNumber;
                  this.previousPageNumber = this.result.pageNumber;
                  this.result.totalCount = res.totalCount;
                }
                this.isLoading = false;
                this.cdr.detectChanges();              
              });
        
    }
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
      (value: any) => {
        if (value) {
          this.api.postExercise(value)
            .subscribe({
              next: (res: any) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Création réussie !' });
                this.getExercises();
              },
              error: (error: any) => {
                const notunique = error.error.toString().trim() === 'UniqueTitle';
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: notunique ? 'Un exercice à ce nom existe déjà' : 'Une erreur est survenue...'
                });
              }
            });
        }
      })   
  }

  /**
   * Update exercise
   * @param event exercise object
   */

  private updateExercise(exercise:Exercise){
    const dialog = this.dialogService.open(ExerciseFormComponent,{
      header:"Modifier un exercice",
      width: "40%",
      data:{
        exercise: exercise,
        read:false
      }
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
   * See exercise details
   */
  private seeExercise(exercise:Exercise){
     this.dialogService.open(ExerciseFormComponent,{
      header:'Consulter détails de l\'exercice ' + exercise.title,
      width: "40%",
      data:{
       exercise: exercise,
       read: true
      }
    })
    
  }

  /**
   * Delete an exercise
   * @param exercise Exercise to delete
   */
  private deleteExercise(exercise: Exercise) {
    if(this.isModalOpen==false){
      this.isModalOpen = true;
      this.confirmationService.confirm({
        message: `Êtes-vous sûr de vouloir supprimer l'exercice "${exercise.title}" ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteExercise(exercise.id)
            .subscribe({
              next: (res: any) => {
                console.log(res);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
                this.isModalOpen=false;
              },
              error: (error: any) => {
                this.isModalOpen=false;
                const isUsed = error.error.toString().trim() === 'ExerciseUsed';
                this.messageService.add({ severity: 'error', summary: 'Suppression impossible', detail: isUsed ? 'Cet exercice est utilisé dans un ou plusieurs entrainements...': 'Une erreur est survenue lors de la suppression.' });
            
              }
            });
        }
      });
    }
   
  }
  
  
  handleSelectedElement(event: Exercise) {
    this.selectedExercise = event;
    
  }
  
}

