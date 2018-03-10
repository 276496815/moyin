Page({
  onChangeSong: function (e) {
    wx.navigateTo({
      url: '../list/index'
    })
  },
  onCompound: function (e) {
    wx.navigateTo({
      url: '../finish/index'
    })
  }
})