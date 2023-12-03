import { 
  getByAutocomplete
} from './api.js'

const d = document

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
  const cbInatParamGroup = d.querySelectorAll('input[name="inat-param"]')

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
  const parent = d.getElementById('inat-params-input-check-box-group')
  
  if(!parent) return
    console.log('createInatParamsCheckboxGroup')
  const t = d.getElementById('checkbox-template')

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
            const option = d.createElement('option')
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
            createInatParamsCheckboxGroup(g)
        }
    })
}

export const handleTermAutocomplete = ({inputText, selectedTerms, dataList, g, data, parent, addSelectedTermBtn, handleAddSelectedTerm}) => {
  inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        g.matches = data.filter(item => item.dt.toLowerCase().startsWith(strToComplete.toLowerCase()))
                
        g.matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match['dt']
            dataList.appendChild(option)
        })
    }, 0))

    inputText.addEventListener('change', e => {
        const match = e.target.value

        if(match) {
            const term = data.find(option => option.dt === match)            
            const spans = parent.querySelectorAll('.centred-block > span:nth-child(2)')

            spans[0].innerText = term.dt
            spans[1].innerText = term.dd
            spans[2].innerText = term.ds
            spans[3].innerText = term.da
            if(spans[4]) spans[4].innerText = term.dx || '--'

            if(selectedTerms.find(t => t.dt.toLowerCase() === match.toLowerCase())) return 

            addSelectedTermBtn.classList.remove('disabled')
            addSelectedTermBtn.addEventListener('click', e => handleAddSelectedTerm({e,selectedTerm: term}), true)
        }
    })
}

export const mapTaxon = ({taxon}) => {
    return {
        iconic_taxon_id: taxon.iconic_taxon_id,
        name: taxon.name,
        id: taxon.id,
        default_photo: taxon.default_photo,
        iconic_taxon_name: taxon.iconic_taxon_name,
        preferred_common_name: taxon.preferred_common_name || '-'
    }
}

export const mapInatSpeciesToLTP = ({species, count, taxa}) => {
    return species
        .filter(sp => sp.taxon)
        .filter(sp => sp.taxon.preferred_common_name || sp.taxon.name)
        .filter(sp => sp.taxon.default_photo)
        .filter(sp => taxa.map(t => t.name).includes(sp.taxon.iconic_taxon_name.toLowerCase()))
        .slice(0,count)
        .map(sp => {
            return {
                count: sp.count || 0,
                taxon: mapTaxon({taxon: sp.taxon})
            }
        })
}

export const bgColour = taxon => {
    return getComputedStyle(d.documentElement).getPropertyValue(`--${taxon.toLowerCase()}`)
}