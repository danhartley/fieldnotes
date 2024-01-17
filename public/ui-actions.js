import { 
      getIdByAutocomplete
    , removeElementFromArray
    , addElementToArray
    , updateElementFromArray
    , updateFieldnoteProperty
    , getFieldnotesStubs
    , getFirebaseAuth
    , firebaseLogin
    , firebaseSignOut
} from './api.js'

import { 
      species
    , observations
    , inatlookup
    , terms
    , images
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

export const createInatLookups = ({globalWrite, parent, writeTemplateId, sectionIndex}) => {
    cloneImages({
          globalWrite
        , parent
        , writeTemplateId
        , sectionIndex
    })
}

export const handleInatAutocomplete = ({globalWrite, inputText, dataList, id, prop, callback, cbParent, writeTemplateId, sectionIndex}) => {
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
            if(callback) callback({globalWrite, parent: cbParent, writeTemplateId, sectionIndex})
        }
    })
}

export const handleTermAutocomplete = ({selectedTerms, inputText, dataList, globalWrite, data, parent, addSelectedTermBtn, handleOnClickAddSelectedTermBtn}) => {
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

            if(selectedTerms.find(t => t.dt.toLowerCase() === match.toLowerCase())) return 

            addSelectedTermBtn.classList.remove('disabled')
            addSelectedTermBtn.addEventListener('click', e => handleOnClickAddSelectedTermBtn({selectedTerm: term}), true)
        }
    })
}

const addTitlesToList = async ({dataList, strToComplete, fieldnotesStubs}) => {
    try {
        const stubs = await fieldnotesStubs

        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const matches = stubs.filter(item => item.title.toLowerCase().startsWith(strToComplete.toLowerCase()))

        dataList.replaceChildren()

        matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match['title']
            dataList.appendChild(option)
        })

        return stubs
    } catch (e) {
        showNotificationsDialog({
              message: 'You are not logged in.'
            , type: 'error'
        })
    }
}

export const fieldsnotesAutocomplete = async ({inputText, dataList, global, fieldnotesStubs, fetchFieldnotesBtn}) => {
    // The list of titles will initially be short, so we load it at once, in its entirety
    let stubs = await addTitlesToList({
          dataList
        , strToComplete: ''
        , fieldnotesStubs
    })

    inputText.addEventListener('input', debounce(async (e) => {
        stubs = await addTitlesToList({
            dataList
            , strToComplete: e.target.value
            , fieldnotesStubs
        })
    }, 0))

    inputText.addEventListener('change', e => {
        const match = e.target.value

        if(match) {
            global.fieldnotesStubs = stubs.find(option => option.title === match)
            fetchFieldnotesBtn.enable() 
        }
    })
}

export const mapTaxon = ({taxon}) => {
    return {
        iconic_taxon_id: taxon.iconic_taxon_id,
        name: taxon.name,
        id: taxon.id,
        default_photo: taxon.default_photo, // map again to remove properties that aren't needed
        iconic_taxon_name: taxon.iconic_taxon_name,
        preferred_common_name: taxon.preferred_common_name || '-'
    }
}

