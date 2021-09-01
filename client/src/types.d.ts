declare interface Condition {
  name: string;
  met: boolean;
}

declare type ConditionName = string;

declare interface Dialogue {
  name: string;
  character: string;
  dialogue: string;
  default: boolean;
}

declare interface DialogueResponse {
  name: string;
  parent: string;
  next: string;
  category: string;
  condition: ConditionName;
  dialogue: string;
}

declare interface Character {
  name: string;
  displayName: string;
  default: string;
}
