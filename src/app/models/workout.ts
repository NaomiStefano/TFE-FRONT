import { Coach } from "./Coach";
import { Exercise } from "./exercise";
import { WorkoutExercises } from "./workoutExercise";

export class Workout{
    id: number = 0;
    title: string = "";
    isActive!: boolean;
    publisher!: Coach;
    publisherId!:number;
    exercises!: Exercise[];
    workoutExercises: Array<WorkoutExercises>=[];
    constructor(data:any) {
        Object.assign(this, data)
    }
}