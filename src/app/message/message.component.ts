import { Component, OnInit, Input } from '@angular/core';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  text: String;
  
  @Input()
  icon: IconDefinition;
  
  constructor() {}

  ngOnInit() {}
}