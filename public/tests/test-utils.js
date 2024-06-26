import { URL } from 'url'

export const scroll = async ({page}) => {
  return await page.evaluate(async () => {
      return await new Promise((resolve, reject) => {
          var i = setInterval(() => {
              window.scrollBy(0, window.innerHeight)
              if (
                  document.scrollingElement.scrollTop + window.innerHeight >=
                  document.scrollingElement.scrollHeight
              ) {
                  window.scrollTo(0, 0)
                  clearInterval(i)
                  resolve()
              }
          }, 100)
      })
  })
}

export const hasClass = ({classList, className, logToConsole = false}) => {  
  const classNames = []
  Object.keys(classList).forEach(key => {
    classNames.push(classList[key])
  })
  
  const isTrue = classNames.includes(className)

  if(logToConsole) {
    if(isTrue) {
      console.log(`The CSS class "${className}" was in the classList`)
    } else {
      console.log(`The CSS class "${className}" was not in the classList`)
    }
  }
  
  return isTrue
}

export const isDisabled = ({classList}) => {
  return hasClass({
      classList
    , className: 'disabled'
  })
}

export const isEnabled = ({classList}) => {
  return !hasClass({
      classList
    , className: 'disabled'
  })
}

// Helper function to use aysnc/await with timers
export const pause = async ({func, delay = 2000}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(func())
    }, delay)
  })
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

const getDomainByPatternMatching = ({url}) => {
  let result
  let match
  if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
      result = match[1]
      if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
          result = match[1]
      }
  }
  return result
}

export const getDomainFromURL = ({url}) => {
  try {
    const parsedURL = new URL(url)
    let hostname = parsedURL.hostname

    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    return hostname }
  catch (e) {
    // If the built in parser fails, as it will for e.g. bbcorp.fr, use pattern matching
    return getDomainByPatternMatching({url})
  }
}


export const getLighthouseReport = async ({lighthouse, chromeLauncher, url}) => {    
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']})
    const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port}
    const runnerResult = await lighthouse(url, options)
    const lh = runnerResult.lhr
    
    const report = {
      'audits': { 
        'first-contentful-paint': {
            id: lh.audits['first-contentful-paint'].id
          , title: lh.audits['first-contentful-paint'].title
          , score: lh.audits['first-contentful-paint'].score
        },
        'largest-contentful-pain': {
            id: lh.audits['largest-contentful-paint'].id
          , title: lh.audits['largest-contentful-paint'].title
          , score: lh.audits['largest-contentful-paint'].score
        },
        'first-meaningful-paint': {
            id: lh.audits['first-meaningful-paint'].id
          , title: lh.audits['first-meaningful-paint'].title
          , score: lh.audits['first-meaningful-paint'].score
        },
        'speed-index': {
            id: lh.audits['speed-index'].id
          , title: lh.audits['speed-index'].title
          , score: lh.audits['speed-index'].score
        },
        'interactive': {
            id: lh.audits['interactive'].id
          , title: lh.audits['interactive'].title
          , score: lh.audits['interactive'].score
        },
        'user-timings': {
            id: lh.audits['user-timings'].details.items
        },
        'metrics': lh.audits['metrics'].details.items,      
        'resource-summary': lh.audits['resource-summary'].details.items,
        'third-party-summary': lh.audits['third-party-summary'].details.items,      
        'script-treemap-data': lh.audits['script-treemap-data'].details.items,      
        'total-byte-weight': lh.audits['total-byte-weight'].details.items,
        'dom-size': lh.audits['dom-size'].numericValue,      
      },
      'entities': lh.entities
    }

    const summary = {
          totalResourceTransferSize: report.audits['resource-summary'].find(r => r.resourceType === "total").transferSize
        , resources: report.audits['resource-summary'].filter(r => r.resourceType !== "total")
        , observedDomContentLoaded: report.audits.metrics['firstContentfulPaint']?.observedDomContentLoaded || 0
        , domContentLoaded: report.audits['user-timings']?.id?.find(ut => ut.name === 'dom-content-loaded')?.startTime || 0
        , thirdPartySummary: {
            totalTransferSize: report.audits['third-party-summary'].reduce((total, tp) => total + tp.transferSize, 0)
          , entities: report.audits['third-party-summary'].map(tp => { return { entity: tp.entity, transferSize: tp.transferSize }})
        }
        , totalByteWeight: report.audits['total-byte-weight'].reduce((total, current) => total + current.totalBytes,0)
        , DOMSize: report.audits['dom-size']
    }
    
    chrome.kill()
    
    return { report, summary }
}