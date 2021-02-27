import { Component, ComponentFactoryResolver, ElementRef, OnInit, Type, ViewChild, RendererFactory2, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Globals } from '../Globals';
import { RtcService } from '../rtc.service';

@Component({
  selector: 'app-video-session',
  templateUrl: './video-session.component.html',
  styleUrls: ['./video-session.component.css']
})
export class VideoSessionComponent implements OnInit, AfterViewInit {

  @ViewChild('local_video') local_video!: ElementRef<HTMLVideoElement>;
  @ViewChild('video_container') video_container!: ElementRef<HTMLDivElement>;
  @ViewChildren('peer_video') peer_videos!: QueryList<any>;
  room_id: string = '';

  constructor(private router: Router, public rtc: RtcService, private componentFactoryResolver: ComponentFactoryResolver, private sanitizer: DomSanitizer) {
    let nav = this.router.getCurrentNavigation();
    let state: { [k : string] : any } | null | undefined = (nav) ? nav.extras.state : null;
    if (state) {
      this.room_id = state.roomId;
      Globals.room_id = state.roomId;
      console.log(this.room_id);
    }
  }

  async ngOnInit() {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, height: 720 }, audio: true});
      // @ts-ignore
      //let stream = await navigator.mediaDevices.getDisplayMedia({video: { width: 1280, height: 720 }, audio: false});
      this.rtc.SetMediaDevie(stream);
      this.local_video.nativeElement.srcObject = stream;
    } catch (e) {
      //alert('failed to get camera');
    }

    await this.rtc.JoinRoom(this.room_id);
  }

  ngAfterViewInit() {
    this.peer_videos.changes.subscribe(change => {
      change.last.nativeElement.srcObject = this.rtc.streams[change.length-1];
      if (change.length > 0) {
        this.video_container.nativeElement.classList.remove('single');
        this.video_container.nativeElement.classList.add('multiple');
      }
    });
  }
}
