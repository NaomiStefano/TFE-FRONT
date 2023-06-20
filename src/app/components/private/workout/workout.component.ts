import { Component } from '@angular/core';
import { MyButton } from 'src/app/models/button';
import { Workout } from 'src/app/models/workout';
import { MyColumn } from '../../shared/my-table/myColumn';
import { Exercise } from 'src/app/models/exercise';
import { ApiCallService } from 'src/app/services/api-call.service';
import { Coach } from 'src/app/models/Coach';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ExerciseType } from 'src/app/models/exerciseType';
import { WorkoutExercises } from 'src/app/models/workoutExercise';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss']
})
export class WorkoutComponent {
  public workoutsMode : boolean = true;
  public button : MyButton[] = [
    {
      text : 'Créer un nouvel entrainement',
      click:() => this.goToCreationMode()
    }
  ];
  public creationButton : MyButton[] = [
    {
      text : 'Enregistrer entrainement',
      click:() => this.updateMode ? this.updateWorkout() : this.createWorkout()
      }
  ];
  public workouts : Array<Workout> = [];
  public isLoading : boolean = true; 
  public columns : Array<MyColumn> = [
       {
      field:"title",
      header:"Titre de l'entrainement",
      format : (val:string) => {
        return val;
      }
    },
    {
      field: "exercises",
      header: "Exercices contenus",
      format: (val: Array<Exercise>) => {
        const uniqueTitles = new Set<string>();
        val.forEach((exercise) => uniqueTitles.add(exercise.title));
        return Array.from(uniqueTitles).join(', ');
      }
    }    
  ]
  public selectedCoach! : Coach;
  public coaches : Array<Coach> = [];
  public selectedWorkout !: Workout ;
  public menuItem : MenuItem[] = [  
    // { 
    //   label: 'Voir les détails...',  // LATER
    //   icon: 'pi pi-fw pi-search', 
    //   command: () => alert("voir") 
    // },
    { 
      label: 'Modifier...', 
      icon: 'pi pi-fw pi-pencil', 
      command: () => this.goToUpdateMode()
    },
    { 
      label: 'Supprimer', 
      icon: 'pi pi-fw pi-times', 
      command: () => this.deleteWorkout(this.selectedWorkout) 
    }
  ]
  public workoutTitle :string = "";
  public updateMode : boolean = false;
  public showExerciseSideBar : boolean = false;
  public types !: Array<ExerciseType> ;
  public selectedType !: ExerciseType ;
  public exercises : Array<Exercise> = [];
  public workoutExercises : Array<WorkoutExercises> = [];
  public selectedCategory : number = 0;
  public tooltipOptions  = {
    showDelay: 150,
    autoHide: false,
    tooltipEvent: 'hover',
    tooltipPosition: 'right'
  }
  constructor(
    private api : ApiCallService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private staminaService: StaminaService

  ){
  }
  ngOnInit(): void {
    this.getCoaches();
    this.getWorkouts();
    this.getExerciseTypes();
     this.getAllExercises();
  }

  /**
   * Load all workouts
   * @param coach filter by coach
   */
  public getWorkouts(coach?:any){
    this.workouts = [];
    this.isLoading = true ; 
    this.api.getAllWorkouts(coach && coach.workoutTitle ? coach.workoutTitle : null ).subscribe(
      (res:any)=>{
        if(res){
          this.workouts = res; 
        }
        this.isLoading = false;
    })
  }

  /**
   * Load coaches to fill the dropdown filter
   */
  getCoaches(){
    this.api.getAllCoaches().subscribe(
      (res:Array<Coach>)=>{
        this.coaches = res;
      }
    )
  }

  /**
   * Get all exercises
   *    
   * */

