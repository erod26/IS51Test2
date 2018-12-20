import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  //Everything that is imported from above is made into an instance here
  //For example, since Router was imported, make a new instance of it!
  //let test of tests refers to test.id/firstName, and tests refers to the tests here below!
  tests: Array<ITest> = [];
  nameParams = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  //On traversing to this page. const ensures that data from local storage
  //is pulled from the cookie. 
  async ngOnInit() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      this.tests = tests;
    } else {
      this.tests = await this.loadGradesFromJson();
    }
  }

  //loading data from the file. Remember if you use async, you must have await in there......
  async loadGradesFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  //Adding, saving, and deleting tests
  addTest() {
    const testForm: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null,
    }
    //the command above calls ITest to create a form with empty fields. below
    //tells it to add it to the left. 
    this.tests.unshift(testForm);
    //the command below saves the addition to local storage. 
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }
  //Save the Test(s) added.
  saveTest() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
    this.toastService.showToast('success', 2000, 'Saved.')
  }
  //Delete the Tests(s) added.
  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveTest();
  }

  //get final grade
  compute() {
    if (this.nameParams == null || this.nameParams === '') {
      this.toastService.showToast('warning', 2000, 'Name must be defined!')
    } else if (this.nameParams.indexOf(', ') === -1) {
      this.toastService.showToast('warning', 2000, 'Name must have a comma!');
    }
     else {
      let pointsPossible = 0;
      let pointsReceived = 0;
      let percentage = 0.00;
      let grade = '';
      let firstName, lastName, indexOfComma, fullName;
      indexOfComma = this.nameParams.indexOf(', ');
      firstName = this.nameParams.slice(indexOfComma + 1, this.nameParams.length);
      lastName = this.nameParams.slice(0, indexOfComma);
      fullName = firstName + ' ' + lastName;
      for (let i = 0, len = this.tests.length; i < len; i++) {
        console.log('i---->', i, 'this.tests', 'this.tests[i]', this.tests[i]);
        const test = this.tests[i];
        pointsPossible += test.pointsPossible;
        pointsReceived += test.pointsReceived;
      }
      console.log('pointsPoss', pointsPossible, 'poinstRec', pointsReceived);
      //to.fixed makes the percentage go only up 2 decimal points. Recommended!
      percentage = pointsReceived / pointsPossible;
      grade = this.computeGrade(percentage * 100);
      console.log('percentage', percentage, 'grade', grade, 'first', firstName, 'last', lastName);
      this.router.navigate(['home', {
        pointsPossible: pointsPossible,
        pointsReceived: pointsReceived,
        percentage: percentage,
        fullName: fullName,
        grade: grade
      }]);
    }


  }

  //This was literally taken from the powerpoint Control Flow!
  computeGrade(percentage: number) {
    let grade = '';
    switch (true) {
      case percentage >= 90:
        grade = 'A';
        break;
      case percentage >= 80:
        grade = 'B';
        break;
      case percentage >= 70:
        grade = 'C';
        break;
      case percentage >= 60:
        grade = 'D';
        break;
      default:
        grade = 'F';
        break;
    }
    return grade;
  }
}
