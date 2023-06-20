import { UserType } from "./userType";

export class Client{
    id: number =0;
    lastName: string = "";
    firstName: string = "";
    login: string = "";
    password: string = "";
    birthDate!: Date;
    phoneNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    type!: UserType;
    profession?: string;
    medicalHistory?: string;
    physicalActivity?: string;
    numSessions?: number;
    hasKids?: boolean;
    maritalStatus?: string;
    initialMu?: string;
    initialPu?: string;
    initialDips?: string;
    initialSquat?: string;
    maxMu?: string;
    maxPu?: string;
    maxDips?: string;
    maxSquat?: string;
    hasDistancial?: boolean
    fullName : string 
    constructor(data:any) {
        Object.assign(this, data)
        this.hasDistancial = this.initialMu && this.initialDips && this.initialPu && this.initialSquat ? true : false ;
        this.fullName = this.lastName +' ' + this.firstName

    }
}