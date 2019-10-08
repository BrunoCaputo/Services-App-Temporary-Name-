import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTooltip, MatDialog } from '@angular/material';

import { AngularFirestore } from '@angular/fire/firestore';

import { formatPhone } from '../core/global';

import { User } from '../utils/user';
import { Service } from '../utils/service';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';

/**
 * Represents the contact type being displayed on the card.
 */
enum ContactType {
  Email,
  Phone
}

/**
 * Cards that contain the informations about the services.
 */
@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {
  /**
   * Represents the user who has published the service.
   */
  @Input()
  user: User;

  /**
   * Represents the service that is being represented.
   */
  @Input()
  service: Service;

  /**
   * Represents whether the service is editable.
   */
  @Input()
  editable: Boolean;

  @ViewChild('emailTooltip', { static: false })
  emailTooltip: MatTooltip;

  @ViewChild('phoneTooltip', { static: false })
  phoneTooltip: MatTooltip;

  /**
   * Default constructor.
   * @param angularDatabase - Instance of AngularFirestore.
   * @param dialog - Instance of MatDialog.
   */
  constructor(
    private angularDatabase: AngularFirestore,
    private dialog: MatDialog) { }

  ngOnInit() { }

  /**
   * Invoked when the service is being deleted.
   */
  onDelete() {
    this.angularDatabase
      .doc(`users/${this.user.id}`)
      .collection("services")
      .doc(this.service.id.toString()).delete().catch(() => {
        this.dialog.open(ErrorAlertComponent, {
          role: "alertdialog",
          data: {
            title: "Erro de conexão",
            message: "Ocorreu uma falha durante a tentativa de apagar o serviço."
          }
        });
      });
  }

  /**
   * Returns the telephone number associated to this service as transformed by
   * the formatPhone button.
   */
  formattedPhone() {
    return formatPhone(this.service.phone);
  }

  /**
   * Copies the contact type to the clipboard.
   * @param type - Instance of ContactType.
   */
  showCopyContact(type: ContactType) {
    switch (type) {
      case ContactType.Email:
        this.emailTooltip.show();
        setTimeout(() => this.emailTooltip.hide(), 1500);

        window.open('mailto:' + this.user.email, '_self');

        break;
      case ContactType.Phone:
        this.phoneTooltip.show();
        setTimeout(() => this.phoneTooltip.hide(), 1500);

        window.open('tel:' + this.formattedPhone(), '_self');

        break;
    }
  }
}
