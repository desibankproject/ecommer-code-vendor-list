import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  public signOut() {
    //make a google service call to update the active status and the date of exit
    sessionStorage.removeItem('currentUser');
    console.log("Logging out of website...");
    //change to navigating to successful sign out page
  }
}
