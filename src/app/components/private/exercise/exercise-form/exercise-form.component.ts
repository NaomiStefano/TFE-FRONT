import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseType } from 'src/app/models/exerciseType';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss']
})
export class ExerciseFormComponent implements OnInit{
  public exerciseToUpdate !: Exercise ;
  public updateMode : boolean = false;
  public exerciseForm: FormGroup = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    url: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    publisherId: new FormControl<string | null>(null, Validators.required),
    exerciseTypeIds: new FormControl<Array<number> | null>(null, Validators.required)
  });
  public loading : boolean = true; 
  public types: Array<ExerciseType> = [];
  public exerciseIds: Array<number>|number = [];

  constructor(
    private api : ApiCallService,
    public ref: DynamicDialogRef,
    private staminaService : StaminaService,
    public dialogConfig: DynamicDialogConfig,
    ){}

  ngOnInit(): void {
      
      this.initData();
  }


  private initData(){
    if(this.dialogConfig.data){
      this.updateMode = true;
      this.exerciseToUpdate = this.dialogConfig.data;
      this.exerciseIds = this.exerciseToUpdate.exerciseTypes.map((type: ExerciseType)=>type.id)
    }

    this.api.getAllExerciseTypes().subscribe(
      (res:Array<ExerciseType>)=>{
        if(res){
          this.types = res ; 
        }
        this.loading = false;
      }
    )
    if(this.updateMode){
      this.exerciseForm.patchValue(this.exerciseToUpdate);
      this.exerciseForm.patchValue({
        title: this.exerciseToUpdate.title,
        url:this.exerciseToUpdate.url ,
        description:this.exerciseToUpdate.description ,
        publisherId: this.exerciseToUpdate.publisher.id,
        exerciseTypeIds: this.exerciseIds
      });
    }else{
      this.exerciseForm.patchValue({
        publisherId:this.staminaService.publisherId
      })
    }
  }

}
