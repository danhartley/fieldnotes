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