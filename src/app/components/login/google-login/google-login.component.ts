import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  // FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angular-6-social-login-v2';
import { GoogleLoginService } from 'src/app/services/login/google-login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {

  constructor(private socialAuthService: AuthService, private googleLoginService: GoogleLoginService, private router: Router) { }
  ngOnInit() {
  }
  public socialSignIn(socialPlatform: string) {

    let socialPlatformProvider;
    // if(socialPlatform == "facebook"){
    //   socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    // }
    if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.googleLoginService.googleVerify(userData.idToken).subscribe(data => {
          // data will be the current token trying to log in
          //data3 will be the data from the database
          if (data.email_verified == "true") {
            console.log('Successful verification!');
            //When website is launched create different googleloginprovider code found in app.module
            //true validation validates the 'iss' and exp claims from the googletoken
            this.googleLoginService.checkDuplicate(data.email).subscribe(data3 => {
              if (data3 == null) { //then it is not in the database
                this.googleLoginService.googleSave(data).subscribe(data2 => {
                  if (data2.status == "success") {  }
                  sessionStorage.setItem('currentUser', JSON.stringify(data2));
                  this.router.navigate(['/user-dashboard']);
                  return data;
                });
              }//end if - for storing info not in database
              else {
                if (data3.status != "blocked") {//data3 is the data in the database
                  console.log("account already in database");
                  //session storing data will store the google token info
                  sessionStorage.setItem('currentUser', JSON.stringify(data3));
                  console.log('Logging in as: ' + data.email);
                  if(data3.role=='admin'){
                    this.router.navigate(['/admin-dashboard']);
                  }
                  if(data3.role=='user'){
                    this.router.navigate(['/user-dashboard']);
                  }
                  if(data3.role=='vendor'){
                    this.router.navigate(['/seller-dashboard']);
                  }
                } else {
                  alert("This account has been blocked....Please contact an admin at BigEnja@gmail.com");
                  this.router.navigate(['/index']);
                }
              }
              return data;
              //change to redirect to either admin, user or vendor dashboard
              //this.router.navigate(['/index']);
            });
          } else {
            console.log("Failed to verify");
          }
        });
      }
    );
  }//end of social sign in
  public socialSignOut() {
    //make a google service call to update the active status and the date of exit
    sessionStorage.removeItem('currentUser');
    console.log("Logging out of website...");
    //change to navigating to successful sign out page
    this.router.navigate(['/logout']);
  }

}