export const mapUser = ({user}) => {
    return {
          icon: user.icon
        , id: user.id
        , identifications_count: user.identifications_count
        , journal_posts_count: user.journal_posts_count
        , login: user.login
        , name: user.name
        , observations_count: user.observations_count
        , species_count: user.species_count
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

export const getTaxonGroupColour = ({taxon}) => {
    return getComputedStyle(d.documentElement).getPropertyValue(`--${taxon.toLowerCase()}`)
}

export const handleTermCheckState = ({e, globalWrite, selectedTerm, li, sectionIndex}) => {
    const checkbox = e.target
    const isChecked = checkbox.checked
  
    if(!isChecked) li.remove()

    let section = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)    

    if(section) {
        isChecked
            ? section.terms.push(selectedTerm)
            : section.terms = section.terms.filter(t => t !== selectedTerm) 
    } else {
        section = {...terms, terms: [selectedTerm], templateId: terms.templateId, sectionIndex }
        globalWrite.fieldnotes.sections.push(section)
    }
}

export const addTermToList = ({selectedTerms, selectedTerm, selectedItemsListElement, globalWrite, sectionIndex}) => {

    let section = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)

    // Check the new term hasn't been added in memory i.e. not yet saved to db
    if(selectedTerms.findIndex(item => item.dt === selectedTerm.dt) > -1) return

    if(section) {
        // Check that the new term hasn't previously been added i.e. has been saved to db
        if(section.terms.findIndex(term => term.dt === selectedTerm.dt) === -1) {
            section.terms.push(selectedTerm)
        }
    } else {
        section = {...terms, terms: [selectedTerm], templateId: terms.templateId, sectionIndex }
        globalWrite.fieldnotes.sections.push(section)
    }

    // Add the new term to the list
    [selectedTerm].forEach(term => {
        const li = d.createElement('li')
        const checkbox = d.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = term.dt
        checkbox.setAttribute('checked', true)
        checkbox.classList.add('fl')
        checkbox.addEventListener('change', e => handleTermCheckState({
              e
            , globalWrite
            , selectedTerm
            , li
            , sectionIndex
        }), true)
        const label = d.createElement('label')
        label.innerText = term.dt
        label.htmlFor = checkbox.id
        li.appendChild(checkbox)
        li.appendChild(label)
        selectedItemsListElement.appendChild(li)
      })
}

const handleSpeciesCheckState = async({e, taxon, sectionIndex, globalWrite,  writeTemplateId}) => {
    const checkbox = e.target
    const name = checkbox.value
    const id = checkbox.id
    const taxonId = Number(id.substring(id.indexOf('-') + 1)) // remove section identifier used to keep Ids unique in the DOM
    const label = checkbox.nextElementSibling
    const observation = globalWrite.species.find(sp => sp.id === taxonId)

    let section = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)    
    let index = globalWrite.fieldnotes.sections.findIndex(t => t.sectionIndex === sectionIndex)

    const getSpeciesForInatLookup = ({taxon}) => {
        return {
            taxon: {
                  id: taxon.id
                , name: taxon.name
                , preferred_common_name: taxon.preferred_common_name
                , iconic_taxon_name: taxon.iconic_taxon_name
                , default_photo: {
                    square_url: taxon.default_photo.square_url
                }
            }
        }
    }

    if(section) {        
        switch(writeTemplateId) {
            case 'species-write-template':
                if(section.species.find(sp => sp === name)) {
                    section.species = section.species.filter(sp => sp !== name)
                    label.innerText = 'Not included'
                } else {
                    section.species.push(name)
                    label.innerText = 'Included'
                }
                globalWrite.fieldnotes.sections[index] = section
                break
            case 'observations-write-template':                
                if(section.species.find(sp => sp.observation_id === taxonId)) {
                    section.species = section.species.filter(sp => sp.observation_id !== observation.id)
                    label.innerText = 'Not included'
                } else {
                    section.species.push({
                        name
                      , observation_id: observation.id
                      , src: observation.photos[0].url
                    })
                    label.innerText = 'Included'
                }
                globalWrite.fieldnotes.sections[index] = section
                break
            case 'inat-lookup-write-template':
                    if(section.species.find(sp => sp.taxon.name === name)) {
                        section.species = section.species.filter(sp => sp.taxon.name !== name)
                        label.innerText = 'Not included'
                    } else {
                        section.species.push(getSpeciesForInatLookup({
                            taxon
                        })) 
                        label.innerText = 'Included'
                    }
                    globalWrite.fieldnotes.sections[index] = section
                break
        }
    } else {
        const sp = [name]
        label.innerText = 'Included'
        switch(writeTemplateId) {
            case 'species-write-template':
                section = {...species, species: sp, templateId: species.templateId, sectionIndex }
                break
            case 'observations-write-template':
                section = {
                      ...observations
                    , species: [{
                          name
                        , observation_id: observation.id
                        , src: observation.photos[0].url
                    }]
                    , templateId: observations.templateId
                    , sectionIndex
                }
                break
            case 'inat-lookup-write-template':
                section = {
                      ...inatlookup
                    , species: [getSpeciesForInatLookup({
                        taxon
                      })]
                    , templateId: inatlookup.templateId
                    , sectionIndex 
                }
                break
        }
        globalWrite.fieldnotes.sections.push(section)
    }

    if(!globalWrite.fieldnotes.taxa.find(t => t.name === name)) {
        globalWrite.fieldnotes.taxa.push({
              id: globalWrite.species.find(sp => sp.taxon.name === name)?.taxon?.id
            , name
        })
        updateFieldnoteProperty({
              fieldnotes: globalWrite.fieldnotes
            , prop: 'taxa'
            , value: globalWrite.fieldnotes.taxa
        })
    }
}

