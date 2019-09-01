import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { of, Subscription, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  serviceSubscription: Subscription;

  isLoading: Observable<Boolean>;
  
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    private angularDatabase: AngularFirestore,
    public dialog: MatDialog) { }

  private formattedPhone(phone) {
    return `(${ phone.substr(0, 2) }) ${ phone.substr(2, 5) }-${ phone.substr(7, 4) }`;
  }

  private unformattedPhone(phone) {
    return phone.replace(/[^0-9]/g, '');
  }

  ngOnInit() {
    this.isLoading = of(true);

    this.title = this.route.snapshot.data.title;
    this.subtitle = this.route.snapshot.data.subtitle;

    this.serviceForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]),
      useEmail: new FormControl(false)
    });

    this.serviceSubscription = this.auth.user.pipe(switchMap((user) => {
      this.userID = user.id;
      
      return this.route.params.pipe(switchMap((params) => {
        const serviceID = params.id;

        if (serviceID)
          return this.angularDatabase
            .doc<Service>(`users/${this.userID}/services/${serviceID}`)
            .get()
            .pipe(switchMap((document) => {
              const data = document.data();
              const service = new Service();

              service.id = data['id'];
              service.name = data['name'];
              service.description = data['description'];
              service.phone = data['phone'];
              service.useEmail = data['useEmail'];
              service.providerID = data['providerID'];
              
              return of(service);
            }));
        else
          return of(null);
      }));
    })).subscribe((service) => {
      this.isLoading = of(false);
      
      if (service) {
        if (service.id) {
          this.serviceID = service.id;

          const name = this.serviceForm.controls["name"] as FormControl;
          const description = this.serviceForm.controls["description"] as FormControl;
          const phone = this.serviceForm.controls["phone"] as FormControl;
          const useEmail = this.serviceForm.controls["useEmail"] as FormControl;
  
          name.setValue(service.name);
          description.setValue(service.description);
          phone.setValue(this.formattedPhone(service.phone));
          useEmail.setValue(service.useEmail);
        }
        else {
          this.dialog.open(ErrorAlertComponent, {
            role: "alertdialog",
            data: {
              title: "Erro de conexão",
              message: "Ocorreu uma falha durante a tentativa de editar o serviço."
            }
          });
        }
      }
      else
        this.serviceSubscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (!this.serviceSubscription.closed)
      this.serviceSubscription.unsubscribe();
  }
  
  hasError = (controlName: string, errorName: string) => {
    return this.serviceForm.controls[controlName].hasError(errorName);
  }
  
  addService(value) {
    if (this.serviceForm.valid) {
      this.location.back();

      const serviceID = this.serviceID || this.angularDatabase.createId();
      
      const document: AngularFirestoreDocument<any> = this.angularDatabase
        .doc(`users/${this.userID}`)
        .collection("services")
        .doc(serviceID.toString());
      
      const service = new Service(
        serviceID,
        value.name,
        value.description,
        this.unformattedPhone(value.phone),
        value.useEmail,
        this.userID
      );
      
      document.set(service.getData(), { merge: true }).catch(() => {
        this.dialog.open(ErrorAlertComponent, {
          role: "alertdialog",
          data: {
            title: "Erro de conexão",
            message: "Ocorreu uma falha durante a tentativa de salvar o serviço."
          }
        });
      });
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