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

export const saveJson = ({obj, title = 'fieldnotes', textOnly = false}) => {
  const formatAuthor = author => {
    return author.split(' ').map(name => {
      return name.charAt(0).toUpperCase() + name.substring(1)
    }).join(' ')
  }
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-gb', { 
      weekday: 'long'
    , year: 'numeric'
    , month: 'long'
    , day: 'numeric'
})
  }
  const filterByText = obj => {
    let text = `[Originally published at <a href=https://ifieldnotes.org>iFieldnotes.org</a>]`
    text += `<p><em>${formatAuthor(obj.author)}</em></p>`
    text += `<p><em>${formatDate(obj.d1)}</em></p>`
    text += `<p><em><a href=https://www.google.com/maps/place/${obj.location.location}>${obj.location.place_guess}</a></em></p>`

    obj.sections.map(section => {
      switch(section.name) {
        case 'Header':
          text += `<h3>${section.h3}</h3>`
          break
        case 'Subheader':
          text += `<h4>${section.h4}</h4>`
          break
        case 'Text block':
          section.paras.forEach(p => {
            text += `<p>${p.p}</p>`
          })            
          break
      }
    })
    return text
  }

  const uniCodeEncode = str => {
    const out = []
    for (let i = 0; i < str.length; i++) {
      out[i] = str.charCodeAt(i)
    }
    return new Uint16Array(out)
  }

  const str = textOnly
    ? JSON.stringify(filterByText(obj))
    : JSON.stringify(obj)
  const data = uniCodeEncode(str)

  const blob = new Blob([data], {
      type: 'application/octet-stream'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.json`)
  const event = document.createEvent('MouseEvents')
  event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
  link.dispatchEvent(event)

  // With thanks: https://gist.github.com/yiwenl/8f2b735a2263bc93ee33
}

export const isValidDate = ({date}) => {
  return date.length > 0 && Object.prototype.toString.call(new Date(date)) === '[object Date]'
}