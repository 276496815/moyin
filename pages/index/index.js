//page.js
let AudioPlayer = require('../../utils/player.js');
let AjaxController = require('../../utils/ajax.js');
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
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
            param: {
                is_xml: 0,
                key: ''
            }
        }, (err, r) => {
            if (!err) {
                let songlist = [{
                        title: '旅行的意义',
                        subtitle: '呱蛙儿子',
                        imgUrl: 'https://p.qpic.cn/music_cover/OmT4ibflJ4UHdpVjIJM6iaMMHWNib2iaqAJIpkiaZwM1YCJpKK8JNy6ic0aw/300?n=1',
                        versionImgUrl: '../../resource/image/frog.png',
                        song: {
                            id: 0,
                            url: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=4'
                        }
                    },
                    {
                        title: '旅行的意义',
                        subtitle: '招财猫',
                        imgUrl: 'https://p.qpic.cn/music_cover/y0Elj3m25QhKsCrLguvkxicxDkicjQOn4PUp0BqCf9L0PjGqSgo2uBvw/300?n=1&max_age=2592000',
                        versionImgUrl: '../../resource/image/frog.png',
                        song: {
                            id: 1,
                            url: 'http://ws1.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=4'
                        }
                    },
                    {
                        title: '新年好',
                        subtitle: '呱蛙儿子',
                        imgUrl: 'https://p.qpic.cn/music_cover/llTQ9l2AeicK2OLIORnsUdqg9HGYEh1HMSPYPx3IiaIiant4Go0DPxJMg/300?n=1&max_age=2592000',
                        versionImgUrl: '../../resource/image/frog.png',
                        song: {
                            id: 2,
                            url: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=4'
                        }
                    },
                    {
                        title: '新年好',
                        subtitle: '招财猫',
                        imgUrl: 'https://p.qpic.cn/music_cover/eO9YLkEHAnz3gntq1uUDL3hdkNc0eIyAhQmricRics1f8A76yzpk6Jwg/300?n=1',
                        versionImgUrl: '../../resource/image/frog.png',
                        song: {
                            id: 3,
                            url: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=4'
                        }
                    }
                ];
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
                    require('../../utils/util.js').getUserInfo((userInfo) => {
                        that.setData({
                            userInfo: userInfo
                        })
                    })
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
    onTapToInviteFriend: function () {},
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
            // that.data.songlist.forEach(item => {
            //     if (item.song.id == songData.info.id) {
            //         if (eventName == 'play') {
            //             item.song._state = 'play';
            //         } else {
            //             item.song._state = 'pause';
            //         }
            //     } else {
            //         item.song._state = 'pause';
            //     }

            // });
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
        // if (e.target.dataset.state == 'play') {
        //     wx.showLoading({
        //         title: '加载中'
        //     });
        //     console.log('trigger play');
        //     this.audioCtx.play(this.data.songlist[e.target.dataset.index].song);
        // } else {
        //     console.log('trigger pause');
        //     this.audioCtx.pause();
        // }

    }
})