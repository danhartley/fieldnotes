import { 
  getByAutocomplete
} from './api.js'

const debounce = (func, wait) => {
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

const attachListenersToInatParams = g => {
  const cbInatParamGroup = document.querySelectorAll('input[name="inat-param"]')

  cbInatParamGroup.forEach(cb => {
      cb.addEventListener('click', e => {
          const name = e.target.value
          g.inatAutocompleteOptions.forEach(option => {
              if(option.name === name) {
                  option.isActive = !option.isActive
              }
          })
      })
  })
}

export const createInatParamsCheckboxGroup = g => {
  const parent = document.getElementById('inat-params-input-check-box-group')
  const t = document.getElementById('checkbox-template')

  parent.innerHTML = ''

  g.inatAutocompleteOptions.filter(param => param.isActive).forEach(param => {
      const clone = t.content.cloneNode(true)

      const input = clone.querySelector('input')
      const label = clone.querySelector('label')
      label.setAttribute('class', 'text-initial')
  
      input.setAttribute('name', 'inat-param')
      input.id = param.id
      if(param.isActive) input.setAttribute('checked', true)
      input.value = param.name
      label.textContent = param[param.name][param.prop]
      label.htmlFor = input.id

      parent.appendChild(clone)
  })

  attachListenersToInatParams(g)
}

export const handleInatAutocomplete = ({inputText, dataList, g}) => {
  inputText.addEventListener('input', debounce(async (e) => {
    while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild)
    }

    const { id, prop } = g.inatAutocomplete
    const strToComplete = e.target.value

    if(strToComplete.length < 3) return

    const data = await getByAutocomplete({ by: id, toComplete: strToComplete })
    
    g.matches = data.results
    
    g.matches.forEach(match => {
        const option = document.createElement('option')
        option.value = match[prop]
        dataList.appendChild(option)
    })   
}, 350))

inputText.addEventListener('change', e => {
    const { id, name, prop } = g.inatAutocomplete
    const match = e.target.value

    g.inatAutocompleteOptions.forEach(option => {
        if(option.id === id) {
            option.isActive = true
        }
    })

    if(match) {
        const option = g.inatAutocompleteOptions.find(option => option.id === id)
        option[name] = g.matches.find(m => m[prop] === match)
console.log(g)
        createInatParamsCheckboxGroup(g)
    }
})
}