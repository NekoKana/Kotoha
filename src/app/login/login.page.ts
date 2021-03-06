import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['../login-common.scss'],
})

export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  result: boolean;

  postObj: any = {};

  constructor(
    private router: Router,
    public gs: GlobalService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.login(localStorage.email, localStorage.password);
  }

  ngOnDestroy() {
    if(!this.result){
      this.router.navigate(['/login']);
    }
  }

  navigate = () => this.login(this.email, this.password);

  navigateToSignup = () => this.safeNavigate(['signup']);

  login(email: string, password: string) {

    this.postObj['email'] = email;
    this.postObj['password'] = password;

    const body: any = this.postObj;

    // console.log(body);

    this.gs.http('/login.php', body).subscribe(
      res => {
        console.log(res);
        this.result = res['result'];

        if (this.result) {
          localStorage.email = email;
          localStorage.password = password;
          localStorage.user_id = res['user_id'];
          localStorage.family_id = res['family_id'];
          localStorage.user_name = res['user_name'];
          localStorage.first_name = res['first_name'];
          localStorage.last_name = res['last_name'];
          localStorage.birth = res['birth'];

          this.router.navigate(['/tabs', 'tab1']);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  safeNavigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }
}
