import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise';
import { TimeSlot } from '../models/timeslot';
import { Coach } from '../models/Coach';
import { LoginData } from '../models/loginData';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  private baseUrl : string = "https://localhost:7101/api/v1/"
  constructor(
    private http: HttpClient
  ) { }


  // ME 

  public checkLoginCoach(data:LoginData):Observable<any>{
    data.type = "Coach";
    return this.http.post<any[]>(`${this.baseUrl}Me`,data);}

  // COACH

  public getAllCoaches(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}Coaches`);
  }

  public postCoach(data:Coach):Observable<any>{
    return this.http.post<any[]>(`${this.baseUrl}Coaches`,data);}




  // EXERCISE 
  public getAllExerciseTypes() :Observable<any>{
      return this.http.get<any>(`${this.baseUrl}Exercises/types`);
  }
  public postExercise(data:Exercise):Observable<any>{
    return this.http.post<any[]>(`${this.baseUrl}Exercises`,data);}
  
  public getAllExercises(coachId?: number|null, exerciseTypeId?:number|null): Observable<any> {
    let params = new HttpParams();
      if (coachId ) {
        params = params.set('publisherId', coachId);
      }
      if(exerciseTypeId){
        params = params.set('exerciseTypeId',exerciseTypeId);
      }
      return this.http.get<any>(`${this.baseUrl}Exercises`, { params });
    }
  
  public updateExercise(exerciseId : number, exercise:Exercise){
    return this.http.put<any>(`${this.baseUrl}Exercises/${exerciseId}`, exercise);

  }

  public deleteExercise(id: number){
    return this.http.delete<any[]>(`${this.baseUrl}Exercises/${id}`);}


    // TIMESLOT SESSIONS

    
  public getAllUpcomingTimeslot(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}Timeslots/upcoming`);
  }
  public getAllPastTimeslot(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}Timeslots/past`);
  }

  public postTimeslot(data:TimeSlot):Observable<any>{
    return this.http.post<any[]>(`${this.baseUrl}Timeslots`,data);}
    
  public updateTimeslot(timeslotId : number, exercise:Exercise){
    return this.http.put<any>(`${this.baseUrl}Timeslots/${timeslotId}`, exercise);

  }
  public deleteTimeslot(timeslotId: number){
    return this.http.delete<any[]>(`${this.baseUrl}Timeslots/${timeslotId}`);}
  

    // WORKOUTSS

    public getAllWorkouts(coachId?:string): Observable<any>{
      let params = new HttpParams();
      if (coachId) {
        params = params.set('publisherId', coachId);
      }
      return this.http.get<any>(`${this.baseUrl}Workouts`,{params});
    }
    public postWorkout(data:any):Observable<any>{
      return this.http.post<any[]>(`${this.baseUrl}Workouts`,data);}
    public updateWorkout(id:number, data:any):Observable<any>{
        return this.http.put<any[]>(`${this.baseUrl}Workouts/${id}`,data);}
    public deleteWorkout(workoutId: number){
      return this.http.delete<any[]>(`${this.baseUrl}Workouts/${workoutId}`);}
    
    /// CLIENTS 

    public getAllClients(): Observable<any>{
      return this.http.get<any>(`${this.baseUrl}Clients`);
    }
      
    public deleteClient(clientId: number){
      return this.http.delete<any[]>(`${this.baseUrl}Clients/${clientId}`);}
    
}