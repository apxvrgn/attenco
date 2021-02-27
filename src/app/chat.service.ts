import { Injectable, Type } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Globals } from './Globals';
import { RtcService } from './rtc.service';
import { TextItem } from './text.item';
import { TextComponent } from './text/text.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  texts_subject: Subject<TextItem[]> = new Subject<TextItem[]>();
  texts: TextItem[] = [];
  test: any[] = [];
  chat_ref!: AngularFirestoreCollection;
  constructor(private firestore: AngularFirestore) {
  }

  async GetChatRef() {
    this.chat_ref = await this.firestore.collection('rooms/'+Globals.room_id+'/chat');
    this.chat_ref.stateChanges().subscribe( async (changes) => {
      for (let i of changes) {
        if (i.type === 'added') {
          let data = await i.payload.doc.data();
          let t: TextItem = new TextItem(TextComponent, data.name, data.msg, (data.uid === Globals.user?.uid) ? true : false);
          this.texts.push(t);
          this.texts_subject.next(this.texts);
        }
      }
    });
  }

  async SendMessage(message: string) {
    await this.chat_ref.add({ name: 'dylan', msg: message, uid: Globals.user?.uid });
  }
}
