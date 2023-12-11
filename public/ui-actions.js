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

export const handleFieldsNotesAutocomplete = ({inputText, dataList, g, data, importFieldNotesBtn}) => {
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
            importFieldNotesBtn.classList.remove('disabled')        
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

let sectionToMove = null

export const dragstartHandler = e => {
  // The event target is the dragged section
  e.dataTransfer.setData("text/plain", e.target.id)
  sectionToMove = d.getElementById(e.target.id)
  sectionToMove.classList.add('moveable')
}

export const dragoverHandler = e => {
  // The event target is the section over which the section to move jumps
  e.preventDefault()
  e.dataTransfer.dropEffect = "move"

  if(e.target.type === 'fieldset') {
    const sectionToJumpId = e.target.parentNode.id
    const sectiontoJump = d.getElementById(sectionToJumpId)
    
    // Find the index in the DOM of the section being moved, and the section we are jumping over
    const sectionToMoveDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectionToMove.id)
    const sectionToJumpDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectiontoJump.id)
    
    if(sectionToMoveDOMIndex === sectionToJumpDOMIndex) return
    
    sectionToMoveDOMIndex > sectionToJumpDOMIndex
      ? sectiontoJump.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }) // Move up
      : sectiontoJump.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' }) // Move down
  }
}

export const dragenterHandler = e => {
  // The event target is the section we are jumping over
  e.preventDefault()    
  if(e.target.type === 'fieldset') {
    const fieldset = e.target
    // We don't want to highlight the section we are moving
    if(sectionToMove.id === fieldset.parentNode.id) return
    const section = d.getElementById(fieldset.parentNode.id)
    if(section) section.getElementsByTagName('fieldset')[0].classList.add('drop-before')
  }
}

export const dragleaveHandler = e => {
  // The event target is the section we are jumping over
  e.preventDefault()
  if(e.target.type === 'fieldset') {
    const fieldset = e.target
    // We don't want to highlight the section we are moving
    if(sectionToMove.id === fieldset.parentNode.id) return
    const section = d.getElementById(fieldset.parentNode.id)
    // Allow time for the target area to be apparent to the user
    setTimeout(() => {
      if(section) section.getElementsByTagName('fieldset')[0].classList.remove('drop-before')
    }, 500)
  }
}

export const dropHandler = ({e, globalWrite, draggableSections}) => {
  // The event target is the section being moved (dragged and dropped)
  e.preventDefault()

  if(e.target.type === 'fieldset') {
    const sectionToDropId = sectionToMove.id
    const sectionToJumpId = e.target.parentNode.id

    // Find out whether we are moving the section up or down
    const sectionToMoveDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectionToDropId)
    const sectionToJumpDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectionToJumpId)
    
    if(sectionToMoveDOMIndex === sectionToJumpDOMIndex) return
    
    sectionToMoveDOMIndex > sectionToJumpDOMIndex
      // Update the position of the section visually (in the DOM)
      ? draggableSections.insertBefore(sectionToMove, e.target.parentNode) // Move up
      : draggableSections.insertBefore(sectionToMove, e.target.parentNode.nextSibling) // Move down

    // Update the mouse icon
    sectionToMove.classList.remove('moveable')
    sectionToMove.classList.add('pointer')
    
    // Finally update the position of the moved section template to correspond to its new position in the DOM
    const indexOfJumpedSectionTemplate = globalWrite.templates.findIndex(t => t.sectionId === sectionToJumpId)

    if(indexOfJumpedSectionTemplate === -1) return // There is no such section, something went wrong

    const sectionTemplateToMove = globalWrite.templates.find(t => t.sectionId === sectionToDropId)

    globalWrite.templates = globalWrite.templates.filter(t => t.sectionId !== sectionToDropId)

    sectionToMoveDOMIndex > sectionToJumpDOMIndex
      ? globalWrite.templates.splice(indexOfJumpedSectionTemplate, 0, sectionTemplateToMove) // Move up
      : globalWrite.templates.splice(indexOfJumpedSectionTemplate + 1, 0, sectionTemplateToMove) // Move down
  }
}