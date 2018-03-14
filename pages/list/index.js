
import AudioPlayer from '../../utils/player.js'

Page({
    data: {
        list: [{
            id: 1,
            album: '大灌篮 电影原声带',
            song: '周大侠',
            img: 'https://y.gtimg.cn/music/photo/album_300/49/300_albumpic_33749_0.jpg',
            src: 'https://dl.stream.qqmusic.qq.com/C100002kCqZy0Vrb14.m4a?fromtag=38',
        }, {
            id: 2,
            album: '万有引力',
            song: '有点甜',
            img: 'https://y.gtimg.cn/music/photo/album_300/74/300_albumpic_121274_0.jpg',
            src: 'https://dl.stream.qqmusic.qq.com/C100001bdYk41BCfRi.m4a?fromtag=38',
        }, {
            id: 3,
            album: '霍元甲',
            song: '霍元甲',
            img: 'https://y.gtimg.cn/music/photo/album_300/36/300_albumpic_14536_0.jpg',
            src: 'https://dl.stream.qqmusic.qq.com/C100002HeqcH2GMiOL.m4a?fromtag=38',
        }, {
            id: 4,
            album: '童话镇',
            song: '童话镇',
            img: 'https://y.gtimg.cn/music/photo/album_300/38/300_albumpic_1632238_0.jpg',
            src: 'https://dl.stream.qqmusic.qq.com/C1000041vb5D3WMtrl.m4a?fromtag=38',
        }],
        currentSongInfo: null
    },
    onReady() {
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
        }));
    },
    chooseSong(e) {
        var obj = {
            src: e.target.dataset.src,
            img: e.target.dataset.img,
            song: e.target.dataset.song,
            id: e.target.dataset.id
        }

        wx.setStorage({key:'bgm', data:obj});

        wx.navigateTo({
            url: '../main/index'
        })
    },
    onTapToPlaySong: function (e) {
        var src = e.target.dataset.src;

        if (src == this.currentSongInfo) {

            if (this.audioCtx._currentSong.state == 'play') {

                this.audioCtx.pause();
            }
            else {
                this.audioCtx.play();
            }

        }
        else {
            wx.showLoading({
                title: '加载中'
            });

            this.audioCtx.play(src);
            this.currentSongInfo = src;
        }
             
    }
})