import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../core/services/message/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {    
    this.messageService.delivered.subscribe( isDelivered => {
      if (isDelivered) {
        this.messageService.clear();
      }
    })
  }

  get message(): string {
    return this.messageService.message;
  }

  isDelivered () {
    return this.messageService.delivered.value;
  }

  onClick() {
    this.messageService.clear();
  }
}
