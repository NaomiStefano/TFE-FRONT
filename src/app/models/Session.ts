export class Session{

    id!: number;
    title!: string;
    numOrder!: number;
    workoutId!: number;
    sessionDetails!: Array<SessionDetails>;
    isMade!:boolean;
    performanceDate!: Date;
    testingMax !: boolean ;
    constructor(data?:any) {
        Object.assign(this, data)
        if(data){
            this.sessionDetails = this.sessionDetails?.map((details)=>new SessionDetails(details));
        }
    }
}

export class SessionDetails{

    reps: string = "";
    repUnit: string = "";
    coachComment:string = "";
    sets: number|string = 0;
    restSeconds:number =0;
    exercise! :{id:number,title:string};
    type!: {id:number,title:string};
    exerciseId: number = 0;
    typeId:number=0;
    exerciseTitle!: string;
    typeName!:string;
    constructor(data?:any) {
        Object.assign(this, data)
        if(data){
            this.exerciseTitle = this.exercise.title;
            this.typeName = this.type.title;
        }
    }
}
