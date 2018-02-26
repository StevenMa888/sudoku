<template>
<!--   <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div> -->
    <div id="app" class="container">
        <h2 class="text-center">添加用户</h2>
        <form class="form-horizontal">
            <div class="form-group">
                <label for="name" class="control-label col-sm-2 col-sm-offset-2">姓 名：</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model="user.name" placeholder="请输入姓名">
                </div>
            </div>
            <div class="form-group">
                <label for="age" class="control-label col-sm-2 col-sm-offset-2">年 龄：</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" id="age" v-model="user.age" placeholder="请输入年龄">
                </div>
            </div>
            <div class="form-group">
                <label for="email" class="control-label col-sm-2 col-sm-offset-2">邮 箱：</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" id="email" v-model="user.email" placeholder="请输入邮箱">
                </div>
            </div>
            <div class="form-group text-center">
                <input type="button" value="添  加" class="btn btn-primary" @click="addUser">
                <input type="reset" value="重  置" class="btn btn-primary">
            </div>
        </form>
        <br/>
        <table class="table table-bordered table-hover">
            <caption class="h3 text-center text-info">用户列表</caption>
            <thead>
            <tr>
                <th class="text-center">
                    <input type="checkbox" @click="toggleAll" v-model="selectAll">
                </th>
                <th class="text-center">序号</th>
                <th class="text-center">姓名</th>
                <th class="text-center">年龄</th>
                <th class="text-center">邮箱</th>
                <th class="text-center">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in users" class="text-center">
                <td>
                    <input type="checkbox" :value="index" :id="index" v-model="delIndexes" @click="selectAll = false">
                </td>
                <td>{{ index+1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.age }}</td>
                <td>{{ user.email }}</td>
                <td>
                    <button class="btn btn-danger" data-toggle="modal" data-target="#del" @click="nowIndex = index;delIndexes=[rowIndex];deleteUser()">
                        删除
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="6" class="text-right">
                    <button class="btn btn-danger" data-toggle="modal" data-target="#del" @click="nowIndex = -1;delIndexes=[];deleteUser()">
                        删除所有
                    </button>
                    <button class="btn btn-danger" :data-toggle="modalToggle" :data-target="modalTarget"
                            :class="{disabled:disableDelSelect}" @click="deleteUser">
                        删除选中
                    </button>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- 弹出框 -->
        <div class="modal" id="del">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                        <h4 class="modal-title" v-show="delIndexes.length > 0">
                            确认要删除用户
                            <span v-for="(value, index) in delIndexes">
                                {{ users[value].name }}
                                <span v-if="index < delIndexes.length - 1">、</span>
                            </span>
                            吗？
                        </h4>
                        <h4 class="modal-title" v-show="delIndexes.length === 0 && nowIndex !== -1">
                            确认要删除用户{{ users[nowIndex] ? users[nowIndex].name : '' }}吗？
                        </h4>
                        <h4 class="modal-title" v-show="delIndexes.length === 0 && nowIndex === -1">
                            确认要删除所有用户吗？
                        </h4>
                    </div>
                    <div class="modal-body text-center">
                        <button class="btn btn-primary" data-dismiss="modal">取消</button>
                        <button class="btn btn-primary" data-dismiss="modal" @click="deleteUser">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      user: {},
      users: [
        {name: 'Switch', age: 25, email: 'switchvov@163.com'},
        {name: 'Kitty', age: 25, email: 'kitty@163.com'}
      ],
      nowIndex: -1, // 当前要删除项的索引
      delIndexes: [], // 删除项索引列表
      selectAll: false, // 删除所有
      disableDelSelect: true, // 关闭删除选项
      modalTarget: '',
      modalToggle: ''
    }
  },
  methods: {
    addUser: function () {
      this.users.push(this.user)
      this.user = {}
    },
    deleteUser: function () {
      if (this.delIndexes.length > 0) {
        // 从大到小排序，不排序则会出现删除错乱
        this.delIndexes.sort(function (a, b) {
          return b - a
        })
        for (let i = 0; i < this.delIndexes.length; i++) {
          this.users.splice(this.delIndexes[i], 1)
        }
        this.delIndexes = []
        this.selectAll = false
        return
      }
      if (this.nowIndex === -1) {
        this.users = []
        return
      }
      this.users.splice(this.nowIndex, 1)
    },
    toggleAll: function () {
      if (this.selectAll) {
        let length = this.users.length
        this.delIndexes = []
        for (let i = 0; i < length; i++) {
          this.delIndexes.push(i)
        }
        return
      }
      this.delIndexes = []
    }
  },
  watch: {
    delIndexes: function () {
      if (this.delIndexes.length > 0) {
        this.disableDelSelect = false
        this.modalTarget = '#del'
        this.modalToggle = 'modal'
        return
      }
      this.disableDelSelect = true
    }
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
</style>
