import { Coach } from "./Coach";
import { ExerciseType } from "./exerciseType";

export class Exercise{
        id: number = 0;
        title: string = "";
        url?: string;
        description?: string;
        isActive!: boolean;
        exerciseTypes!: ExerciseType[];
        publisher!: Coach;

}
