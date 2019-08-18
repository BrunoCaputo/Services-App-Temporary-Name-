import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ConfirmAlertData {
  title: String;
  message: String;
  actionName: String;
  action: Function;
}

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmAlertData) {}

  ngOnInit() {}
}