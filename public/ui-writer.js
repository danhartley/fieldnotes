import {   
  getInatObservations
, g
, getTerms
, getFieldnotesStubs
, getFieldnotesById
, addFieldnotes
, updateFieldNotes
, updateFieldnoteProperty
, updateFieldnotesTitle
} from './api.js'

import { 
  previewTemplates
, writeTemplates
} from './templates.js'

import { 
    handleInatAutocomplete
  , createInatLookups
  , handleTermAutocomplete
  , handleFieldsnotesAutocomplete
  , cloneImages
  , cloneImageTemplate
  , dragstartHandler
  , dragoverHandler
  , dragenterHandler
  , dragleaveHandler
  , dropHandler
  , deleteSection
  , addOrUpdateSectionArray
  , showNotificationsDialog
  , addContentToPreviewContainer
  , setOriginalTypeValues
  , getOriginalTypeValues
  , hasOriginalTypeValues
  , addTermToList
  , isValidDate
  , mapTaxon
  , mapUser
  , handleImageTextChange
  , calcImageIndex
  , toggleBtnEnabledState
  , handleInputChangeEvent
  , handleImageInputChangeEvent
  , toggleSpeciesList
} from './ui-actions.js'

import {
    ButtonComponent
  , MenuNavComponent
} from './ui-components.js'

import { 
  Router
} from './router.js'

