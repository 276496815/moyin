Page({
  data: {
    list: [{
      id: 0,
      album: '专辑1',
      song: '歌曲1'
    }, {
      id: 1,
      album: '专辑2',
      song: '歌曲2'
    }, {
      id: 2,
      album: '专辑3',
      song: '歌曲3'
    }, {
      id: 3,
      album: '专辑1',
      song: '歌曲4'
    }]
  },
  chooseSong(index) {
    console.log(index)
    wx.navigateTo({
      url: '../main/index'
    })
  }
})