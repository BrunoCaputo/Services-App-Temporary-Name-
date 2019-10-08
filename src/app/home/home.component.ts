import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeviceDetectorService } from 'ngx-device-detector';

import { AboutComponent } from '../about/about.component';
import { LicenseComponent } from '../license/license.component';
import { ConfirmAlertComponent } from './../confirm-alert/confirm-alert.component';

import { AuthenticationService } from '../core/authentication.service';

/**
 * Provides the base interface for the home screen, where all other components
 * are called.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isMobile: Boolean;

  /**
   * Default constructor.
   * @param auth - Instance of AuthenticationService.
   * @param dialog - Instance of MatDialog.
   * @param deviceService - Instance of DeviceDetectorService.
   */
  constructor(
    public auth: AuthenticationService,
    public dialog: MatDialog,
    private deviceService: DeviceDetectorService) {}

  /**
   * Called while the page is being loaded.
   */
  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }

  /**
   * Opens the about dialog.
   */
  openAboutDialog() {
    this.dialog.open(AboutComponent);
  }

  /**
   * Opens the license dialog.
   */
  openLicenseDialog() {
    this.dialog.open(LicenseComponent);
  }

  /**
   * Opens the delete account dialog.
   */
  openDeleteAccountDialog() {
    this.dialog.open(ConfirmAlertComponent, {
      role: 'alertdialog',
      data: {
        title: 'Você tem certeza que deseja apagar sua conta?',
        message: 'Todos os seus dados serão excluídos permanentemente.',
        actionName: 'Apagar',
        action: () => this.auth.deleteAccount()
      }
    });
  }
}
