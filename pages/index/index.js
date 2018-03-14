//page.js
let AudioPlayer = require('../../utils/player.js');
let AjaxController = require('../../utils/ajax.js');

var songNameMap = {
    '0': '圣诞歌',
    '1': '周大侠',
    '2': '有点甜',
    '3': '霍元甲',
    '4': '童话镇'
}

var singerMap = {
    '0': '拆迁主任',
    '1': '喵小姐',
    '2': '瓜娃儿子',
    '3': '鞭炮君',
    '10': '用户大大'
}

var imgMap = {
    '0': 'dog',
    '1': 'cat',
    '2': 'frog',
    '3': 'fire',
    '10': 'exper'
}

Page({
    data: {
        loaded: false,
        songlist: [],
        currentSongInfo: {
            index: 0,
            state: 'pause'
        }
    },
    getData: function () {
        let that = this;
        AjaxController.request({
            url: 'https://cd.y.qq.com/shop/fcgi-bin/fcg_moyin_get',
            param: {
                cmd: 'list',
                format: 'json',
                inChartset: 'utf-8',
                outChart: 'utf-8'
            }
        }, (err, r) => {
            if (!err && r && r.code == 0) {
                console.log(r.data);
                // 
                let songlist = r.data.data.map(function (item) {
                    return {
                        title: songNameMap[item.bgm],
                        subtitle: singerMap[item.tone],
                        img: imgMap[item.tone],
                        song: {
                            url: item.url
                        }
                    }
                });

                let first = songlist && songlist[0];
                if (first) {
                    that.setData({
                        songlist: songlist,
                        title: first.title,
                        subtitle: first.subtitle,
                        loaded: 'success'
                    });
                    wx.showShareMenu({
                        withShareTicket: true
                    });
                } else {
                    that.setData({
                        loaded: 'empty'
                    });
                }
            } else {
                that.setData({
                    loaded: 'error'
                });
            }

        })
    },
    onLoad: function () {
        // 版本判断
        var deviceInfo = wx.getSystemInfoSync();
        if (!deviceInfo.SDKVersion || deviceInfo.SDKVersion <= '1.9.0') {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            });
            return;
        }
        this.getData();
    },
    onSwiperChange: function (current) {
        if (current && current.detail) {
            let index = current.detail.current;
            let songInfo = this.data.songlist[index];
            this.setData({
                title: songInfo.title,
                subtitle: songInfo.subtitle,
                currentSongInfo: {
                    index: index,
                    state: 'pause'
                }
            });
            this.audioCtx.pause();
        }

    },
    onShareAppMessage: function () {
        return {
            title: '来听听这里的魔音吧~~',
            path: '../playsong/page?songid=' + this.options.songid
        }
    },
    onTapToInviteFriend: function () { },
    onTapToCreateMyWork: function () {
        wx.navigateTo({
            url: '../main/index'
        })
    },
    onReady: function (e) {
        var that = this;
        that.audioCtx = new AudioPlayer();
        that.audioCtx.on('play pause ended error', ((eventName, songData, res) => {
            wx.hideLoading();
            console.log(eventName);
            if (eventName == 'error') {
                wx.showToast({
                    title: '播放失败，错误：' + res.errCode,
                    icon: 'none'
                });
            }
            that.data.currentSongInfo.state = eventName == 'play' ? 'play' : 'pause';
            that.setData(that.data);

        }));
    },
    onTapToPlaySong: function (e) {
        let currentSong = this.data.currentSongInfo;
        if (currentSong.state == 'pause') {
            wx.showLoading({
                title: '加载中'
            });
            console.log('trigger play');
            console.log(this.data.songlist[currentSong.index].song);
            this.audioCtx.play(this.data.songlist[currentSong.index].song);
        } else {
            console.log('trigger pause');
            this.audioCtx.pause();
        }
    }
})