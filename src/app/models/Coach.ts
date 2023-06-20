export class Coach{
    id: number = 0;
    lastName: string = "";
    firstName: string = "";
    login: string = "";
    password: string = "";
    birthDate!: Date;
    phoneNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    needAccessGym!: boolean;
    fullName? : string 
    constructor(data:any) {
        Object.assign(this, data)
        this.fullName = this.lastName +' ' + this.firstName
    }
}