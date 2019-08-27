(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_N = 15;
exports.SET_N = 30;
exports.WEIGHT_MAX = 86;
exports.WEIGHT_REQUERID = 0.7;
exports.COST_REQUERID = 118; // Условия выхода
function random(from = 0, to = 0) {
    return (Math.floor(Math.random() * to) + from);
}
exports.random = random;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRndInteger = getRndInteger;
function showNumber(num, fixed = 2, pointer = 2) {
    const a = new Intl.NumberFormat('Ru-ru', { minimumIntegerDigits: fixed, minimumFractionDigits: pointer });
    return a.format(num);
}
exports.showNumber = showNumber;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const item_1 = require("./item");
const consts_1 = require("./consts");
let start = document.getElementById('start');
if (start) {
    start.addEventListener('click', () => {
        const cross = document.getElementsByName('cross');
        const mutation = document.getElementsByName('mutation');
        const selection = document.getElementsByName('selection');
        const choose = document.getElementsByName('choose');
        const output = document.getElementById('output');
        const input = document.getElementById('input');
        run(getValueRadioButton(cross), getValueRadioButton(mutation), getValueRadioButton(selection), getValueRadioButton(choose), output, input.value);
    });
}
let calc = document.getElementById('calc');
if (calc) {
    calc.addEventListener('click', () => {
        const input = document.getElementById('input');
        const path = document.getElementById('path');
        const result = document.getElementById('result');
        calculate(input.value, path.value, result);
    });
}
function getValueRadioButton(radios) {
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            return (radios[i].value);
        }
    }
    return '';
}
function calculate(input, path, result) {
    const rows = input.split('\n');
    let items = [];
    for (let i = 0; i < rows.length; i++) {
        items[i] = new item_1.Item(rows[i].split(' ').map(v => +v));
    }
    const genotype = path.split(' ').filter(a => a.trim().length > 0).map(i => +i);
    let distanceSum = 0;
    result.innerHTML = '';
    for (let i = 1; i <= genotype.length; i++) {
        const city = genotype[i % genotype.length];
        const city1 = genotype[(i - 1) % genotype.length];
        result.innerHTML += (`<div>distance: ${consts_1.showNumber(distanceSum, 3, 2)}, city №1: ${consts_1.showNumber(city1, 2, 0)}, city №2: ${consts_1.showNumber(city, 2, 0)}, distance: ${items[city1 - 1].distance[city - 1]}</div>`);
        distanceSum += items[city1 - 1].distance[city - 1];
    }
    result.innerHTML += `<div>result distance: ${consts_1.showNumber(distanceSum, 3, 2)}</div>`;
}
function run(cross, mutation, selection, choose, output, input) {
    output.value = '';
    let main = new main_1.Main((str) => {
        output.value += str;
    });
    main.outputText('INITIAL VALUE:\n');
    const rows = input.split('\n');
    for (let i = 0; i < rows.length; i++) {
        main.items[i] = new item_1.Item(rows[i].split(' ').map(v => +v));
    }
    main.showItems();
    main.initSets();
    main.outputText('\n');
    main.outputText('Стартовая популяция:\n');
    main.showSets();
    main.outputText('\n');
    do {
        main.outputText('Поколение: ' + main.age + '\n');
        main.outputText('\n');
        main.outputText('Лучший в поколении:');
        let best = main.getBest(main.sets);
        main.outputText(best.show() + '\n\n');
        let par;
        if (choose === '1') {
            main.outputText('Выбор случайных родителей:\n');
            par = main.choosePar();
        }
        else {
            main.outputText('Выбор лучших родителей\n');
            par = main.chooseBestPar();
        }
        main.outputText('Первый родитель:', par[0].show() + '\n');
        main.outputText('Второй родитель:', par[1].show() + '\n');
        let generate = [...main.sets];
        let mutants = 0;
        for (let i = 0; i < main.sets.length; i++) {
            if (cross === '1')
                generate.push(main.doubleCross(par[0], par[1]));
            else {
                generate.push(main.chunkSelcetedCross(par[0], par[1]));
            }
            const index = generate.length - 1;
            main.outputText('\n');
            main.outputText('child    ' + consts_1.showNumber(i + 1 + mutants, 2, 0) + ':' + generate[index].show() + '\n');
            if (consts_1.getRndInteger(0, 100) < 30) {
                if (mutation === '1') {
                    generate.push(main.pointerMutation(generate[index]));
                }
                else {
                    generate.push(main.inversionMutation(generate[index]));
                }
                main.outputText('mutation ' + consts_1.showNumber(i + 1 + ++mutants, 2, 0) + ':' + generate[index + 1].show() + '\n');
            }
        }
        main.outputText('\n Get population from:\n');
        main.showSets(generate);
        if (selection === '1') {
            main.newPopulation(main.bitturnir(generate, consts_1.SET_N));
        }
        else {
            main.newPopulation(main.selectionRandom(generate, consts_1.SET_N));
        }
        main.outputText('Новая популяция:\n');
        main.showSets();
    } while (main.age < 20);
    main.outputText('\n\nРЕЗУЛЬТАТ:\n');
    main.showSets();
    main.outputText('\nЛучший:');
    const best = main.getBest(main.sets);
    main.outputText(best.show() + '\n');
    /*
     do {
         for (let i = 0; i < main.sets.length * 2; i++) {

         // child.sort((a, b) => b.sumCost - a.sumCost);
         main.outputText('\n Get population from:\n');
         main.showSets(child);
         if (selection === '1') {
             main.newPopulation(main.bitturnir(child, SET_N));
         } else {
             main.newPopulation(main.selectionRandom(child, SET_N));
         }

         // main.sets.sort((a, b) => b.sumCost - a.sumCost);
         main.outputText('Новая популяция:\n');
         main.showSets();

     } while (!main.end(WEIGHT_MAX, main.getBest()) && main.age < 30);
     main.outputText('\n\nРЕЗУЛЬТАТ:\n');
     main.showSets();
     main.outputText('\nЛучший:');
     const best = main.getBest();
     main.outputText(best.show() + '\n');*/
}
exports.run = run;

},{"./consts":1,"./item":3,"./main":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
class Item {
    constructor(distance) {
        this.distance = distance;
    }
    toString(s) {
        let ret = ("Имя " + s + " | ");
        for (let i = 0; i < this.distance.length; i++) {
            ret += `[${i + 1},  ${consts_1.showNumber(this.distance[i], 2)}] `;
        }
        return ret;
    }
}
exports.Item = Item;

},{"./consts":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const set_1 = require("./set");
class Main {
    constructor(output) {
        this.output = output;
        this.age = 1;
        this.items = new Array(consts_1.ITEM_N);
        this.sets = [];
    }
    outputText(...str) {
        if (!!this.output) {
            for (const s of str) {
                this.output(s);
            }
        }
        {
            console.log(...str);
        }
    }
    initSets() {
        for (let i = 0; i < consts_1.SET_N; i++) {
            this.sets.push(new set_1.MySet(this.items, true));
        }
        //this.sets.sort((a, b) => b.sumCost - a.sumCost);
    }
    showItems() {
        this.outputText('Список городов:\n');
        for (let i = 0; i < this.items.length; i++) {
            this.outputText(this.items[i].toString(consts_1.showNumber(i + 1, 2, 0)) + "\n");
        }
    }
    showSets(sets) {
        const set = !!sets ? [...sets] : [...this.sets];
        set.sort((a, b) => a.distanceSum - b.distanceSum);
        for (let i = 0; i < set.length; i++) {
            this.outputText(set[i].show() + "\n");
        }
    }
    getBest(sets) {
        let min = 0;
        let minIndex = -1;
        for (let i = 0; i < sets.length; i++) { //WEIGHT_MAX = 86 // *0.8
            if (sets[i].distanceSum < min || i === 0) {
                min = sets[i].distanceSum;
                minIndex = i;
            }
        }
        return sets[minIndex];
    }
    choosePar() {
        const par = [];
        par[0] = this.sets[consts_1.getRndInteger(0, consts_1.SET_N)];
        do {
            par[1] = this.sets[consts_1.getRndInteger(0, consts_1.SET_N)];
        } while (par[0] === par[1]);
        return par;
    }
    chooseBestPar() {
        let select = [...this.sets];
        let S = [];
        do {
            const best = this.getBest(select);
            S.push(best);
            select.splice(select.indexOf(best), 1);
        } while (S.length < 2);
        return S;
    }
    doubleCross(s1, s2) {
        let res = new set_1.MySet(this.items);
        const length = s1.genotype.length;
        let [start, end] = this.generateStartEnd(length);
        let copyParent = consts_1.getRndInteger(0, 2) === 0 ? s1 : s2;
        for (let i = start; i < end; i++) {
            res.genotype[i] = copyParent.genotype[i];
        }
        copyParent = copyParent === s1 ? s2 : s1;
        for (let x = end, i = 0; (x - end) < length - (end - start); i++) {
            const city = copyParent.genotype[(i + x) % length];
            if (res.genotype.includes(city)) {
                continue;
            }
            res.genotype[x++ % length] = city;
        }
        res.refresh();
        return res;
    }
    chunkSelcetedCross(s1, s2) {
        let res = new set_1.MySet(this.items);
        const length = s1.genotype.length;
        let [start, end] = this.generateStartEnd(length);
        let copyParent = consts_1.getRndInteger(0, 2) === 0 ? s1 : s2;
        for (let i = start; i < end; i++) {
            res.genotype[i] = copyParent.genotype[i];
        }
        copyParent = copyParent === s1 ? s2 : s1;
        for (let i = end; (i - end) < length - (end - start); i++) {
            let city = copyParent.genotype[(i) % length];
            while (res.genotype.includes(city)) {
                const index = res.genotype.indexOf(city);
                city = copyParent.genotype[index];
            }
            res.genotype[i % length] = city;
        }
        res.refresh();
        return res;
    }
    generateStartEnd(lenght) {
        const rand = [consts_1.getRndInteger(0, lenght), consts_1.getRndInteger(0, lenght)];
        let start = Math.min(...rand);
        let end = Math.max(...rand);
        if (start === end) {
            end += 2;
        }
        if (end > lenght) {
            start -= 2;
            end -= 2;
        }
        return [start, end];
    }
    inversionMutation(set) {
        const newSet = set.copy();
        let [start, end] = this.generateStartEnd(set.genotype.length);
        newSet.genotype = [...set.genotype.slice(0, start), ...set.genotype.slice(start, end).reverse(), ...set.genotype.slice(end)];
        newSet.refresh();
        return newSet;
    }
    pointerMutation(set) {
        const bitIndex = consts_1.getRndInteger(1, consts_1.ITEM_N - 1);
        const randomPos = consts_1.getRndInteger(0, 2);
        const newSet = set.copy();
        let modif = 1;
        if (randomPos === 0) {
            modif = -1;
        }
        [newSet.genotype[bitIndex], newSet.genotype[bitIndex + modif]] = [newSet.genotype[bitIndex + modif], newSet.genotype[bitIndex]];
        newSet.refresh();
        return newSet;
    }
    selectionRandom(childs, m) {
        let res = new Array(m);
        let count = 0;
        let copyChild = [...childs];
        do {
            let rand = consts_1.getRndInteger(0, copyChild.length);
            res[count++] = copyChild[rand];
            copyChild.splice(rand, 1);
        } while (count !== m);
        return res;
    }
    selectProportion(childs, nextC) {
        let sumDist = 0;
        let midlCost;
        let C = [...childs];
        let S = [];
        for (const i of childs) {
            sumDist += i.distanceSum;
        }
        midlCost = sumDist / childs.length;
        do {
            let rand;
            rand = consts_1.getRndInteger(0, sumDist);
            for (let i = 0; i < C.length; i++) {
                if (rand - C[i].distanceSum / midlCost < 0) {
                    S.push(C[i]);
                    C.splice(i, 1);
                    break;
                }
            }
        } while (S.length < nextC);
        return S;
    }
    bitturnir(childs, nextChild, countChild = 4) {
        let C = [...childs];
        let S = [];
        let count = 0;
        do {
            let select = [];
            for (let i = 0; i < countChild; i++) {
                let rand = consts_1.getRndInteger(0, C.length);
                select.push(C[rand]);
                C.splice(rand, 1);
            }
            const best = this.getBest(select);
            const index = select.indexOf(best);
            S[count] = select[index];
            select.splice(index, 1);
            C = [...C, ...select];
            count++;
        } while (count < nextChild);
        return S;
    }
    newPopulation(newP) {
        for (let i = 0; i < this.sets.length; i++) {
            this.sets[i] = newP[i];
        }
        this.age++;
    }
    end(lowEdge, best) {
        return best.distanceSum < lowEdge;
    }
}
exports.Main = Main;

},{"./consts":1,"./set":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
class MySet {
    constructor(items, _random = false) {
        this.items = items;
        this.genotype = [];
        this.distanceSum = 0;
        if (!_random)
            return;
        this.distanceSum = 0;
        let number_list = [];
        for (let i = 0; i < items.length; i++) {
            number_list.push(i);
        }
        for (let i = 0; i < items.length; i++) {
            let index = (consts_1.getRndInteger(0, number_list.length));
            this.genotype[i] = (number_list.splice(index, 1)[0]);
        }
        this.refresh();
    }
    copy() {
        const newSet = new MySet([...this.items]);
        newSet.genotype = [...this.genotype];
        newSet.distanceSum = this.distanceSum;
        return newSet;
    }
    show() {
        let str = '';
        for (let i = 0; i < this.genotype.length; i++) {
            str += consts_1.showNumber(this.genotype[i] + 1, 2, 0) + " ";
        }
        return ("Расстояние = " + consts_1.showNumber(this.distanceSum, 3, 2) + ' ' + str);
    }
    refresh() {
        this.distanceSum = 0;
        for (let i = 1; i < this.items.length; i++) {
            const city = this.genotype[i];
            const city1 = this.genotype[i - 1];
            this.distanceSum += this.items[city1].distance[city];
        }
        this.distanceSum += this.items[this.genotype[this.items.length - 1]].distance[this.genotype[0]];
    }
}
exports.MySet = MySet;

},{"./consts":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2l0ZW0uanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLklURU1fTiA9IDE1O1xyXG5leHBvcnRzLlNFVF9OID0gMzA7XHJcbmV4cG9ydHMuV0VJR0hUX01BWCA9IDg2O1xyXG5leHBvcnRzLldFSUdIVF9SRVFVRVJJRCA9IDAuNztcclxuZXhwb3J0cy5DT1NUX1JFUVVFUklEID0gMTE4OyAvLyDQo9GB0LvQvtCy0LjRjyDQstGL0YXQvtC00LBcclxuZnVuY3Rpb24gcmFuZG9tKGZyb20gPSAwLCB0byA9IDApIHtcclxuICAgIHJldHVybiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdG8pICsgZnJvbSk7XHJcbn1cclxuZXhwb3J0cy5yYW5kb20gPSByYW5kb207XHJcbmZ1bmN0aW9uIGdldFJuZEludGVnZXIobWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XHJcbn1cclxuZXhwb3J0cy5nZXRSbmRJbnRlZ2VyID0gZ2V0Um5kSW50ZWdlcjtcclxuZnVuY3Rpb24gc2hvd051bWJlcihudW0sIGZpeGVkID0gMiwgcG9pbnRlciA9IDIpIHtcclxuICAgIGNvbnN0IGEgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ1J1LXJ1JywgeyBtaW5pbXVtSW50ZWdlckRpZ2l0czogZml4ZWQsIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogcG9pbnRlciB9KTtcclxuICAgIHJldHVybiBhLmZvcm1hdChudW0pO1xyXG59XHJcbmV4cG9ydHMuc2hvd051bWJlciA9IHNob3dOdW1iZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IG1haW5fMSA9IHJlcXVpcmUoXCIuL21haW5cIik7XHJcbmNvbnN0IGl0ZW1fMSA9IHJlcXVpcmUoXCIuL2l0ZW1cIik7XHJcbmNvbnN0IGNvbnN0c18xID0gcmVxdWlyZShcIi4vY29uc3RzXCIpO1xyXG5sZXQgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcclxuaWYgKHN0YXJ0KSB7XHJcbiAgICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCBjcm9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjcm9zcycpO1xyXG4gICAgICAgIGNvbnN0IG11dGF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ211dGF0aW9uJyk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3NlbGVjdGlvbicpO1xyXG4gICAgICAgIGNvbnN0IGNob29zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjaG9vc2UnKTtcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0Jyk7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcclxuICAgICAgICBydW4oZ2V0VmFsdWVSYWRpb0J1dHRvbihjcm9zcyksIGdldFZhbHVlUmFkaW9CdXR0b24obXV0YXRpb24pLCBnZXRWYWx1ZVJhZGlvQnV0dG9uKHNlbGVjdGlvbiksIGdldFZhbHVlUmFkaW9CdXR0b24oY2hvb3NlKSwgb3V0cHV0LCBpbnB1dC52YWx1ZSk7XHJcbiAgICB9KTtcclxufVxyXG5sZXQgY2FsYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYWxjJyk7XHJcbmlmIChjYWxjKSB7XHJcbiAgICBjYWxjLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0Jyk7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXRoJyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdCcpO1xyXG4gICAgICAgIGNhbGN1bGF0ZShpbnB1dC52YWx1ZSwgcGF0aC52YWx1ZSwgcmVzdWx0KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldFZhbHVlUmFkaW9CdXR0b24ocmFkaW9zKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmFkaW9zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHJhZGlvc1tpXS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgIC8vIGRvIHdoYXRldmVyIHlvdSB3YW50IHdpdGggdGhlIGNoZWNrZWQgcmFkaW9cclxuICAgICAgICAgICAgcmV0dXJuIChyYWRpb3NbaV0udmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAnJztcclxufVxyXG5mdW5jdGlvbiBjYWxjdWxhdGUoaW5wdXQsIHBhdGgsIHJlc3VsdCkge1xyXG4gICAgY29uc3Qgcm93cyA9IGlucHV0LnNwbGl0KCdcXG4nKTtcclxuICAgIGxldCBpdGVtcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaXRlbXNbaV0gPSBuZXcgaXRlbV8xLkl0ZW0ocm93c1tpXS5zcGxpdCgnICcpLm1hcCh2ID0+ICt2KSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBnZW5vdHlwZSA9IHBhdGguc3BsaXQoJyAnKS5maWx0ZXIoYSA9PiBhLnRyaW0oKS5sZW5ndGggPiAwKS5tYXAoaSA9PiAraSk7XHJcbiAgICBsZXQgZGlzdGFuY2VTdW0gPSAwO1xyXG4gICAgcmVzdWx0LmlubmVySFRNTCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gZ2Vub3R5cGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaXR5ID0gZ2Vub3R5cGVbaSAlIGdlbm90eXBlLmxlbmd0aF07XHJcbiAgICAgICAgY29uc3QgY2l0eTEgPSBnZW5vdHlwZVsoaSAtIDEpICUgZ2Vub3R5cGUubGVuZ3RoXTtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MICs9IChgPGRpdj5kaXN0YW5jZTogJHtjb25zdHNfMS5zaG93TnVtYmVyKGRpc3RhbmNlU3VtLCAzLCAyKX0sIGNpdHkg4oSWMTogJHtjb25zdHNfMS5zaG93TnVtYmVyKGNpdHkxLCAyLCAwKX0sIGNpdHkg4oSWMjogJHtjb25zdHNfMS5zaG93TnVtYmVyKGNpdHksIDIsIDApfSwgZGlzdGFuY2U6ICR7aXRlbXNbY2l0eTEgLSAxXS5kaXN0YW5jZVtjaXR5IC0gMV19PC9kaXY+YCk7XHJcbiAgICAgICAgZGlzdGFuY2VTdW0gKz0gaXRlbXNbY2l0eTEgLSAxXS5kaXN0YW5jZVtjaXR5IC0gMV07XHJcbiAgICB9XHJcbiAgICByZXN1bHQuaW5uZXJIVE1MICs9IGA8ZGl2PnJlc3VsdCBkaXN0YW5jZTogJHtjb25zdHNfMS5zaG93TnVtYmVyKGRpc3RhbmNlU3VtLCAzLCAyKX08L2Rpdj5gO1xyXG59XHJcbmZ1bmN0aW9uIHJ1bihjcm9zcywgbXV0YXRpb24sIHNlbGVjdGlvbiwgY2hvb3NlLCBvdXRwdXQsIGlucHV0KSB7XHJcbiAgICBvdXRwdXQudmFsdWUgPSAnJztcclxuICAgIGxldCBtYWluID0gbmV3IG1haW5fMS5NYWluKChzdHIpID0+IHtcclxuICAgICAgICBvdXRwdXQudmFsdWUgKz0gc3RyO1xyXG4gICAgfSk7XHJcbiAgICBtYWluLm91dHB1dFRleHQoJ0lOSVRJQUwgVkFMVUU6XFxuJyk7XHJcbiAgICBjb25zdCByb3dzID0gaW5wdXQuc3BsaXQoJ1xcbicpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbWFpbi5pdGVtc1tpXSA9IG5ldyBpdGVtXzEuSXRlbShyb3dzW2ldLnNwbGl0KCcgJykubWFwKHYgPT4gK3YpKTtcclxuICAgIH1cclxuICAgIG1haW4uc2hvd0l0ZW1zKCk7XHJcbiAgICBtYWluLmluaXRTZXRzKCk7XHJcbiAgICBtYWluLm91dHB1dFRleHQoJ1xcbicpO1xyXG4gICAgbWFpbi5vdXRwdXRUZXh0KCfQodGC0LDRgNGC0L7QstCw0Y8g0L/QvtC/0YPQu9GP0YbQuNGPOlxcbicpO1xyXG4gICAgbWFpbi5zaG93U2V0cygpO1xyXG4gICAgbWFpbi5vdXRwdXRUZXh0KCdcXG4nKTtcclxuICAgIGRvIHtcclxuICAgICAgICBtYWluLm91dHB1dFRleHQoJ9Cf0L7QutC+0LvQtdC90LjQtTogJyArIG1haW4uYWdlICsgJ1xcbicpO1xyXG4gICAgICAgIG1haW4ub3V0cHV0VGV4dCgnXFxuJyk7XHJcbiAgICAgICAgbWFpbi5vdXRwdXRUZXh0KCfQm9GD0YfRiNC40Lkg0LIg0L/QvtC60L7Qu9C10L3QuNC4OicpO1xyXG4gICAgICAgIGxldCBiZXN0ID0gbWFpbi5nZXRCZXN0KG1haW4uc2V0cyk7XHJcbiAgICAgICAgbWFpbi5vdXRwdXRUZXh0KGJlc3Quc2hvdygpICsgJ1xcblxcbicpO1xyXG4gICAgICAgIGxldCBwYXI7XHJcbiAgICAgICAgaWYgKGNob29zZSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgIG1haW4ub3V0cHV0VGV4dCgn0JLRi9Cx0L7RgCDRgdC70YPRh9Cw0LnQvdGL0YUg0YDQvtC00LjRgtC10LvQtdC5OlxcbicpO1xyXG4gICAgICAgICAgICBwYXIgPSBtYWluLmNob29zZVBhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbWFpbi5vdXRwdXRUZXh0KCfQktGL0LHQvtGAINC70YPRh9GI0LjRhSDRgNC+0LTQuNGC0LXQu9C10LlcXG4nKTtcclxuICAgICAgICAgICAgcGFyID0gbWFpbi5jaG9vc2VCZXN0UGFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1haW4ub3V0cHV0VGV4dCgn0J/QtdGA0LLRi9C5INGA0L7QtNC40YLQtdC70Yw6JywgcGFyWzBdLnNob3coKSArICdcXG4nKTtcclxuICAgICAgICBtYWluLm91dHB1dFRleHQoJ9CS0YLQvtGA0L7QuSDRgNC+0LTQuNGC0LXQu9GMOicsIHBhclsxXS5zaG93KCkgKyAnXFxuJyk7XHJcbiAgICAgICAgbGV0IGdlbmVyYXRlID0gWy4uLm1haW4uc2V0c107XHJcbiAgICAgICAgbGV0IG11dGFudHMgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbi5zZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjcm9zcyA9PT0gJzEnKVxyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGUucHVzaChtYWluLmRvdWJsZUNyb3NzKHBhclswXSwgcGFyWzFdKSk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGUucHVzaChtYWluLmNodW5rU2VsY2V0ZWRDcm9zcyhwYXJbMF0sIHBhclsxXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZ2VuZXJhdGUubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgbWFpbi5vdXRwdXRUZXh0KCdcXG4nKTtcclxuICAgICAgICAgICAgbWFpbi5vdXRwdXRUZXh0KCdjaGlsZCAgICAnICsgY29uc3RzXzEuc2hvd051bWJlcihpICsgMSArIG11dGFudHMsIDIsIDApICsgJzonICsgZ2VuZXJhdGVbaW5kZXhdLnNob3coKSArICdcXG4nKTtcclxuICAgICAgICAgICAgaWYgKGNvbnN0c18xLmdldFJuZEludGVnZXIoMCwgMTAwKSA8IDMwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobXV0YXRpb24gPT09ICcxJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlLnB1c2gobWFpbi5wb2ludGVyTXV0YXRpb24oZ2VuZXJhdGVbaW5kZXhdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZS5wdXNoKG1haW4uaW52ZXJzaW9uTXV0YXRpb24oZ2VuZXJhdGVbaW5kZXhdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtYWluLm91dHB1dFRleHQoJ211dGF0aW9uICcgKyBjb25zdHNfMS5zaG93TnVtYmVyKGkgKyAxICsgKyttdXRhbnRzLCAyLCAwKSArICc6JyArIGdlbmVyYXRlW2luZGV4ICsgMV0uc2hvdygpICsgJ1xcbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1haW4ub3V0cHV0VGV4dCgnXFxuIEdldCBwb3B1bGF0aW9uIGZyb206XFxuJyk7XHJcbiAgICAgICAgbWFpbi5zaG93U2V0cyhnZW5lcmF0ZSk7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgIG1haW4ubmV3UG9wdWxhdGlvbihtYWluLmJpdHR1cm5pcihnZW5lcmF0ZSwgY29uc3RzXzEuU0VUX04pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG1haW4ubmV3UG9wdWxhdGlvbihtYWluLnNlbGVjdGlvblJhbmRvbShnZW5lcmF0ZSwgY29uc3RzXzEuU0VUX04pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFpbi5vdXRwdXRUZXh0KCfQndC+0LLQsNGPINC/0L7Qv9GD0LvRj9GG0LjRjzpcXG4nKTtcclxuICAgICAgICBtYWluLnNob3dTZXRzKCk7XHJcbiAgICB9IHdoaWxlIChtYWluLmFnZSA8IDIwKTtcclxuICAgIG1haW4ub3V0cHV0VGV4dCgnXFxuXFxu0KDQldCX0KPQm9Cs0KLQkNCiOlxcbicpO1xyXG4gICAgbWFpbi5zaG93U2V0cygpO1xyXG4gICAgbWFpbi5vdXRwdXRUZXh0KCdcXG7Qm9GD0YfRiNC40Lk6Jyk7XHJcbiAgICBjb25zdCBiZXN0ID0gbWFpbi5nZXRCZXN0KG1haW4uc2V0cyk7XHJcbiAgICBtYWluLm91dHB1dFRleHQoYmVzdC5zaG93KCkgKyAnXFxuJyk7XHJcbiAgICAvKlxyXG4gICAgIGRvIHtcclxuICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWluLnNldHMubGVuZ3RoICogMjsgaSsrKSB7XHJcblxyXG4gICAgICAgICAvLyBjaGlsZC5zb3J0KChhLCBiKSA9PiBiLnN1bUNvc3QgLSBhLnN1bUNvc3QpO1xyXG4gICAgICAgICBtYWluLm91dHB1dFRleHQoJ1xcbiBHZXQgcG9wdWxhdGlvbiBmcm9tOlxcbicpO1xyXG4gICAgICAgICBtYWluLnNob3dTZXRzKGNoaWxkKTtcclxuICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgICBtYWluLm5ld1BvcHVsYXRpb24obWFpbi5iaXR0dXJuaXIoY2hpbGQsIFNFVF9OKSk7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBtYWluLm5ld1BvcHVsYXRpb24obWFpbi5zZWxlY3Rpb25SYW5kb20oY2hpbGQsIFNFVF9OKSk7XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIC8vIG1haW4uc2V0cy5zb3J0KChhLCBiKSA9PiBiLnN1bUNvc3QgLSBhLnN1bUNvc3QpO1xyXG4gICAgICAgICBtYWluLm91dHB1dFRleHQoJ9Cd0L7QstCw0Y8g0L/QvtC/0YPQu9GP0YbQuNGPOlxcbicpO1xyXG4gICAgICAgICBtYWluLnNob3dTZXRzKCk7XHJcblxyXG4gICAgIH0gd2hpbGUgKCFtYWluLmVuZChXRUlHSFRfTUFYLCBtYWluLmdldEJlc3QoKSkgJiYgbWFpbi5hZ2UgPCAzMCk7XHJcbiAgICAgbWFpbi5vdXRwdXRUZXh0KCdcXG5cXG7QoNCV0JfQo9Cb0KzQotCQ0KI6XFxuJyk7XHJcbiAgICAgbWFpbi5zaG93U2V0cygpO1xyXG4gICAgIG1haW4ub3V0cHV0VGV4dCgnXFxu0JvRg9GH0YjQuNC5OicpO1xyXG4gICAgIGNvbnN0IGJlc3QgPSBtYWluLmdldEJlc3QoKTtcclxuICAgICBtYWluLm91dHB1dFRleHQoYmVzdC5zaG93KCkgKyAnXFxuJyk7Ki9cclxufVxyXG5leHBvcnRzLnJ1biA9IHJ1bjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgY29uc3RzXzEgPSByZXF1aXJlKFwiLi9jb25zdHNcIik7XHJcbmNsYXNzIEl0ZW0ge1xyXG4gICAgY29uc3RydWN0b3IoZGlzdGFuY2UpIHtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZyhzKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IChcItCY0LzRjyBcIiArIHMgKyBcIiB8IFwiKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGlzdGFuY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmV0ICs9IGBbJHtpICsgMX0sICAke2NvbnN0c18xLnNob3dOdW1iZXIodGhpcy5kaXN0YW5jZVtpXSwgMil9XSBgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuSXRlbSA9IEl0ZW07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNvbnN0c18xID0gcmVxdWlyZShcIi4vY29uc3RzXCIpO1xyXG5jb25zdCBzZXRfMSA9IHJlcXVpcmUoXCIuL3NldFwiKTtcclxuY2xhc3MgTWFpbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXQpIHtcclxuICAgICAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcclxuICAgICAgICB0aGlzLmFnZSA9IDE7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheShjb25zdHNfMS5JVEVNX04pO1xyXG4gICAgICAgIHRoaXMuc2V0cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgb3V0cHV0VGV4dCguLi5zdHIpIHtcclxuICAgICAgICBpZiAoISF0aGlzLm91dHB1dCkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygc3RyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm91dHB1dChzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLnN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFNldHMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25zdHNfMS5TRVRfTjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0cy5wdXNoKG5ldyBzZXRfMS5NeVNldCh0aGlzLml0ZW1zLCB0cnVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdGhpcy5zZXRzLnNvcnQoKGEsIGIpID0+IGIuc3VtQ29zdCAtIGEuc3VtQ29zdCk7XHJcbiAgICB9XHJcbiAgICBzaG93SXRlbXMoKSB7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRUZXh0KCfQodC/0LjRgdC+0Log0LPQvtGA0L7QtNC+0LI6XFxuJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0VGV4dCh0aGlzLml0ZW1zW2ldLnRvU3RyaW5nKGNvbnN0c18xLnNob3dOdW1iZXIoaSArIDEsIDIsIDApKSArIFwiXFxuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob3dTZXRzKHNldHMpIHtcclxuICAgICAgICBjb25zdCBzZXQgPSAhIXNldHMgPyBbLi4uc2V0c10gOiBbLi4udGhpcy5zZXRzXTtcclxuICAgICAgICBzZXQuc29ydCgoYSwgYikgPT4gYS5kaXN0YW5jZVN1bSAtIGIuZGlzdGFuY2VTdW0pO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0VGV4dChzZXRbaV0uc2hvdygpICsgXCJcXG5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0QmVzdChzZXRzKSB7XHJcbiAgICAgICAgbGV0IG1pbiA9IDA7XHJcbiAgICAgICAgbGV0IG1pbkluZGV4ID0gLTE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXRzLmxlbmd0aDsgaSsrKSB7IC8vV0VJR0hUX01BWCA9IDg2IC8vICowLjhcclxuICAgICAgICAgICAgaWYgKHNldHNbaV0uZGlzdGFuY2VTdW0gPCBtaW4gfHwgaSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbWluID0gc2V0c1tpXS5kaXN0YW5jZVN1bTtcclxuICAgICAgICAgICAgICAgIG1pbkluZGV4ID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2V0c1ttaW5JbmRleF07XHJcbiAgICB9XHJcbiAgICBjaG9vc2VQYXIoKSB7XHJcbiAgICAgICAgY29uc3QgcGFyID0gW107XHJcbiAgICAgICAgcGFyWzBdID0gdGhpcy5zZXRzW2NvbnN0c18xLmdldFJuZEludGVnZXIoMCwgY29uc3RzXzEuU0VUX04pXTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHBhclsxXSA9IHRoaXMuc2V0c1tjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIGNvbnN0c18xLlNFVF9OKV07XHJcbiAgICAgICAgfSB3aGlsZSAocGFyWzBdID09PSBwYXJbMV0pO1xyXG4gICAgICAgIHJldHVybiBwYXI7XHJcbiAgICB9XHJcbiAgICBjaG9vc2VCZXN0UGFyKCkge1xyXG4gICAgICAgIGxldCBzZWxlY3QgPSBbLi4udGhpcy5zZXRzXTtcclxuICAgICAgICBsZXQgUyA9IFtdO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgY29uc3QgYmVzdCA9IHRoaXMuZ2V0QmVzdChzZWxlY3QpO1xyXG4gICAgICAgICAgICBTLnB1c2goYmVzdCk7XHJcbiAgICAgICAgICAgIHNlbGVjdC5zcGxpY2Uoc2VsZWN0LmluZGV4T2YoYmVzdCksIDEpO1xyXG4gICAgICAgIH0gd2hpbGUgKFMubGVuZ3RoIDwgMik7XHJcbiAgICAgICAgcmV0dXJuIFM7XHJcbiAgICB9XHJcbiAgICBkb3VibGVDcm9zcyhzMSwgczIpIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IHNldF8xLk15U2V0KHRoaXMuaXRlbXMpO1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHMxLmdlbm90eXBlLmxlbmd0aDtcclxuICAgICAgICBsZXQgW3N0YXJ0LCBlbmRdID0gdGhpcy5nZW5lcmF0ZVN0YXJ0RW5kKGxlbmd0aCk7XHJcbiAgICAgICAgbGV0IGNvcHlQYXJlbnQgPSBjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIDIpID09PSAwID8gczEgOiBzMjtcclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgICAgICByZXMuZ2Vub3R5cGVbaV0gPSBjb3B5UGFyZW50Lmdlbm90eXBlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb3B5UGFyZW50ID0gY29weVBhcmVudCA9PT0gczEgPyBzMiA6IHMxO1xyXG4gICAgICAgIGZvciAobGV0IHggPSBlbmQsIGkgPSAwOyAoeCAtIGVuZCkgPCBsZW5ndGggLSAoZW5kIC0gc3RhcnQpOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGNvcHlQYXJlbnQuZ2Vub3R5cGVbKGkgKyB4KSAlIGxlbmd0aF07XHJcbiAgICAgICAgICAgIGlmIChyZXMuZ2Vub3R5cGUuaW5jbHVkZXMoY2l0eSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlcy5nZW5vdHlwZVt4KysgJSBsZW5ndGhdID0gY2l0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgY2h1bmtTZWxjZXRlZENyb3NzKHMxLCBzMikge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgc2V0XzEuTXlTZXQodGhpcy5pdGVtcyk7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gczEuZ2Vub3R5cGUubGVuZ3RoO1xyXG4gICAgICAgIGxldCBbc3RhcnQsIGVuZF0gPSB0aGlzLmdlbmVyYXRlU3RhcnRFbmQobGVuZ3RoKTtcclxuICAgICAgICBsZXQgY29weVBhcmVudCA9IGNvbnN0c18xLmdldFJuZEludGVnZXIoMCwgMikgPT09IDAgPyBzMSA6IHMyO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlcy5nZW5vdHlwZVtpXSA9IGNvcHlQYXJlbnQuZ2Vub3R5cGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvcHlQYXJlbnQgPSBjb3B5UGFyZW50ID09PSBzMSA/IHMyIDogczE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGVuZDsgKGkgLSBlbmQpIDwgbGVuZ3RoIC0gKGVuZCAtIHN0YXJ0KTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaXR5ID0gY29weVBhcmVudC5nZW5vdHlwZVsoaSkgJSBsZW5ndGhdO1xyXG4gICAgICAgICAgICB3aGlsZSAocmVzLmdlbm90eXBlLmluY2x1ZGVzKGNpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHJlcy5nZW5vdHlwZS5pbmRleE9mKGNpdHkpO1xyXG4gICAgICAgICAgICAgICAgY2l0eSA9IGNvcHlQYXJlbnQuZ2Vub3R5cGVbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlcy5nZW5vdHlwZVtpICUgbGVuZ3RoXSA9IGNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIGdlbmVyYXRlU3RhcnRFbmQobGVuZ2h0KSB7XHJcbiAgICAgICAgY29uc3QgcmFuZCA9IFtjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIGxlbmdodCksIGNvbnN0c18xLmdldFJuZEludGVnZXIoMCwgbGVuZ2h0KV07XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gTWF0aC5taW4oLi4ucmFuZCk7XHJcbiAgICAgICAgbGV0IGVuZCA9IE1hdGgubWF4KC4uLnJhbmQpO1xyXG4gICAgICAgIGlmIChzdGFydCA9PT0gZW5kKSB7XHJcbiAgICAgICAgICAgIGVuZCArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZW5kID4gbGVuZ2h0KSB7XHJcbiAgICAgICAgICAgIHN0YXJ0IC09IDI7XHJcbiAgICAgICAgICAgIGVuZCAtPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xyXG4gICAgfVxyXG4gICAgaW52ZXJzaW9uTXV0YXRpb24oc2V0KSB7XHJcbiAgICAgICAgY29uc3QgbmV3U2V0ID0gc2V0LmNvcHkoKTtcclxuICAgICAgICBsZXQgW3N0YXJ0LCBlbmRdID0gdGhpcy5nZW5lcmF0ZVN0YXJ0RW5kKHNldC5nZW5vdHlwZS5sZW5ndGgpO1xyXG4gICAgICAgIG5ld1NldC5nZW5vdHlwZSA9IFsuLi5zZXQuZ2Vub3R5cGUuc2xpY2UoMCwgc3RhcnQpLCAuLi5zZXQuZ2Vub3R5cGUuc2xpY2Uoc3RhcnQsIGVuZCkucmV2ZXJzZSgpLCAuLi5zZXQuZ2Vub3R5cGUuc2xpY2UoZW5kKV07XHJcbiAgICAgICAgbmV3U2V0LnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gbmV3U2V0O1xyXG4gICAgfVxyXG4gICAgcG9pbnRlck11dGF0aW9uKHNldCkge1xyXG4gICAgICAgIGNvbnN0IGJpdEluZGV4ID0gY29uc3RzXzEuZ2V0Um5kSW50ZWdlcigxLCBjb25zdHNfMS5JVEVNX04gLSAxKTtcclxuICAgICAgICBjb25zdCByYW5kb21Qb3MgPSBjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIDIpO1xyXG4gICAgICAgIGNvbnN0IG5ld1NldCA9IHNldC5jb3B5KCk7XHJcbiAgICAgICAgbGV0IG1vZGlmID0gMTtcclxuICAgICAgICBpZiAocmFuZG9tUG9zID09PSAwKSB7XHJcbiAgICAgICAgICAgIG1vZGlmID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFtuZXdTZXQuZ2Vub3R5cGVbYml0SW5kZXhdLCBuZXdTZXQuZ2Vub3R5cGVbYml0SW5kZXggKyBtb2RpZl1dID0gW25ld1NldC5nZW5vdHlwZVtiaXRJbmRleCArIG1vZGlmXSwgbmV3U2V0Lmdlbm90eXBlW2JpdEluZGV4XV07XHJcbiAgICAgICAgbmV3U2V0LnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gbmV3U2V0O1xyXG4gICAgfVxyXG4gICAgc2VsZWN0aW9uUmFuZG9tKGNoaWxkcywgbSkge1xyXG4gICAgICAgIGxldCByZXMgPSBuZXcgQXJyYXkobSk7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgY29weUNoaWxkID0gWy4uLmNoaWxkc107XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBsZXQgcmFuZCA9IGNvbnN0c18xLmdldFJuZEludGVnZXIoMCwgY29weUNoaWxkLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJlc1tjb3VudCsrXSA9IGNvcHlDaGlsZFtyYW5kXTtcclxuICAgICAgICAgICAgY29weUNoaWxkLnNwbGljZShyYW5kLCAxKTtcclxuICAgICAgICB9IHdoaWxlIChjb3VudCAhPT0gbSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHNlbGVjdFByb3BvcnRpb24oY2hpbGRzLCBuZXh0Qykge1xyXG4gICAgICAgIGxldCBzdW1EaXN0ID0gMDtcclxuICAgICAgICBsZXQgbWlkbENvc3Q7XHJcbiAgICAgICAgbGV0IEMgPSBbLi4uY2hpbGRzXTtcclxuICAgICAgICBsZXQgUyA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjaGlsZHMpIHtcclxuICAgICAgICAgICAgc3VtRGlzdCArPSBpLmRpc3RhbmNlU3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtaWRsQ29zdCA9IHN1bURpc3QgLyBjaGlsZHMubGVuZ3RoO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgbGV0IHJhbmQ7XHJcbiAgICAgICAgICAgIHJhbmQgPSBjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIHN1bURpc3QpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5kIC0gQ1tpXS5kaXN0YW5jZVN1bSAvIG1pZGxDb3N0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFMucHVzaChDW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBDLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gd2hpbGUgKFMubGVuZ3RoIDwgbmV4dEMpO1xyXG4gICAgICAgIHJldHVybiBTO1xyXG4gICAgfVxyXG4gICAgYml0dHVybmlyKGNoaWxkcywgbmV4dENoaWxkLCBjb3VudENoaWxkID0gNCkge1xyXG4gICAgICAgIGxldCBDID0gWy4uLmNoaWxkc107XHJcbiAgICAgICAgbGV0IFMgPSBbXTtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50Q2hpbGQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhbmQgPSBjb25zdHNfMS5nZXRSbmRJbnRlZ2VyKDAsIEMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKENbcmFuZF0pO1xyXG4gICAgICAgICAgICAgICAgQy5zcGxpY2UocmFuZCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgYmVzdCA9IHRoaXMuZ2V0QmVzdChzZWxlY3QpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHNlbGVjdC5pbmRleE9mKGJlc3QpO1xyXG4gICAgICAgICAgICBTW2NvdW50XSA9IHNlbGVjdFtpbmRleF07XHJcbiAgICAgICAgICAgIHNlbGVjdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBDID0gWy4uLkMsIC4uLnNlbGVjdF07XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSB3aGlsZSAoY291bnQgPCBuZXh0Q2hpbGQpO1xyXG4gICAgICAgIHJldHVybiBTO1xyXG4gICAgfVxyXG4gICAgbmV3UG9wdWxhdGlvbihuZXdQKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRzW2ldID0gbmV3UFtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZ2UrKztcclxuICAgIH1cclxuICAgIGVuZChsb3dFZGdlLCBiZXN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGJlc3QuZGlzdGFuY2VTdW0gPCBsb3dFZGdlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTWFpbiA9IE1haW47XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNvbnN0c18xID0gcmVxdWlyZShcIi4vY29uc3RzXCIpO1xyXG5jbGFzcyBNeVNldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpdGVtcywgX3JhbmRvbSA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xyXG4gICAgICAgIHRoaXMuZ2Vub3R5cGUgPSBbXTtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlU3VtID0gMDtcclxuICAgICAgICBpZiAoIV9yYW5kb20pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlU3VtID0gMDtcclxuICAgICAgICBsZXQgbnVtYmVyX2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG51bWJlcl9saXN0LnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gKGNvbnN0c18xLmdldFJuZEludGVnZXIoMCwgbnVtYmVyX2xpc3QubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2Vub3R5cGVbaV0gPSAobnVtYmVyX2xpc3Quc3BsaWNlKGluZGV4LCAxKVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuICAgICAgICBjb25zdCBuZXdTZXQgPSBuZXcgTXlTZXQoWy4uLnRoaXMuaXRlbXNdKTtcclxuICAgICAgICBuZXdTZXQuZ2Vub3R5cGUgPSBbLi4udGhpcy5nZW5vdHlwZV07XHJcbiAgICAgICAgbmV3U2V0LmRpc3RhbmNlU3VtID0gdGhpcy5kaXN0YW5jZVN1bTtcclxuICAgICAgICByZXR1cm4gbmV3U2V0O1xyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICBsZXQgc3RyID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdlbm90eXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBjb25zdHNfMS5zaG93TnVtYmVyKHRoaXMuZ2Vub3R5cGVbaV0gKyAxLCAyLCAwKSArIFwiIFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFwi0KDQsNGB0YHRgtC+0Y/QvdC40LUgPSBcIiArIGNvbnN0c18xLnNob3dOdW1iZXIodGhpcy5kaXN0YW5jZVN1bSwgMywgMikgKyAnICcgKyBzdHIpO1xyXG4gICAgfVxyXG4gICAgcmVmcmVzaCgpIHtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlU3VtID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2l0eSA9IHRoaXMuZ2Vub3R5cGVbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNpdHkxID0gdGhpcy5nZW5vdHlwZVtpIC0gMV07XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdGFuY2VTdW0gKz0gdGhpcy5pdGVtc1tjaXR5MV0uZGlzdGFuY2VbY2l0eV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGlzdGFuY2VTdW0gKz0gdGhpcy5pdGVtc1t0aGlzLmdlbm90eXBlW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV1dLmRpc3RhbmNlW3RoaXMuZ2Vub3R5cGVbMF1dO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTXlTZXQgPSBNeVNldDtcclxuIl19
