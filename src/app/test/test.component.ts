import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RtcService } from '../rtc.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  
  @ViewChild('local_video') local_video!: ElementRef<HTMLVideoElement>;

  subjects: string[] = [
    'Design',
    'Computer Science'
  ];

  sizes: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];

  shareSettings: string[] = [
    'All Sharing',
    'LOL'
  ];

  selectedSubject: string = '';
  selectedSize: number = 1;
  selectedShareSetting: string = '';
  constructor(public rtc: RtcService) {}

  async ngOnInit() {
    //this.firestore.collection('rooms')
    let stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, height: 720 }, audio: false});
    this.rtc.SetMediaDevie(stream);
    this.local_video.nativeElement.srcObject = stream;
  }

}
