import {showNumber} from "./consts";

export class Item {
    constructor(readonly distance: number[]) {
    }

    toString(s: string) {
        let ret = ("Имя " + s + " | ");
        for (let i = 0; i < this.distance.length; i++) {
            ret += `[${i+1},  ${showNumber(this.distance[i], 2)}] `;
        }
        return ret;
    }
}