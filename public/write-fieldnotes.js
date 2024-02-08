import {   
  addFieldnotes
, g
, getFieldnotesById
, getFirebaseAuth
, getInatObservations
, getTerms
, onFirebaseAuthStateChange
, updateFieldNotes
, updateFieldnoteStubProperty
} from './api.js'

import { 
  previewTemplates
, writeTemplates
} from './templates.js'

import { 
    addContentToPreviewContainer
  , addOrUpdateSectionArray
  , addTermToList
  , authenticateNewUserEmailAndPassword
  , authenticateUserEmailAndPassword
  , calcImageIndex
  , cloneImages
  , cloneImageTemplate
  , createInatLookups
  , deleteSection
  , dragenterHandler
  , dragleaveHandler
  , dragoverHandler
  , dragstartHandler
  , dropHandler
  , editSection
  , enableSaveFieldNotesSection
  , fetchFieldnotesStubs
  , fieldnotesAutocomplete
  , getOriginalTypeValues
  , handleImageInputChangeEvent
  , handleImageTextChange
  , handleInputChangeEvent
  , handleInatAutocomplete
  , handleTermAutocomplete
  , isSectionBeingAdded
  , mapTaxon
  , mapUser
  , saveNewTerm
  , setOriginalTypeValues
  , showNotificationsDialog
  , toggleSpeciesList
  , updateFieldnotesStateSection
  , updateMetadataFields
} from './ui-actions.js'

import {
      ButtonComponent
    , CheckBoxComponent
} from './ui-components.js'

import {
  saveJson
} from './utils.js'

