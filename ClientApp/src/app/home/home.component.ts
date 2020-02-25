import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { MatTableDataSource } from '@angular/material';
import { Homeservice } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  is1time = true;
  isAddEmp = false;
  isUpdateEmp = false;
  isLogIn = false;
  username: string = '';
  password: string = '';
  sub: Subscription[] = [];
  Fname = '';
  Lname = '';
  Email = '';
  BDate = '';
  uid = '';
  displayedEmps = [
    'firstname',
    'lastname',
    'birthday',
    'email',
    '_id',
  ];
  emps = new MatTableDataSource();
  resultValue: any;
  constructor(private homeService: Homeservice) { }

  ngOnInit() {
    this.loginClick();
  }
  getEmp() {
    this.sub.push(this.homeService.getEmpList(this.username, this.password).subscribe(
      (result) => {
        this.resultValue = result;
        this.emps = new MatTableDataSource(this.resultValue);
      }));
  }
  addUpdateEmp() {
    const authorization = this.username + ':' + this.password;
    if (this.isAddEmp) {
      if (this.Fname === '' || this.Lname === '' || this.Email === '' || this.BDate === '') {
        alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      } else {
        const settings = {
          'url': 'https://dummy-api.cm.edu/employees',
          'method': 'POST',
          'timeout': 0,
          'headers': {
            'Content-Type': 'application/json'
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(authorization));
          },
          // 'data': JSON.stringify({ 'firstname': 'Chatdanai', 'lastname': 'Tongsin', 'birthday': '1993-07-21', 'email': 'TChatdanai@gmail.com' }),
          'data': JSON.stringify({ 'firstname': this.Fname, 'lastname': this.Lname, 'birthday': this.BDate, 'email': this.Email }),
        };
        // '1993-07-21'
        $.ajax(settings).done(function (response) {
          window.location.reload();
        });
      }
    } else if (this.isUpdateEmp) {
      const settings = {
        'url': 'https://dummy-api.cm.edu/employees/' + this.uid,
        'method': 'PUT',
        'timeout': 0,
        'headers': {
          'Content-Type': 'application/json'
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + btoa(authorization));
        },
        'data': JSON.stringify({ 'firstname': this.Fname, 'lastname': this.Lname, 'birthday': '1999-07-21', 'email': this.Email }),
      };
      $.ajax(settings).done(function (response) {
        window.location.reload();
      });
    }

  }
  deleteEmp(value: any) {
    const authorization = this.username + ':' + this.password;
    const settings = {
      'url': 'https://dummy-api.cm.edu/employees/' + value._id,
      'method': 'DELETE',
      'timeout': 0,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(authorization));
      },
    };

    $.ajax(settings).done(function (response) {
      window.location.reload();
    });
  }
  updateEmpClick(value: any) {
    this.uid = value._id;
    this.Fname = value.firstname;
    this.Lname = value.lastname;
    this.BDate = value.birthday;
    this.Email = value.email;
    this.isUpdateEmp = !this.isUpdateEmp;
  }
  addEmpClick() {
    this.isAddEmp = true;
  }
  cancelClick() {
    this.isAddEmp = false;
    this.isUpdateEmp = false;
    this.Fname = '';
    this.Lname = '';
    this.BDate = '';
    this.Email = '';
    this.uid = '';
  }
  loginClick() {
    const userLocal = localStorage.getItem('username');
    const passwordLocal = localStorage.getItem('password');
    console.log(userLocal);
    console.log(passwordLocal);
    if (userLocal !== null && passwordLocal !== null) {
      this.homeService.login(userLocal, passwordLocal).subscribe((result) => {
        this.isLogIn = true;
        this.username = userLocal;
        this.password = passwordLocal;
        this.getEmp();
      },
        (err) => { alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); });
    } else {
      if (this.username.trim() === '' || this.password.trim() === '') {
        if (this.is1time) {

        } else {
          alert('กรุณากรอกชื่อผผู้ใช้เเละรหัสผ่านให้ครบ');
        }

      } else {
        this.homeService.login(this.username, this.password).subscribe((result) => {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
          this.isLogIn = true;
          this.getEmp();
        },
          (err) => { alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); });
      }
    }

  }
  logoutClick() {
    this.username = '';
    this.password = '';
    localStorage.clear();
    this.isLogIn = false;
    this.ngOnInit();
  }
}
