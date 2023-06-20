import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TimeSlot } from 'src/app/models/timeslot';
import { ApiCallService } from 'src/app/services/api-call.service';
import { StaminaService } from 'src/app/services/stamina.service';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit {

  public timeslotForm: FormGroup = new FormGroup({
    startingDateTime: new FormControl<Date | null>(null,[Validators.required,this.validateStartingDateTime.bind(this)]),
    maxParticipants: new FormControl<number | null>(null, Validators.required),
    endDateTime: new FormControl<Date | null>(null, Validators.required),
    isCollective: new FormControl<boolean | null>(null, Validators.required),
    coachId: new FormControl<string | null>(null, Validators.required)
  });

  public types = [
    {
      label: 'Séance collective',
      value: true
    },
    {
      label: 'Séance privée ',
      value: false
    },
  ];
  public todayDate: Date = new Date(); // can't create a session in the past
  public defaultDate: Date = new Date();  // default time is today at 4pm
  public timeslotToUpdate !: TimeSlot ;
  public updateMode : boolean = false;
  constructor(
    public ref: DynamicDialogRef,
    private staminaService : StaminaService,
    public dialogConfig: DynamicDialogConfig,
    ){}
  ngOnInit() {
    this.defaultDate.setDate(this.todayDate.getDate() + 1);
    this.defaultDate.setHours(16, 0, 0, 0);
    this.initData();
  }
  
  private initData(){
    if(this.dialogConfig.data){
      this.updateMode = true;
      this.timeslotToUpdate = this.dialogConfig.data;
    }
    if(this.updateMode){
       this.timeslotForm.patchValue({
        'startingDateTime' : moment(this.timeslotToUpdate.startingDateTime).toDate(),
        'endDateTime' : moment(this.timeslotToUpdate.endDateTime).toDate(),
        'isCollective' : this.timeslotToUpdate.isCollective,
        'coachId': this.timeslotToUpdate.coach.id,
        'maxParticipants' : this.timeslotToUpdate.maxParticipants
      })
    
    }else{
      this.timeslotForm.patchValue({
        coachId:this.staminaService.publisherId
      }) 
    }
    console.log(this.defaultDate)
  }
   

  /**
   * When selecting the first dateTime, i'm setting by default the second 1 à start+1h 
   */
  public setDate(){
    const startingDateTime = this.timeslotForm.get('startingDateTime')?.value;
    if (startingDateTime) {
      const endDateTime = new Date(startingDateTime.getTime() + 60 * 60 * 1000); // + 1 hour
      this.timeslotForm.get('endDateTime')?.setValue(endDateTime);
    }
  }

  /**
   * VALIDATOR
   * @param control 
   * @returns 
   */
  private validateStartingDateTime(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate: Date = control.value;
    const today: Date = new Date();
  
    if (selectedDate < today) {
      return { 'invalidDate': true };
    }
  
    return null;
  }

}