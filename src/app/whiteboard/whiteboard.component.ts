import { AfterViewInit, Component, ElementRef, Host, HostListener, OnInit, ViewChild } from '@angular/core';
import { zip } from 'rxjs';
import { Globals } from '../Globals';
import { WhiteboardService } from '../whiteboard.service';

interface Mouse {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
}

interface Line {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  user: string;
}

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})
export class WhiteboardComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  context!:CanvasRenderingContext2D | null;
  draw: boolean = false;
  mouse: Mouse;
  constructor(private wb: WhiteboardService) {
    this.mouse = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    } as Mouse;
  }

  async ngOnInit() {
    await this.wb.GetBoardRef();
    /*this.wb.board_ref.stateChanges().subscribe((changes) => {
      for (let i of changes) {
        let data = i.payload.doc.data();
        if (i.type === 'added' && data.user != Globals.user?.uid && this.context) {
          this.context.beginPath();
          this.context.moveTo(data.x, data.y);
          this.context.lineTo(data.lastX, data.lastY);
          this.context.stroke();
        }
      }
    });*/
    this.wb.board_ref.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        let data = action.payload.val();
        if (data.user != Globals.user?.uid && this.context) {
          this.context.beginPath();
          this.context.moveTo(this.DeCompressX(data.x), this.DeCompressY(data.y));
          this.context.lineTo(this.DeCompressX(data.lastX), this.DeCompressY(data.lastY));
          this.context.stroke();
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerHeight * 0.8 / 720 * 1080;
    this.canvas.nativeElement.height = window.innerHeight * 0.8;
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  UpdateMouse(x: number, y: number, lastx: number, lasty: number): void {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.lastX = lastx;
    this.mouse.lastY = lasty;
  }  

  UpdateMouseXY (x: number, y: number) {
    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;
    this.mouse.x = x;
    this.mouse.y = y;
  }

  CompressX(x: number) {
    return  x * 1280 / this.canvas.nativeElement.width;
  }

  CompressY(y: number) {
    return y * 720 / this.canvas.nativeElement.height;
  }

  DeCompressX(x: number) {
    return x * this.canvas.nativeElement.width / 1280;
  }

  DeCompressY(y: number) {
    return y * this.canvas.nativeElement.height / 720;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent): void {
    this.draw = true;
    this.UpdateMouse(e.offsetX, e.offsetY, e.offsetX, e.offsetY);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.draw && this.context) {
      this.context.beginPath();
      this.context.moveTo(this.mouse.x, this.mouse.y);
      this.context.lineTo(this.mouse.lastX, this.mouse.lastY);
      this.context.stroke();
      this.wb.write({ x: this.CompressX(this.mouse.x), y: this.CompressY(this.mouse.y), lastX: this.CompressX(this.mouse.lastX), lastY: this.CompressY(this.mouse.lastY), user: Globals.user?.uid } as Line);
      this.UpdateMouseXY(e.offsetX, e.offsetY);
    }
  }


  @HostListener('mouseup', ['$event'])
  onMouseUp(): void {
    this.draw = false;
  }

}
