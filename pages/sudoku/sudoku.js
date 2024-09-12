var app = getApp();

var SudokuMap = require('./SudokuMap.js');
var Solver = require('./Solver.js');
var config = {
  data : {
    checked: false,
    flag:1,
    initMap01: [
      [5, 0, 0, 3, 0, 2, 8, 6, 9],
      [0, 7, 6, 0, 1, 9, 2, 4, 0],
      [0, 0, 0, 0, 0, 4, 5, 7, 0],

      [0, 0, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 9, 0, 0, 4, 0, 6],
      [0, 9, 0, 1, 4, 0, 0, 0, 0],

      [3, 0, 1, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 7, 0, 0, 6, 1, 9, 5],
    ],
    initMap: [
      [5, 0, 0, 3, 0, 2, 8, 6, 9],
      [0, 7, 6, 0, 1, 9, 2, 4, 0],
      [0, 0, 0, 0, 0, 4, 5, 7, 0],

      [0, 0, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 9, 0, 0, 4, 0, 6],
      [0, 9, 0, 1, 4, 0, 0, 0, 0],

      [3, 0, 1, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 7, 0, 0, 6, 1, 9, 5],
    ],
    hhh: [
      [5, 0, 0, 3, 0, 2, 8, 6, 9],
      [0, 7, 6, 0, 1, 9, 2, 4, 0],
      [0, 0, 0, 0, 0, 4, 5, 7, 0],

      [0, 0, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 9, 0, 0, 4, 0, 6],
      [0, 9, 0, 1, 4, 0, 0, 0, 0],

      [3, 0, 1, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 7, 0, 0, 6, 1, 9, 5],
    ],
    
    choosingCell : [null, null],
    readyToInput : false,
    solveDone : false,
    timeElapse : '请点击求解'
  },

  onLoad : function() {
    var that =this
    wx.getStorage({
      key:'puzzle',
      success(res){
        console.log('获取的数据：',res.data)
        that.setData({
          initMap01:res.data,
          initMap:res.data
        })
        
      }
    })
  },
//背景音乐
  onShow : function() {
    this.player(wx.getBackgroundAudioManager())
  },
  player(e) {
    e.title = '背景音乐'
    e.src = "http://music.163.com/song/media/outer/url?id=1340439829.mp3"
    //音乐播放结束后继续播放此音乐，循环不停的播放
    e.onEnded(() => {
      this.player(wx.getBackgroundAudioManager())
    })
  },
   // 页面卸载时候暂停播放（不加页面将一直播放）
   onUnload: function () {
    wx.getBackgroundAudioManager().stop();
  },
  // 小程序隐藏时候暂停播放（不加页面将一直播放）
  onHide() {
    wx.getBackgroundAudioManager().stop();
  },
  /**
   * 跳转到'使用说明'
   */
  goToMenu : function() {
    wx.navigateTo({
      url: '../menu/menu'
    })
  },

  /**
   * 点击某个宫格
   */
  cellClick : function(e) {
    var cellId = e.target.id.split("_");
    this.setData({
      choosingCell : [parseInt(cellId[1]), parseInt(cellId[2])],
      readyToInput : true
    });
  },

  /**
   * 点击数字输入区的某个数字
   */
  
  inputNum : function(e) {
    if (this.data.solveDone || !this.data.readyToInput) {
      return;
    }
    
    var numToBeInput = e.target.dataset.num;
    var newMap = this.data.initMap;
    var newMap01=this.data.initMap01;
  
    let that = this
    wx.getStorage({
      key:'puzzle',
      success(res){
       var a=res.data[that.data.choosingCell[0]][that.data.choosingCell[1]]
       if(a==0){
         newMap[that.data.choosingCell[0]][that.data.choosingCell[1]] =numToBeInput;
         that.setData({
           flag:0,
           initMap : newMap
         });
       }
      },
      fail(){
       var a=newMap01[that.data.choosingCell[0]][that.data.choosingCell[1]]
       if(a==0){
        newMap[that.data.choosingCell[0]][that.data.choosingCell[1]] =numToBeInput;
        that.setData({
          flag:0,
          initMap : newMap
        });
        
      }
      },
    })
  },

  /**
   * 点击求解
   */
  doSolve : function() {
    if (this.data.solveDone) {
      return;
    }
    var allZero = true;
    process : {
      for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
          if (this.data.initMap[i][j] > 0) {
            allZero = false;
            break process;
          }
        }
      }
    }
    if (allZero) {
      return;
    }
    var map = new SudokuMap();
    map.init(this.data.initMap);
    if (!this.checkInitMapValidation(map)) {
      this.showErrMsg();
      return;
    }
    var solver = new Solver(map);
    var usedTime = solver.doSolve();
    this.setData({
      flag:0,
      initMap : solver.map.getResult(),
      solveDone : true,
      timeElapse : usedTime+'ms'
    });
  },

  /**
   * 点击空白区域
   */
  emptyAreaClick : function() {
    this.setData({
      choosingCell: [null, null],
      readyToInput: false
    });
  },

  /**
   * 点击重新开始
   */
  clean : function() {
    var hhh=[
      [5, 0, 0, 3, 0, 2, 8, 6, 9],
      [0, 7, 6, 0, 1, 9, 2, 4, 0],
      [0, 0, 0, 0, 0, 4, 5, 7, 0],

      [0, 0, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 9, 0, 0, 4, 0, 6],
      [0, 9, 0, 1, 4, 0, 0, 0, 0],

      [3, 0, 1, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 7, 0, 0, 6, 1, 9, 5],
    ];
    let that = this
    
    wx.getStorage({
      key:'puzzle',
      success(res){
        that.setData({
          initMap:res.data,
          choosingCell: [null, null],
          readyToInput: false,
          solveDone: false,
          timeElapse: '点击求解显示'
        })
      },
     fail(){
      that.setData({
        
        initMap:hhh,
        choosingCell: [null, null],
        readyToInput: false,
        solveDone: false,
        timeElapse: '点击求解显示'
      })
  
     }
    })
        
      
    
  },

  /**
   * 校验输入的初始数据是否正确
   * 在doSolve中被调用
   */
  checkInitMapValidation : function(map) {
    // 校验每一行
    for (var i=0; i<9; i++) {
      var flag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var rowNodes = map.getRow(i);
      for(var ii=0; ii<9; ii++) {
        if (rowNodes[ii].value == 0) {
          continue;
        }
        if (flag[rowNodes[ii].value] > 0) {
          return false;
        }
        flag[rowNodes[ii].value] = 1;
      }
    }
    // 校验每一列
    for (var i = 0; i < 9; i++) {
      var flag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var colNodes = map.getCol(i);
      for (var ii = 0; ii < 9; ii++) {
        if (colNodes[ii].value == 0) {
          continue;
        }
        if (flag[colNodes[ii].value] > 0) {
          return false;
        }
        flag[colNodes[ii].value] = 1;
      }
    }
    // 校验每个九宫格
    for (var i = 0; i < 9; i++) {
      var rowStart = parseInt(i/3)*3;
      var colStart = Math.round(i%3)*3;
      var tempNodes = new Array();
      for (var j=0; j<3; j++) {
        for (var jj=0; jj<3; jj++) {
          tempNodes[j*3 + jj] = map.getNode(rowStart+j, colStart+jj);
        }
      }
      var flag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var ii = 0; ii < 9; ii++) {
        if (tempNodes[ii].value == 0) {
          continue;
        }
        if (flag[tempNodes[ii].value] > 0) {
          return false;
        }
        flag[tempNodes[ii].value] = 1;
      }
    }
    return true;
  },

  /**
   * 当输入的初始数据有错误
   */
  showErrMsg : function() {
    wx.showModal({
      title: '提示',
      content: '同一行，同一列，同一九宫格，不能有重复的数字',
      showCancel: false
    })
  }
}

Page(config);