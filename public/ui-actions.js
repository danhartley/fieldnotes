import { 
    getIdByAutocomplete
} from './api.js'

import { 
    species
} from './templates.js'

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

export const createInatParamsCheckboxGroup = ({g, parent, typeId, sectionId}) => {
    
    if(!parent) return
    
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

export const createInatLookups = ({g, parent, typeId, sectionId}) => {
    cloneImages({global:g, parent, typeId, sectionId})
}

export const handleInatAutocomplete = ({inputText, dataList, g, id, prop, callback, cbParent, typeId, sectionId}) => {
  inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        const data = await getIdByAutocomplete({ by: id, toComplete: strToComplete })
        
        g.matches = data.results
        
        g.matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match[prop]
            dataList.appendChild(option)
        })
    }, 350))

    inputText.addEventListener('change', e => {
        // const { id, name, prop } = g.inatAutocomplete
        const { name } = g.inatAutocomplete
        const match = e.target.value

        g.inatAutocompleteOptions.forEach(option => {
            if(option.id === id) {
                option.isActive = true
            }
        })

        if(match) {
            const option = g.inatAutocompleteOptions.find(option => option.id === id)
            if(option) option[name] = g.matches.find(m => m[prop] === match)
            
            g[prop] = match
            callback({g, parent: cbParent, typeId, sectionId})
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

export const handleFieldsNotesAutocomplete = ({inputText, dataList, g, data, importFieldTripBtn}) => {
  inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        g.matches = data.filter(item => item.title.toLowerCase().startsWith(strToComplete.toLowerCase()))
                
        g.matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match['title']
            dataList.appendChild(option)
        })
    }, 0))

    inputText.addEventListener('change', e => {
        const match = e.target.value

        if(match) {
            g.fieldnote = data.find(option => option.title === match)
            importFieldTripBtn.classList.remove('disabled')        
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

const handleSpeciesCheckState = ({e, sectionId, global}) => {
    const name = e.target.value
    const section = global.templates.find(t => t.sectionId === sectionId)
    if(section) {
      section.species.find(sp => sp === name) 
        ? section.species = section.species.filter(sp => sp !== name)
        : section.species.push(name)
    } else {
      const sp = [ name ]
      global.templates.push({...species, species: sp, templateId: species.id, sectionId })
    }
    // We should check also if a taxon needs to be removed from the list i.e. it appears in no species or observation section
    // But for now, we will content ourselves with addding taxon (which is harmless)
    if(!global.taxa.find(t => t.name === name)) {
      global.taxa.push({
        id: global.species.find(sp => sp.taxon.name === name)?.taxon?.id,
        name
      })
    }
  }

 export const cloneImages = ({global, parent, typeId, sectionId}) => {
    switch(typeId) {
        case 'species':
        case 'observations':
            if(global.species.length > 0) {
            global.species.forEach((species, index) => {
                const imgUrl = typeId === 'observations'
                ? species.photos[0].url
                : species.taxon.default_photo.medium_url
                const clone = cloneImageTemplate({species, index, sectionId, imgUrl, global})            
                parent.appendChild(clone)
            })
            } 
            break
        case 'inat-lookup':
        if(global.name) {
            const match = global.matches.find(match => match.name === global.name)
            const imgUrl = match.default_photo.square_url
            const clone = cloneImageTemplate({species: {taxon:match}, index: 0, sectionId, imgUrl, global})            
            parent.appendChild(clone)

            if(!global.taxa.find(taxon => taxon.id === match.id)) {                
                global.taxa.push({
                    id: match.id,
                    name: match.name,
                })
            }
        }
        break
    }
  }

  const cloneImageTemplate = ({species, index, sectionId, imgUrl, global}) => {
      const templateToClone = d.getElementById('img-template')
      const clone = templateToClone.content.cloneNode(true)

      const spans = clone.querySelectorAll('span')
      const img = clone.querySelector('img')      
      const figure = clone.querySelector('figure')
      const checkbox = clone.querySelector('input')
      const label = clone.querySelector('label')
  
      figure.style.setProperty("background-color", bgColour(species.taxon.iconic_taxon_name))

      img.src = imgUrl
      img.alt = species.taxon.name
      img.id = species.taxon.id
      img.setAttribute('data-i', index + 1)
      img.setAttribute('loading', 'lazy')

      spans[0].textContent = species.taxon.preferred_common_name
      spans[1].textContent = species.taxon.name
      spans[1].classList.add('latin')
      
      checkbox.id = `${sectionId}-${species.id}`
      checkbox.value = species.taxon.name
      checkbox.addEventListener('change', e => handleSpeciesCheckState({e, sectionId, global}), true)
      label.htmlFor = checkbox.id

      return clone
  }

  export const toggleFilterCtrl = (({ ctrl, fieldsetId }) => {
    ctrl.addEventListener('click', () => {
        ctrl.classList.toggle('hide')
        ctrl.innerText = ctrl.innerText === 'HIDE' ? 'SHOW' : 'HIDE'

        const fieldset = d.getElementById(fieldsetId)
        fieldset.classList.toggle('hidden')
    })
})