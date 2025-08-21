import { FormControl } from '@angular/forms';

export interface NewSessionForm {
  nameSession: FormControl<string | null>;
  userName: FormControl<string>;
}
