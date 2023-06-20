import { Coach } from "./Coach";

export class TimeSlot {
  id: number =0;
  startingDateTime!: Date;
  endDateTime!: Date;
  maxParticipants!: number;
  registeredAmount!: number;
  isCollective!: boolean;
  isActive!: boolean;
  coach!: Coach;
}