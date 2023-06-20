import { Coach } from "./Coach";
import { Exercise } from "./exercise";

export class Workout{
    id: number = 0;
    title: string = "";
    isActive!: boolean;
    publisher!: Coach;
    publisherId!:number;
    exercises!: Exercise[];
}