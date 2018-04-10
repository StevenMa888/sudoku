<template>
  <div id="app" class="container">
      <h2 class="text-center">Sudoku</h2>
      <table class="sudoku" border="1" cellspacing="0">
        <tr v-for="x in 9">
          <td v-for="y in 9">
            <input v-if="cells[x-1][y-1].value!='' || cells[x-1][y-1].possibleValues.length==0" type="number" min="1" max= "9" v-model.number="cells[x-1][y-1].value"/>
            <textarea class= "hint" v-if="cells[x-1][y-1].value=='' && cells[x-1][y-1].possibleValues.length>0" v-model="cells[x-1][y-1].possibleValues.join('')"/>
          </td>
        </tr>
      </table>
      <button class="btn btn-primary run" @click="runRule1">Run Rule 1</button>
      <button class="btn btn-primary run" @click="runRule2">Run Rule 2</button>
      <button class="btn btn-primary run" @click="runRule3">Run Rule 3</button>
      <button class="btn btn-primary run" @click="runRule4">Run Rule 4</button>
      <button class="btn btn-primary run" @click="runRule5">Run Rule 5</button>
      <button class="btn btn-primary run" @click="runRule6">Run Rule 6</button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  class Cell {
    constructor(public x: number, public y: number, public value: any = 0, public possibleValues: Array<number> = []) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.possibleValues = possibleValues;
    }
  }

  class Sudoku {
    cells: Object = {};

    constructor(rawCells: Array<Array<any>>) {
      this.cells = this.convert2DArrayToObject(rawCells);
    }

    convert2DArrayToObject (arr2: Array<Array<any>>) : Object {
      let object: Object = {};
      arr2.forEach((arr: Array<any>, x: number) => {
        object[x] = {};
        arr.forEach((v: any, y: number) => {
          object[x][y] = new Cell(x, y, v);
        })
      })
      return object;
    }
  }

  @Component({})
  export default class App extends Vue {
    // initilize data
    rawCells: Array<Array<any>> = [
      ["","","","","","","",4,""],
      ["",8,7,4,"","","","",5],
      ["",2,4,6,"","","",1,3],
      [6,"",3,"","",1,5,"",""],
      [9,"",8,"",6,4,3,"",""],
      ["","","","",5,"","","",""],
      ["","",9,"",3,8,"",5,4],
      ["","","","",4,2,"","",6],
      ["","","","","",6,"",8,7]
    ];
    sudoku: Sudoku = new Sudoku(this.rawCells);
    cells: Object = this.sudoku.cells;

    heng: Array<Array<Cell>>  = [];
    shu: Array<Array<Cell>>  = [];
    jiu: Array<Array<Cell>>  = [];
    
    // methods
    compute () {
      const vm = this;
      let group = function () {
        for (let i = 0; i < 9; i++) {
          vm.heng[i] = [];
          vm.shu[i] = [];
          vm.jiu[i] = [];
          for (let j = 0; j < 9; j++) {
            vm.heng[i][j] = vm.cells[i][j];
            vm.shu[i][j] = vm.cells[j][i];
            vm.jiu[i][j] = vm.cells[3 * Math.floor(i/3) + Math.floor(j/3)][3 * (i%3) + j%3];
          }
        }
      };

      group();
    }

    runRule1 () {
      const vm = this;
      let groups = [vm.heng, vm.shu, vm.jiu];
      groups.forEach(g => g.map(vm.rule1));
    }

    runRule2 () {
      this.rule2();
    }

    runRule3 () {
      this.rule3();
    }

    runRule4 () {
      this.rule4();
    }

    runRule5 () {
      this.rule5();
    }

    runRule6 () {
      this.rule6();
    }

    convert (arr: Array<Cell>) {
      return arr.map(c => c.value == "" ? 0 : c.value);
    }

    // fill the last value if the group is missing only one element
    rule1 (arr: Array<Cell>) {
      let arrVal: Array<number>= this.convert(arr);
      if (arrVal.countOf(0) == 1) {
        let sum = 0;
        arrVal.forEach(e => sum = sum + e);
        let idx = arrVal.indexOf(0);
        arr[idx].value = 45 - sum;
      }
    }

    // scan three hoziontal lines at a time, since each horizontal line should have a number exactly
    // once, cross vertical lines to see if there is some definite element that can be filled
    rule2 () {
      const vm = this;
      for (let i = 0; i < 9; i += 3) {
        // combine all numbers of the three heng lines
        let heng3 = vm.heng[i].concat(vm.heng[i+1]).concat(vm.heng[i+2]);
        let heng3Val: Array<number> = vm.convert(heng3);
        // count occurrence for each number
        let nums = {1: [], 2: [], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
        for (let j = 0; j < 27; j ++ ) {
          if (heng3Val[j] != 0) {
            nums[heng3Val[j]].push({c: heng3[j], v: heng3Val[j]});
          }
        }
        for (let k = 1; k <= 9; k++) {
          if (nums[k].length == 2) { // only 1 heng line is missing k
            let heng1 = nums[k][0].c.x;
            let heng2 = nums[k][1].c.x;
            let jiu1 = 3 * Math.floor(heng1 / 3) + Math.floor(nums[k][0].c.y / 3);
            let jiu2 = 3 * Math.floor(heng2 / 3) + Math.floor(nums[k][1].c.y / 3);
            let jiu3 = (i != jiu1 && i != jiu2) ? i : ((i + 1) != jiu1 && (i + 1) != jiu2)? (i + 1) : (i + 2); // the target jiu group should be among the three adjacent jiu groups
            let targetHeng = (i != heng1 && i != heng2) ? i : ((i + 1) != heng1 && (i + 1) != heng2)? (i + 1) : (i + 2); // the target cell should be among the three adjacent heng lines
            let startShu = (jiu3 - 3 * Math.floor(targetHeng / 3)) * 3 // narrow down the target cell shu lines
            let countShu1 = vm.convert(vm.shu[startShu]).countOf(k) | Number((vm.cells[targetHeng][startShu].value != "")); // if this line contains k or the cell is occupied, then it is counted as 1
            let countShu2 = vm.convert(vm.shu[startShu + 1]).countOf(k) | Number((vm.cells[targetHeng][startShu + 1].value != ""));
            let countShu3 = vm.convert(vm.shu[startShu + 2]).countOf(k) | Number((vm.cells[targetHeng][startShu + 2].value != ""));
            // if both of the other two lines contains k or the position is occupied, then the left target cell can only be k
            if (countShu1 + countShu2 + countShu3 == 2) {
              let targetShu = countShu1 == 0 ? startShu : countShu2 == 0 ? startShu + 1 : startShu + 2;
              vm.cells[targetHeng][targetShu].value = k;
            }
          }
        }
      }
    }

    // scan three vertical lines at a time, since each vertical line should have a number exactly
    // once, cross horizontal lines to see if there is some definite element that can be filled
    rule3 () {
      const vm = this;
      for (let i = 0; i < 9; i += 3) {
        let shu3 = vm.shu[i].concat(vm.shu[i+1]).concat(vm.shu[i+2]);
        let shu3Val: Array<number> = vm.convert(shu3);
        let nums = {1: [], 2: [], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
        for (let j = 0; j < 27; j ++ ) {
          if (shu3Val[j] != 0) {
            nums[shu3Val[j]].push({c: shu3[j], v: shu3Val[j]});
          }
        }
        for (let k = 1; k <= 9; k++) {
          if (nums[k].length == 2) {
            let shu1 = nums[k][0].c.y;
            let shu2 = nums[k][1].c.y;
            let jiu1 = 3 * Math.floor(nums[k][0].c.x / 3) + Math.floor(shu1 / 3);
            let jiu2 = 3 * Math.floor(nums[k][1].c.x / 3) + Math.floor(shu2 / 3);
            let jiu3 = (3 - Math.floor(jiu1 / 3) - Math.floor(jiu2 / 3)) * 3 + i / 3; // 0, 3, 6 or 1, 4, 7 or 2, 5, 8
            let targetShu = (i != shu1 && i != shu2) ? i : ((i + 1) != shu1 && (i + 1) != shu2)? (i + 1) : (i + 2);
            let startHeng = jiu3 - Math.floor(targetShu / 3);
            let countHeng1 = vm.convert(vm.heng[startHeng]).countOf(k) | Number((vm.cells[startHeng][targetShu].value != "")); // if this line contains k or the cell is occupied, then it is counted as 1
            let countHeng2 = vm.convert(vm.heng[startHeng + 1]).countOf(k) | Number((vm.cells[startHeng + 1][targetShu].value != ""));
            let countHeng3 = vm.convert(vm.heng[startHeng + 2]).countOf(k) | Number((vm.cells[startHeng + 2][targetShu].value != ""));
            // if both of the other two lines contains k or the position is occupied, then the left target cell can only be k
            if (countHeng1 + countHeng2 + countHeng3 == 2) {
              let targetHeng = countHeng1 == 0 ? startHeng : countHeng2 == 0 ? startHeng + 1 : startHeng + 2;
              vm.cells[targetHeng][targetShu].value = k;
            }
          }
        }
      }
    }

    // scan each cell, list all number occurrence for its corresponding heng, shu and jiu groups, if
    // there is only one number left, fill that number
    rule4 () {
      const vm = this;
      for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j ++) {
          let targetCell = vm.cells[i][j];
          if (targetCell.value == "") {
            if (targetCell.possibleValues.length == 1) {
              targetCell.value = targetCell.possibleValues[0];
              continue;
            }
            let g1 = i; // heng group that the current cell belongs to
            let g2 = j; // shu group...
            let g3 = 3 * Math.floor(g1 / 3) + Math.floor(g2 / 3); // jiu group...
            let nums: Array<number> = vm.convert(vm.heng[g1]).concat(vm.convert(vm.shu[g2])).concat(vm.convert(vm.jiu[g3]));
            let nonFillable = {};
            nums.forEach(n => nonFillable[n] = 1);
            let fillable = [1,2,3,4,5,6,7,8,9].filter(n => !nonFillable[n]);
            targetCell.possibleValues = fillable;
            if (fillable.length == 1) {
              targetCell.value = fillable[0];
            }
          }
        }
      }
    }

    // if in a group, only n possible values are for n blocks, then these n possible values
    // should be excluded in other blocks within the
    rule5 () {
      const vm = this;
      let allGroups = vm.heng.concat(vm.shu).concat(vm.jiu);
      let sortArray = function(a, b) {
        if (a.possibleValues.length > b.possibleValues.length) return 1;
        if (a.possibleValues.length < b.possibleValues.length) return -1;
        return a.possibleValues > b.possibleValues ? 1 : 0;
      }
      allGroups.forEach(g => {
        // only consider those non-fill blocks
        g = g.filter(c => c.possibleValues.length > 0);
        // sort array to make blocks with same possibleValues adjacent
        g.sort(sortArray);
        // find blocks with same possibleValues and store them based on length
        // e.x. {2: [[cell1, cell2]], 3: [[cell3, cell4], [cell4, cell5]]}
        let samePossibleValues: Object = {};
        for (let i = 0; i < g.length - 1; i++) {
          if (g[i].possibleValues.equals(g[i+1].possibleValues)) {
            let key = g[i].possibleValues.length;
            samePossibleValues[key] = samePossibleValues[key] ? samePossibleValues[key] : [];
            samePossibleValues[key].push([g[i], g[i+1]]);
          }
        }
        // merge pairs of same possibleValues based on length
        // e.x. {2: [[cell1, cell2]], 3: [[cell3, cell4, cell5]]}
        let lengths = Object.keys(samePossibleValues);
        let mergedSamePossibleValues: Object = {};
        for (let i = Math.min.apply(Math, lengths); i <= Math.max.apply(Math, lengths); i++) {
          let p = samePossibleValues[i];
          // length 2 doesn't need to merge pairs
          if (i == 2) {
            mergedSamePossibleValues[i] = p;
            continue;
          }
          // merge pairs based on length
          // e.x. {3: [[cell3, cell4, cell5], [cell7, cell8, cell9]], 4: [[cell1, cell2, cell6, cell7]]}
          for (let j = 0; j <= p.length - i + 1; j++) {
            let s = i - 2;
            while (s > 0) {
              p[j] = p[j].concat(p[j+1]);
              p.splice(j+1, 1);
              s--;
            }
            mergedSamePossibleValues[i] = mergedSamePossibleValues[i] ? mergedSamePossibleValues[i] : [];
            mergedSamePossibleValues[i].push([...new Set(p[j])]);
          }
        }
        let mergedLengths = Object.keys(mergedSamePossibleValues);
        mergedLengths.forEach(l => {
          mergedSamePossibleValues[l].forEach(m => {
            if (m.length == l) {
              let otherBlocks = g.filter(c => !m.includes(c));
              otherBlocks.forEach(c => c.possibleValues = c.possibleValues.filter(v => !m[0].possibleValues.includes(v)));
            }
          })
        })
      })
    }

    // for cases like [[1,2], [2,5], [1,5]], other blocks can also exclude [1,2,5]
    rule6 () {
      const vm = this;
      let allGroups = vm.heng.concat(vm.shu).concat(vm.jiu);
      let sortArray = function(a, b) {
        if (a.possibleValues.length > b.possibleValues.length) return 1;
        if (a.possibleValues.length < b.possibleValues.length) return -1;
        return a.possibleValues > b.possibleValues ? 1 : 0;
      }
      allGroups.forEach(g => {
        // only consider those non-fill blocks
        g = g.filter(c => c.possibleValues.length > 0);
        // sort array to make blocks with same length of possible values adjacent
        g.sort(sortArray);
        for (let n = g[0].possibleValues.length; n <= g[g.length - 1].possibleValues.length; n++) {
          for (let i = 0; i < g.length - n + 1 && g[i].possibleValues.length <=n ; i++) {
            let s = n - 1;
            let j = 1;
            let mergedCells: Array<Cell> = [g[i]];
            let mergedPossibleValues: Array<number> = g[i].possibleValues;
            while (s > 0) {
              mergedCells.push(g[i+j]);
              mergedPossibleValues = mergedPossibleValues.concat(g[i+j].possibleValues);
              j++;
              s--;
            }
            mergedPossibleValues = [...new Set(mergedPossibleValues)];
            if (n == mergedPossibleValues.length) {
              let otherBlocks = g.filter(c => !mergedCells.includes(c));
              otherBlocks.forEach(c => c.possibleValues = c.possibleValues.filter(v => !mergedPossibleValues.includes(v)));
            }
          }
        }
      })
    }

    // declare lifecycle hook
    mounted () {
      Array.prototype.countOf = function(value: number) {
        return this.reduce(function(total,x){return x == value ? total + 1 : total}, 0);
      }
      Array.prototype.reduceArray = function() {
        let initialArray = [];
        return this.reduce((initialArray, arr) => initialArray.concat(arr));
      }
      Array.prototype.max = function() {
        let max = this[0];
        let index = 0;
        let len = this.length;
        for (let i = 1; i < len; i++){ 
          if (this[i] > max) { 
            max = this[i];
            index = i;
          }
        }
        return [max, index];
      }
      Array.prototype.equals =  function (array) {
        // if the other array is a falsy value, return
        if (!array) return false;
 
        // compare lengths - can save a lot of time
        if (this.length != array.length) return false;
        
        for (var i = 0, l = this.length; i < l; i++) {
          // Check if we have nested arrays
          if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) return false;
          }
          else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
          }
        }
        return true;
      }
      this.compute();
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .sudoku {
    position: relative;
    left: 50%;
    width: 400px;
    margin-left: -200px;
  }
  .sudoku tr, .sudoku td {
    padding: 0;
  }
  .sudoku input, .sudoku textarea{
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    text-align: center;
    font-size: 20px;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  button.run {
    margin-top: 20px;
    font-size: 20px;
  }
  .hint {
    color: orange;
    font-size: 15px !important;
    resize: none;
    display: block;
  }
</style>