  public getAllExercises(event?:any){
    this.exercises = [];
    this.api.getAllExercises(null,event? event.value:null).subscribe(
      (res:any)=>{
        if(res){
          this.exercises = res.sort((a: any, b: any) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        }
    })  
  }
  /**
  Get all exercise Type for the menu
  */
  public getExerciseTypes(){
    this.types = [];
    this.api.getAllExerciseTypes().subscribe(
      (res:Array<ExerciseType>)=>{
        if(res){
          this.types = res ; 
          this.selectedCategory = res[0].id;
        }
      }
    )
  }
  /**
   * When clicking on create workout, switch to a creation Mode 
   */

  public goToCreationMode(){
    this.workoutsMode = false;
  }

  public goToUpdateMode(){
    this.workoutExercises = [];

    this.updateMode = true; 
    this.workoutsMode = false;

    this.workoutTitle = this.selectedWorkout.title;
    this.updateMode = true; 
    this.workoutsMode = false;
  
    this.workoutTitle = this.selectedWorkout.title;
    console.log(this.selectedWorkout);
  

    this.selectedWorkout.exercises.forEach((exerciseObj:any) => {
      const typeId = exerciseObj.typeId;
      const exerciseId = exerciseObj.exerciseId;
  
      const exercise = this.exercises.find((ex) => ex.id === exerciseId);
      if (exercise) {
        let workoutExercise = this.workoutExercises.find((we) => we.typeId === typeId);
        if (!workoutExercise) {
          workoutExercise = {
            typeId: typeId,
            exercises: []
          };
          this.workoutExercises.push(workoutExercise);
        }
        
        // Add the exercise to the workoutExercise
        workoutExercise.exercises.push(exercise);
      }
    });  }

  public goBackToList(){
    this.workoutsMode = true;
    this.updateMode = false;
    this.workoutTitle = "";
    this.workoutExercises = [];
    this.getWorkouts();

  }
  /**
   * Create a Workout 
   */
  public createWorkout(){
    if(this.workoutTitle.length <2){
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez donner un titre à l\'entrainement.' });
    } else if (this.workoutExercises.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez ajouter au moins un exercice à l\'entrainement.' });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Patience...', detail: 'Ajout en cours...' });

      let object: any = {
        Title: this.workoutTitle,
        PublisherId: this.staminaService.publisherId,
        Exercises: []
      };
      
      this.workoutExercises.forEach((workoutExercise) => {
        const typeId = workoutExercise.typeId;
        workoutExercise.exercises.forEach((exercise) => {
          const exerciseId = exercise.id;
          object.Exercises.push({ ExerciseId: exerciseId, TypeId: typeId });
        });
      });
      
      this.api.postWorkout(object).subscribe((res:any)=>{
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
          this.goBackToList();
        }
      })
      console.log(object)
    }
  }
  /**
   * Update a workout 
   */
  private updateWorkout() {
    let updatedWorkout: any = {
      id: this.selectedWorkout.id,
      Title: this.workoutTitle,
      PublisherId: this.selectedWorkout.publisherId,
      Exercises: []
    };
    
    this.workoutExercises.forEach((workoutExercise) => {
      const typeId = workoutExercise.typeId;
      workoutExercise.exercises.forEach((exercise) => {
        const exerciseId = exercise.id;
        updatedWorkout.Exercises.push({ ExerciseId: exerciseId, TypeId: typeId });
      });
    });
  
    this.api.updateWorkout(updatedWorkout.id, updatedWorkout).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie !' });
      this.selectedWorkout = updatedWorkout; // Update the selectedWorkout with the modified data
      this.goBackToList();
    });
  }
  /**
   * Delete a workout
   */
  private deleteWorkout(workout:Workout){
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'entrainement  " ${workout.title} "  ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteWorkout(workout.id).subscribe((res)=>{
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Suppression réussie !' });
          this.getWorkouts();
        })
      }
  });
  }

  /**
   * Add exercise to Workout 
   */
  addExerciseToWorkout(typeId: number, exercise: Exercise) {
    if(this.workoutExercises.length>0){
        const existingWorkoutExercise = this.workoutExercises.find(
            (workoutExercise) => workoutExercise.typeId === typeId
          );
        
          if (existingWorkoutExercise) {
            const exerciseExists = existingWorkoutExercise.exercises.some(
              (existingExercise) => existingExercise.id === exercise.id
            );
        
            if (!exerciseExists) {
              existingWorkoutExercise.exercises.push(exercise);
            }
          } else {

            const newWorkoutExercise: WorkoutExercises = {
              typeId: typeId,
              exercises: [exercise]
            };
            this.workoutExercises.push(newWorkoutExercise);
          }
    } else{
      const newWorkoutExercise: WorkoutExercises = {
              typeId: typeId,
              exercises: [exercise]
            };
      this.workoutExercises = [newWorkoutExercise];
    }
  } 
  
  

  removeExerciseFromWorkout(typeId: number, exerciseId: number): void {
    const existingWorkoutExercise = this.workoutExercises.find(
      (workoutExercise) => workoutExercise.typeId === typeId
    );
  
    if (existingWorkoutExercise) {
      existingWorkoutExercise.exercises = existingWorkoutExercise.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      );
    }
  }
  

  
  handleSelectedElement(event: Workout) {
    this.selectedWorkout = event;
    
  }

  onTabChange(event: any): void {
    // Handle tab change event
    console.log('Tab change event:', event);
    // Access the selected tab index: event.index
    // Access the original browser event: event.originalEvent
  }

  onActiveIndexChange(newActiveIndex: number): void {
    if (newActiveIndex >= 0 && newActiveIndex < this.types.length) {
      const selectedType = this.types[newActiveIndex];
      this.selectedCategory = selectedType.id;
    }
  }
}
