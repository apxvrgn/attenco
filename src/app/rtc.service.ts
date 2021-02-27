import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { config, Observable, Subject } from 'rxjs';
import { Globals } from './Globals';

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const constraints = {
  'video': true,
  'audio': true
};

export interface Room {
  user_count: number;
}

export interface User {
  ice_candidates: AngularFirestoreCollection<RTCIceCandidate>;
  sdps: AngularFirestoreCollection<RTCSessionDescription>;
}

export enum ConnectionType {
  Local,
  Remote,
}

@Injectable({
  providedIn: 'root'
})
export class RtcService {

  local_stream!: MediaStream;

  id!: number;
  room_ref!:AngularFirestoreDocument<Room>;
  local_user_data!: Observable<User>;

  connections: Map<string, RTCPeerConnection>;
  //connections_subject: Subject<RTCPeerConnection> = new Subject<RTCPeerConnection>();
  streams: MediaStream[] = [];

  constructor(private firestore: AngularFirestore) {
    this.connections = new Map<string, RTCPeerConnection>();
  }

  SetMediaDevie(stream: MediaStream) {
    this.local_stream = stream;
  }

  CreateConnection(id: string): RTCPeerConnection {
    let connection = new RTCPeerConnection();
    connection.onicecandidate = (ev) => {
      if (ev.candidate) {
        this.room_ref.collection('users').doc(id.toString()).collection('ices').doc(this.id.toString()).set(ev.candidate.toJSON());
      }
    }
    connection.onconnectionstatechange = (ev) => {
      console.log(connection.connectionState);
    }

    let stream: MediaStream = new MediaStream();

    connection.ontrack = (ev) => {
      stream.addTrack(ev.track);
    }

    this.streams.push(stream);
    
    if (this.local_stream) {
      this.local_stream.getTracks().forEach(track => {
        connection.addTrack(track, this.local_stream);
      });
    }

    return connection;
  }

  public GetConnectionCount(): any[] {
    return new Array(this.connections.size);
  }

  async CreateSelf() {
    
    let room_data = await (await this.room_ref.ref.get()).data();
    if (room_data) {
      this.id = room_data.user_count;
      let user_ref = await this.room_ref.collection('users').doc(this.id.toString());
      user_ref.set({} as User);
      user_ref.valueChanges().subscribe((data) => {});
      user_ref.collection('sdps').snapshotChanges().subscribe((snapshotChanges) => {
        snapshotChanges.forEach(async (change) => {
          if (change.type === 'added') {
            let id = change.payload.doc.id;
            let data = await change.payload.doc.data();
            if (!this.connections.has(id)) {
              let connection = this.CreateConnection(id);
              this.connections.set(id, connection);
              //this.connections_subject.next(connection);
            }
            let connection = this.connections.get(id);
            if (connection) {
              connection.setRemoteDescription(new RTCSessionDescription(data));
              if (!connection.localDescription) {
                let answer = await connection.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
                connection.setLocalDescription(answer);
                await this.room_ref.collection('users').doc(id.toString()).collection('sdps').doc(this.id.toString()).set({ sdp: answer.sdp, type: answer.type });
              }
            }
            await user_ref.collection('sdps').doc(change.payload.doc.id).delete();
          }
        });
      });
      user_ref.collection('ices').snapshotChanges().subscribe((snapshotChanges) => {
        snapshotChanges.forEach(async (change) => {
          if (change.type === 'added') {
            let id = change.payload.doc.id;
            let data = await change.payload.doc.data();
            if (!this.connections.has(id)) {
              let connection = this.CreateConnection(id);
              this.connections.set(id, connection);
              //this.connections_subject.next(connection);
            }
            let connection = this.connections.get(id);
            if (connection) {
              connection.addIceCandidate(new RTCIceCandidate({sdpMid: data.sdpMid, candidate: data.candidate }));
              await user_ref.collection('ices').doc(change.payload.doc.id).delete();
            }
          }
        });
      });
      await this.room_ref.update({ user_count: this.id + 1 } as Room);
    }

  }

  async GetRoomRef(room_id: string) {
    this.room_ref = await this.firestore.doc<Room>('rooms/'+room_id);
  }

  public async CreateRoom() {
    let room_id = await (await this.firestore.collection('rooms').add({ user_count: 0 } as Room)).id;
    Globals.room_id = room_id;
    return room_id;
  }

  public async JoinRoom(room_id: string) {
    await this.GetRoomRef(room_id);
    await this.CreateSelf();
    for (let i: number = 0; i < this.id; ++i) {
      let connection = this.CreateConnection(i.toString());
      let offer = await connection.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true});
      await connection.setLocalDescription(offer);
      this.room_ref.collection('users').doc(i.toString()).collection('sdps').doc(this.id.toString()).set({ sdp: offer.sdp, type: offer.type });
      this.connections.set(i.toString(), connection);
      //this.connections_subject.next(connection);
    }
    Globals.room_id = room_id;
    return room_id;
  }
}
