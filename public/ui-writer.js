import {   
  getInatObservations
, g
, getTerms
, getFieldnotesStubs
, getFieldnotesById
, addFieldnotes
, updateFieldNotes
, updateFieldnoteProperty
} from './api.js'

import { 
  terms
, image
, previewTemplates
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
} from './ui-actions.js'

const init = () => {

  const initGlobalWrite = () => {
    const globalWrite = {}
    Object.assign(globalWrite, {
      iconicTaxa: g.ICONIC_TAXA,      
      useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
      species: [],
      nextSectionIndex: 0,
      inatAutocompleteOptions: g.inatAutocompleteOptions,
      inatAutocomplete: g.inatAutocomplete,
      view: 'create',
      fieldnotesStubs: [],
      fieldnotes: {
        author: '',
        d1: '',
        d2: '',
        fnId: '',
        id: '',
        language: g.LANGUAGES[1],
        location: {
          location: '',
          place_guess: '',      
        },
        sectionOrder: [],
        sections: [],
        taxa: [],
        title: '',
        user: {
          id: '',
          icon: '',
          identifications_count: 0,
          login: '',
          observations_count: 0,
          species_count: 0,
        },
      },
      originalTypeValues: []
    })

    return globalWrite
  }

  let globalWrite = initGlobalWrite()

  const d = document
  const createFieldnotesInputRadio = d.getElementById('create-fieldnotes-input-radio')
  const editFieldnotesInputRadio = d.getElementById('edit-fieldnotes-input-radio')
  const editView = d.querySelectorAll('.edit-view')
  const createView = d.querySelectorAll('.create-view')
  const draggableSections = d.getElementById('draggable-sections')
  const iNatAutocompleteInputText = d.getElementById('inat-autocomplete-input-text')
  const iNatAutocompleteDatalist = d.getElementById('inat-autocomplete-data-list')
  const ltpAutocompleteTitleInputText = d.getElementById('ltp-autocomplete-title-input-text')
  const ltpAutocompleteTitleDatalist = d.getElementById('ltp-autocomplete-title-data-list')
  const singleObservationsInputDate = d.getElementById('single-observations-input-date')
  const searchInatObservationsBtn = d.getElementById('search-inat-observations-btn')
  const searchInatObservationsNotificationText = d.getElementById('search-inat-observations-notification-text')
  const importFieldNotesBtn = d.getElementById('import-fieldnotes-btn')
  const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')
  const titleInputText = d.getElementById('title-input-text')
  const authorInputText = d.getElementById('author-input-text')
  const dateInputText = d.getElementById('date-input-text')
  const placeInputText = d.getElementById('place-input-text')
  const selectSectionTypeSection = d.getElementById('select-section-type-section')
  const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')
  const exportFieldNotesBtn = d.getElementById('export-fieldnotes-btn')
  const exportFieldNotesContainer = d.getElementById('export-fieldnotes-container')

  draggableSections.addEventListener('dragover', dragoverHandler)
  draggableSections.addEventListener('drop', e => dropHandler({e, globalWrite, draggableSections, apiCallback: updateFieldNotes}))

  const toggleView = e => {
    const view = e.target.value

    Array.from(editView).forEach(view => view.classList.toggle('hidden'))
    Array.from(createView).forEach(view => view.classList.toggle('hidden'))
    
    globalWrite.view = view

    switch(view) {
      case 'create':
        iNatAutocompleteInputText.focus()
        break
      case 'edit':
        ltpAutocompleteTitleInputText.focus()
        break
    }    
  }

  createFieldnotesInputRadio.addEventListener('click', toggleView, true)
  editFieldnotesInputRadio.addEventListener('click', toggleView, true)

  const searchInatObservations = async ({userId}) => {
  try {
      searchInatObservationsNotificationText.classList.toggle('hidden')
      searchInatObservationsBtn.classList.toggle('disabled')

      // Clear import search text to avoid confusion
      ltpAutocompleteTitleInputText.value = ''

      globalWrite.fieldnotes.user = globalWrite.inatAutocompleteOptions.find(o => o.id === 'users')?.user

      globalWrite.species = await getInatObservations({ 
          user_id: globalWrite.fieldnotes.user.id,
          place_id: null,
          iconic_taxa: globalWrite.iconicTaxa,
          per_page: 200,
          locale: globalWrite.fieldnotes.language.id,
          species_count: false,
          d1: singleObservationsInputDate.value,
          d2: singleObservationsInputDate.value,
      })    
      
      searchInatObservationsBtn.classList.toggle('disabled')

      searchInatObservationsNotificationText.innerText = 'Search complete'

      setTimeout(() => {
        searchInatObservationsNotificationText.classList.toggle('hidden')
        searchInatObservationsNotificationText.innerText = 'Waiting for response from iNaturalist…'
      }, 1500)

      if(globalWrite.species.length === 0) return

      const { author, date, location } = {
        author: globalWrite.species[0].user.name,
        date: globalWrite.species[0].observed_on,
        location: {
          location: globalWrite.species[0].location, place_guess: globalWrite.species[0].place_guess
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
      showNotificationsDialog({message: 'iNaturalist observations now available', type: 'success'})
      } catch (e) {
      showNotificationsDialog({message: e.message, type: 'error'})
    }
  }

  searchInatObservationsBtn.addEventListener('click', searchInatObservations, false)

  const { id, prop } = globalWrite.inatAutocomplete
  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, globalWrite, id, prop, cbParent: d.getElementById('inat-params-input-check-box-group')})  
  handleFieldsnotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, global: globalWrite, fieldnotesStubsCallback: getFieldnotesStubs, importFieldNotesBtn}) 

  const toggleBtnEnabledState = ({str, btn}) => {
    str.length > 0
    ? btn.classList.remove('disabled')
    : btn.classList.add('disabled')
  }

  const createSection = ({writeTemplateId, typeText, sectionTemplate, sectionIndex}) => {
    const sectionClone = sectionTemplate.content.cloneNode(true)
    const sectionContainer = sectionClone.querySelector('section')
    const fieldset = sectionClone.querySelector('fieldset')
    const legend = sectionClone.querySelector('legend')
    const showAllOrIncludedBtn = sectionClone.querySelector('.show-all-or-include-only-btn')
    const parentContainer = sectionClone.querySelector('div')
    const addOrUpdateSectionBtn = sectionClone.getElementById('add-or-update-section-btn')
    const editSectionBtn = sectionClone.getElementById('edit-section-btn')
    const deleteSectionBtn = sectionClone.getElementById('delete-section-btn')    
    const typeTemplate = d.getElementById(writeTemplateId)
    const typeClone = typeTemplate.content.cloneNode(true)

    sectionContainer.setAttribute('id', sectionIndex)
    sectionContainer.addEventListener('dragstart', dragstartHandler)
    
    let input, label, textarea, datalist, previewContainer, images, cbParent = null

    legend.innerText = typeText

    previewContainer = typeClone.querySelector('.edit')

    switch(writeTemplateId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        input = typeClone.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionBtn), true)
        addOrUpdateSectionBtn.addEventListener('click', e => addOrUpdateSection({parent: e.target.parentElement, writeTemplateId, typeValue: input.value, previewContainer, sectionIndex}), true)
        break
      case 'textarea-write-template':    
        textarea = typeClone.querySelector('textarea')
        textarea.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionBtn), true)
        addOrUpdateSectionBtn.addEventListener('click', e => addOrUpdateSection({parent: e.target.parentElement, writeTemplateId, typeValue: textarea.value, previewContainer, sectionIndex}), true)
        break
      case 'observations-write-template':
      case 'species-write-template':       
        cloneImages({globalWrite, parent:typeClone.querySelector('div'), writeTemplateId, sectionIndex })
        addOrUpdateSectionBtn.addEventListener('click', e => addOrUpdateSection({parent: e.target.parentElement, writeTemplateId, typeValue: null, previewContainer, sectionIndex}), true)
        addOrUpdateSectionBtn.classList.remove('disabled')
        break
      case 'terms-write-template':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionIndex}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionIndex}-dl-input-text`
        input.setAttribute('list', datalist.id)        
        label = typeClone.querySelector('label')
        label.htmlFor = input.id                  
        addOrUpdateSectionBtn.addEventListener('click', e => addOrUpdateSection({parent: e.target.parentElement, writeTemplateId, typeValue: null, previewContainer, sectionIndex}), true)
        break
      case 'images':
        const url1 = typeClone.getElementById('image-url-input-one')
        const title1 = typeClone.getElementById('image-title-input-one')
        url1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addOrUpdateSectionBtn, url1, title1}), true)
        title1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addOrUpdateSectionBtn, url1, title1}), true)
        typeValue = images        
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
        cbParent.id = `section-${sectionIndex}-lookup-parent`
        addOrUpdateSectionBtn.addEventListener('click', e => addOrUpdateSection({parent: e.target.parentElement, writeTemplateId, typeValue: null, previewContainer, sectionIndex}), true)
        addOrUpdateSectionBtn.classList.remove('disabled')
        break
    }
    
    editSectionBtn.addEventListener('click', e => editSection({e}), true)
    
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
    
    deleteSectionBtn.addEventListener('click', e => deleteSection({d, sectionIndex, globalWrite}), true)

    // Add additional functionality once the DOM has been updated
    switch(writeTemplateId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()
        break
      case 'species-write-template':
      case 'observations-write-template':      
          showAllOrIncludedBtn.addEventListener('click', e => toggleAllOrIncludedInSpeciesList({btn:showAllOrIncludedBtn, fieldset}))          
         break
      case 'textarea-write-template':
        fieldset.querySelector('textarea:not(.hidden)')?.focus()
        break
      case 'terms-write-template':
        const parent = fieldset.querySelector('#selected-term')
        const addSelectedTermBtn = fieldset.querySelector('#add-selected-term-btn')
        const addNewTermBtn = fieldset.querySelector('#add-new-term-btn')
        
        const selectedItems = globalWrite?.fieldnotes.sections?.find(t => t.sectionIndex === sectionIndex)?.terms || []        

        const handleOnClickAddSelectedTermBtn = ({selectedItems, selectedItem}) => {
          const selectedItemsListElement = fieldset.querySelector('#selected-terms-list')
          addTermToList({selectedItems, selectedItem, selectedItemsListElement, globalWrite, sectionIndex})
          addSelectedTermBtn.classList.add('disabled')
          addOrUpdateSectionBtn.classList.remove('disabled')
          input.value = ''             
        }
        input.focus()
        handleTermAutocomplete({ inputText: input, selectedItems, dataList: datalist, globalWrite, data: getTerms(), parent, addSelectedTermBtn, handleOnClickAddSelectedTermBtn})
        
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
          toggleBtnEnabledState({str: e.target.value, btn: addNewTermBtn })          
        })
        
        addNewTermBtn.addEventListener('click', e => {
          const newTerm = Object.assign({}, {
            dt: dt.value,
            dd: dd.value,
            ds: ds.value,
            da: da.value,
            dx: dx.value,
          })
          
          handleOnClickAddSelectedTermBtn({selectedItems, selectedItem: newTerm})
        })
        break
      case 'images':
        const url1 = fieldset.querySelector('#image-url-input-one')
        const title1 = fieldset.querySelector('#image-title-input-one')
        const url2 = fieldset.querySelector('#image-url-input-two')
        const title2 = fieldset.querySelector('#image-title-input-two')
        const url3 = fieldset.querySelector('#image-url-input-three')
        const title3 = fieldset.querySelector('#image-title-input-three')
        
        const handleImageTextChange = ({images, index, strValue, property}) => {
          const image = images[index]
          if(image) {
            image[property] = strValue
            images[index] = image
          } else {
            images.push({
              [property]: strValue
            })
          }
        }
        
        const calcIndex = (index) => {
          return (index % 2 === 0)
          ? index / 2
          : ((index -1) / 2)
        }
        
        images = []
        
        for (let i = 0; i < 3; i++) {
          images.push({src:'', alt:''})
        }
        
        [url1, title1, url2, title2, url3, title3].forEach((input, index) => {
          input.addEventListener('input', e => handleImageTextChange({images, strValue:e.target.value, index: calcIndex(index), property:input.dataset.key}), true)
        })
        break
      case 'inat-lookup-write-template':
          showAllOrIncludedBtn.addEventListener('click', e => toggleAllOrIncludedInSpeciesList({btn:showAllOrIncludedBtn, fieldset}))
          Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()

          handleInatAutocomplete({ 
              inputText: input
            , dataList: datalist
            , globalWrite
            , id: 'taxa'
            , prop: 'name'
            , callback: createInatLookups
            , cbParent
            , writeTemplateId
            , sectionIndex
          })
      break
    }
    return sectionContainer
  }

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', e => { createSection({writeTemplateId: e.target.value, typeText: e.target.innerText, sectionTemplate: getSectionTemplate({writeTemplateId}), sectionIndex: globalWrite.nextSectionIndex})}, true))

  const addOrUpdateSection = async ({parent, writeTemplateId, typeValue, previewContainer, sectionIndex}) => {
    // if(previewContainer) previewContainer.innerHTML = ''

    let sectionToUpdate, sectionAddedOrUpdated, isEdit = null

    sectionToUpdate = structuredClone(globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)) || null

    isEdit = hasOriginalTypeValues({globalWrite, section: sectionToUpdate}) && !!sectionToUpdate
    
    const writeTemplate = writeTemplates.find(template => template.templateId === writeTemplateId)
    const previewTemplate = previewTemplates.find(template => template.id === writeTemplate.previewTemplateId)

    switch(writeTemplateId) {
      case 'h3-write-template':        
      case 'h4-write-template':
      case 'xenocanto-write-template':
        previewTemplate[previewTemplate.element] = typeValue
        sectionAddedOrUpdated = { ...previewTemplate, sectionIndex }
        addContentToPreviewContainer({previewTemplate, textContent: typeValue, previewContainer})
        break
      case 'textarea-write-template':
        const ps = typeValue.split('\n').filter(p => p.length > 0)
        const paras = ps.map(p => {
          return {
            p
          }
        })
        previewTemplate[previewTemplate.element] = typeValue
        sectionAddedOrUpdated = { ...previewTemplate, sectionIndex, paras }
        paras.forEach(text => addContentToPreviewContainer({previewTemplate, textContent:text.p, previewContainer}))
        break
      case 'observations-write-template':
      case 'species-write-template':
      case 'inat-lookup-write-template':
        sectionAddedOrUpdated = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)
        if(sectionToUpdate) sectionToUpdate.species = getOriginalTypeValues({globalWrite, section: sectionToUpdate, type: 'species'})
        break
      case 'terms-write-template':                
        sectionAddedOrUpdated = globalWrite.fieldnotes.sections.find(t => t.sectionIndex === sectionIndex)
        if(sectionToUpdate) sectionToUpdate.terms = getOriginalTypeValues({globalWrite, section: sectionToUpdate, type: 'terms'})
        break
      case 'images':
        sectionAddedOrUpdated = { ...image, templateId: image.id, sectionIndex, imgs: typeValue }
        break
    }
    
    // Show the preview section and hide the edit section
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))

    addOrUpdateSectionArray({globalWrite, sectionToUpdate, sectionAddedOrUpdated, isEdit})
  }

  const editSection = ({e}) => {
    const parent = e.target.parentElement
    const addOrUpdateSectionBtn = parent.querySelector('#add-or-update-section-btn')
    addOrUpdateSectionBtn.innerText = 'Save changes'
    addOrUpdateSectionBtn.classList.remove('disabled')

    Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
  }

  const handleInputChangeEvent = (e, addBtn) => {
    toggleBtnEnabledState({str: e.target.value, btn: addBtn})
  }

  const handleImageInputChangeEvent = ({e, addBtn, url1, title1}) => {
      (url1.value.length >= 5 && title1.value.length >= 2)
        ? addBtn.classList.remove('disabled')
        : addBtn.classList.add('disabled')    
  }

  const toggleAllOrIncludedInSpeciesList = ({btn, fieldset}) => {
    {
      if(btn.innerText.toLowerCase() === 'show only included') {
        fieldset.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(input => {
          input.closest('figure').classList.add('hidden')
        })
        btn.innerText = 'show all'
      } else {
        fieldset.querySelectorAll('input[type="checkbox"]').forEach(input => {
          input.closest('figure').classList.remove('hidden')
        })
        btn.innerText = 'show only included'
      }
    }
  }

  const getSectionTemplate = ({writeTemplateId}) => {
    let sectionTemplate = null
    switch (writeTemplateId) {
      case 'species-write-template':
      case 'observations-write-template':
      case 'inat-lookup-write-template':
        sectionTemplate = d.getElementById('section-include-template')
        break
      default:
        sectionTemplate = d.getElementById('section-template')
    }
    return sectionTemplate
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
      try {
      const response = await updateFieldnoteProperty({fieldnotes: globalWrite.fieldnotes, prop, value})      
      showNotificationsDialog({message: response.message, type: response.type, displayDuration: 2000})
      } catch (e) {
        showNotificationsDialog({message: `${e.message} for ${prop}`, type: 'error'})
      }
    }
  }

  titleInputText.addEventListener('change', e => { 
    globalWrite.fieldnotes.title = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({prop: 'title', value: globalWrite.fieldnotes.title})
  })
  authorInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.author = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({prop: 'author', value: globalWrite.fieldnotes.author})
  })
  dateInputText.addEventListener('change', e => {
    const date = e.target.value    
    if(isValidDate({date})) {
      globalWrite.fieldnotes.d1 = date
      globalWrite.fieldnotes.d2 = date
      updateSingleFields({prop: 'd1', value: globalWrite.fieldnotes.d1})
      updateSingleFields({prop: 'd2', value: globalWrite.fieldnotes.d2})
    }
    enableExportFieldNotesContainer()
  })
  placeInputText.addEventListener('change', e => {
    globalWrite.fieldnotes.location.place_guess = e.target.value
    globalWrite.view === 'create'
      ? enableExportFieldNotesContainer()
      : updateSingleFields({prop: 'location', value: { place_guess: globalWrite.fieldnotes.location.place_guess }})
  })
  
  // Check state of iNat search button (enabled or disabled)
  const enableSearchBtn = () => {
    const hasUser = globalWrite.login && globalWrite.login.length > 0
    const date = new Date(singleObservationsInputDate.value)
    const hasDate = singleObservationsInputDate.value.length > 0 && Object.prototype.toString.call(date) === '[object Date]'

    hasUser && hasDate
      ? searchInatObservationsBtn.classList.remove('disabled')
      : searchInatObservationsBtn.classList.add('disabled')
  }
  
  singleObservationsInputDate.addEventListener('blur', enableSearchBtn, true)
  iNatAutocompleteInputText.addEventListener('blur', enableSearchBtn, true)

  const exportFieldNotes = async() => {
    try {
      const notes = {}

      Object.assign(notes, {
        id: globalWrite.fieldnotes.id || '',
        fnId: globalWrite.fieldnotes.title,
        title: globalWrite.fieldnotes.title,
        author: globalWrite.fieldnotes.author,
        user: {
          id: globalWrite.fieldnotes.user.id,
          icon: globalWrite.fieldnotes.user.icon,
          identifications_count: globalWrite.fieldnotes.user.identifications_count,
          login: globalWrite.fieldnotes.user.login,
          observations_count: globalWrite.fieldnotes.user.observations_count,
          species_count: globalWrite.fieldnotes.user.species_count,
        },
        d1: globalWrite.fieldnotes.d1,
        d2: globalWrite.fieldnotes.d2,
        location: globalWrite.fieldnotes.location,
        language: globalWrite.fieldnotes.language,
        taxa: globalWrite.fieldnotes.taxa,
        sections: globalWrite.fieldnotes.sections.map(t => {
          const {templateId, ...validProps} = t
          return {
            ...validProps,
          }
        }),
        sectionOrder: globalWrite.fieldnotes.sections.map(section => section.sectionIndex)
      })
      
      const response = await addFieldnotes({fieldnotes: notes})

      globalWrite.fieldnotes.id = response.id

      // Show notification that Fieldnotes have been exported
      showNotificationsDialog({message: response.message, type: response.type, displayDuration: 2000})
    } catch (e) {
      showNotificationsDialog({message: e.message, type: 'error'})
    }
  }

  exportFieldNotesBtn.addEventListener('click', exportFieldNotes, true)

  const importFieldNotes = async () => {
    try {
      importFieldNotesNotificationText.classList.remove('hidden')

      const response = useLocal 
        ? await globalWrite.fieldnotesStubs
        : await getFieldnotesById({id: globalWrite.fieldnotesStubs.fieldnotesId})

      if(!response.success) return 

      const fieldnotes = response.data

      Object.assign(globalWrite, {
        fieldnotes,
        sections: fieldnotes.sectionOrder.map(sectionIndex => {
          return fieldnotes.sections.find(section => section.sectionIndex === sectionIndex)
        })      
      })

      const { title, author, d1, d2, location } = globalWrite.fieldnotes

      titleInputText.value = title
      authorInputText.value = author
      dateInputText.value = d1
      placeInputText.value = location.place_guess

      globalWrite.species = await getInatObservations({ 
        user_id: globalWrite.fieldnotes.user.id,
        place_id: null,
        iconic_taxa: globalWrite.iconicTaxa,
        per_page: 200,
        locale: globalWrite.fieldnotes.language.id,
        species_count: false,
        d1,
        d2,
      })

      importFieldNotesNotificationText.classList.add('hidden')

      // Set the index for the next section
      globalWrite.nextSectionIndex = globalWrite.fieldnotes.sections.length > 0
        ? globalWrite.fieldnotes.sections.map(s => s.sectionIndex).sort(function (a, b) { return a - b })[globalWrite.fieldnotes.sections.length -1 ] + 1
        : 0

      // Remove existing sections
      draggableSections.replaceChildren()

      globalWrite.fieldnotes.sections.forEach(section => {
        const sectionContainer = createSection({
            writeTemplateId: section.writeTemplateId
          , typeText: section.name
          , sectionTemplate: getSectionTemplate({writeTemplateId: section.writeTemplateId})
          , sectionIndex: section.sectionIndex     
        })

        const addOrUpdateSectionBtn = sectionContainer.querySelector('#add-or-update-section-btn')
        const editSectionBtn = sectionContainer.querySelector('#edit-section-btn')      

        if(addOrUpdateSectionBtn) addOrUpdateSectionBtn.classList.add('hidden')
        if(editSectionBtn) editSectionBtn.classList.remove('hidden')

        const previewContainer = sectionContainer.querySelector('.edit')
        previewContainer.classList.remove('hidden')
        const add = sectionContainer.querySelector('.add')
        if(sectionContainer.querySelector('.add:not(.edit)')) sectionContainer.querySelector('.add:not(.edit)').classList.add('hidden')

        const previewTemplate = previewTemplates.find(template => template.id === section.templateId)

        let speciesCheckboxes = null

        switch(section.templateId) {
          case 'h3-preview-template':
          case 'h4-preview-template':
          case 'xenocanto-preview-template':
            addContentToPreviewContainer({previewTemplate, textContent: section[section.element], previewContainer})
            add.value = section[section.element]
            break
          case 'textarea-preview-template':          
            section.paras.forEach(text => {
              addContentToPreviewContainer({previewTemplate, textContent: text.p, previewContainer})
              add.innerText += text.p
            })          
            break
          case 'species-preview-template':
          case 'observations-preview-template':
          setOriginalTypeValues({globalWrite, section, type:'species'})
            speciesCheckboxes = sectionContainer.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              if(section.species.includes(checkbox.value)) {
                checkbox.setAttribute('checked', true)
              }
            })            
            break
          case 'inat-lookup-preview-template':
            setOriginalTypeValues({globalWrite, section, type:'species'})
            let parent = null
            section.species.forEach((sp, index) => {
              parent = sectionContainer.querySelector(`#section-${section.sectionIndex}-lookup-parent`)
              const clone = cloneImageTemplate({species: sp, index, sectionIndex: section.sectionIndex, imgUrl: sp.taxon.default_photo.square_url, globalWrite, writeTemplateId: section.writeTemplateId})
              parent.appendChild(clone)
              const figure = parent.querySelector('figure')
              figure.classList.remove('hidden')
            })
            speciesCheckboxes = parent.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              checkbox.setAttribute('checked', true)
            }) 
            break
          case 'terms-preview-template':
            setOriginalTypeValues({globalWrite, section, type:'terms'})
            const selectedItemsListElement = sectionContainer.querySelector('#selected-terms-list')
            section.terms.forEach((term, index) => {
              addTermToList({selectedItems: section.terms, selectedItem: term, selectedItemsListElement, globalWrite, sectionIndex: section.sectionIndex})
            })
        }
      })

      // Enable the create observation and species section buttons
      selectSectionTypeSection.querySelector('#observations').classList.remove('disabled')
      selectSectionTypeSection.querySelector('#species').classList.remove('disabled')

      // Hide all species that are not included
      const btns = d.querySelectorAll('.show-all-or-include-only-btn')
      btns.forEach(btn => {
        btn.innerText = 'show only included'
        const fieldset = btn.parentElement
        toggleAllOrIncludedInSpeciesList({btn, fieldset})
      })

      // Enable saving fieldnotes
      exportFieldNotesContainer.classList.remove('disabled')

      // Show notification that Fieldnotes have been imported
      showNotificationsDialog({message: 'Fieldnotes imported', type: 'success', displayDuration: 2000})
    } catch (e) {
      console.log('Error importing fieldnotes')
      showNotificationsDialog({message: e.message, type: 'error'})
    }
  }

  importFieldNotesBtn.addEventListener('click', importFieldNotes, true)
}

init()