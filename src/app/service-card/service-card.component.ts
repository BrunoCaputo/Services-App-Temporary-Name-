import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTooltip, MatDialog } from '@angular/material';

import { AngularFirestore } from '@angular/fire/firestore';

import { formatPhone } from '../core/global';

import { User } from '../utils/user';
import { Service } from '../utils/service';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';

enum ContactType {
  Email,
  Phone
}

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {
  @Input()
  user: User;

  @Input()
  service: Service;

  @Input()
  editable: Boolean;

  @ViewChild('emailTooltip', { static: false })
  emailTooltip: MatTooltip;
  
  @ViewChild('phoneTooltip', { static: false })
  phoneTooltip: MatTooltip;
  
  constructor(
    private angularDatabase: AngularFirestore,
    private dialog: MatDialog) {}

  ngOnInit() {}

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

  formattedPhone() {
    return formatPhone(this.service.phone);
  }

  showCopyContact(type: ContactType) {
    switch(type) {
      case ContactType.Email:
        this.emailTooltip.show();
        setTimeout(() => this.emailTooltip.hide(), 1500);

        break;
      case ContactType.Phone:
        this.phoneTooltip.show();
        setTimeout(() => this.phoneTooltip.hide(), 1500);

        break;
    }
  }
}