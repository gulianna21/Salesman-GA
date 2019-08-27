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
