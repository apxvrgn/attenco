import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { ChatHostDirective } from '../chat-host.directive';
import { ChatService } from '../chat.service';
import { TextItem } from '../text.item';
import { TextComponent } from '../text/text.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild(ChatHostDirective, { static: true }) chatHost!: ChatHostDirective;

  index: number = 0;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private chatService: ChatService) { }

  ngOnInit(): void {
  }

  AddText(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.chatService.texts[this.index].component);
    const viewContainerRef = this.chatHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<TextComponent>(componentFactory);
    componentRef.instance.name = this.chatService.texts[this.index].name;
    componentRef.instance.self = this.chatService.texts[this.index].self;
    componentRef.instance.text = this.chatService.texts[this.index].text;
    ++this.index;
  }
}
