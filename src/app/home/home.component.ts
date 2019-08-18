import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AboutComponent } from '../about/about.component'
import { LicenseComponent } from '../license/license.component'
import { ConfirmAlertComponent } from './../confirm-alert/confirm-alert.component';

import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthenticationService, public dialog: MatDialog) {}

  ngOnInit() {}

  openAboutDialog() {
    this.dialog.open(AboutComponent);
  }

  openLicenseDialog() {
    this.dialog.open(LicenseComponent);
  }

  openDeleteAccountDialog() {
    this.dialog.open(ConfirmAlertComponent, {
      role: "alertdialog",
      data: {
        title: "Você tem certeza que deseja apagar sua conta?",
        message: "Todos os seus dados serão excluídos permanentemente.",
        actionName: "Apagar",
        action: () => this.auth.deleteAccount()
      }
    });
  }
}