import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  text: String;
  
  @Input()
  icon: String;
  
  constructor() {}

  ngOnInit() {}
}