export const cloneImages = ({globalWrite, parent, writeTemplateId, sectionIndex}) => {
    switch(writeTemplateId) {
        case 'species-write-template':
            if(globalWrite.species.length > 0) {
                const uniqueSpecies = []
                globalWrite.species.forEach((sp, index) => {
                if(uniqueSpecies.findIndex(us => us === sp.taxon.name) === -1) {
                        const clone = cloneImageTemplate({
                              species: sp
                            , index
                            , sectionIndex
                            , imgUrl: sp.taxon.default_photo.medium_url
                            , globalWrite
                            , writeTemplateId
                        })   
                        parent.appendChild(clone)
                        uniqueSpecies.push(sp.taxon.name)                
                    }
                })
            }
            break
        case 'observations-write-template':
            if(globalWrite.species.length > 0) {
                    globalWrite.species.forEach((species, index) => {
                    const clone = cloneImageTemplate({
                          species
                        , index
                        , sectionIndex
                        , imgUrl: species.photos[0].url
                        , globalWrite
                        , writeTemplateId
                    })  
                    parent.appendChild(clone)
                })
            }
            break
        case 'inat-lookup-write-template':
        const term = globalWrite.name || globalWrite.matched_term
        if(term) {
            // match.name is the scientific name, match.matched_term is the preferred common name in the given language (default en)
            const match = globalWrite.matches.find(match => match.name === term || match.matched_term === term)
            const imgUrl = match.default_photo.square_url
            const clone = cloneImageTemplate({
                  species: {
                    taxon: match
                  }
                , index: 0
                , sectionIndex
                , imgUrl
                , globalWrite
                , writeTemplateId
            })           
            parent.appendChild(clone)

            if(!globalWrite.fieldnotes.taxa.find(taxon => taxon.id === match.id)) {                
                globalWrite.fieldnotes.taxa.push({
                      id: match.id
                    , name: match.name
                })
            }
        }
        break
    }
}

