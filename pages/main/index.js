let start, end;
Page({
  data: {
    bgImg: 'https://y.gtimg.cn/music/photo_new/T011R640x800M0000030qYXG1yxPXk.png',
    list: [{
      id: 0,
      title: '拆迁主任',
      img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000000NWZsA4PMBOk.png'
    }, {
      id: 1,
      title: '瞄小姐',
      img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000002ByRR01RZnnx.png'
    }, {
      id: 2,
      title: '呱蛙儿子',
      img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M0000030qYXG1yxPXk.png'
    }, {
      id: 3,
      title: '鞭炮君',
      img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000001ndTAx1yAimG.png'
    }, {
      id: 4,
      title: '上传音乐',
      img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000001oJRb50joel5.png'
    }]
  },
  onReady() {
    // wx.chooseImage({
    //   success(res) {
    //     var tempFilePaths = res.tempFilePaths;
    //     wx.uploadFile({
    //       url: 'https://cd.y.qq.com/musichall/fcgi-bin/fcg_moyin_upload.fcg', //仅为示例，非真实的接口地址
    //       filePath: tempFilePaths[0],
    //       name: 'file',
    //       formData: {
    //         'user': 'test',
    //         'tone': 1
    //       },
    //       success(res) {
    //         console.log(res)
    //         var data = res.data
    //         //do something
    //       },
    //       fail(e) {
    //         console.log(e)
    //       }
    //     })
    //   }
    // })
  },
  onChangeSong: function (e) {
    wx.navigateTo({
      url: '../list/index'
    })
  },
  onCompound: function (e) {
    wx.navigateTo({
      url: '../finish/index'
    })
  },

  touchstart(e) {
    if (e.touches.length == 1) {
      start = e.touches[0].pageX;
    }
  },
  touchmove(e) {
    if (e.touches.length == 1) {
      end = e.touches[0].pageX;
    }
  },
  touchend() {
    let left = end - start < 0;
    if (left) {
      let voice = this.data.list[0];
      this.data.list.push(voice);
      this.data.list.splice(0, 1);
    } else {
      let voice = this.data.list[this.data.list.length - 1];
      this.data.list.unshift(voice);
      this.data.list.splice(this.data.list.length - 1, 1);
    }

    let list = [];

    let param = {};
    this.data.list.forEach((item, index) => {
      let id = 'list[' + index + '].id';
      let title = 'list[' + index + '].title';
      let img = 'list[' + index + '].img';
      param[id] = item.id;
      param[title] = item.title;
      param[img] = item.img;
    });

    this.setData({
      bgImg: this.data.list[2].img                                                            
    });

    this.setData(param);
    start = null;
    end = null;
  }
})