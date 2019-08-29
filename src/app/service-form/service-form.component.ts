import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { switchMap, map } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Service } from '../utils/service';
import { AuthenticationService } from '../core/authentication.service';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  title: String;
  subtitle: String;
  serviceForm: FormGroup;

  phoneMask = [
    '(', /\d/, /\d/, ')', ' ',
    /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, /\d/, /\d/
  ];

  placeholderMask = '\u2000';

  userID: String;
  serviceID: String;
  
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    private angularDatabase: AngularFirestore,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.title = this.route.snapshot.data.title;
    this.subtitle = this.route.snapshot.data.subtitle;

    this.serviceForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]),
      useEmail: new FormControl(false)
    });
    
    this.auth.user.pipe(switchMap((user) => {
      this.userID = user.id;

      console.log(this.userID);

      return this.route.params.pipe(switchMap((params) => {
        this.serviceID = params.id;

        console.log(this.serviceID);

        return this.angularDatabase.doc<Service>(`users/${this.userID}/services/${this.serviceID}`).get();
      }));
    })).pipe(map((document) => {
        if (document.exists) {
          const data = document.data;
          console.log(data);

          const name = this.serviceForm.controls["name"] as FormControl;
          const description = this.serviceForm.controls["description"] as FormControl;
          const phone = this.serviceForm.controls["phone"] as FormControl;
          const useEmail = this.serviceForm.controls["useEmail"] as FormControl;

          name.setValue(data['name']);
          description.setValue(data['description']);
          phone.setValue(data['phone']);
          useEmail.setValue(data['useEmail']);
        }
        else {
          this.dialog.open(ErrorAlertComponent, {
            role: "alertdialog",
            data: {
              title: "Erro de acesso",
              message: "Ocorreu uma falha durante a tentativa de editar o serviço."
            }
          });
        }
    }));
  }

  ngOnDestroy() {}

  hasError = (controlName: string, errorName: string) => {
    return this.serviceForm.controls[controlName].hasError(errorName);
  }
  
  async addService(value) {
    if (this.serviceForm.valid) {
      this.location.back();
      
      if (this.serviceID == null)
        this.serviceID = this.angularDatabase.createId();
      
      const document: AngularFirestoreDocument<any> = this.angularDatabase
        .doc(`users/${this.userID}`)
        .collection("services")
        .doc(this.serviceID.toString());
      
      const service = new Service(
        this.serviceID,
        value.name,
        value.description,
        value.phone.replace(/[^0-9]/g, ''),
        value.useEmail,
        this.userID
      );

      document.set(service.getData(), { merge: true });
    }
    else {
      this.dialog.open(ErrorAlertComponent, {
        role: "alertdialog",
        data: {
          title: "Campos inválidos",
          message: "O formulário de serviço contem informações inválidas."
        }
      });
    }
  }

  onCancel() {
    this.location.back();
  }
}