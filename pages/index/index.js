// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     input:"",
     todos:[],
     leftCount:0,
     allCompleted:false,
     logs:[]
  },


   save:function(){
     wx.setStorageSync('todo_list', this.data.todos)
     wx.setStorageSync('todo_logs', this.data.logs)
   },

   load:function(){
     var todos = wx.getStorageSync('todo_list')
     if(todos){
       var leftCount = todos.filter(function(item){
            return !item.completed
       }).length
       this.setData({ todos: todos, leftCount: leftCount })
     }
     var logs = wx.getStorageSync('todo_logs')
     if(logs){
       this.setData({logs:logs})
     }
   },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.load()
  },


  inputChangeHandle:function(e){
    this.setData({input:e.detail.value})
   
   //注释 在控制台中直接打印
    // console.log({input:e.detail.value})
  },

  addTodoHandle:function(e){
    if(!this.data.input || !this.data.input.trim())
    return
    var todos = this.data.todos
    todos.push({name:this.data.input,completed:false})

    var logs = this.data.logs
    logs.push({timestamp:new Date(),action:'Add',name:this.data.input})
    this.setData({
      input: '',
      todos:todos,
      leftCount:this.data.leftCount+1,
      logs:logs
    })
    console.log("创建" ,logs)
    this.save()
  },
   
//更新操作,选中的操作
  toggleTodoHandle:function(e){
     var index = e.currentTarget.dataset.index
     var todos = this.data.todos
     todos[index].completed = !todos[index].completed
     var logs = this.data.logs
     logs.push({
       timestamp:new Date(),
       action:todos[index].completed?'Finish':'Restart',
       name:todos[index].name
     })
     this.setData({
       todos:todos,
       leftCount:this.data.leftCount + (todos[index].completed? -1:1),
       logs:logs
     })
    console.log("更新：",logs)
     this.save()
   },
   

   //删除操作
  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index

    console.log(index)
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })

    console.log({name:remove.name})
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      
      logs: logs
     

    })
     console.log("删除",logs)
    this.save()
    },


//选中所有清单

   toggleAllHandle:function(e){
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for(var i = todos.length -1 ; i>= 0;i--){
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp:new Date(),
      action:this.data.allCompleted? 'Finish':'Restart',
      name: 'All todos'
    })
    this.setData({
      todos:todos,
      leftCount:this.data.allCompleted?0 :todos.length,
      logs:logs
    })
    console.log("选中",log)
    this.save()
   },




//清除选中的清单

   clearCompletedHandle:function(e){
     var todos = this.data.todos
     
     var remains = []
     for(var i = 0;i<todos.length;i++){
       todos[i].completed || remains.push(todos[i])
     }
     var logs = this.data.logs
     logs.push({
       timestamp:new Date(),
       action:'Clear',
       name:'Completed todos'
     })
     this.setData({todos:remains,logs:logs})
     console.log("清除",logs)
     this.save()
   }
})