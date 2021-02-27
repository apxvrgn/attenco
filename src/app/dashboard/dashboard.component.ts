import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RtcService } from '../rtc.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private rtc: RtcService) { }

  ngOnInit(): void {
  }

  async createRoom() {
    let room_id = await this.rtc.CreateRoom();
    this.router.navigate(['session'], { state: { roomId: room_id } });
  }

  async joinRoom(room_id: string) {
    //let room_id = await this.rtc.JoinRoom(roomid);
    this.router.navigate(['session'], { state: { roomId: room_id } });
  }
}
