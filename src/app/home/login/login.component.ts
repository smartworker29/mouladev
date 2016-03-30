import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import {LoginService, TokenResponse} from 'app/auth/login.service';
import {LoginRequest} from 'app/auth/models/LoginRequest';
import {CommonResponse} from 'app/core/api/CommonResponse';
import {AuthService} from 'app/auth/auth.service';
import {SignupService} from 'app/auth/signup.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import {TermsOfUseContent} from '../terms-of-use/terms-of-use.component';
import {LoginErrors} from './form-errors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './login.component.portrait.css'
  ],
  providers: [LoginService, SignupService]
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private callback = false;
  popUpOptions: NgbModalOptions = {backdrop: false, windowClass: 'center-position', size: 'lg'};
  showOtpInput = false;

  messages: any;
  fields = null;
  @Input() title;
  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private signupService: SignupService,
    private modalService: NgbModal
  ) {
    this.loginForm = formBuilder.group({
      method: ['email', []],
      common: ['', []],
      email: ['', []],
      phone: ['', []],
      password: ['', []],
      otp: ['', []]
    });
  }

  ngOnInit() {
    this.messages = new LoginErrors();
    console.log(this.messages);
    this.route.queryParams.subscribe((params: Params) => {
      const token = params['token'];
      if (token) {
        this.authService.login(token);
        this.callback = true;
        this.getUserStatus();
      }
    });

    this.loginForm.valueChanges.subscribe((e) => {
      this.loginForm.controls['common'].setErrors(null);
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

  removeErrors() {
    this.fields = [];
    Object.keys(this.loginForm.controls).forEach((control) => {
      this.loginForm.controls[control].setErrors(null);
    });
  }


  get showLoginButton() {
    const method = this.loginForm.value.method;
    if (method === 'email') {
      return true;
    } else if (method === 'phone') {
      return this.showOtpInput;
    }
    return false;
  }

  loginUser() {
    this.fields = this.loginForm.controls;
      const data = this.loginForm.value;
      const loginData: LoginRequest =
        data.method === 'email' && {email: data.email, password: data.password} ||
        data.method === 'phone' && {phone: data.phone, password: data.otp};
    if (this.loginForm.valid) {
      this.loginService.login(loginData)
        .subscribe(
          (response: TokenResponse) => {
            console.log(response);
            this.authService.login(response.token);
            // TODO: get user info
            const user = {} as UserProfileModel;
            this.navigateToNext(user);
          },
          (errorMsg: any) => {
            this.checkForErrors(errorMsg);
          }
        );
    }
  }

  getUserStatus() {
    this.loginService.getLoginStatus().subscribe(
      (response: CommonResponse) => {
        console.log(response);
        if (response.success === true) {
          const user = response.data as UserProfileModel;
          this.navigateToNext(user);
          return;
        } else {
          const error = response.error;
          if (error.message !== undefined) {
            alert(error.message);
          }
        }
        this.callback = false;
      },
      (errorMsg: any) => {
        console.log(errorMsg);
        this.callback = false;
      }
    );
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.loginForm.controls[err] ? this.loginForm.controls[err].setErrors(newErr)
        : this.loginForm.controls['common'].setErrors(newErr);
    });
  }

  sendCode() {
    this.fields = {phone: this.loginForm.controls['phone']};
    if (!this.loginForm.controls['phone'].value) this.loginForm.controls['phone'].setErrors({required: true});
    const phone: string = this.loginForm.value.phone;
    this.signupService.signupWithPhone({phone})
      .subscribe(
        (response: any) => {
          console.log(response.token);
          this.showOtpInput = true;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
          this.checkForErrors(errorMsg);
        }
      );
  }

  navigateToNext(user: UserProfileModel) {
    this.roleService.getPrimaryRole()
      .subscribe((role: Roles) => {
        if (role) {
          this.roleService.setCurrentRole(role);
          this.router.navigate([this.roleService.getCurrentHome()]);
        } else {
          this.router.navigate(['/role']);
        }
      });
  }
}
