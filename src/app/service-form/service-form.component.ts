import { Component, OnInit, Input } from '@angular/core';

import { Service } from '../utils/service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  @Input()
  title: String;

  @Input()
  subtitle: String;

  service = new Service();

  constructor() { }

  ngOnInit() {}
}