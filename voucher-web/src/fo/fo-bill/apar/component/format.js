let format = function (value, fmt) {
    // ie11和safari浏览器不能解析new Date(2018-09-12)这种格式，只能解析new Date(2018/09/12)
    var dateobj = new Date(new Date(value.replace(/-/g, '/')).getTime())
    var o = {
        'M+': dateobj.getMonth() + 1, // 月份
        'd+': dateobj.getDate(), // 日
        'h+': dateobj.getHours(), // 小时
        'm+': dateobj.getMinutes(), // 分
        's+': dateobj.getSeconds(), // 秒
        'q+': Math.floor((dateobj.getMonth() + 3) / 3), // 季度
        'S': dateobj.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}
// let f = Date.prototype.format = format

let toThousands = function (num) {
    var l
    if (num < 0) {
        l = 4
    } else {
        l = 3
    }
    let tail = ''
    let ind = num.toString().indexOf('.')
    if (ind > 0) {
        tail = num.toString().substr(ind)
    }

    num = Math.floor(num)
    num = (num || 0).toString()
    let result = ''
    while (num.length > l) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
    }
    if (num) {
        result = num + result
    }
    return result + tail
}

// 数据集字符串转指定小数位浮点
let strToFloat = function (str, divisor, decimal) {
    var f = 0
    while (str.indexOf(',') !== -1) {
        str = str.replace(',', '')
    }
    f = (parseFloat(str) / divisor).toFixed(decimal)
    return f
}

export const displayFormat = {
    'format': format,
    'toThousands': toThousands,
    'strToFloat': strToFloat
}
