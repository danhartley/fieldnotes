import { 
      getIdByAutocomplete
    , removeElementFromArray
    , addElementToArray
    , updateElementFromArray
    , updateFieldnoteProperty
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

// const attachListenersToInatParams = g => {
//   const cbInatParamGroup = d.querySelectorAll('input[name="inat-param"]')

//   cbInatParamGroup.forEach(cb => {
//       cb.addEventListener('click', e => {
//           const name = e.target.value
//           g.inatAutocompleteOptions.forEach(option => {
//               if(option.name === name) {
//                   option.isActive = !option.isActive
//               }
//           })
//       })
//   })
// }

// export const createInatParamsCheckboxGroup = ({g, parent, typeId, sectionIndex}) => {
    
//     if(!parent) return
    
//     const t = d.getElementById('checkbox-template')

//     parent.innerHTML = ''

//     g.inatAutocompleteOptions.filter(param => param.isActive).forEach(param => {
//         const clone = t.content.cloneNode(true)

//         const input = clone.querySelector('input')
//         const label = clone.querySelector('label')
//         label.setAttribute('class', 'text-initial')
    
//         input.setAttribute('name', 'inat-param')
//         input.id = param.id
//         if(param.isActive) input.setAttribute('checked', true)
//         input.value = param.name
//         label.textContent = param[param.name][param.prop]
//         label.htmlFor = input.id

//         parent.appendChild(clone)
//     })

//     attachListenersToInatParams(g)
// }

export const createInatLookups = ({globalWrite, parent, typeId, sectionIndex}) => {
    cloneImages({globalWrite, parent, typeId, sectionIndex})
}

export const handleInatAutocomplete = ({inputText, dataList, globalWrite, id, prop, callback, cbParent, typeId, sectionIndex}) => {
  inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        const data = await getIdByAutocomplete({ by: id, toComplete: strToComplete })
        
        globalWrite.matches = data.results
        
        globalWrite.matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match[prop]
            dataList.appendChild(option)
        })
    }, 350))

    inputText.addEventListener('change', e => {
        const { name } = globalWrite.inatAutocomplete
        const match = e.target.value

        globalWrite.inatAutocompleteOptions.forEach(option => {
            if(option.id === id) {
                option.isActive = true
            }
        })

        if(match) {
            const option = globalWrite.inatAutocompleteOptions.find(option => option.id === id)
            if(option) option[name] = globalWrite.matches.find(m => m[prop] === match)
            
            globalWrite[prop] = match
            // callback({globalWrite, parent: cbParent, typeId, sectionIndex})
        }
    })
}

export const handleTermAutocomplete = ({inputText, selectedItems, dataList, globalWrite, data, parent, addSelectedTermBtn, handleOnClickAddSelectedTermBtn}) => {
  inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        globalWrite.matches = data.filter(item => item.dt.toLowerCase().startsWith(strToComplete.toLowerCase()))
                
        globalWrite.matches.forEach(match => {
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

            if(selectedItems.find(t => t.dt.toLowerCase() === match.toLowerCase())) return 

            addSelectedTermBtn.classList.remove('disabled')
            addSelectedTermBtn.addEventListener('click', e => handleOnClickAddSelectedTermBtn({selectedItems, selectedItem: term}), true)
        }
    })
}

