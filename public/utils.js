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
  const formatSpeciesImgSrc = ({src, part}) => {
    return src.replace('square', part)
  }
  const styleFieldTripPhotos = 'height:165px;width:220px;object-fit:cover;margin-right:.25rem;margin-bottom:.25rem;'
  const styleSpeciesPhotos = 'height:170px;width:170px;object-fit:cover;margin-right:.25rem;margin-bottom:.25rem;'

  const filterByText = obj => {
    let text = `<div style=font-size:1rem;margin-top:-1rem;'><div style='font-size:.9rem;margin-bottom: -3rem;'>`
    text+= `<p><strong>[Originally published at <a href=https://ifieldnotes.org>iFieldnotes.org</a>]</strong></p>`
    text+= `<p style='margin-top:0rem;'>Author: ${formatAuthor(obj.author)}</p>`
    text+= `<p style='margin-top:-2rem;'>Date: ${formatDate(obj.d1)}</p>`
    if(obj.startTime?.length > 0) {
      if(obj.endTime?.length > 0) {
        text+= `<p style='margin-top:-2rem;'>Time: ${obj.startTime}-${obj.endTime}</p>`
      } else {
        text+= `<p style='margin-top:-2rem;'>${obj.startTime}</p>`
      }
    }
    text+= `<p style='margin-top:-2rem;'><a href=https://www.google.com/maps/place/${obj.location.location}>${obj.location.place_guess}</a></p>`
    if(obj.weather) {
      text+= `<p style='margin-top:-2rem;'>Weather: ${obj.weather}</p>`
    }
    if(obj.habitat) {
      text+= `<p style='margin-top:-2rem;'>Habitat: ${obj.habitat}</p>`
    }
    text+= '</div>'

    obj.sections.map(section => {
      switch(section.name) {
        case 'Header':
          text+= `<h3>${section.h3}</h3>`
          break
        case 'Subheader':
          text+= `<h4>${section.h4}</h4>`
          break
        case 'Text block':
          section.paras.forEach(p => {
            text+= `<p>${p.p}</p>`
          })    
          break
        case 'Field trip photos':
          text+= `<h4 style='padding: 1rem 0 0 0;margin-bottom:-.5rem;font-weight:bold;'>Field trip photos</h4>`
          section.images.forEach(img => {
            text+= `<img src=${img.src} alt=${img.alt} style=${styleFieldTripPhotos} />`
          })
          text+= '<br /><br />'
          break
        case 'Author\'s photos':
          text+= `<h4 style='padding: 1rem 0 0 0;margin-bottom:-.5rem;font-weight:bold;'>Author's photos</h4>`
          section.species.forEach(sp => {
            text+= `<img src=${formatSpeciesImgSrc({
                src: sp.observation.default_photo.url
              , part: 'small'
            })} alt=${sp.observation.species_guess} style=${styleSpeciesPhotos} />`
          })
          text+= '<br /><br />'
          break
        case 'iNat species':
          text+= `<h4 style='padding: 1rem 0 0 0;margin-bottom:-.5rem;font-weight:bold;'><strong>iNat species</strong></h4>`
          section.species.forEach(sp => {
            text+= `<img src=${formatSpeciesImgSrc({
                src: sp.taxon.default_photo.square_url
              , part: 'small'
            })} alt=${sp.taxon.name} style=${styleSpeciesPhotos} />`
          })
          text+= '<br /><br />'
          break
          case 'Terms':
            text+= `<dl style='font-weight:bold;margin: 1rem 0;border:1px solid lightgray;padding:0 0 1rem 1rem;'>`
            section.terms.forEach((term, index) => {              
              if(index === 0) {
                text+= `<dt style='margin-bottom:-1rem;'>${term.dt}</dt><dd><small>${term.dd}</small></dd>`
              } else {
                text+= `<dt style='margin-top:1rem;margin-bottom:-1rem;'>${term.dt}</dt><dd><small>${term.dd}</small></dd>`
              }
            })
            text+= '</dl>'
            break
      }
    })
    text+= '</div>'

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
  return date.length > 0 && !isNaN(Date.parse(new Date(date)))
}

export const logger = ({message, type ='', stack}) => {
  const log = process.env.LOG

  if(log === 'true') {
    switch(type) {
      case 'success':
        console.log('message: ', message)
        break
      case 'error':
        console.log('message: ', message)
        if(stack) {
          console.warn('stack: ', stack)
        }
        break
      default:
        console.log(message)
        break
    }
  }
}

export const sortBy = ({arr, prop, dir = 'asc'}) => {
  return dir === 'asc' 
   ? arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return x - y
      })
    : arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return y - x
      })
}

/*
  Check for valid slug in url path
  e.g. 'danielhartley-lisbon-portugal-wed-feb-28-2024'
*/
export const validateSlug = ({
    pathname = '',
    slugs = [],
  }) => {

  let validSlugs, slug

  validSlugs = ['', '/']

  // Remove the leading slash from the pathname
  slug = pathname.slice(1)

  // slugs should have trailing slash: https://www.w3.org/TR/ldp-bp/#include-a-trailing-slash-in-container-uris
  slug = slug[slug.length - 1] === '/' 
    ? slug 
    : slug + '/' 

  // slugs should be lower case
  slug = slug.toLowerCase()

  // Add valid ifieldnotes slugs to incoming slugs
  slugs = slugs.concat(validSlugs)

  let isValid = true

  isValid = isValid && slugs.includes(slug)

  return {
      isValid      
    , slug: isValid ? slug : ''
  }
}

export const createSlug = ({author, location, date}) => {
  const _author = author
  const _location = location.place_guess.replace(',', '').replace(' ', '-')
  const _date = date.toDateString().toLowerCase().replaceAll(' ', '-')
  return (`${_author}-${_location}-${_date}/`).toLowerCase()
}

export const getURL = ({location, slug}) => {
  return `${location.origin}/${slug}`
}