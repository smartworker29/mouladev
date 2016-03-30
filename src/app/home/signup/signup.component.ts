import {Location} from '@angular/common';
import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormsModule, AbstractControlDirective} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from 'app/auth/auth.service';
import {LoginService, TokenResponse} from 'app/auth/login.service';
import {SignupService} from 'app/auth/signup.service';
import UserProfileModel from 'app/core/models/UserProfileModel';

import {TermsOfUseContent} from '../terms-of-use/terms-of-use.component';
import {SignUpErros} from './form-errors';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    '../login/login.component.scss',
    './signup.component.portrait.css'
  ],
  providers: [SignupService, LoginService]
})
export class SignupComponent implements OnInit {
  @Input() title;

  private signupForm: FormGroup;
  popUpOptions: NgbModalOptions = {backdrop: false, windowClass: 'center-position', size: 'lg'};
  showOtpInput = false;

  messages: any;
  fields = null;
  constructor(
    private router: Router,
    private signupService: SignupService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private _location: Location,
    private modalService: NgbModal
  ) {
    this.signupForm = formBuilder.group({
      method: ['email', []],
      common: ['', []],
      email: ['', []],
      phone: ['', []],
      password: ['', []],
      otp: ['', []]
    });
  }
  ngOnInit() {
    this.messages = new SignUpErros;
    this.signupForm.valueChanges.subscribe((e) => {
      this.signupForm.controls['common'].setErrors(null);
    });
  }


  openPrivacyPolicyModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Privacy Policy';
  }

  openTermsOfUseModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Terms of Use';
  }

  get showJoinButton() {
    const method = this.signupForm.value.method;
    if (method === 'email') {
      return true;
    } else if (method === 'phone') {
      return this.showOtpInput;
    }
    return false;
  }

  removeErrors(value) {
    this.fields = [];
    Object.keys(this.signupForm.controls).forEach((control) => {
      this.signupForm.controls[control].setErrors(null);
    });
  }

  registerUser() {
    this.fields = this.signupForm.controls;
    if (this.signupForm.valid) {
      const method: string = this.signupForm.value.method;
      const email: string = this.signupForm.value.email;
      const phone: string = this.signupForm.value.phone;
      const password: string = this.signupForm.value.password;
      const otp: string = this.signupForm.value.otp;

      if (method === 'email') {
        this.signupService.signupWithEmail({email, password})
          .flatMap((response: UserProfileModel) => {
            return this.loginService.login({email, password});
          })
          .subscribe(this.onLogin, this.onLoginError);
      } else if (method === 'phone') {
        this.loginService.login({phone, password: otp})
          .subscribe(this.onLogin, this.onLoginError);
      }
    }
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      console.log(errorMsg);
      this.signupForm.controls[err] ? this.signupForm.controls[err].setErrors(newErr)
        : this.signupForm.controls['common'].setErrors(newErr);
    });
  }

  sendCode() {
    const phone: string = this.signupForm.value.phone;
    this.fields = {phone: this.signupForm.controls['phone']};
    if (!this.signupForm.controls['phone'].value) this.signupForm.controls['phone'].setErrors({required: true});
    this.signupService.signupWithPhone({phone})
      .subscribe(
        (response: any) => {
          console.log(response.token);
          this.showOtpInput = true;
        },
        (errorMsg: any) => {
          this.checkForErrors(errorMsg);
        }
      );
  }

  onLogin = (loginResponse: TokenResponse) => {
    this.authService.login(loginResponse.token);
    this.router.navigate(['/role']);
  }

  onLoginError = (errorMsg: any) => {
    console.log(errorMsg);
    this.checkForErrors(errorMsg);
  };

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
