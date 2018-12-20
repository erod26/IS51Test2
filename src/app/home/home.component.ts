import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //since the data is an object, you have to make it an empty array! Check below to see
  //how its treated! See the HTML to see how to send the data to its columns!

  data: object = {};
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      this.data = data;
      console.log('this.data', this.data)
    });
  }

}
