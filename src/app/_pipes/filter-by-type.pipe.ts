import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {
  transform(workoutExercises: any[], activeType: number): any[] {
    if (!workoutExercises || !activeType) {
      return [];
    }
    
    return workoutExercises.filter(exercise => exercise.typeId === activeType);
  }
}