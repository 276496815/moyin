//page.js
Page({
    data: {
        firstLoad: true
    },
    onReady: function (e) {
        var that = this;
        setTimeout(function () {
            that.setData({'firstLoad':true});
            wx.navigateTo({
                url: '../index/index'
            });
        },1000)
    },
    onToIndex: function () {
        var firstLoad = this.data.firstLoad;
        if (firstLoad) {
            wx.navigateTo({
                url: '../index/index'
            })
        }
    }
})