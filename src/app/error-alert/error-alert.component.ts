import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ErrorAlertData {
  title: String;
  message: String;
}

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorAlertData) {}

  ngOnInit() {}
}