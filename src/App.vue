<template>
  <div id="app" class="container">
      <h2 class="text-center">Sudoku</h2>
      <table class="sudoku" border="1" cellspacing="0">
        <tr v-for="x in 9">
          <td v-for="y in 9">
            <input type="number" min="1" max= "9" v-model.number="cells[x-1][y-1]"/>
          </td>
        </tr>
      </table>
      <button class="btn btn-primary run" @click="runRule1">Run Rule 1</button>
      <button class="btn btn-primary run" @click="runRule2">Run Rule 2</button>
      <button class="btn btn-primary run" @click="runRule3">Run Rule 3</button>
      <button class="btn btn-primary run" @click="runRule4">Run Rule 4</button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  class Block {
    constructor(public x: number, public y: number, public value: number = 0, public possibleValues: Array<number> = []) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.possibleValues = possibleValues;
    }
  }

  @Component({})
  export default class App extends Vue {
    // initilize data
    cells = [
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
    heng: Array<Array<Array<number>>> = [];
    shu: Array<Array<Array<number>>>  = [];
    jiu: Array<Array<Array<number>>>  = [];
    // cell: [
    //   ["","","","","","","","4",""],
    //   ["","8","7","4","","","","","5"],
    //   ["","2","4","6","","","","1","3"],
    //   ["6","","3","","","1","5","",""],
    //   ["9","","8","","6","4","3","",""],
    //   ["","","","","5","","","",""],
    //   ["","","9","","3","8","","5","4"],
    //   ["","","","","4","2","","","6"],
    //   ["","","","","","6","","8","7"]
    // ]
    
    // methods
    compute () {
      const vm = this;
      var group = function () {
        for (let i = 0; i < 9; i++) {
          vm.heng[i] = [];
          vm.shu[i] = [];
          vm.jiu[i] = [];
          for (let j = 0; j < 9; j++) {
            vm.heng[i][j] = [i, j];
            vm.shu[i][j] = [j, i]
            vm.jiu[i][j] = [3 * Math.floor(i/3) + Math.floor(j/3), 3 * (i%3) + j%3]
          }
          // for (let j = 0; j < 9; j++) {
          //   vm.heng[i][j] = vm.cells[i][j] == "" ? 0 : vm.cells[i][j];
          //   vm.shu[i][j] = vm.cells[j][i] == "" ? 0 : vm.cells[j][i];
          //   let jiuValue = vm.cells[3 * Math.floor(i/3) + Math.floor(j/3)][3 * (i%3) + j%3];
          //   vm.jiu[i][j] = jiuValue == "" ? 0 : jiuValue;
          // }
        }
      };

      group()
    }

    runRule1 () {
      const vm = this
      var groups = [vm.heng, vm.shu, vm.jiu]
      groups.forEach(g => vm.runRuleForGroup(vm.rule1, g))
    }

    runRule2 () {
      const vm = this
      // var cellWhole = vm.cells.reduceArray()
      // var numCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      // numCount = numCount.map(n => cellWhole.countOf(n))
      var fills = vm.rule2()
      fills.forEach(f => {
        vm.cells[f[0][0]].splice(f[0][1], 1, f[1])
      })
    }

    runRule3 () {
      const vm = this
      // var cellWhole = vm.cells.reduceArray()
      // var numCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      // numCount = numCount.map(n => cellWhole.countOf(n))
      var fills = vm.rule3()
      fills.forEach(f => {
        vm.cells[f[0][0]].splice(f[0][1], 1, f[1])
      })
    }

    runRule4 () {
      const vm = this
      // var cellWhole = vm.cells.reduceArray()
      // var numCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      // numCount = numCount.map(n => cellWhole.countOf(n))
      var fills = vm.rule4()
      fills.forEach(f => {
        vm.cells[f[0][0]].splice(f[0][1], 1, f[1])
      })
    }

    convert (arr) {
      return arr.map(i => this.cells[i[0]][i[1]] == "" ? 0 : this.cells[i[0]][i[1]])
    }

    runRuleForGroup  (rule, group) {
      const vm = this
      var fills = group.map(rule).reduceArray()
      // fills example:
      // [[[0,0], 5],
      //  [[2,1], 3],
      //  [[5,6], 8]]
      fills.forEach(f => {
        // 由于JavaScript的限制，Vue不能检测这种利用索引直接设置一个项的改动，可以用Vue.set
        // 或者splice方法。然而这里识别不出Vue而且我们用的是二维数组，所以只好用splice了。
        vm.cells[f[0][0]].splice(f[0][1], 1, f[1])
        // Vue.set(vm.cells[f[0][0]], f[0][1], f[1])
        // vm.cells[f[0][0]][f[0][1]] = f[1]
      })
      // group = group.map(rule)
    }

    // fill the last value if the group is missing only one element
    rule1 (arr) {
      var arrVal = this.convert(arr)
      var fills: Array<any> = []
      if (arrVal.countOf(0) == 1) {
        let sum = 0
        arrVal.forEach(e => sum = sum + e)
        let idx = arrVal.indexOf(0)
        fills.push([arr[idx], 45 - sum])
      }
      // if (arr.countOf(0) == 1) {
      //   let sum = 0
      //   arr.forEach(e => sum = sum + e)
      //   arr[arr.indexOf(0)] = 45 - sum
      // }
      return fills
    }

    // scan three hoziontal lines at a time, since each horizontal line should have a number exactly
    // once, cross vertical lines to see if there is some definite element that can be filled
    rule2 () {
      const vm = this
      var fills: Array<any> = []
      for (let i = 0; i < 9; i += 3) {
        // combine all numbers of the three heng lines
        var heng3 = vm.heng[i].concat(vm.heng[i+1]).concat(vm.heng[i+2])
        var heng3Val = vm.convert(heng3)
        // count occurrence for each number
        var nums = {1: [], 2: [], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]}
        for (let j = 0; j < 27; j ++ ) {
          if (heng3Val[j] != 0) {
            nums[heng3Val[j]].push({p: heng3[j], v: heng3Val[j]})
          }
        }
        for (let k = 1; k <= 9; k++) {
          if (nums[k].length == 2) { // only 1 heng line is missing k
            let heng1 = nums[k][0].p[0]
            let heng2 = nums[k][1].p[0]
            let jiu1 = 3 * Math.floor(heng1 / 3) + Math.floor(nums[k][0].p[1] / 3)
            let jiu2 = 3 * Math.floor(heng2 / 3) + Math.floor(nums[k][1].p[1] / 3)
            var jiu3 = (i != jiu1 && i != jiu2) ? i : ((i + 1) != jiu1 && (i + 1) != jiu2)? (i + 1) : (i + 2) // the target jiu group should be among the three adjacent jiu groups
            var targetHeng = (i != heng1 && i != heng2) ? i : ((i + 1) != heng1 && (i + 1) != heng2)? (i + 1) : (i + 2) // the target cell should be among the three adjacent heng lines
            let startShu = (jiu3 - 3 * Math.floor(targetHeng / 3)) * 3 // narrow down the target cell shu lines
            let countShu1 = vm.convert(vm.shu[startShu]).countOf(k) | Number((vm.cells[targetHeng][startShu] != "")) // if this line contains k or the cell is occupied, then it is counted as 1
            let countShu2 = vm.convert(vm.shu[startShu + 1]).countOf(k) | Number((vm.cells[targetHeng][startShu + 1] != ""))
            let countShu3 = vm.convert(vm.shu[startShu + 2]).countOf(k) | Number((vm.cells[targetHeng][startShu + 2] != ""))
            // if both of the other two lines contains k or the position is occupied, then the left target cell can only be k
            if (countShu1 + countShu2 + countShu3 == 2) {
              var targetShu = countShu1 == 0 ? startShu : countShu2 == 0 ? startShu + 1 : startShu + 2
              fills.push([[targetHeng, targetShu], k])
            }
          }
        }
      }
      return fills
    }

    // scan three vertical lines at a time, since each vertical line should have a number exactly
    // once, cross horizontal lines to see if there is some definite element that can be filled
    rule3 () {
      const vm = this
      var fills: Array<any> = []
      for (let i = 0; i < 9; i += 3) {
        var shu3 = vm.shu[i].concat(vm.shu[i+1]).concat(vm.shu[i+2])
        var shu3Val = vm.convert(shu3)
        var nums = {1: [], 2: [], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]}
        for (let j = 0; j < 27; j ++ ) {
          if (shu3Val[j] != 0) {
            nums[shu3Val[j]].push({p: shu3[j], v: shu3Val[j]})
          }
        }
        for (let k = 1; k <= 9; k++) {
          if (nums[k].length == 2) {
            let shu1 = nums[k][0].p[1]
            let shu2 = nums[k][1].p[1]
            let jiu1 = 3 * Math.floor(nums[k][0].p[0] / 3) + Math.floor(shu1 / 3)
            let jiu2 = 3 * Math.floor(nums[k][1].p[0] / 3) + Math.floor(shu2 / 3)
            var jiu3 = (3 - Math.floor(jiu1 / 3) - Math.floor(jiu2 / 3)) * 3 + i / 3 // 0, 3, 6 or 1, 4, 7 or 2, 5, 8
            var targetShu = (i != shu1 && i != shu2) ? i : ((i + 1) != shu1 && (i + 1) != shu2)? (i + 1) : (i + 2)
            let startHeng = jiu3 - Math.floor(targetShu / 3)
            let countHeng1 = vm.convert(vm.heng[startHeng]).countOf(k) | Number((vm.cells[startHeng][targetShu] != "")) // if this line contains k or the cell is occupied, then it is counted as 1
            let countHeng2 = vm.convert(vm.heng[startHeng + 1]).countOf(k) | Number((vm.cells[startHeng + 1][targetShu] != ""))
            let countHeng3 = vm.convert(vm.heng[startHeng + 2]).countOf(k) | Number((vm.cells[startHeng + 2][targetShu] != ""))
            // if both of the other two lines contains k or the position is occupied, then the left target cell can only be k
            if (countHeng1 + countHeng2 + countHeng3 == 2) {
              var targetHeng = countHeng1 == 0 ? startHeng : countHeng2 == 0 ? startHeng + 1 : startHeng + 2
              fills.push([[targetHeng, targetShu], k])
            }
          }
        }
      }
      return fills
    }

    // scan each cell, list all number occurrence for its corresponding heng, shu and jiu groups, if
    // there is only one number left, fill that number
    rule4 () {
      const vm = this
      var fills: Array<any> = []
      for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j ++) {
          if (vm.cells[i][j] == "") {
            let g1 = i // heng group that the current cell belongs to
            let g2 = j // shu group...
            let g3 = 3 * Math.floor(g1 / 3) + Math.floor(g2 / 3) // jiu group...
            var nums = vm.convert(vm.heng[g1]).concat(vm.convert(vm.shu[g2])).concat(vm.convert(vm.jiu[g3]))
            var nonFillable = {}
            nums.forEach(n => nonFillable[n] = 1)
            var fillable = [1,2,3,4,5,6,7,8,9].filter(n => !nonFillable[n])
            if (fillable.length == 1) {
              fills.push([[i, j], fillable[0]])
            }
          }
        }
      }
      return fills
    }

    // declare lifecycle hook
    mounted () {
      Object.defineProperties(Array.prototype, {
        countOf: {
          value: function(value) {
            return this.reduce(function(total,x){return x == value ? total + 1 : total}, 0)
          }
        },
        reduceArray: {
          value: function() {
            let initialArray = []
            return this.reduce((initialArray, arr) => initialArray.concat(arr))
          }
        },
        max: {
          value: function() {
            let max = this[0]
            let index = 0
            let len = this.length 
            for (let i = 1; i < len; i++){ 
              if (this[i] > max) { 
                max = this[i]
                index = i
              }
            }
            return [max, index]
          }
        }
      });
      this.compute()
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
    width: 40px;
    height: 40px;
    padding: 0;
  }
  .sudoku input{
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
</style>
