module.exports = {
  uploadfile(file) {
    wx.uploadFile({
      url: 'https://cd.y.qq.com/musichall/fcgi-bin/fcg_moyin_upload.fcg', //仅为示例，非真实的接口地址
      filePath: file,
      name: 'file',
      formData: {
        'user': 'test',
        'tone': 1
      },
      success(res) {
        console.log(res)
        var data = res.data
        //do something
      },
      fail(e) {
        console.log(e)
      }
    })
  }
}