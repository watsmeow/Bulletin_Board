const moment = require('moment');


module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format)
    },
    truncate: function(str, len) {
        if (str.length > len && str.length > 0) {
            let newStr = str + ' '
            newStr = str.substr(0, len)
            newStr = str.substr(0, newStr.lastIndexOf(' '))
            newStr = newStr.length > 0 ? newStr : str.substr(0, len)
            return newStr + '...'
        }
        return str
    },
    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    }, 
    editIcon: function (noteUser, loggedUser, noteId, floating = true) {
        if (noteUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/notes/edit/${noteId}" class="btn-floating halfway-fab purple lighten-1"><i class="fa-solid fa-pen fa-small"></i></a>`
          } else {
            return `<a href="/notes/edit/${noteId}"><i class="fa-solid fa-pen"></i></a>`
          }
        } else {
          return ''
        }
      },
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
      },
} 