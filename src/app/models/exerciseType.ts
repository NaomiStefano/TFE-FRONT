export class ExerciseType{
    id: number =0;
    title : string = "";
    isActive! : boolean ; 

    constructor(data?:any){
        Object.assign(this, data)
    }
}