const init = () => {

  const initGlobalWrite = () => {
    const globalWrite = {}
    Object.assign(globalWrite, {
        iconicTaxa: g.ICONIC_TAXA
      , species: []
      , nextSectionIndex: 0
      , inatAutocompleteOptions: g.inatAutocompleteOptions
      , inatAutocomplete: g.inatAutocomplete
      , fieldnotesStubs: {}
      , fieldnotes: {
        author: ''
      , d1: ''
      , d2: ''
      , fnId: ''
      , id: ''
      , language: g.LANGUAGES[1]
      , location: {
            location: ''
          , place_guess: ''
        }
      , sectionOrder: []
      , sections: []
      , taxa: []
      , title: ''
      , user: {
            id: ''
          , icon: ''
          , identifications_count: 0
          , login: ''
          , observations_count: 0
          , species_count: 0
        }
      }
      , originalTypeValues: []
      , authentication: {}
      , isUserEditing: false
    })

    return globalWrite
  }

  let globalWrite = initGlobalWrite()

  const d = document

  const draggableSections = d.getElementById('draggable-sections')
  const fnAutocompleteTitleInputText = d.getElementById('fn-autocomplete-title-input-text')
  const fnAutocompleteTitleDatalist = d.getElementById('fn-autocomplete-title-data-list')
  const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')
  
  const metaDataSection = d.getElementById('meta-data-section')
  const titleInputText = d.getElementById('title-input-text')
  const authorInputText = d.getElementById('author-input-text')
  const dateInputText = d.getElementById('date-input-text')
  const placeInputText = d.getElementById('place-input-text')

  const selectSectionTypeSection = d.getElementById('select-section-type-section')  
  const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')
  
  const updateFieldnotesStatusText = d.getElementById('update-fieldnotes-status-text')
  const updateFieldnotesCurrentStatusText = d.getElementById('update-fieldnotes-current-status-text')
  
  const authenticationForm = d.getElementById('authentication-form')
  const authenticateStateText = d.getElementById('authenticate-state-text')
  const iNatAutocompleteInputText = d.getElementById('inat-autocomplete-input-text')
  const iNatAutocompleteDatalist = d.getElementById('inat-autocomplete-data-list')
  
  const singleObservationsInputDate = d.getElementById('single-observations-input-date')
  const searchInatObservationsNotificationText = d.getElementById('search-inat-observations-notification-text')
  
  const saveFieldnotesSection = d.getElementById('save-fieldnotes-section')
  const fieldnotesStateSection = d.getElementById('fieldnotes-state-section')
  const rememberInatUserCheckbox = d.getElementById('remember-inat-user-checkbox')
  
  draggableSections.addEventListener('dragover', dragoverHandler)
  draggableSections.addEventListener('drop', e => dropHandler({
      e
    , globalWrite
    , draggableSections
    , apiCallback: updateFieldNotes
  }))

  // User action: select create or edit fieldnotes
  const toggleView = ({btn}) => {
    const view = btn.dataset.view

    globalWrite.view = view

    // Change the text of the buttons that trigger a change of view
      Array.from(d.getElementsByClassName('view-btn')).forEach(btn => {
        btn.innerText = btn.innerText.toLowerCase() === 'show'
          ? 'hide'
          : 'show'
    })
    
    Array.from(d.getElementsByClassName('fieldnotes-view'))
      .forEach(view => {
        // Remove solid fieldset borders
        view.closest('fieldset')?.classList.remove('border-solid')
        // Show or hide active view
        view.classList.toggle('hidden')
      })

      // Highlight active view with solid fieldset border
      btn.closest('fieldset').classList.add('border-solid')

    switch(view) {
      case 'create':
        iNatAutocompleteInputText.focus()
        metaDataSection.classList.remove('disabled')
        globalWrite.isUserEditing = false
        break
      case 'edit':
        fnAutocompleteTitleInputText.focus()
        metaDataSection.classList.add('disabled')
        globalWrite.isUserEditing = true
        break
    }    

    // Remove existing sections
    draggableSections.replaceChildren()
  }

  const showHideEditFieldnotesBtn = new ButtonComponent({
      elementSelector: 'show-hide-edit-fieldnotes-btn'
    , clickHandler: e => toggleView({ btn: e.target })
  })

  const showHideCreateFieldnotesBtn = new ButtonComponent({
      elementSelector: 'show-hide-create-fieldnotes-btn'
    , clickHandler: e => toggleView({ btn: e.target })
  })

  // Create fieldnotes
  
  // search iNaturalist for observations
  const searchInatObservations = async () => {
    try {
        searchInatObservationsNotificationText.classList.toggle('hidden')
        searchInatObservationsBtn.toggleActiveState()
  
        const defaultUser = globalWrite.fieldnotes.user
        
        // If there is no user available via autocomplete, use the default (saved) inat user, if there is one
        globalWrite.fieldnotes.user = globalWrite.inatAutocompleteOptions.find(o => o.id === 'users')?.user || defaultUser
  
        globalWrite.observations = await getInatObservations({ 
              user_id: globalWrite.fieldnotes.user.id
            , place_id: null
            , iconic_taxa: globalWrite.iconicTaxa
            , per_page: 200
            , locale: globalWrite.fieldnotes.language.id
            , species_count: false
            , d1: singleObservationsInputDate.value
            , d2: singleObservationsInputDate.value
        })    
        
        searchInatObservationsBtn.toggleActiveState()
  
        searchInatObservationsNotificationText.innerText = 'Search complete'
  
        setTimeout(() => {
          searchInatObservationsNotificationText.classList.toggle('hidden')
          searchInatObservationsNotificationText.innerText = 'Waiting for response from iNaturalist…'
        }, 1500)
  
        if(globalWrite.observations.length === 0) {
          showNotificationsDialog({
              message: 'Unfortunately your search returned no observations.'
            , displayDuration: 5000
          })
          return
        }
  
        const { author, date, location } = {
            author: globalWrite.observations[0].user.name
          , date: globalWrite.observations[0].observed_on
          , location: {
              location: globalWrite.observations[0].location
            , place_guess: globalWrite.observations[0].place_guess
          }
        }
        const title = `${location.place_guess}, ${(new Date(date)).toDateString()}`
  
        titleInputText.value = title
        authorInputText.value = author
        dateInputText.value = date
        placeInputText.value = location.place_guess
  
        globalWrite.fieldnotes.title = title
        globalWrite.fieldnotes.author = author
        globalWrite.fieldnotes.d1 = date
        globalWrite.fieldnotes.d2 = date
        globalWrite.fieldnotes.location = location
  
        // Enable the create observation and species section buttons
        selectSectionTypeSection.querySelector('#observations').classList.remove('disabled')
        selectSectionTypeSection.querySelector('#species').classList.remove('disabled')
        
        // Immeditely save a private draft of the fieldnotes
        await saveFieldnotes({
          status: 'private'
        })

        // Update the titles list
        await fetchFieldnotesStubs({
            inputText: fnAutocompleteTitleInputText
          , dataList: fnAutocompleteTitleDatalist
          , global: globalWrite
          , fetchFieldnotesBtn
        })({ user: globalWrite.user })

        // Immediately hide save options
        saveFieldnotesSection.classList.add('hidden')

        // Set fieldnotesStubs as if it had been selected        
        globalWrite.fieldnotesStubs = globalWrite.fieldnotesStubsCollection.find(stub => stub.title === globalWrite.fieldnotes.title)

        // Set values for fieldnotes status text and update button
        updateFieldnotesStateSection({
            globalWrite
          , updateFieldnotesStatusBtn
          , updateFieldnotesStatusText
          , updateFieldnotesCurrentStatusText
        })

        // Trigger the switch to edit view
        toggleView({
          btn: showHideEditFieldnotesBtn.buttonElement
        })

        // Set the selected title as the title of the newly created fieldnotes
        fnAutocompleteTitleInputText.value = globalWrite.fieldnotesStubs.title

        // Enable fetch 
        fetchFieldnotesBtn.enable()
  
        // Save inat user
        if(rememberInatUserCheckbox.checked) {
          const { icon, id, login, name, name_autocomplete, observations_count, species_count } = globalWrite.observations[0].user
  
          appLocalStorage.set({
              key: 'inat-user'
            , value: {
                icon
              , id
              , login
              , name
              , name_autocomplete
              , observations_count
              , species_count
            }
          })
        }

        // Enable other sections
        d.querySelectorAll('.has-fieldnotes').forEach(section => section.classList.remove('disabled'))

        // Remove manual save options
        saveFieldnotesSection.classList.add('hidden')

        // Enable option to toggle fieldnotes state between private and public
        fieldnotesStateSection.classList.remove('disabled')    
  
        // Notify user that observations are available
        showNotificationsDialog({
            message: 'iNaturalist observations now available'
          , type: 'success'
        })
      } catch (e) {
          showNotificationsDialog({
              message: e.message
            , type: 'error'
          })
      }
  }
  
  const searchInatObservationsBtn = new ButtonComponent({
        elementSelector: 'search-inat-observations-btn'
      , clickHandler: searchInatObservations
  })

  handleInatAutocomplete({ 
      inputText: iNatAutocompleteInputText
    , dataList: iNatAutocompleteDatalist
    , globalWrite
    , id: globalWrite.inatAutocomplete.id
    , prop: globalWrite.inatAutocomplete.prop
    , cbParent: d.getElementById('inat-params-input-check-box-group')
  })

  const updateFieldnotesStatusBtn = new ButtonComponent({
      elementSelector: 'update-fieldnotes-status-btn'
  })

  // Create & edit fieldnotes
  
  // Create new fieldnotes section
  const createSection = ({writeTemplateId, typeText, sectionTemplate, sectionIndex}) => {
    const sectionClone = sectionTemplate.content.cloneNode(true)
    const draggableSection = sectionClone.querySelector('section.draggable')
    const contentContainer = sectionClone.querySelector('.content-container')
    const fieldset = sectionClone.querySelector('fieldset')
    const legend = sectionClone.querySelector('legend')
    const parentContainer = sectionClone.querySelector('div')
    
    const toggleSpeciesListBtn = new ButtonComponent({
        parent: sectionClone
      , elementSelector: 'toggle-species-include-all-btn'
    })
    const addOrUpdateSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementSelector: 'add-or-update-section-btn'
    })
    const editSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementSelector: 'edit-section-btn'
    })
    const deleteSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementSelector: 'delete-section-btn'
    })
    const cancelActionBtn = new ButtonComponent({
        parent: sectionClone
      , elementSelector: 'cancel-action-btn'
    })
    
    const typeTemplate = d.getElementById(writeTemplateId)
    const typeClone = typeTemplate.content.cloneNode(true)

    draggableSection.setAttribute('id', sectionIndex)
    draggableSection.addEventListener('dragstart', dragstartHandler)    
    
    let input, label, textarea, datalist, previewContainer, images, cbParent, observer = null

    legend.innerText = typeText

    previewContainer = typeClone.querySelector('.edit')

    // Create the section
    switch(writeTemplateId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        input = typeClone.querySelector('input')
        input.id = `input-${sectionIndex}`
        input.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionBtn), true)
        label = typeClone.querySelector('label')
        label.htmlFor = input.id
        addOrUpdateSectionBtn.addClickHandler({
          clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: input.value
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        break
      case 'textarea-write-template':    
        textarea = typeClone.querySelector('textarea')
        textarea.id = `textarea-${sectionIndex}`
        textarea.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionBtn), true)
        label = typeClone.querySelector('label')
        label.htmlFor = textarea.id
        addOrUpdateSectionBtn.addClickHandler({
          clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: textarea.value
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        break
      case 'observations-write-template':
      case 'species-write-template':       
        cloneImages({
            globalWrite
          , parent: typeClone.querySelector('div')
          , writeTemplateId
          , sectionIndex
        })
        addOrUpdateSectionBtn.addClickHandler({
          clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: null
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        // Observe changes to the species list
        observer = new MutationObserver(() => {
          const section = globalWrite.fieldnotes.sections.find(s => s.sectionIndex === sectionIndex)
          const speciesCount = section?.species?.length || 0
          if(speciesCount > 0) {
            addOrUpdateSectionBtn.enable()
            addOrUpdateSectionBtn.setText({
              text: 'Save changes' 
            })
          } else {
            addOrUpdateSectionBtn.setText({
              text: 'Add section' 
            })
            addOrUpdateSectionBtn.disable()
          }
        })
        observer.observe(draggableSection.querySelector('.content-container'), {
              subtree: true
            , childList: true
        })
        break
      case 'terms-write-template':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionIndex}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionIndex}-dl-input-text`
        input.setAttribute('list', datalist.id)        
        label = typeClone.querySelector('label')
        label.htmlFor = input.id                  
        addOrUpdateSectionBtn.addClickHandler({
          clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: null
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        // Observe changes to the terms list
        observer = new MutationObserver(() => {
          const section = globalWrite.fieldnotes.sections.find(s => s.sectionIndex === sectionIndex)
          const termsCount = section?.terms?.length || 0
          if(termsCount > 0) {
            addOrUpdateSectionBtn.enable()
            addOrUpdateSectionBtn.setText({
              text: 'Save changes' 
            })
          } else {
            addOrUpdateSectionBtn.setText({
              text: 'Add section' 
            })
            addOrUpdateSectionBtn.disable()
          }
        })
        observer.observe(draggableSection.querySelector('.content-container'), {
              subtree: true
            , childList: true
        })
        break
      case 'images-write-template':
        const sectionContainer = typeClone.getElementById('section-id')
        sectionContainer.id = `${sectionContainer.id}-${sectionIndex}`
        const url1 = typeClone.getElementById('image-url-input-0')
        const title1 = typeClone.getElementById('image-title-input-0')
        url1.addEventListener('input', () => handleImageInputChangeEvent({
            addOrUpdateSectionBtn
          , url1
          , title1
        }), true)
        title1.addEventListener('input', () => handleImageInputChangeEvent({
            addOrUpdateSectionBtn
          , url1
          , title1
        }), true)
        addOrUpdateSectionBtn.addClickHandler({
          clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: null
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        break
      case 'inat-lookup-write-template':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionIndex}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionIndex}-dl-input-text`
        input.setAttribute('list', datalist.id)
        label = typeClone.querySelector('label')
        label.htmlFor = input.id
        cbParent = typeClone.querySelector('#inat-lookup-callback-parent')
        cbParent.id = `inat-lookup-parent-${sectionIndex}`
        addOrUpdateSectionBtn.addClickHandler({
            clickHandler: e => addOrUpdateSection({
              parent: e.target.parentElement
            , writeTemplateId
            , typeValue: null
            , previewContainer
            , sectionIndex
            , cancelActionBtn
          })
        })
        // Observe changes to the species list
        observer = new MutationObserver(e => {
          const section = globalWrite.fieldnotes.sections.find(s => s.sectionIndex === sectionIndex)
          const speciesCount = section?.species?.length || 0
          if(speciesCount > 0) {
            addOrUpdateSectionBtn.enable()
            addOrUpdateSectionBtn.setText({
              text: 'Save changes' 
            })
          } else {
            addOrUpdateSectionBtn.setText({
              text: 'Add section' 
            })
            addOrUpdateSectionBtn.disable()
          }
        })
        observer.observe(draggableSection.querySelector('.content-container'), {
              subtree: true
            , childList: true
        })
        break
    }
    editSectionBtn.addClickHandler({
      clickHandler: e => editSection({
          e
        , addOrUpdateSectionBtn
        , editSectionBtn
        , cancelActionBtn
        , contentContainer
      })
    })

    // Add the child to its parent container
    parentContainer.appendChild(typeClone)

    // Add the parent container (the HTML cloned fragment) to the DOM
    draggableSections.appendChild(sectionClone)

    // Listen for drag events
    Array.from(draggableSections.getElementsByTagName('section')).forEach(section => {
      section.addEventListener('dragenter', dragenterHandler)
      section.addEventListener('dragenter', dragleaveHandler)
    })

    draggableSections.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })
    
    deleteSectionBtn.addClickHandler({
      clickHandler: () => deleteSection({
          sectionIndex
        , globalWrite
      })
    })

    cancelActionBtn.addClickHandler({
      clickHandler: e => {
        cancelActionBtn.hide()
        addOrUpdateSectionBtn.hide()
        editSectionBtn.show()
        deleteSectionBtn.show()
        contentContainer.classList.toggle('disabled')
      }
    })

    const section = globalWrite.fieldnotes.sections.find(section => section.sectionIndex === sectionIndex)

    if(!section) {
      contentContainer.classList.toggle('disabled')
    }

    // Add additional functionality once the DOM has been updated
    switch(writeTemplateId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()
        break
      case 'species-write-template':
      case 'observations-write-template':
          toggleSpeciesListBtn.addClickHandler({
            clickHandler: () => toggleSpeciesList({
                btn:toggleSpeciesListBtn
              , fieldset
            })
          }) 
         break
      case 'textarea-write-template':
        fieldset.querySelector('textarea:not(.hidden)')?.focus()
        break
      case 'terms-write-template':
        const parent = fieldset.querySelector('#selected-term')
        const addSelectedTermBtn = fieldset.querySelector('#add-selected-term-btn')
        const addNewTermBtn = new ButtonComponent({
          elementSelector: 'add-new-term-btn'
        })

        const selectedTerms = []
        const handleOnClickAddSelectedTermBtn = ({terms, selectedTerm}) => {
          const selectedItemsListElement = fieldset.querySelector('#selected-terms-list')
          addTermToList({
              selectedTerms
            , selectedTerm
            , selectedItemsListElement
            , globalWrite
            , sectionIndex
          })
          addSelectedTermBtn.classList.add('disabled')
          addOrUpdateSectionBtn.enable()
          input.value = ''
          selectedTerms.push(selectedTerm)
        }
        input.focus()
        handleTermAutocomplete({ 
            selectedTerms
          , inputText: input
          , dataList: datalist
          , globalWrite
          , data: getTerms()
          , parent
          , addSelectedTermBtn
          , handleOnClickAddSelectedTermBtn
        })
        
        // Create a new term
        const dt = fieldset.querySelector('#input-dt')
        const dd = fieldset.querySelector('#input-dd')
        const ds = fieldset.querySelector('#input-ds')
        const da = fieldset.querySelector('#input-da')
        const dx = fieldset.querySelector('#input-dx')

        // Update the term ids so that they are unique in the DOM
        dt.id = `${sectionIndex}-input-dt`
        d.querySelector('label[for="input-dt"]').htmlFor = dt.id
        dd.id = `${sectionIndex}-input-dd`
        d.querySelector('label[for="input-dd"]').htmlFor = dd.id
        ds.id = `${sectionIndex}-input-ds`
        d.querySelector('label[for="input-ds"]').htmlFor = ds.id
        da.id = `${sectionIndex}-input-da`
        d.querySelector('label[for="input-da"]').htmlFor = da.id
        dx.id = `${sectionIndex}-input-dx`
        d.querySelector('label[for="input-dx"]').htmlFor = dx.id
        
        dt.addEventListener('change', e => {
          e.target.value.length > 0
            ? addNewTermBtn.enable()
            : addNewTermBtn.disable()
        })
        
        addNewTermBtn.addClickHandler({
          clickHandler: async () => {
            const newTerm = Object.assign({}, {
              dt: dt.value
            , dd: dd.value
            , ds: ds.value
            , da: da.value
            , dx: dx.value
          })

          const terms = await getTerms()

          saveNewTerm({
              terms
            , term: newTerm
          })
                    
          handleOnClickAddSelectedTermBtn({
              selectedTerms
            , selectedTerm: newTerm
          })}
        })
        break
      case 'images-write-template':
        const url1 = fieldset.querySelector('#image-url-input-0')
        const title1 = fieldset.querySelector('#image-title-input-0')
        const url2 = fieldset.querySelector('#image-url-input-1')
        const title2 = fieldset.querySelector('#image-title-input-1')
        const url3 = fieldset.querySelector('#image-url-input-2')
        const title3 = fieldset.querySelector('#image-title-input-2')      
        
        images = section?.images || []
        
        if(images.length === 0) {
          for (let i = 0; i < 3; i++) {
            images.push({
                src:''
              , alt:''
            })  
          }
        }
        
        [url1, title1, url2, title2, url3, title3].forEach((input, index) => {
          input.addEventListener('input', e => handleImageTextChange({
              globalWrite
            , sectionIndex
            , imageSrcs: images
            , strValue:e.target.value
            , index: calcImageIndex(index)
            , property:input.dataset.key
          }), true)
        })
        Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()
        break
      case 'inat-lookup-write-template':
        toggleSpeciesListBtn.addClickHandler({
          clickHandler: () => toggleSpeciesList({
              btn: toggleSpeciesListBtn
            , fieldset
          })
        })
        Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()

        globalWrite.inatAutocomplete = globalWrite.inatAutocompleteOptions.find(option => option.id === 'taxa')

        handleInatAutocomplete({ 
            inputText: input
          , dataList: datalist
          , globalWrite
          , id: globalWrite.inatAutocomplete.id
          , prop: globalWrite.inatAutocomplete.prop
          , callback: createInatLookups
          , cbParent
          , writeTemplateId
          , sectionIndex
        })
      break
    }
    return draggableSection
  }

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', e => { 
    const writeTemplateId = e.target.value
    const parentTemplateId = 
         globalWrite.fieldnotes.sections.find(section => section.writeTemplateId === writeTemplateId)?.writeParentTemplateId 
      || writeTemplates.find(template => template.templateId === writeTemplateId).writeParentTemplateId
    
    createSection({
        writeTemplateId
      , typeText: e.target.innerText
      , sectionTemplate: d.getElementById(parentTemplateId)
      , sectionIndex: globalWrite.nextSectionIndex
    })
  }, true))

  // User action: add or update a section
  const addOrUpdateSection = async ({parent, writeTemplateId, typeValue, previewContainer, sectionIndex, cancelActionBtn}) => {
    cancelActionBtn.hide()

    let sectionAddedOrUpdated = null

    const sectionToUpdate = structuredClone(globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)) || null
    const isBeingAdded = isSectionBeingAdded({
        globalWrite
      , sectionToUpdate
    })
    
    const writeTemplate = writeTemplates.find(template => template.templateId === writeTemplateId)
    const previewTemplate = previewTemplates.find(template => template.templateId === writeTemplate.previewTemplateId)

    switch(writeTemplateId) {
      case 'h3-write-template':        
      case 'h4-write-template':
      case 'xenocanto-write-template':
        previewTemplate[previewTemplate.element] = typeValue
        sectionAddedOrUpdated = { ...previewTemplate, sectionIndex }
        previewContainer.replaceChildren()
        addContentToPreviewContainer({
            previewTemplate
          , textContent: typeValue
          , previewContainer
        })
        break
      case 'textarea-write-template':
        const ps = typeValue.split('\n').filter(p => p.length > 0)
        const paras = ps.map(p => {
          return {
            p
          }
        })
        sectionAddedOrUpdated = { ...previewTemplate, sectionIndex, paras }
        previewContainer.replaceChildren()
        paras.forEach(text => addContentToPreviewContainer({
            previewTemplate
          , textContent:text.p
          , previewContainer}))
        break
      case 'observations-write-template':
      case 'species-write-template':
      case 'inat-lookup-write-template':
        sectionAddedOrUpdated = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)
        if(sectionToUpdate) sectionToUpdate.species = getOriginalTypeValues({
            globalWrite
          , section: sectionToUpdate
          , type: sectionToUpdate.type
        })
        break
      case 'terms-write-template':                
        sectionAddedOrUpdated = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)
        if(sectionToUpdate) sectionToUpdate.terms = getOriginalTypeValues({
            globalWrite
          , section: sectionToUpdate
          , type: sectionToUpdate.type
        })
        break
      case 'images-write-template':
        sectionAddedOrUpdated = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)
        if(sectionToUpdate) sectionToUpdate.images = getOriginalTypeValues({
            globalWrite
          , section: sectionToUpdate
          , type: sectionToUpdate.type
        })
        break
    }
    
    // Show the preview section and hide the edit section
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))

    addOrUpdateSectionArray({globalWrite, sectionToUpdate, sectionAddedOrUpdated, isBeingAdded})
  }

  // User action: change metadata value
  titleInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.title = e.target.value
    updateMetadataFields({
        globalWrite
      , prop: 'title'
      , value: globalWrite.fieldnotes.title
    })
    enableSaveFieldNotesSection({ 
        globalWrite
      , saveFieldnotesSection 
    })
  })
  authorInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.author = e.target.value
    updateMetadataFields({
        globalWrite
      , prop: 'author'
      , value: globalWrite.fieldnotes.author
    })
    enableSaveFieldNotesSection({ 
        globalWrite
      , saveFieldnotesSection 
    })
  })
  dateInputText.addEventListener('change', e => {
    const date = e.target.value        
    globalWrite.fieldnotes.d1 = date
    globalWrite.fieldnotes.d2 = date
    updateMetadataFields({
        globalWrite
      , prop: 'd1'
      , value: globalWrite.fieldnotes.d1
    })
    updateMetadataFields({
        globalWrite
      , prop: 'd2'
      , value: globalWrite.fieldnotes.d2
    })    
    enableSaveFieldNotesSection({ 
        globalWrite
      , saveFieldnotesSection 
    })
  })
  placeInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.location.place_guess = e.target.value
    updateMetadataFields({
          globalWrite
        , prop: 'location'
        , value: { 
            place_guess: globalWrite.fieldnotes.location.place_guess
          , location: globalWrite.fieldnotes.location.location
      }
    })
    enableSaveFieldNotesSection({ 
        globalWrite
      , saveFieldnotesSection 
    })
  })

  const enableSearchBtn = () => {
    const hasUser = globalWrite.login && globalWrite.login.length > 0
    const date = new Date(singleObservationsInputDate.value)
    const hasDate = singleObservationsInputDate.value.length > 0 && Object.prototype.toString.call(date) === '[object Date]'

    hasUser && hasDate
      ? searchInatObservationsBtn.enable()
      : searchInatObservationsBtn.disable()
  }
  
  singleObservationsInputDate.addEventListener('blur', enableSearchBtn, true)
  iNatAutocompleteInputText.addEventListener('blur', enableSearchBtn, true)

  // Save newly created fieldnotes
  const saveFieldnotes = async({status}) => {
    try {
      const notes = {}

      Object.assign(notes, {
          id: globalWrite.fieldnotes.id || ''
        , fnId: globalWrite.fieldnotes.title
        , title: globalWrite.fieldnotes.title
        , author: globalWrite.fieldnotes.author
        , user: {
            id: globalWrite.fieldnotes.user.id
          , icon: globalWrite.fieldnotes.user.icon
          , identifications_count: globalWrite.fieldnotes.user.identifications_count || 0
          , login: globalWrite.fieldnotes.user.login
          , observations_count: globalWrite.fieldnotes.user.observations_count
          , species_count: globalWrite.fieldnotes.user.species_count
        }
        , d1: globalWrite.fieldnotes.d1
        , d2: globalWrite.fieldnotes.d2
        , location: globalWrite.fieldnotes.location
        , language: globalWrite.fieldnotes.language
        , taxa: globalWrite.fieldnotes.taxa
        , sections: globalWrite.fieldnotes.sections
        , sectionOrder: globalWrite.fieldnotes.sections.map(section => section.sectionIndex)
      })
      
      const response = await addFieldnotes({
          fieldnotes: notes
        , status
        , user: globalWrite.user
        , isUserEditing: true
      })

      if(response.success) {
        globalWrite.fieldnotes.id = response.id
      }

      showNotificationsDialog({
          message: response.message
        , type: response.type
        , displayDuration: 3000
      })
    } catch (e) {
      showNotificationsDialog({
          message: e.message
        , type: 'error'
      })
    }
  }

  const saveFieldNotesBtn = new ButtonComponent({
      elementSelector: 'save-fieldnotes-btn'
      , clickHandler: () => saveFieldnotes({
        status: 'private'
      })
  })

  // Edit fieldnotes   
  const fetchFieldnotes = async () => {
    try {
      importFieldNotesNotificationText.classList.remove('hidden')

      const response = await getFieldnotesById({
        id: globalWrite.fieldnotesStubs.fieldnotesId
      })

      if(!response.success) return 

      const fieldnotes = response.data

      Object.assign(globalWrite, {
          fieldnotes: {
              ...fieldnotes
            , sections: fieldnotes.sectionOrder.map(sectionIndex => {
                return fieldnotes.sections.find(section => section.sectionIndex === sectionIndex)
              })
            }
        , isUserEditing: true
      })

      const { title, author, d1, d2, location } = globalWrite.fieldnotes

      titleInputText.value = title
      authorInputText.value = author
      dateInputText.value = d1
      placeInputText.value = location.place_guess

      const observations = await getInatObservations({ 
          user_id: globalWrite.fieldnotes.user.id
        , place_id: null
        , iconic_taxa: globalWrite.iconicTaxa
        , per_page: 200
        , locale: globalWrite.fieldnotes.language.id
        , species_count: false
        , d1
        , d2
      })

      globalWrite.observations = observations.map(sp => {
        return {
            id: sp.id
          , observation_photos: sp.observation_photos
          , photos: sp.photos
          , place_guess: sp.place_guess
          , species_guess: sp.species_guess
          , taxon: mapTaxon({taxon: sp.taxon})
          , user: mapUser({user: sp.user})
        }
      })

      importFieldNotesNotificationText.classList.add('hidden')

      // Enable other sections
      d.querySelectorAll('.has-fieldnotes').forEach(section => section.classList.remove('disabled'))

      // Set the index for the next section
      globalWrite.nextSectionIndex = globalWrite.fieldnotes.sections.length > 0
        ? globalWrite.fieldnotes.sections.map(s => s.sectionIndex).sort(function (a, b) { return a - b })[globalWrite.fieldnotes.sections.length -1 ] + 1
        : 0

      // Remove existing sections
      draggableSections.replaceChildren()

      // Recreate the sections
      globalWrite.fieldnotes.sections.forEach(section => {
        const draggableSection = createSection({
            writeTemplateId: section.writeTemplateId
          , typeText: section.name
          , sectionTemplate: d.getElementById(section.writeParentTemplateId)
          , sectionIndex: section.sectionIndex     
        })

        const addOrUpdateSectionBtn = new ButtonComponent({
          parent: draggableSection
        , elementSelector: 'add-or-update-section-btn'
      })
        const editSectionBtn = new ButtonComponent({
          parent: draggableSection
        , elementSelector: 'edit-section-btn'
      })

        if(addOrUpdateSectionBtn) addOrUpdateSectionBtn.hide()
        if(editSectionBtn) editSectionBtn.show()

        const previewContainer = draggableSection.querySelector('.edit')
        previewContainer.classList.remove('hidden')
        const add = draggableSection.querySelector('.add')
        if(draggableSection.querySelector('.add:not(.edit)')) draggableSection.querySelector('.add:not(.edit)').classList.add('hidden')

        const previewTemplate = previewTemplates.find(template => template.templateId === section.templateId)

        let speciesCheckboxes = null

        switch(section.templateId) {
          case 'h3-preview-template':
          case 'h4-preview-template':
          case 'xenocanto-preview-template':
            addContentToPreviewContainer({
                previewTemplate
              , textContent: section[section.element]
              , previewContainer
            })
            add.value = section[section.element]
            break
          case 'textarea-preview-template':          
            section.paras.forEach((text, i) => {
              addContentToPreviewContainer({
                  previewTemplate
                , textContent: text.p
                , previewContainer
              })
              add.value += text.p
              if(i < section.paras.length - 1) {
                add.value += '\r\n\n'
              }
            })     
            break
          case 'species-preview-template':
          case 'observations-preview-template':
            speciesCheckboxes = draggableSection.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              let hasMatch
              if(section.templateId === 'species-preview-template') hasMatch = section.species.map(sp => sp.taxon.name).includes(checkbox.value)
              if(section.templateId === 'observations-preview-template') {
                const checkboxId = Number(checkbox.id.substring(checkbox.id.indexOf('-') + 1))
                hasMatch = (section.templateId === 'observations-preview-template' && section.species.map(sp => sp.observation.id).includes(checkboxId))
              }
              if(hasMatch) {
                checkbox.setAttribute('checked', true)
                checkbox.nextElementSibling.innerText = 'Included'
              } else {
                checkbox.closest('figure').classList.add('hidden')                
              }
            })            
            draggableSection.querySelector('#toggle-species-include-all-btn').innerText = 'show all'
            break
          case 'inat-lookup-preview-template':
            let parent = null
            section.species.forEach((species, index) => {
              parent = draggableSection.querySelector(`#inat-lookup-parent-${section.sectionIndex}`)
              const clone = cloneImageTemplate({
                  observation: species
                , index
                , sectionIndex: section.sectionIndex
                , imgUrl: species.taxon.default_photo.square_url
                , globalWrite
                , writeTemplateId: section.writeTemplateId
              })
              parent.appendChild(clone)
              const figure = parent.querySelector('figure')
              figure.classList.remove('hidden')
            })
            speciesCheckboxes = parent.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              checkbox.setAttribute('checked', true)
              checkbox.nextElementSibling.innerText = 'Included'
            }) 
            break
          case 'images-preview-template':    
            section.images.forEach((img, i) => {
              if(img.src.length > 0) {
                d.querySelector(`#section-id-${section.sectionIndex} #image-url-input-${i}`).value = img.src
                d.querySelector(`#section-id-${section.sectionIndex} #image-title-input-${i}`).value = img.alt
              }
            })
            break
          case 'terms-preview-template':
            const selectedItemsListElement = draggableSection.querySelector('#selected-terms-list')
            const selectedTerms = []        
            section.terms.forEach((term) => {
              addTermToList({
                  selectedTerms
                , selectedTerm: term
                , selectedItemsListElement
                , globalWrite
                , sectionIndex: section.sectionIndex
              })
              selectedTerms.push(term)
          })
        }
        setOriginalTypeValues({
            globalWrite
          , section
          , type: section.type
        })
      })

      // Enable the create observation and species section buttons
      selectSectionTypeSection.querySelector('#observations').classList.remove('disabled')
      selectSectionTypeSection.querySelector('#species').classList.remove('disabled')

      // Hide all species that are not included
      const btns = d.querySelectorAll('.toggle-species-include-all-btn')
      btns.forEach(btn => {
        btn.innerText = 'show only included'
        const fieldset = btn.parentElement
        toggleSpeciesList({
            btn
          , fieldset
        })
      })

      // Set values for fieldnotes status text and update button
      updateFieldnotesStateSection({
          globalWrite
        , updateFieldnotesStatusBtn
        , updateFieldnotesStatusText
        , updateFieldnotesCurrentStatusText
      })

      showNotificationsDialog({
          message: 'Your fieldnotes are available to edit'
        , type: 'success'
        , displayDuration: 2000
      })
    } catch (e) {
      console.log('Error importing fieldnotes')
      console.log(e.stack)
      showNotificationsDialog({
          message: e.message
        , type: 'error'
      })
    }
  }

  const fetchFieldnotesBtn = new ButtonComponent({
      elementSelector: 'fetch-fieldnotes-btn'
    , clickHandler: fetchFieldnotes
  })

  fnAutocompleteTitleInputText.focus()

  // User action: log in or log out
  const authenticateBtn = new ButtonComponent({
      elementSelector: 'authenticate-btn'
    , clickHandler: e => authenticateUserEmailAndPassword({
        user: globalWrite.user
      , email: d.getElementById('firebase-email')
      , password: d.getElementById('firebase-password')
      , showNotificationsDialog 
    })
  })

  // User action: sign up
  const signUpBtn = new ButtonComponent({
    elementSelector: 'sign-up-btn'
  })

  signUpBtn.addClickHandler({
    clickHandler: e => authenticateNewUserEmailAndPassword({
        email: d.getElementById('firebase-email')
      , password: d.getElementById('firebase-password')
      , showNotificationsDialog
      , signUpBtn
      , callback: () => toggleView({
          btn: showHideCreateFieldnotesBtn.buttonElement
        })
    })
  })

  // User action: enable firebase sign up
  const firebaseSignUpCheckbox = new CheckBoxComponent({
    selector: '#firebase-sign-up-checkbox'
  , clickHandler: e => {
      const checkbox = e.target
      if(checkbox.checked) {
        authenticateBtn.hide()
        signUpBtn.show()
        authenticateStateText.innerText = 'You can sign up with a valid email and password.'
      } else {
        authenticateStateText.innerText = 'You are logged out.'
        authenticateBtn.show()
        signUpBtn.hide()
      }
    }
  })

  // Email and password firebase authentication
  authenticateUserEmailAndPassword({
      user: globalWrite.user
    , email: d.getElementById('firebase-email')
    , password: d.getElementById('firebase-password')
  })
  
  // Observe changes to user authentication on firebase
  onFirebaseAuthStateChange({
      auth: getFirebaseAuth()
    , globalWrite
    , authenticateBtn
    , firebaseSignUpCheckbox
    , fetchFieldnotesStubs: fetchFieldnotesStubs({
          inputText: fnAutocompleteTitleInputText
        , dataList: fnAutocompleteTitleDatalist
        , global: globalWrite
        , fetchFieldnotesBtn
      })    
    , isAuthenticatedSections: d.querySelectorAll('.is-authenticated')
  })

  // User action: chnge access to fieldnotes 
  updateFieldnotesStatusBtn.addClickHandler({
    clickHandler: async () => {
      const btn = updateFieldnotesStatusBtn
      const status = globalWrite.fieldnotesStubs.status
      const newStatus = status === 'public' 
        ? 'private'
        : 'public'
      const response = await updateFieldnoteStubProperty({
          fieldnotesStubs: globalWrite.fieldnotesStubs
        , prop: 'status'
        , value: newStatus
      })
      if(response.success) {
        updateFieldnotesCurrentStatusText.innerText = newStatus
        btn.setText({
          text: newStatus === 'public'
            ? 'Set your fieldnotes to private'
            : 'Publish your fieldnotes'
        })
        updateFieldnotesStatusText.innerText = newStatus === 'public'
          ? 'If you set your fieldnotes to private, they will no longer viewable by others.'
          : 'Publishing your fieldnotes will make them available to others.'

        globalWrite.fieldnotesStubs.status = newStatus

        showNotificationsDialog({
            message: newStatus === 'public'
              ? 'Your fieldnotes have been published.'
              : 'Your fieldnotes have been set to private.'
          , type: response.type
          , displayDuration: 3000
        })
      }
    }
  })

  // User action: delete fieldnotes
  const deleteFieldnotesBtn = new ButtonComponent({
      elementSelector: 'delete-fieldnotes-btn'
    , clickHandler: async () => {
      // This is a soft delete, and simply updates the status to deleted
      const response = await updateFieldnoteStubProperty({
          fieldnotesStubs: globalWrite.fieldnotesStubs
        , prop: 'status'
        , value: 'deleted'
      })
      if(response.success) {
        showNotificationsDialog({
            message: 'Your fielnotes have been deleted.'
          , type: response.type
          , displayDuration: 3000
        })
      }
    }
  })

  // User action: save fieldnotes to file (export)
  const saveFieldnotesToFileBtn = new ButtonComponent({
      elementSelector: 'save-fieldnotes-to-file-btn'
    , clickHandler: () => {
      saveJson({
          obj: globalWrite.fieldnotes
        , title: globalWrite.fieldnotes.title
      })
    }
  })

  // Prevent form submission disrupting log in and sign up  
  authenticationForm.addEventListener('submit', e => {
    e.preventDefault()
  })

  // Clear input so that user can select new title
  fnAutocompleteTitleInputText.addEventListener('focus', e => {
    if(fnAutocompleteTitleDatalist.innerHTML !== '' && titleInputText.value.length > 0) {
        fnAutocompleteTitleInputText.value = ''
        fieldnotesAutocomplete({ 
            inputText: fnAutocompleteTitleInputText
          , dataList: fnAutocompleteTitleDatalist
          , global: globalWrite
          , fetchFieldnotesBtn
          , fieldnotesStubs: globalWrite.fieldnotesStubsCollection
      })
    }
  })

  // Check for changes to the list of titles; if the list is empty, change to create fieldnotes views
  const titlesObserver = new MutationObserver(() => {
    const options = Array.from(fnAutocompleteTitleDatalist.getElementsByTagName('option')).map(option => option.value)
    if(options.length === 0) {
      toggleView({
        btn: showHideCreateFieldnotesBtn.buttonElement
      })
    }
  })

  titlesObserver.observe(fnAutocompleteTitleDatalist, {
      subtree: true
    , childList: true
  })
}

init()
