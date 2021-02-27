import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  chatForm = this.formBuilder.group({
    msg: ''
  });
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private chatService: ChatService, private formBuilder: FormBuilder) { }

  async ngOnInit() {
    await this.chatService.GetChatRef();
    this.chatService.texts_subject.subscribe((texts) => {
      console.log('new');
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(texts[this.index].component);
      const viewContainerRef = this.chatHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent<TextComponent>(componentFactory);
      componentRef.instance.name = texts[this.index].name;
      componentRef.instance.self = texts[this.index].self;
      componentRef.instance.text = texts[this.index].text;
      ++this.index;
    });
  }

  SendMessage() {
    this.chatService.SendMessage(this.chatForm.value.msg);
    this.chatForm.reset();
  }
}
