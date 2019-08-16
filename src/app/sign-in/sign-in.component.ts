import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { LicenseComponent } from '../license/license.component'

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  googleIcon = faGoogle;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog() {
    this.dialog.open(LicenseComponent);
  }
}