export const handleFieldsnotesAutocomplete = async ({inputText, dataList, global, fieldnotesStubsCallback, importFieldNotesBtn}) => {
    let stubs
    inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        stubs = await fieldnotesStubsCallback()

        const matches = stubs.filter(item => item.title.toLowerCase().startsWith(strToComplete.toLowerCase()))

        dataList.replaceChildren()
                
        matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match['title']
            dataList.appendChild(option)
        })
    }, 0))

    inputText.addEventListener('change', e => {
        const match = e.target.value

        if(match) {
            global.fieldnotesStubs = stubs.find(option => option.title === match)
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

const handleSpeciesCheckState = async({e, sectionIndex, globalWrite}) => {
    const name = e.target.value    

    let section = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)    
    let index = globalWrite.fieldnotes.sections.findIndex(t => t.sectionIndex === sectionIndex)

    if(section) {
        section.species.find(sp => sp === name) 
            ? section.species = section.species.filter(sp => sp !== name)
            : section.species.push(name)
        globalWrite.fieldnotes.sections[index] = section            
    } else {
        const sp = [ name ]
        section = {...species, species: sp, templateId: species.id, sectionIndex }
        globalWrite.fieldnotes.sections.push(section)
    }

    if(!globalWrite.fieldnotes.taxa.find(t => t.name === name)) {
        globalWrite.fieldnotes.taxa.push({
        id: globalWrite.species.find(sp => sp.taxon.name === name)?.taxon?.id,
        name
        })
        updateFieldnoteProperty({fieldnotes: globalWrite.fieldnotes, prop: 'taxa', value: globalWrite.fieldnotes.taxa})
    }
}

export const cloneImages = ({globalWrite, parent, typeId, sectionIndex}) => {
switch(typeId) {
    case 'species-write-template':
    case 'observations-write-template':
        if(globalWrite.species.length > 0) {
            globalWrite.species.forEach((species, index) => {
            const imgUrl = typeId === 'observations-write-template'
            ? species.photos[0].url
            : species.taxon.default_photo.medium_url
            const clone = cloneImageTemplate({species, index, sectionIndex, imgUrl, globalWrite})            
            parent.appendChild(clone)
        })
        } 
        break
    case 'inat-lookup':
    if(globalWrite.name) {
        const match = globalWrite.matches.find(match => match.name === globalWrite.name)
        const imgUrl = match.default_photo.square_url
        const clone = cloneImageTemplate({species: {taxon:match}, index: 0, sectionIndex, imgUrl, globalWrite})            
        parent.appendChild(clone)

        if(!globalWrite.fieldnotes.taxa.find(taxon => taxon.id === match.id)) {                
            globalWrite.fieldnotes.taxa.push({
                id: match.id,
                name: match.name,
            })
        }
    }
    break
}
}

const cloneImageTemplate = ({species, index, sectionIndex, imgUrl, globalWrite}) => {
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
    
    checkbox.id = `${sectionIndex}-${species.id || species.taxon.id}`
    checkbox.value = species.taxon.name
    checkbox.addEventListener('change', e => handleSpeciesCheckState({e, sectionIndex, globalWrite}), true)
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

export const dropHandler = async ({e, globalWrite, draggableSections, apiCallback}) => {
  // The event target is the section being moved (dragged and dropped)
  e.preventDefault()

  if(e.target.type === 'fieldset') {
    const sectionToDropId = sectionToMove.id
    const sectionToJumpId = e.target.parentNode.id

    // Find out whether we are moving the section up or down
    const sectionToMoveDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectionToDropId)
    const sectionToJumpDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => section.id === sectionToJumpId)
    
    if(sectionToMoveDOMIndex === sectionToJumpDOMIndex) return

    // Get the section to move
    const sectionTemplateToMoveId = globalWrite.fieldnotes.sectionOrder.find(sectionIndex => sectionIndex === sectionToDropId)

    // Remove the section to move
    globalWrite.fieldnotes.sectionOrder = globalWrite.fieldnotes.sectionOrder.filter(sectionIndex => sectionIndex !== sectionToDropId)

    // Calculate position of the jumped section
    const indexOfJumpedSectionTemplate = globalWrite.fieldnotes.sectionOrder.findIndex(sectionIndex => sectionIndex === sectionToJumpId)

    if(indexOfJumpedSectionTemplate === -1) {
        throw new Error({
            message: 'Something went wrong, please try again.'
        })
    }

    let sectionOrder = globalWrite.fieldnotes.sectionOrder

    const moveUp = sectionToMoveDOMIndex > sectionToJumpDOMIndex

    try {
        moveUp
            ? sectionOrder.splice(indexOfJumpedSectionTemplate, 0, sectionTemplateToMoveId)
            : sectionOrder.splice(indexOfJumpedSectionTemplate + 1, 0, sectionTemplateToMoveId)

        // Save to the db
        const response = await apiCallback({fieldnotes: globalWrite.fieldnotes, data: {
            sectionOrder
        }})

        if(response.success) {
            // Update changes in memory
            globalWrite.fieldnotes.sectionOrder = sectionOrder

            // Update changes to the DOM
            moveUp
                ? draggableSections.insertBefore(sectionToMove, e.target.parentNode)
                : draggableSections.insertBefore(sectionToMove, e.target.parentNode.nextSibling)

            // Update the mouse icon
            sectionToMove.classList.remove('moveable')
            sectionToMove.classList.add('pointer')

            // Notify user
            showNotificationsDialog({message: 'Section moved'})
        }
    } catch (e) {
        showNotificationsDialog({message: e.message, type: 'error'})
    }
  }
}

export const showNotificationsDialog = ({message, type = 'success', displayDuration = 3500, icon = 'success-icon'}) => {
    const dialog = document.getElementById('state-notifications')
    const div1 = dialog.querySelector('div > div:nth-child(1)')

    div1.innerText = message
    div1.classList.remove(...div1.classList)
    div1.classList.add(icon)

    const className = type === 'success'
        ? 'success-bg'
        : 'error-bg'
    dialog.classList.remove(...dialog.classList)
    dialog.classList.add(className)
    dialog.show()
    setTimeout(() => {
        dialog.close()
    }, displayDuration)
}

export const deleteSection = async ({d, sectionIndex, globalWrite}) => {
    try {        
    const elementToRemove = globalWrite.fieldnotes.sections.find(t => t.sectionIndex == sectionIndex)
    
    // Remove section from fieldnotes in the db
    const response = !!elementToRemove 
        ? await removeElementFromArray({fieldnotes: globalWrite.fieldnotes, array: 'sections',  element: elementToRemove})
        : {
            success: true,
            message: 'Section removed'
        }

    if(response.success) {
        const element = d.getElementById(sectionIndex)
        // Remove section from the DOM
        element.remove()

        // Remove section from the in-memory fieldnotes
        globalWrite.fieldnotes.sections = globalWrite.fieldnotes.sections.filter(t => t.sectionIndex !== sectionIndex)
        globalWrite.fieldnotes.sectionOrder = globalWrite.fieldnotes.sectionOrder.filter(id => id !== sectionIndex)

        // Notify user
        showNotificationsDialog({message: response.message, type: 'success'})
    }    
    } catch (e) {
      showNotificationsDialog({message: e.message, type: 'error'})
    }
}

export const addOrUpdateSection = async ({globalWrite, index, sectionToUpdate, sectionAddedOrUpdated, isEdit}) => {
    try {
        const array = 'sections'

        // Save changes to the db
        let response
        
        if(isEdit) {
            response = await updateElementFromArray({fieldnotes: globalWrite.fieldnotes, array, elementToUpdate: sectionToUpdate, elementAddedOrUpdated: sectionAddedOrUpdated})
            // Update changes in memory
            if(response.success) {                
                globalWrite.fieldnotes.sections[index] = sectionAddedOrUpdated
            }
        } else {
            response = await addElementToArray({fieldnotes: globalWrite.fieldnotes, array, element: sectionAddedOrUpdated})
            // Update changes in memory
            if(response.success) {                
                globalWrite.fieldnotes.sections.push(sectionAddedOrUpdated)
                globalWrite.fieldnotes.sectionOrder.push(sectionAddedOrUpdated.sectionIndex)
            }
        }

        // Notify user
        showNotificationsDialog({message: response.message, type: 'success'})

        return response
        
    } catch (e) {
        showNotificationsDialog({message: e.message, type: 'error'})
    }
}

export const addContentToPreviewContainer = ({previewTemplate, textContent, previewContainer}) => {
    const t = d.getElementById(previewTemplate.templateId)
    const clone = t.content.cloneNode(true)
    const p = clone.querySelector(previewTemplate.element)
    p.textContent = textContent
    previewContainer.appendChild(clone)
  }