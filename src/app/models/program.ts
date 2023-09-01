import { Session } from "./Session";

export class Program{
    id!: number ;
    title!: string;
    coachId!: number;
    clientId!: number;
    sessions: Array<Session> = [];
    numberOfSessions: number = 2;
    lastDate!:Date;

    constructor(data?:any) {
        Object.assign(this, data)
        if(data){
            this.lastDate = this.sessions[this.numberOfSessions-1].performanceDate;
        }
    }
}
