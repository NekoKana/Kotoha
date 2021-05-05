import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  email: string = localStorage.email;
  user_id: string = localStorage.user_id;
  user_name: string = localStorage.user_name;
  first_name: string = localStorage.first_name;
  last_name: string = localStorage.last_name;
  birth: string = localStorage.birth;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.email == null) {
      this.router.navigate(['login']);
    }
  }
  
}
