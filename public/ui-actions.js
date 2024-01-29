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
    , addTerm
    , firebaseCreateAccount
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

export const handleTermAutocomplete = async ({selectedTerms, inputText, dataList, globalWrite, data, parent, addSelectedTermBtn, handleOnClickAddSelectedTermBtn}) => {
    let termData

    inputText.addEventListener('input', debounce(async (e) => {
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild)
        }

        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        termData = await data

        globalWrite.matches = termData.filter(td => td.dt.toLowerCase().startsWith(strToComplete.toLowerCase()))
                
        globalWrite.matches.forEach(match => {
            const option = d.createElement('option')
            option.value = match['dt']
            dataList.appendChild(option)
        })
    }, 0))

    inputText.addEventListener('change', async (e) => {
        const match = e.target.value

        if(match) {
            const term = termData.find(td => td.dt === match)            
            const spans = parent.querySelectorAll('.centred-block > span:nth-child(2)')

            spans[0].innerText = term.dt
            spans[1].innerText = term.dd
            spans[2].innerText = term.ds
            spans[3].innerText = term.da
            if(spans[4]) spans[4].innerText = term.dx || '--'

            if(selectedTerms.find(t => t.dt.toLowerCase() === match.toLowerCase())) return 

            addSelectedTermBtn.classList.remove('disabled')
            addSelectedTermBtn.addEventListener('click', e => handleOnClickAddSelectedTermBtn({
                  terms: termData
                , selectedTerm: term
            }), true)            
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
        , identifications_count: user.identifications_count || 0
        , journal_posts_count: user.journal_posts_count
        , login: user.login
        , name: user.name
        , observations_count: user.observations_count
        , species_count: user.species_count
    }
}

export const mapInatSpeciesToRequiredSpecies = ({species, count, taxa}) => {    
    return species  
        .filter(sp => taxa.map(t => t.name).includes(sp.taxon.iconic_taxon_name.toLowerCase()))      
        .map(sp => {
            return {
                  species_guess: sp.species_guess
                , observation_photos: sp.observation_photos
                , taxon: {
                    ...sp.taxon
                    , count: sp.count || 0
                }            
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
        addSectionToFieldnotes({
              globalWrite
            , section
        })
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

export const saveNewTerm = async ({terms, term}) => {
    // Save new term to db
    if(terms.filter(td => td.dt === term.dt).length === 0) {
        try {
            const response = await addTerm({
                term
            })
            if(response.success) {
                showNotificationsDialog({
                    message: response.message
                })
            }
        } catch (e) {
            showNotificationsDialog({
                  message: e.message
                , type: 'error'
            })
        }
    } else {
        showNotificationsDialog({
            message: 'There is already a definition for this term.'
        })
    }
}

const handleSpeciesCheckState = async({e, observation, sectionIndex, globalWrite,  writeTemplateId}) => {
    const checkbox = e.target
    const name = checkbox.value
    const label = checkbox.nextElementSibling

    let section = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)    
    let index = globalWrite.fieldnotes.sections.findIndex(t => t.sectionIndex === sectionIndex)

    const getSpeciesForInatLookup = ({taxon}) => {
        return {
            taxon: {
                  id: taxon.id
                , name: taxon.name
                , preferred_common_name: taxon.preferred_common_name || '-'
                , iconic_taxon_name: taxon.iconic_taxon_name
                , default_photo: {
                    square_url: taxon.default_photo.square_url
                }
            }
        }
    }

    const getTaxon = ({observation}) => {
       return {
            id: observation.taxon.id,
            name: observation.taxon.name,
            preferred_common_name: observation.taxon.preferred_common_name || '-',
            iconic_taxon_name: observation.taxon.iconic_taxon_name,
            default_photo: {
                square_url: observation.taxon.default_photo.square_url
            }
       }
    }

    const getObservation = ({observation}) => {
        return {
            species_guess: observation.species_guess,
            id: observation.id,
            default_photo: {
                url: observation.photos[0].url
            },
            photos: observation.photos.map(photo => {
                return {
                    id: photo.id,
                    url: photo.url,
                    attribution: photo.attribution
                }
            })
        }
    }

    if(section) {        
        switch(writeTemplateId) {
            case 'species-write-template':
                if(section.species.find(sp => sp.taxon.name === name)) {
                    section.species = section.species.filter(sp => sp.taxon.name !== name)
                    label.innerText = 'Not included'
                } else {
                    section.species.push({
                            name
                          , taxon : getTaxon({ observation })
                    })
                    label.innerText = 'Included'
                }
                globalWrite.fieldnotes.sections[index] = section
                break
            case 'observations-write-template':
                if(section.species.find(sp => sp.observation.id === observation.id)) {
                    section.species = section.species.filter(sp => sp.observation.id !== observation.id)
                    label.innerText = 'Not included'
                } else {
                    section.species.push({
                          name
                        , taxon : getTaxon({ observation })
                        , observation: getObservation({ observation })
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
                        section.species.push(getSpeciesForInatLookup({ taxon: observation.taxon })) 
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
                section = { 
                      ...species
                    , species: [{
                              name
                            , taxon : getTaxon({ observation })
                        }]
                    , templateId: species.templateId
                    , sectionIndex
                }
                break
            case 'observations-write-template':
                section = {
                      ...observations
                    , species: [{
                          name
                        , taxon : getTaxon({ observation })
                        , observation: getObservation({ observation })                        
                    }]
                    , templateId: observations.templateId
                    , sectionIndex
                }
                break
            case 'inat-lookup-write-template':
                section = {
                      ...inatlookup
                    , species: [getSpeciesForInatLookup({ taxon: observation.taxon })]
                    , templateId: inatlookup.templateId
                    , sectionIndex 
                }
                break
        }
        addSectionToFieldnotes({
            globalWrite
          , section
        })
    }

    if(!globalWrite.fieldnotes.taxa.find(t => t.name === name)) {
        globalWrite.fieldnotes.taxa.push({
              id: globalWrite.observations.find(sp => sp.taxon.name === name)?.taxon?.id
            , name
        })
        // Check fieldnotes exist in the db before trying to update a field
        if(globalWrite.fieldnotes.id.length > 0) {
            updateFieldnoteProperty({
                  fieldnotes: globalWrite.fieldnotes
                , prop: 'taxa'
                , value: globalWrite.fieldnotes.taxa
            })
        }
    }
}

export const cloneImages = ({globalWrite, parent, writeTemplateId, sectionIndex}) => {
    switch(writeTemplateId) {
        case 'species-write-template':
            if(globalWrite.observations.length > 0) {
                const uniqueSpecies = []
                globalWrite.observations.forEach((observation, index) => {
                    // Check for duplicate species as there may be multiple observations of the same species
                    if(uniqueSpecies.findIndex(species => species === observation.taxon.name) === -1) {
                        const clone = cloneImageTemplate({
                              observation: {
                                taxon: observation.taxon
                              }
                            , index
                            , sectionIndex
                            , imgUrl: observation.taxon.default_photo.medium_url // use taxon image
                            , globalWrite
                            , writeTemplateId
                        })   
                        parent.appendChild(clone)
                        uniqueSpecies.push(observation.taxon.name)                
                    }
                })
            }
            break
        case 'observations-write-template':
            if(globalWrite.observations.length > 0) {
                    globalWrite.observations.forEach((observation, index) => {
                    const clone = cloneImageTemplate({
                          observation
                        , index
                        , sectionIndex
                        , imgUrl: observation.photos[0].url // use observation image
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
                  observation: {
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

export const cloneImageTemplate = ({observation, index, sectionIndex, imgUrl, globalWrite, writeTemplateId}) => {
    const templateToClone = d.getElementById('images-preview-template')
    const clone = templateToClone.content.cloneNode(true)
    const spans = clone.querySelectorAll('span')
    const img = clone.querySelector('img')      
    const figure = clone.querySelector('figure')
    const checkbox = clone.querySelector('input')
    const label = clone.querySelector('label')

    figure.style.setProperty("background-color", getTaxonGroupColour({
        taxon: observation.taxon.iconic_taxon_name
    }))

    spans[0].textContent = observation.taxon.preferred_common_name || '-'
    spans[1].textContent = observation.taxon.name
    spans[1].classList.add('latin')

    img.src = imgUrl
    img.alt = observation.taxon.name
    img.id = observation.taxon.id
    img.setAttribute('data-i', index + 1)
    img.setAttribute('loading', 'lazy')
    
    // In order to ensure ids are unique in the DOM, prefix the id with the section index
    checkbox.id = `${sectionIndex}-${observation.id || observation.taxon.id}`
    checkbox.value = observation.taxon.name
    checkbox.addEventListener('change', e => handleSpeciesCheckState({
          e 
        , observation
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

export const showNotificationsDialog = ({message, type = 'success', displayDuration = 3500}) => {
    const dialog = d.getElementById('state-notifications')
    const div1 = dialog.querySelector('div > div:nth-child(1)')

    div1.innerText = message
    div1.classList.remove(...div1.classList)  

    let className, iconName

    if(type === 'success') {
        className = 'success-bg'
        iconName = 'success-icon'
    } else {
        className = 'error-bg'
        iconName = 'error-icon'
    }

    div1.classList.add(iconName)
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

        const elementHasBeenAdded = !!elementToRemove
        
        // Remove section from fieldnotes in the db (or ready for deletion if not)
        const response = elementHasBeenAdded 
            ? await removeElementFromArray({fieldnotes: globalWrite.fieldnotes, array: 'sections',  element: elementToRemove})
            : {
                success: true,
                message: 'Section deleted'
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

export const isSectionBeingAdded = ({ globalWrite, sectionToUpdate }) => {    
    let isBeingAdded = sectionToUpdate === null && !hasOriginalTypeValues({globalWrite, section: sectionToUpdate})

    return isBeingAdded
}

export const addSectionToFieldnotes = async ({globalWrite, section}) => {
    const array = 'sections'
    const isBeingAdded = true
    
    const response = await addElementToArray({
          fieldnotes: globalWrite.fieldnotes
        , element: section
        , array
        , isBeingAdded
    })

    // Update changes in memory where necessary (species and terms sections will already have been addded at this point)
    if(response.success) {
        const hasSectionAlreadyBeenAdded = globalWrite.fieldnotes.sections.find(s => s.sectionIndex === section.sectionIndex)
        if(hasSectionAlreadyBeenAdded) return 

        globalWrite.fieldnotes.sections.push(section)
        globalWrite.fieldnotes.sectionOrder.push(section.sectionIndex)   
        globalWrite.nextSectionIndex++
    }

    return response
}

export const addOrUpdateSectionArray = async ({globalWrite, sectionToUpdate, sectionAddedOrUpdated, isBeingAdded}) => {
    try {
        const array = 'sections'

        // Save changes to the db
        let response
        
        if(isBeingAdded) {
            response = await addSectionToFieldnotes({
                globalWrite
              , section: sectionAddedOrUpdated
            })
        } else {
            response = await updateElementFromArray({
                  fieldnotes: globalWrite.fieldnotes
                , array
                , elementToUpdate: sectionToUpdate
                , elementAddedOrUpdated: sectionAddedOrUpdated
                , isBeingAdded
            })
            // Set the original values to the updated values
            setOriginalTypeValues({
                  section: sectionAddedOrUpdated
                , globalWrite
                , type: sectionToUpdate.type
            })
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
        addSectionToFieldnotes({
              globalWrite
            , section
        })
    }
}

export const calcImageIndex = (index) => {
    return (index % 2 === 0)
        ? index / 2
        : ((index -1) / 2)
}

export const handleInputChangeEvent = (e, addBtn) => {
    addBtn.toggleActiveStateByInput({
        str: e.target.value
    })
}

export const handleImageInputChangeEvent = ({addOrUpdateSectionBtn, url1, title1}) => {
    (url1.value.length >= 5 && title1.value.length >= 2)
        ? addOrUpdateSectionBtn.enable()
        : addOrUpdateSectionBtn.disable()
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
            : await getFieldnotesStubs({
                user: null
              , readonly: true
            })

        global.fetchFieldnotesStubsCollection = await fieldnotesStubs

        fieldsnotesAutocomplete({ 
              inputText
            , dataList
            , global
            , fetchFieldnotesBtn
            , fieldnotesStubs
        })
    }
}

export const authenticateUserEmailAndPassword = ({user, email, password, showNotificationsDialog}) => {
    if(user) {
        firebaseSignOut({
              auth: getFirebaseAuth()
            , showNotificationsDialog
        })      
    } else {
        if(email.validity.valid) {
        firebaseLogin({
              email: email.value
            , password: password.value
            , showNotificationsDialog
        })
        }      
    }    
}

export const authenticateNewUserEmailAndPassword = async({email, password, showNotificationsDialog}) => {
    try {
        if(email.validity.valid) {
            firebaseCreateAccount({
                  email: email.value
                , password: password.value
                , showNotificationsDialog
            })
        }
    } catch (e) {
        showNotificationsDialog({
              message: e.message
            , type: 'error'
        })
        console.log(e.message)
    }
}

const encode = s => {
    var out = []
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i)
    }
    return new Uint8Array(out)
}

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

    // With thanks: https://gist.github.com/yiwenl/8f2b735a2263bc93ee33
}

export const scoreLesson = ({answers, global}) => {
    answers.forEach(answer => {
        const sp = global.species.find(s => s.taxon.id === Number(answer.id))

        if(!sp) return

        let isCorrect = false

        if(answer.value.length) {
            isCorrect = global.target.name === 'common name' 
              ? sp.taxon.preferred_common_name.toLowerCase() === answer.value.toLowerCase()
              : sp.taxon.name.toLowerCase() === answer.value.toLowerCase()            
        }

        const score = {
            id: sp.taxon.id
          , isCorrect
        }

        const isRetry = global.template.scores.find(s => s.id === score.id)

        if(isRetry) {
            const index = global.template.scores.findIndex(s => s.id === score.id)
            global.template.scores[index] = score
        } else {
            global.template.scores.push(score)
        }        
    })

    global.template.score = global.template.scores.filter(score => score.isCorrect)?.length || 0
}

export const checkForLocalisedCommonSpeciesNames = ({s, sp}) => {
    // Check that there is a valid name for a taxa e.g. not the empty string or a placeholder (-) 
    const prohibitedNames = [' ', '-']

    try {
        if(s?.taxon?.preferred_common_name) {
            if(!prohibitedNames.includes(s.taxon.preferred_common_name)) {
                if(sp.taxon) {
                    sp.taxon.preferred_common_name = s.taxon.preferred_common_name || '-'
                } else { // observations (for now)
                    sp.taxon = {
                          ...s.taxon
                        , default_photo: {
                              ...s.taxon.default_photo
                            , src: sp.src
                        }
                     } 
                }
            } else {
                sp.taxon = {
                    ...s.taxon
                  , default_photo: {
                        ...s.taxon.default_photo
                      , src: sp.src
                  }
               }
            }
        } 
        return sp
    } catch (e) {
        console.log(e.message)
        if(s) console.log('s :', s)
        if(sp) console.log('sp :', sp)
    }    
}

export const addImageBlockCaption = ({caption, text, parent}) => {
    caption.innerText = text
    caption.classList.add('caption', 'smallish')
    parent.appendChild(caption)    
}

export const cloneSpeciesCardFromTemplate = ({templateToClone, species, index}) => {
    try {            
        const clone = templateToClone.content.cloneNode(true)
    
        const img = clone.querySelector('img')      
        const figcaption = clone.querySelector('figcaption')
        const spans = figcaption.querySelectorAll('span')

        const commonName = species.species_guess || species.taxon.preferred_common_name || '-'
        const taxonName = species.taxon.name
        // Check for observations saved (fieldnotes), then observations directly from inat (inat search), then finally use the taxon fallback (i.e. species)
        const url = species?.observation?.default_photo.url || species?.observation_photos?.[0]?.photo?.url || species.taxon.default_photo.square_url
        const taxonId = species.taxon.id

        figcaption.style.setProperty("background-color", getTaxonGroupColour({
            taxon: species.taxon.iconic_taxon_name
        }))
    
        spans[0].textContent = commonName
        spans[1].textContent = taxonName
        spans[1].classList.add('latin')
        
        img.src = url.replace('square', 'small')
        img.alt = taxonName
        img.id = taxonId
        img.setAttribute('data-i', index + 1)
        img.setAttribute('loading', 'lazy')
    
        return clone
    } catch (e) {
        if(species) console.log('species', species)
        console.log(e.message)
    }
}

export const editSection = ({e, addOrUpdateSectionBtn, editSectionBtn, cancelActionBtn, contentContainer}) => {
    const parent = e.target.parentElement
    contentContainer.classList.remove('disabled')

    addOrUpdateSectionBtn.setText({
      text: 'Save changes' 
    })
    addOrUpdateSectionBtn.enable()
    editSectionBtn.hide()
    cancelActionBtn.show()

    Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
}

export const enableSaveFieldNotesSection = ({globalWrite, saveFieldnotesSection}) => {
    // Check fieldnotes have not been saved
    if(globalWrite.isUserEditing) return

    // Check fields added by the user
    let areFieldsValid = true
    
    // Title
    areFieldsValid = areFieldsValid && globalWrite.fieldnotes.title.length > 2

    // Author
    areFieldsValid = areFieldsValid && globalWrite.fieldnotes.author.length > 2

    // Date
    areFieldsValid = areFieldsValid && isValidDate({date: globalWrite.fieldnotes.d1})
    areFieldsValid = areFieldsValid && isValidDate({date:globalWrite.fieldnotes.d2})

    // Location
    areFieldsValid = areFieldsValid && globalWrite.fieldnotes.location.place_guess.length > 2

    areFieldsValid
      ? saveFieldnotesSection.classList.remove('disabled')
      : saveFieldnotesSection.classList.add('disabled')    
  }

// user action: update metadata e.g. title, author
export const updateMetadataFields = async ({globalWrite, prop, value}) => {
    // Check fieldnotes have been saved
    if(!globalWrite.isUserEditing) return

    let response
    try {
      response = prop === 'title'
        ? await updateFieldnotesTitle({
            fieldnotes: globalWrite.fieldnotes
          , prop
          , value
          , fieldnotesStubs: globalWrite.fieldnotesStubs
        })
        : await updateFieldnoteProperty({
            fieldnotes: globalWrite.fieldnotes
          , prop
          , value
        })
      
      showNotificationsDialog({
          message: response.message
        , type: response.type
        , displayDuration: 2000
      })
    } catch (e) {
        showNotificationsDialog({
            message: `${e.message} for ${prop}`
          , type: 'error'
        })
    }
}

export const updateFieldnotesStateSection = ({globalWrite, updateFieldnotesStatusBtn, updateFieldnotesStatusText, updateFieldnotesCurrentStatusText}) => {
    if (globalWrite.fieldnotesStubs.status === 'public') {
      updateFieldnotesStatusBtn.setText({
        text: 'Set your fieldnotes to private'
      })
      updateFieldnotesStatusText.innerText = 'If you set your fieldnotes to private, they will no longer viewable by others.'
    } else {
      updateFieldnotesStatusBtn.setText({
        text: 'Publish your fieldnotes'
      })
      updateFieldnotesStatusText.innerText = 'Publishing your fieldnotes will make them available to others.'
    }
    updateFieldnotesCurrentStatusText.innerText = globalWrite.fieldnotesStubs.status
  }