import { Type } from "@angular/core";

export class TextItem {
    constructor(public component: Type<any>, public name: string, public text: string, public self: boolean) {
        
    }
}