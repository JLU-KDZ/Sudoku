// pages/DifficultySelection/Select.js
var a
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  easy:function(){
    this.tap('easy')
  },
  normal:function(){
    this.tap('normal')
  },
  hard:function(){
    this.tap('hard')
  },
  veryhard:function(){
    this.tap('veryhard')
  },

  tap:function(a){
    wx.request({
      url:'http://apis.juhe.cn/fapig/sudoku/generate?key=&difficulty=normal',
      data:{"key":'f10bf1b5f85dd8ca348ac0b9bd3dac27',"difficulty":a},
      success:function(res){
        if(res.data.reason=='success'){
          console.log(res.data.result) 
          wx.setStorage({
            key:'puzzle',
            data:res.data.result.puzzle
          })
          
        }else{
          console.log(res.data.result)
          wx.showToast({
            title: '超过请求次数',
            icon:"error"
          })
        }
        
      }
      })
    wx.navigateTo({
            url: `/pages/sudoku/sudoku`,
          })
    }
   
  
})