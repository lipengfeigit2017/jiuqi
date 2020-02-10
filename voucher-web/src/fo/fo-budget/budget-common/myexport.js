// import XLSX from 'xlsx-style'
import $ from 'jquery'

export function saveAs (obj, fileName) {
    fileName = fileName + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType)
    var tmpa = document.createElement('a')
    tmpa.download = fileName || '未命名'
    // 兼容ie
    if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, '下载的文件名' + '.xlsx')
    } else {
        tmpa.href = window.URL.createObjectURL(obj)
        tmpa.setAttribute('download', fileName)
    }
    $('body').append(tmpa) // 修复firefox中无法触发click
    tmpa.click()
    $(tmpa).remove()
    // tmpa.click()
    setTimeout(function () {
        URL.revokeObjectURL(obj)
    }, 100)
}

const wopts = {
    bookType: 'xls',
    bookSST: true,
    type: 'binary',
    cellStyles: true
}
