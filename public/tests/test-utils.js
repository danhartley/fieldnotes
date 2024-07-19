export const scroll = async ({ page }) => {
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

export const hasClass = ({ classList, className, logToConsole = false }) => {
  const classNames = []
  Object.keys(classList).forEach((key) => {
    classNames.push(classList[key])
  })

  const isTrue = classNames.includes(className)

  if (logToConsole) {
    if (isTrue) {
      console.log(`The CSS class "${className}" was in the classList`)
    } else {
      console.log(`The CSS class "${className}" was not in the classList`)
    }
  }

  return isTrue
}

export const isDisabled = ({ classList }) => {
  return hasClass({
    classList,
    className: 'disabled',
  })
}

export const isEnabled = ({ classList }) => {
  return !hasClass({
    classList,
    className: 'disabled',
  })
}

// Helper function to use aysnc/await with timers
export const pause = async ({ func, delay = 2000 }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(func())
    }, delay)
  })
}

export const sortBy = ({ arr, prop, dir = 'asc' }) => {
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

export const format = (number) => {
  return number.toLocaleString('en-GB', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })
}

export const logEmissions = ({
  url,
  pageWeight,
  count,
  emissions,
  greenHosting,
  data,
  domain,
  responses,
}) => {
  console.log(`Report for ${url}`)
  console.log('Page weight: ', `${format(pageWeight / 1000)} Kbs`)
  console.log('Requests ', count)
  console.log('Emissions: ', `${format(emissions * 1000)} mg of CO2`)
  console.log(
    greenHosting ? 'Hosting: green hosting' : 'Hosting: not green hosting'
  )

  console.log('groupedByType')
  console.log(data?.groupedByType)
  console.log('totalUncachedBytes')
  console.log(data?.totalUncachedBytes)
  console.log('groupedByTypeBytes')
  console.log(data?.groupedByTypeBytes)
  console.log('Responses')
  console.log(responses)
}
