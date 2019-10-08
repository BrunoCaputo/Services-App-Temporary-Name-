import { Component, OnInit } from '@angular/core';

import { Observable, of, Subscription} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthenticationService } from '../core/authentication.service';
import { User } from './../utils/user';
import { Service } from '../utils/service';

/**
 * Displays the services of the logged user.
 */
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  user: User;
  services: Observable<Service[]>;

  serviceSubscription: Subscription;

  status: Observable<Number>;

  emptyMessage = 'Nenhum serviço adicionado';
  emptyIcon = 'work_outline';

  /**
   * Default constructor.
   * @param auth - Instance of AuthenticationService.
   * @param database - Instance of AngularFirestore.
   */
  constructor(
    private auth: AuthenticationService,
    private database: AngularFirestore) {}
  
  /**
   * Invoked when the component is loaded. Creates the cards containing all the
   * logged user's services.
   */
  ngOnInit() {
    this.status = of(-1);

    this.services = this.auth.user.pipe(switchMap((user) => {
      this.user = user;
      
      return this.database.doc(`users/${this.user.id}`)
      .collection('services', doc => doc.orderBy('name'))
      .valueChanges().pipe(map((documents) => {
        const services = new Array<Service>();

        documents.forEach((document) => {
          const service = new Service();

          service.id = document['id'];
          service.name = document['name'];
          service.description = document['description'];
          service.phone = document['phone'];
          service.useEmail = document['useEmail'];
          service.providerID = document['providerID'];

          services.push(service);
        });
        
        return services;
      }));
    }));

    this.serviceSubscription = this.services.subscribe((services) => {
      this.status = of(services.length > 0 ? 1 : 0);
    });
  }

  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
}
