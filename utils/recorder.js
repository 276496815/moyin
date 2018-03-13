'use strict';

const recorderManager = wx.getRecorderManager()

const options = {
    // 录音时间
    duration: 1000,
    // 采样率
    sampleRate: 44100,
    // 录音通道
    numberOfChannels: 1,
    // 有效值
    encodeBitRate: 192000,
    // 音频格式
    format: 'aac'
}

module.exports = {
    start: (cb) => {
        // 回调文件
        recorderManager.onStop((res) => {
            cb(res);
        });
        recorderManager.start(options);
    }
}