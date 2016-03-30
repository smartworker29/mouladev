import {CommonErrors} from 'app/elements/validation/form-errors';

export class SignUpErros extends CommonErrors {
  email = 'This email has already been registered.';
  non_field_errors = 'Unable to log in with provided credentials.';
  constructor(){
    super(name);
  }
}