const init = () => {

  const initGlobalWrite = () => {
    const globalWrite = {}
    Object.assign(globalWrite, {
        iconicTaxa: g.ICONIC_TAXA
      , useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0]
      , species: []
      , nextSectionIndex: 0
      , inatAutocompleteOptions: g.inatAutocompleteOptions
      , inatAutocomplete: g.inatAutocomplete
      , view: 'create'
      , fieldnotesStubs: []
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
    })

    return globalWrite
  }

  let globalWrite = initGlobalWrite()

  const d = document
  const draggableSections = d.getElementById('draggable-sections')
  const iNatAutocompleteInputText = d.getElementById('inat-autocomplete-input-text')
  const iNatAutocompleteDatalist = d.getElementById('inat-autocomplete-data-list')
  const ltpAutocompleteTitleInputText = d.getElementById('ltp-autocomplete-title-input-text')
  const ltpAutocompleteTitleDatalist = d.getElementById('ltp-autocomplete-title-data-list')
  const singleObservationsInputDate = d.getElementById('single-observations-input-date')
  const searchInatObservationsNotificationText = d.getElementById('search-inat-observations-notification-text')
  const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')
  const titleInputText = d.getElementById('title-input-text')
  const authorInputText = d.getElementById('author-input-text')
  const dateInputText = d.getElementById('date-input-text')
  const placeInputText = d.getElementById('place-input-text')
  const selectSectionTypeSection = d.getElementById('select-section-type-section')
  const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')
  const exportFieldNotesContainer = d.getElementById('export-fieldnotes-container')

  draggableSections.addEventListener('dragover', dragoverHandler)
  draggableSections.addEventListener('drop', e => dropHandler({e, globalWrite, draggableSections, apiCallback: updateFieldNotes}))

  const toggleView = ({e, matchedView}) => {
    const view = matchedView || e.target.dataset.view

    const sectionViews = d.querySelectorAll('section')
    sectionViews.forEach(v => v.classList.add('hidden'))
    
    const views = d.querySelectorAll(`.${view}`)
    views.forEach(v => v.classList.remove('hidden'))
    
    globalWrite.view = view

    switch(view) {
      case 'create-fieldnotes-view':
        iNatAutocompleteInputText.focus()
        break
      case 'edit-fieldnotes-view':
        ltpAutocompleteTitleInputText.focus()
        break
      case 'preferences-view':
        console.log('preferences-view')
        break
    }    
  }

  const searchInatObservations = async ({userId}) => {
  try {
      searchInatObservationsNotificationText.classList.toggle('hidden')
      searchInatObservationsBtn.toggleActiveState()

      // Clear import search text to avoid confusion
      ltpAutocompleteTitleInputText.value = ''

      globalWrite.fieldnotes.user = globalWrite.inatAutocompleteOptions.find(o => o.id === 'users')?.user

      globalWrite.species = await getInatObservations({ 
            user_id: globalWrite.fieldnotes.user.id
          , place_id: null
          , iconic_taxa: globalWrite.iconicTaxa
          , per_page: 200
          ,locale: globalWrite.fieldnotes.language.id
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

      if(globalWrite.species.length === 0) return

      const { author, date, location } = {
          author: globalWrite.species[0].user.name
        , date: globalWrite.species[0].observed_on
        , location: {
            location: globalWrite.species[0].location
          , place_guess: globalWrite.species[0].place_guess
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

      // Enable saving fieldnotes
      exportFieldNotesContainer.classList.remove('disabled')

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
      elementId: 'search-inat-observations-btn'
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

  const createSection = ({writeTemplateId, typeText, sectionTemplate, sectionIndex}) => {
    const sectionClone = sectionTemplate.content.cloneNode(true)
    const draggableSection = sectionClone.querySelector('section.draggable')
    const contentContainer = sectionClone.querySelector('.content-container')
    const fieldset = sectionClone.querySelector('fieldset')
    const legend = sectionClone.querySelector('legend')
    const parentContainer = sectionClone.querySelector('div')
    
    const toggleSpeciesListBtn = new ButtonComponent({
        parent: sectionClone
      , elementId: 'toggle-species-include-all-btn'
    })
    const addOrUpdateSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementId: 'add-or-update-section-btn'
    })
    const editSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementId: 'edit-section-btn'
    })
    const deleteSectionBtn = new ButtonComponent({
        parent: sectionClone
      , elementId: 'delete-section-btn'
    })
    const cancelActionBtn = new ButtonComponent({
        parent: sectionClone
      , elementId: 'cancel-action-btn'
    })
    
    const typeTemplate = d.getElementById(writeTemplateId)
    const typeClone = typeTemplate.content.cloneNode(true)

    draggableSection.setAttribute('id', sectionIndex)
    draggableSection.addEventListener('dragstart', dragstartHandler)    
    
    let input, label, textarea, datalist, previewContainer, images, cbParent = null

    legend.innerText = typeText

    previewContainer = typeClone.querySelector('.edit')

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
          , parent:typeClone.querySelector('div')
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
        addOrUpdateSectionBtn.enable()
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
        break
      case 'images-write-template':
        const url1 = typeClone.getElementById('image-url-input-0')
        const title1 = typeClone.getElementById('image-title-input-0')
        url1.addEventListener('input', () => handleImageInputChangeEvent({
            addBtn: addOrUpdateSectionBtn
          , url1
          , title1
        }), true)
        title1.addEventListener('input', () => handleImageInputChangeEvent({
            addBtn: addOrUpdateSectionBtn
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
        cbParent.id = `inat-looup-parent-${sectionIndex}`
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
        // addOrUpdateSectionBtn.enable()
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
        const addNewTermBtn = fieldset.querySelector('#add-new-term-btn')

        const selectedTerms = []
        const handleOnClickAddSelectedTermBtn = ({selectedTerm}) => {
          const selectedItemsListElement = fieldset.querySelector('#selected-terms-list')
          addTermToList({
              selectedTerms
            , selectedTerm
            , selectedItemsListElement
            , globalWrite, sectionIndex
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

          toggleBtnEnabledState({
              str: e.target.value
            , btn: addNewTermBtn 
          })  
        })
        
        addNewTermBtn.addEventListener('click', e => {
          const newTerm = Object.assign({}, {
              dt: dt.value
            , dd: dd.value
            , ds: ds.value
            , da: da.value
            , dx: dx.value
          })
          
          handleOnClickAddSelectedTermBtn({
              selectedTerms
            , selectedTerm: newTerm
          })
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

  const addOrUpdateSection = async ({parent, writeTemplateId, typeValue, previewContainer, sectionIndex, cancelActionBtn}) => {
    cancelActionBtn.hide()

    let sectionToUpdate, sectionAddedOrUpdated, isEdit = null

    sectionToUpdate = structuredClone(globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)) || null

    isEdit = (sectionToUpdate !== null && globalWrite.fieldnotes.sectionOrder.includes(sectionToUpdate.sectionIndex)) 
          || hasOriginalTypeValues({globalWrite, section: sectionToUpdate})
    
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

    addOrUpdateSectionArray({globalWrite, sectionToUpdate, sectionAddedOrUpdated, isEdit})
  }

  const editSection = ({e, addOrUpdateSectionBtn, editSectionBtn, cancelActionBtn, contentContainer}) => {
    const parent = e.target.parentElement
    contentContainer.classList.toggle('disabled')

    addOrUpdateSectionBtn.setText({
      text: 'Save changes' 
    })
    addOrUpdateSectionBtn.enable()
    editSectionBtn.hide()
    cancelActionBtn.show()

    Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
  }

  const enableExportFieldNotesContainer = () => {
    if(globalWrite.view === 'create') {
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
        ? exportFieldNotesContainer.classList.remove('disabled')
        : exportFieldNotesContainer.classList.add('disabled')      
    }
  }

  const updateSingleFields = async ({prop, value}) => {
    if(globalWrite.view === 'edit') {
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
  }

  titleInputText.addEventListener('change', e => { 
    globalWrite.fieldnotes.title = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({
          prop: 'title'
        , value: globalWrite.fieldnotes.title
      })
  })
  authorInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.author = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({
          prop: 'author'
        , value: globalWrite.fieldnotes.author
      })
  })
  dateInputText.addEventListener('change', e => {
    const date = e.target.value    
    if(isValidDate({date})) {
      globalWrite.fieldnotes.d1 = date
      globalWrite.fieldnotes.d2 = date
      updateSingleFields({
         prop: 'd1'
        , value: globalWrite.fieldnotes.d1
      })
      updateSingleFields({
          prop: 'd2'
        , value: globalWrite.fieldnotes.d2
      })
    }
    enableExportFieldNotesContainer()
  })
  placeInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.location.place_guess = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({
          prop: 'location'
        , value: { 
            place_guess: globalWrite.fieldnotes.location.place_guess
          , location: globalWrite.fieldnotes.location.location
      }
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

  const exportFieldnotes = async() => {
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
          , identifications_count: globalWrite.fieldnotes.user.identifications_count
          , login: globalWrite.fieldnotes.user.login
          , observations_count: globalWrite.fieldnotes.user.observations_count
          , species_count: globalWrite.fieldnotes.user.species_count
        }
        , d1: globalWrite.fieldnotes.d1
        , d2: globalWrite.fieldnotes.d2
        , location: globalWrite.fieldnotes.location
        , language: globalWrite.fieldnotes.language
        , taxa: globalWrite.fieldnotes.taxa
        , sections: globalWrite.fieldnotes.sections.map(t => {
          const {templateId, ...validProps} = t
          return {
            ...validProps,
          }
        })
        , sectionOrder: globalWrite.fieldnotes.sections.map(section => section.sectionIndex)
      })
      
      const response = await addFieldnotes({fieldnotes: notes})

      globalWrite.fieldnotes.id = response.id

      // Show notification that Fieldnotes have been exported
      showNotificationsDialog({
          message: response.message
        , type: response.type
        , displayDuration: 2000
      })
    } catch (e) {
      showNotificationsDialog({
          message: e.message
        , type: 'error'
      })
    }
  }

  const exportFieldNotesBtn = new ButtonComponent({
      elementId: 'export-fieldnotes-btn'
    , clickHandler: exportFieldnotes
  })

  const importFieldnotes = async () => {
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
      })

      const { title, author, d1, d2, location } = globalWrite.fieldnotes

      titleInputText.value = title
      authorInputText.value = author
      dateInputText.value = d1
      placeInputText.value = location.place_guess

      const species = await getInatObservations({ 
          user_id: globalWrite.fieldnotes.user.id
        , place_id: null
        , iconic_taxa: globalWrite.iconicTaxa
        , per_page: 200
        , locale: globalWrite.fieldnotes.language.id
        , species_count: false
        , d1
        , d2
      })

      globalWrite.species = species.map(sp => {
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

      // Set the index for the next section
      globalWrite.nextSectionIndex = globalWrite.fieldnotes.sections.length > 0
        ? globalWrite.fieldnotes.sections.map(s => s.sectionIndex).sort(function (a, b) { return a - b })[globalWrite.fieldnotes.sections.length -1 ] + 1
        : 0

      // Remove existing sections
      draggableSections.replaceChildren()

      globalWrite.fieldnotes.sections.forEach(section => {
        const draggableSection = createSection({
            writeTemplateId: section.writeTemplateId
          , typeText: section.name
          , sectionTemplate: d.getElementById(section.writeParentTemplateId)
          , sectionIndex: section.sectionIndex     
        })

        const addOrUpdateSectionBtn = new ButtonComponent({
          parent: draggableSection
        , elementId: 'add-or-update-section-btn'
      })
        const editSectionBtn = new ButtonComponent({
          parent: draggableSection
        , elementId: 'edit-section-btn'
      })

        if(addOrUpdateSectionBtn) addOrUpdateSectionBtn.hide() // messy hide and disable… perhaps simply a separate button
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
            setOriginalTypeValues({
                globalWrite
              , section
              , type:section.type
            })
            speciesCheckboxes = draggableSection.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              if(section.species.includes(checkbox.value) || section.species.map(sp => sp.name).includes(checkbox.value)) {
                checkbox.setAttribute('checked', true)
              }
            })            
            break
          case 'inat-lookup-preview-template':
            setOriginalTypeValues({
                globalWrite
              , section
              , type:section.type})
            let parent = null
            section.species.forEach((sp, index) => {
              parent = draggableSection.querySelector(`#inat-looup-parent-${section.sectionIndex}`)
              const clone = cloneImageTemplate({
                  species: sp
                , index
                , sectionIndex: section.sectionIndex
                , imgUrl: sp.taxon.default_photo.square_url
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
            }) 
            break
          case 'images-preview-template':
            setOriginalTypeValues({
                globalWrite
              , section
              , type:section.type
            })       
            section.images.forEach((img, i) => {
              if(img.src.length > 0) {
                d.querySelector(`#image-url-input-${i}`).value = img.src
                d.querySelector(`#image-title-input-${i}`).value = img.alt
              }
            })
            break
          case 'terms-preview-template':
            setOriginalTypeValues({
                globalWrite
              , section
              , type:'terms'
            })
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

      // Enable saving fieldnotes
      exportFieldNotesContainer.classList.remove('disabled')

      // Show notification that Fieldnotes have been imported
      showNotificationsDialog({
          message: 'Fieldnotes imported'
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

  const importFieldnotesBtn = new ButtonComponent({
      elementId: 'import-fieldnotes-btn'
    , clickHandler: importFieldnotes
  })

  handleFieldsnotesAutocomplete({ 
      inputText: ltpAutocompleteTitleInputText
    , dataList: ltpAutocompleteTitleDatalist
    , global: globalWrite
    , fieldnotesStubsCallback: getFieldnotesStubs
    , importFieldnotesBtn
  })

  const routes = [
    {
          view: 'create-fieldnotes-view'
        , path: '/public/ui-write.html'
    },
    {
          view: 'create-fieldnotes-view'
        , path: '/fieldnotes/create'
    },
    {
          view: 'edit-fieldnotes-view'
        , path: '/fieldnotes/edit'
    },
    {
          view: 'preferences-view'
        , path: '/fieldnotes/preferences'
    },
  ]

  const router = new Router({
        routes
      , callback: toggleView
  })    

  const links = d.querySelectorAll('menu > ul > li > a')
  links.forEach(link => {
      new MenuNavComponent({
          links,
          link,
          router
      })
  })
}

init()