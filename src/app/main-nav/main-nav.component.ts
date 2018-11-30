import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit() {
  }

  //Created the buttons for going places.
  showAbout() {
    this.toastService.showToast('danger', 2000, "This application is designed by Eric Rodriguez. (C) 2018")
  }
  goHome() {
    this.router.navigate(['home']);
  }
  goTest() {
    this.router.navigate(['my-tests']);
  }
  goWhoa() {
    this.toastService.showToast('success', 1000, "Refreshing!");
  }




  
}
