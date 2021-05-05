import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  email: string;
  user_id: string;
  user_name: string;
  family_id: string;
  name : string;
  birth: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.email == null) {
      this.router.navigate(['login']);
    } else {
      this.email = localStorage.email;
      this.user_id = localStorage.user_id;
      this.user_name = localStorage.user_name;
      this.family_id = localStorage.family_id;
      this.name = localStorage.last_name + ' ' + localStorage.first_name;
      this.birth = localStorage.birth;
    }
  }
  
}