export const cloneImageTemplate = ({species, index, sectionIndex, imgUrl, globalWrite, writeTemplateId}) => {
    const templateToClone = d.getElementById('images-preview-template')
    const clone = templateToClone.content.cloneNode(true)
    const spans = clone.querySelectorAll('span')
    const img = clone.querySelector('img')      
    const figure = clone.querySelector('figure')
    const checkbox = clone.querySelector('input')
    const label = clone.querySelector('label')

    figure.style.setProperty("background-color", getTaxonGroupColour({taxon:species.taxon.iconic_taxon_name}))

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
    checkbox.addEventListener('change', e => handleSpeciesCheckState({
          e 
        , taxon: species.taxon
        , sectionIndex
        , globalWrite
        , writeTemplateId
    }), true)
    label.htmlFor = checkbox.id

    return clone
}

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
    const sectionToDropId = Number(sectionToMove.id)
    const sectionToJumpId = Number(e.target.parentNode.id)

    // Find out whether we are moving the section up or down
    const sectionToMoveDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => Number(section.id) === sectionToDropId)
    const sectionToJumpDOMIndex = Array.from(d.querySelectorAll('.draggable')).findIndex(section => Number(section.id) === sectionToJumpId)
    
    if(sectionToMoveDOMIndex === sectionToJumpDOMIndex) return

    // Get the section to move
    const sectionTemplateToMoveId = globalWrite.fieldnotes.sectionOrder.find(sectionIndex => sectionIndex === sectionToDropId)

    // Get the section type
    const elementToMove = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionTemplateToMoveId)

    // Remove the section to move
    globalWrite.fieldnotes.sectionOrder = globalWrite.fieldnotes.sectionOrder.filter(sectionIndex => sectionIndex !== sectionToDropId)

    // Calculate position of the jumped section
    const indexOfJumpedSectionTemplate = globalWrite.fieldnotes.sectionOrder.findIndex(sectionIndex => sectionIndex === sectionToJumpId)

    if(indexOfJumpedSectionTemplate === -1) {
        throw new Error({
            message: 'Something went wrong, please try again.'
        })
    }

    let sectionOrder = globalWrite.fieldnotes.sectionOrder.map(so => so)

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
            showNotificationsDialog({
                 success: true
                , message: `${elementToMove.name} moved`
            })
        }
    } catch (e) {
        showNotificationsDialog({message: e.message, type: 'error'})
    }
  }
}

