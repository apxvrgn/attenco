import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Globals } from './Globals';

interface Line {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {

  //board_ref!: AngularFirestoreCollection;
  board_ref!: AngularFireList<any>;

  constructor(private firestore: AngularFirestore, private db: AngularFireDatabase) { }

  async GetBoardRef() {
    //this.board_ref = await this.firestore.collection('rooms/'+Globals.room_id+'/board');
    let board_object = await this.db.object('/rooms/'+Globals.room_id);
    await board_object.set({ lines: [] });
    this.board_ref = await this.db.list('/rooms/'+Globals.room_id+'/lines');
  }

  async write(line: Line) {
    this.board_ref.push(line);
  }
}
