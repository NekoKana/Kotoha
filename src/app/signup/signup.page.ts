import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['../login-common.scss'],
})
export class SignupPage implements OnInit {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_name: string;
  birth: string;
  family_id: string;

  result: boolean;

  postObj: any = {};

  constructor(
    private router: Router,
    public gs: GlobalService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  navigate = () => this.register();

  navigateToLogin = () => this.safeNavigate(['login']);

  safeNavigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  register() {
    this.postObj['email'] = this.email;
    this.postObj['password'] = this.password;
    this.postObj['first_name'] = this.first_name;
    this.postObj['last_name'] = this.last_name;
    this.postObj['user_name'] = this.user_name;

    if ((this.family_id != null) && (this.family_id != "")) {
      this.postObj['has_family_id'] = true;
      this.postObj['family_id'] = this.family_id;
    } else {
      this.postObj['has_family_id'] = false;
    }

    const birth: Date = new Date(this.birth);
    const year: number = birth.getFullYear();
    const date: number = birth.getDate();
    const month: number = birth.getMonth() + 1;
    this.postObj['birth'] = year.toString() + '-' + date.toString() + '-' + month.toString();

    const body: any = this.postObj;

    // console.log(body);

    this.gs.http('/sign_up.php', body).subscribe(
      res => {
        console.log(res);
        this.result = res['result'];

        if (this.result) {
          localStorage.email = this.email;
          localStorage.password = this.password;
          localStorage.user_id = res['user_id'];
          localStorage.family_id = res['family_id'];
          localStorage.user_name = this.user_name;
          localStorage.first_name = this.first_name;
          localStorage.last_name = this.last_name;
          localStorage.birth = this.birth;

          this.router.navigate(['/tabs', 'tab1']);
        }
      },
      error => {
        console.error(error);
      }
    );
  }
}
