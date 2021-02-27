import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {

  @Input('name') name: string = '';
  @Input('text') text: string = '';
  @Input('self') self: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  GetSelf(): string{
    if (this.self) {
      return 'self';
    }
    return '';
  }

}
