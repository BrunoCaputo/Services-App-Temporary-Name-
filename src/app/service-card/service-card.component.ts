import { Component, OnInit } from '@angular/core';

import { Service } from '../utils/service';
import { AuthenticationService } from './../core/authentication.service';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {
  service = new Service();
  
  constructor(auth: AuthenticationService) {}

  ngOnInit() {}
}