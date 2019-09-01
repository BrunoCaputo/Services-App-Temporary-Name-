import { Component, OnInit } from '@angular/core';

import { Observable} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthenticationService } from '../core/authentication.service';
import { User } from './../utils/user';
import { Service } from '../utils/service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  user: User;
  services: Observable<Service[]>;

  constructor(
    private auth: AuthenticationService,
    private database: AngularFirestore) {}

  ngOnInit() {
    /*this.services = this.auth.user.pipe(switchMap((user) => {
      this.user = user;
      
      return this.database.collection('users').valueChanges().pipe(map((documents) => {
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

        services.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name.toString()));
        
        return services;
      }));
    }));

    this.database.collection('users').get().pipe(switchMap((documets) => {
      documets.forEach((document) => {
        document.get("services")
      });
    }));*/
  }
}