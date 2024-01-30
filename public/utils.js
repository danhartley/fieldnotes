const set = ({key, value}) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const get = ({key}) => {
  return JSON.parse(localStorage.getItem(key))
}

const remove = ({key}) => {
  localStorage.removeItem(key)
}

const clear = () => {
  localStorage.clear()
}

export const appLocalStorage = {
    get
  , set
  , remove
  , clear
}

export const debounce = (func, wait) => {
  let timeout

  return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }

      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
  }
}

const encode = s => {
  var out = []
  for ( var i = 0; i < s.length; i++ ) {
      out[i] = s.charCodeAt(i)
  }
  return new Uint8Array(out)
}

export const saveJson = ({obj, title = 'fieldnotes'}) => {
  var str = JSON.stringify(obj)
  var data = encode(str)

  var blob = new Blob([data], {
      type: 'application/octet-stream'
  })

  var url = URL.createObjectURL(blob)
  var link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.json`)
  var event = document.createEvent('MouseEvents')
  event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
  link.dispatchEvent(event)

  // With thanks: https://gist.github.com/yiwenl/8f2b735a2263bc93ee33
}

export const isValidDate = ({date}) => {
  return date.length > 0 && Object.prototype.toString.call(new Date(date)) === '[object Date]'
}