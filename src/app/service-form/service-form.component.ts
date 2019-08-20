import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Service } from '../utils/service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  title: String;
  subtitle: String;

  service = new Service();
  
  constructor(private location: Location, private route: ActivatedRoute) { }

  ngOnInit() {
    this.title = this.route.snapshot.data.title;
    this.subtitle = this.route.snapshot.data.subtitle;
  }

  cancelAction() {
    this.location.back()
  }
}