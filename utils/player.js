'use strict';

let instance = null;

class AudioPlayer {
    constructor() {
        if (!instance) {
            instance = this;
            this._innerAudioContext = wx.createInnerAudioContext();
            this._currentSong = {};
        }
        
        return instance;
    }

    play(song) {
        if (typeof song == 'object') {
            this._innerAudioContext.src = song.url;
        } else if (song) {
            this._innerAudioContext.src = song;
        }
        this._currentSong.info = song;
        this._innerAudioContext.play();
    }

    pause() {
        this._innerAudioContext.pause();
    }

    stop() {
        this._innerAudioContext.stop();
    }

    destroy() {
        this._innerAudioContext.destroy();
        instance = null;
    }

    on(event, handler) {
        var that = this,
            defaultHandlerEvent = [
                {eventName: 'canplay', handlerName: 'onCanplay'},
                {eventName: 'play', handlerName: 'onPlay'},
                {eventName: 'pause', handlerName: 'onPause'},
                {eventName: 'stop', handlerName: 'onStop'},
                {eventName: 'ended', handlerName: 'onEnded'},
                {eventName: 'timeupdate', handlerName: 'onTimeUpdate'},
                {eventName: 'error', handlerName: 'onError'}
            ];
        event = (event || 'canplay play pause stop ended timeupdate error').split(/\s+/);
        defaultHandlerEvent.forEach(item => {
            event.indexOf(item.eventName) >= 0 && that._innerAudioContext[item.handlerName]((res) => {
                that._currentSong.state = item.eventName;
                handler(item.eventName, that._currentSong, res);
            });
        });

    }

    
}

module.exports = AudioPlayer;