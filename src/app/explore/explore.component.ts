import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subscription, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthenticationService } from '../core/authentication.service';
import { User } from './../utils/user';
import { Service } from '../utils/service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material';
import { ExploreBottomSheetComponent } from '../explore-bottom-sheet/explore-bottom-sheet.component';
import { SearchFilterService } from '../core/search-filter.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  users: Observable<Map<String, User>>;
  services: Observable<Service[]>;
  status: Observable<Number>;
  searchBarText = '';
  searchPrefix: String = 'tudo';
  searchItem: String;
  isMobile: Boolean;

  serviceSubscription: Subscription;

  emptyMessage = 'Nenhum serviço disponível';
  emptyIcon = 'explore';

  emptySearchMessage = 'Nenhum serviço encontrado';
  emptySearchIcon = 'search';

  constructor(
    private auth: AuthenticationService,
    private database: AngularFirestore,
    private deviceService: DeviceDetectorService,
    private bottomSheet: MatBottomSheet,
    private searchFilter: SearchFilterService
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.status = of(-1);

    this.services = this.auth.user.pipe(
      switchMap(user => {
        return this.database
          .collection('users')
          .valueChanges()
          .pipe(
            map(documents => {
              const users = new Map<String, User>();

              documents
                .filter(document => document['id'] !== user.id)
                .forEach(document => {
                  const user = new User();

                  user.id = document['id'];
                  user.name = document['name'];
                  user.email = document['email'];
                  user.photoURL = document['photoURL'];

                  users.set(user.id, user);
                });

              return users;
            })
          )
          .pipe(
            switchMap(users => {
              this.users = of(users);

              return this.database
                .collectionGroup('services')
                .valueChanges()
                .pipe(
                  map(documents => {
                    const services = new Array<Service>();

                    documents
                      .filter(document => document['providerID'] !== user.id)
                      .forEach(document => {
                        const service = new Service();

                        service.id = document['id'];
                        service.name = document['name'];
                        service.description = document['description'];
                        service.phone = document['phone'];
                        service.useEmail = document['useEmail'];
                        service.providerID = document['providerID'];

                        services.push(service);
                      });

                    services.sort((lhs, rhs) =>
                      lhs.name.localeCompare(rhs.name.toString())
                    );

                    return services;
                  })
                );
            })
          );
      })
    );

    this.serviceSubscription = this.services.subscribe(services => {
      this.status = of(services.length > 0 ? 1 : 0);
    });

    this.searchFilter.filtered.subscribe(filtered => {
      this.searchPrefix = filtered;
      this.searchItem = this.searchPrefix + this.searchBarText;
    }, error => {});
  }

  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }

  openBottomSheet(): void {
    this.bottomSheet.open(ExploreBottomSheetComponent);
  }

  modelChanged(newValue: string) {
    this.searchBarText = newValue;
    this.searchItem = this.searchPrefix + this.searchBarText;
  }
}
