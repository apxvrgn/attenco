import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appChatHost]'
})
export class ChatHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