export const showNotificationsDialog = ({message, type = 'success', displayDuration = 3500, icon = 'success-icon'}) => {
    const dialog = d.getElementById('state-notifications')
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

export const deleteSection = async ({sectionIndex, globalWrite}) => {
    try {        
        const elementToRemove = globalWrite.fieldnotes.sections.find(t => t.sectionIndex == sectionIndex)
        
        // Remove section from fieldnotes in the db, or from memory if not previously saved
        const response = !!elementToRemove 
            ? await removeElementFromArray({fieldnotes: globalWrite.fieldnotes, array: 'sections',  element: elementToRemove})
            : {
                success: true,
                message: `${elementToMove.name} deleted`
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

export const addOrUpdateSectionArray = async ({globalWrite, sectionToUpdate, sectionAddedOrUpdated, isEdit}) => {
    try {
        const array = 'sections'

        // Save changes to the db
        let response
        
        if(isEdit) {
            response = await updateElementFromArray({fieldnotes: globalWrite.fieldnotes, array, elementToUpdate: sectionToUpdate, elementAddedOrUpdated: sectionAddedOrUpdated, isEdit})
            // Update changes in memory
            if(response.success) {                
                console.log('Section updated')
            }
        } else {
            response = await addElementToArray({fieldnotes: globalWrite.fieldnotes, array, element: sectionAddedOrUpdated, isEdit})
            // Update changes in memory
            if(response.success) {                
                globalWrite.fieldnotes.sections.push(sectionAddedOrUpdated)
                globalWrite.fieldnotes.sectionOrder.push(sectionAddedOrUpdated.sectionIndex)   
                globalWrite.nextSectionIndex++  
            }
        }

        if(response.success) {            
            if(sectionToUpdate && sectionToUpdate.type) {
                setOriginalTypeValues({section:sectionAddedOrUpdated, globalWrite, type: sectionToUpdate.type})
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

export const setOriginalTypeValues = ({globalWrite, section, type}) => {
    // Updating an element in an array such as section in sections, requires us first to delete
    // the original element as it was before it was changed. Which is why we need to track original values.
    const typeValues = structuredClone({
        values: section[type],
        sectionIndex: section['sectionIndex']
    })
    const hasOriginalValues = globalWrite.originalTypeValues.find(type => type.sectionIndex === section['sectionIndex'])
    if (hasOriginalValues) {
        globalWrite.originalTypeValues.forEach(type => {
            if (type.sectionIndex === section['sectionIndex']) {
                type.values = typeValues.values
            }
        })
    } else {
        globalWrite.originalTypeValues.push(typeValues)
    }
}

export const getOriginalTypeValues = ({globalWrite, section, type}) => {
    const typeValues = section === null
        ? []
        : structuredClone(globalWrite.originalTypeValues.find(values => values.sectionIndex === section['sectionIndex'])?.values) || section[type]

    return typeValues
}

export const hasOriginalTypeValues = ({globalWrite, section}) => {
    const typeValues = section === null
    ? []
    : structuredClone(globalWrite.originalTypeValues.find(values => values.sectionIndex === section['sectionIndex'])?.values) || []

return typeValues.length > 0
}

export const isValidDate = ({date}) => {
    return date.length > 0 && Object.prototype.toString.call(new Date(date)) === '[object Date]'
}

export const handleImageTextChange = ({globalWrite, sectionIndex, imageSrcs, index, strValue, property}) => {
    const image = imageSrcs[index]
    if(image) {
      image[property] = strValue
      imageSrcs[index] = image
    } else {
      imageSrcs.push({
        [property]: strValue              
      })            
    }
    let section = globalWrite.fieldnotes.sections.find(section => section.sectionIndex === sectionIndex)
    if(section) {
      section.images = imageSrcs
    } else {
      section = {...images, images: imageSrcs, templateId: images.templateId, sectionIndex: globalWrite.nextSectionIndex }
      globalWrite.fieldnotes.sections.push(section)
    }
  }
  
  export const calcImageIndex = (index) => {
    return (index % 2 === 0)
    ? index / 2
    : ((index -1) / 2)
  }

  export const toggleBtnEnabledState = ({str, btn}) => {
    str.length > 0
    ? btn.classList.remove('disabled')
    : btn.classList.add('disabled')
  }

  export const handleInputChangeEvent = (e, addBtn) => {
    addBtn.toggleActiveStateByInput({
        str: e.target.value
    })
  }

  export const handleImageInputChangeEvent = ({addBtn, url1, title1}) => {
      (url1.value.length >= 5 && title1.value.length >= 2)
        ? addBtn.classList.remove('disabled')
        : addBtn.classList.add('disabled')    
  }

  export const toggleSpeciesList = ({btn, fieldset}) => {    
    if(btn.getText().toLowerCase() === 'show only included') {
      fieldset.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(input => {
        input.closest('figure').classList.add('hidden')
      })
        btn.setText({
            text: 'show all'
        })
    } else {
        fieldset.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.closest('figure').classList.remove('hidden')
        })
        btn.setText({
            text: 'show only included'
        })
    }
  }

  export const fetchFieldnotesStubs = ({inputText, dataList, global, fetchFieldnotesBtn}) => {
    return async ({user}) => {
      const fieldnotesStubs = user 
        ? await getFieldnotesStubs({user})
        : []

      fieldsnotesAutocomplete({ 
          inputText
        , dataList
        , global
        , fetchFieldnotesBtn
        , fieldnotesStubs
      })
    }
  }

  export const authenticateUserEmailAndPassword = ({user, email, password}) => {
    if(user) {
      firebaseSignOut({
        auth: getFirebaseAuth()
      })      
    } else {
      if(email.validity.valid) {
        firebaseLogin({
            email: email.value
          , password: password.value
        })
      }      
    }    
  }

const encode = s => {
    var out = []
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i)
    }
    return new Uint8Array(out)
}

// With thanks: https://gist.github.com/yiwenl/8f2b735a2263bc93ee33
export const saveJson = ({obj, title = 'fieldnotes'}) => {
    var str = JSON.stringify(obj)
    var data = encode(str)

    var blob = new Blob([data], {
        type: 'application/octet-stream'
    })

    var url = URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${title}.json`)
    var event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
    link.dispatchEvent(event)
}
