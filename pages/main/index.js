import recorder from '../../utils/recorder.js'
import AudioPlayer from '../../utils/player.js'
import file from '../../utils/file.js'
import AjaxController from '../../utils/ajax'
let start, end, recordFile, player;
Page({
    data: {
        currentSongInfo: {
            index: 0,
            state: 'pause'
        },
        songid: 1,
        song: 'https://dl.stream.qqmusic.qq.com/C100002kCqZy0Vrb14.m4a?fromtag=38',
        songname: '周大侠',
        audioCtx: null,
        bgImg: 'https://y.gtimg.cn/music/photo_new/T011R640x800M0000030qYXG1yxPXk.png',
        status: null,
        count: 1,//倒计时
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
            id: 10,
            title: '上传音乐',
            img: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000001oJRb50joel5.png'
        }]
    },
    onReady() {
        var that = this;
        var bgm;

        wx.getStorage({
            key: "bgm",
            success: function (res) {
                console.log(res);
                if (res.data) {
                    that.setData({
                        song: res.data.src,
                        songname: res.data.song,
                        songid: res.data.id
                    })
                }
            } 
        })

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

        }));
    },

    onChangeSong(e) {
        console.log(e);
        wx.navigateTo({
            url: '../list/index'
        })
    },
    
    merge() {
        wx.showLoading({
            title: '正在合成中',
        });
        let that = this;
        console.log(that.data.songid);
        console.log(that.data.list[2].id);
        setTimeout(function () {
            wx.hideLoading();
            AjaxController.request({
                url: 'https://cd.y.qq.com/shop/fcgi-bin/fcg_moyin_get',
                param: {
                    cmd: 'getugc',
                    tone: that.data.list[2].id,
                    bgm: that.data.songid,
                    format: 'json',
                    inChartset: 'utf-8',
                    outChart: 'utf-8'
                }
            }, (err, r) => {
                if (!err && r && r.code == 0) {
                    console.log(r.data.data[0]);
                    // 
                    wx.navigateTo({
                        url: '../index/index?id=' + r.data.data[0].id
                    })
                    
                } else {
                    that.setData({
                        loaded: 'error'
                    });
                }

            })
        }, 3000);
    },

    recording() {
        let self = this;
        if (self.data.status == 'recording') { return; }

        //开始录制并展示倒计时
        self.setData({
            status: 'recording',
            bgImg: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000001oJRb50joel5.png'
        });

        recorder.start(function (res) {
            console.log(res.tempFilePath);
            wx.saveFile({
                tempFilePath: res.tempFilePath,
                success(res) {
                    recordFile = res.savedFilePath;
                }
            })
            //file.upload(res.tempFilePath);
        });

        let t = setInterval(function () {
            self.setData({
                count: self.data.count - 1
            });
            if (self.data.count == 0) {
                self.setData({
                    count: 1,
                    status: 'finish',
                    bgImg: 'https://y.gtimg.cn/music/photo_new/T011R640x800M000001Vci751QmpSc.png'
                });
                clearInterval(t);
            }
        }, 1000);
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
        this.swipe(left);
    },

    swipe(left) {
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
        param.status = null;
        param.count = 1;
        this.setData(param);
        start = null;
        end = null;
    },

    playRecord() { //试听
        this.audioCtx.play(recordFile)
    },

    confirmRecord() {
        var that = this;

        if (!recordFile) { return; }
        wx.uploadFile({
            url: 'https://cd.y.qq.com/musichall/fcgi-bin/fcg_moyin_upload.fcg', //仅为示例，非真实的接口地址
            filePath: recordFile,
            name: 'file',
            formData: {
                'user': 'test',
                'tone': 1,
                'songid': that.data.songid
            },
            success(res) {
                wx.showToast({
                    title: '上传文件成功'
                });
                var data = res.data
                //do something
            },
            fail(e) {
                wx.showToast({
                    title: '上传文件失败，请重试',
                });
            }
        })
    },

    onTapToPlaySong: function (e) {
        let currentSong = this.data.currentSongInfo;
        if (currentSong.state == 'pause') {
            wx.showLoading({
                title: '加载中'
            });
            console.log(1);
            this.audioCtx.play(this.data.song);
        } else {
            this.audioCtx.pause();
        }
    }
})