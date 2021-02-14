import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Globals } from './Globals';
import { TextItem } from './text.item';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  texts: TextItem[] = [];
  constructor(private firestore: AngularFirestore) {
    if (Globals.room_id !== '') {

    } else {
      alert('Firebase not connected or not in a room');
    }
  }
}
