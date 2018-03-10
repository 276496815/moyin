'use strict';

const extend = (source, options) => {
    if (!options) {return source;}
    for(let k in options) {
        source[k] = options[k];
    }
    return source;
}

const request = (options, handler) => {
    if (!options || !options.url) {return handler('param error');}
    let param = extend({
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        g_tk: 5381
    }, options.param);
    wx.request({
        url: options.url,
        data: param,
        method: 'GET',
        success: function (res) {
            console.log(res);
            if (res && res.statusCode == 200) {
                handler('', res.data);
            } else {
                handler('error', res);
            }
            
        },
        fail: function (res) {
            handler('error', res);
        }
    });
}


module.exports = {
    request: request
}