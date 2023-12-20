import {   
  getInatObservations
, g
, getTerms
, _getFieldnotes
, getFieldnotesStubs
, getFieldnotesById
, addFieldnotes
, updateFieldNotes
} from './api.js'

import { 
  term
, image
, previewTemplates
, writeTemplates
} from './templates.js'

import { 
    handleInatAutocomplete
  , createInatParamsCheckboxGroup
  , createInatLookups
  , handleTermAutocomplete
  , handleFieldsnotesAutocomplete
  , cloneImages
  , dragstartHandler
  , dragoverHandler
  , dragenterHandler
  , dragleaveHandler
  , dropHandler
  , deleteSection
  , addOrUpdateSection
  , showNotificationsDialog
} from './ui-actions.js'

const init = () => {

  const useLocal = false

  const initGlobalWrite = () => {
    const globalWrite = {}
    Object.assign(globalWrite, {
      iconicTaxa: g.ICONIC_TAXA,
      language: g.LANGUAGES[1],
      useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
      species: [],
      taxa: [],
      sections: [],
      title: '',
      author: '',
      d1: '',
      d2: '',
      location: {
        location: '',
        place_guess: '',      
      },
      user: {
        id: '',
        icon: '',
        identifications_count: 0,
        login: '',
        observations_count: 0,
        species_count: 0,
      },
      sectionIndex: 0,
      inatAutocompleteOptions: g.inatAutocompleteOptions,
      inatAutocomplete: g.inatAutocomplete,
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

  const toggleView = view => {
    Array.from(editView).forEach(view => view.classList.toggle('hidden'))
    Array.from(createView).forEach(view => view.classList.toggle('hidden'))

    switch(view) {
      case 'create':
        iNatAutocompleteInputText.focus()
        break
      case 'edit':
        ltpAutocompleteTitleInputText.focus()
        break
    }    
  }

  createFieldnotesInputRadio.addEventListener('click', e => toggleView('create'), true)
  editFieldnotesInputRadio.addEventListener('click', e => toggleView('edit'), true)

  const getMeta = ({species}) => {
    return {
      author: species[0].user.name,
      date: species[0].observed_on,
      location: {
        location: species[0].location, place_guess: species[0].place_guess
      }
    }
  }

  const searchInatObservations = async ({userId}) => {
  try {
      searchInatObservationsNotificationText.classList.toggle('hidden')
      searchInatObservationsBtn.classList.toggle('disabled')

      // Clear import search text to avoid confusion
      ltpAutocompleteTitleInputText.value = ''

      globalWrite.user = globalWrite.inatAutocompleteOptions.find(o => o.id === 'users')?.user

      globalWrite.species = await getInatObservations({ 
          user_id: globalWrite.user.id,
          place_id: null,
          iconic_taxa: globalWrite.iconicTaxa,
          per_page: 200,
          locale: globalWrite.language.id,
          species_count: false,
          d1: singleObservationsInputDate.value,
          d2: singleObservationsInputDate.value,
      })    
      
      searchInatObservationsBtn.classList.toggle('disabled')

      searchInatObservationsNotificationText.innerText = 'Search complete'

      setTimeout(() => {
        searchInatObservationsNotificationText.classList.toggle('hidden')
        searchInatObservationsNotificationText.innerText = 'Waiting for response from iNaturalist…'
      },1500)

      if(globalWrite.species.length === 0) return

      const { author, date, location } = getMeta({species: globalWrite.species})
      const title = `${location.place_guess}, ${(new Date(date)).toDateString()}`

      titleInputText.value = title
      authorInputText.value = author
      dateInputText.value = date
      placeInputText.value = location.place_guess

      globalWrite.title = title
      globalWrite.author = author
      globalWrite.d1 = date
      globalWrite.d2 = date
      globalWrite.location = location

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
  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, globalWrite, id, prop, callback: createInatParamsCheckboxGroup, cbParent: d.getElementById('inat-params-input-check-box-group')})  
  handleFieldsnotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, globalWrite, fieldnotesStubsCallback: useLocal ? _getFieldnotes : getFieldnotesStubs, importFieldNotesBtn}) 

  const updateBtnState = ({str, btn}) => {
    str.length > 0
    ? btn.classList.remove('disabled')
    : btn.classList.add('disabled')
  }

  const addItemToList = ({selectedItems, selectedItem, selectedItemsListElement}) => {

    if(selectedItem) {
      const isItemNewToList = selectedItems.findIndex(item => item.dt === selectedItem.dt) === -1
      if(isItemNewToList) selectedItems.push({
            ...selectedItem
          , hasJustBeenAdded: true
      })
    }

    const removeTermFromList = ({e, li}) => {
      const checkbox = e.target
      if(!checkbox.checked) {        
        selectedItems.forEach(item => {
          if(item.dt.toLowerCase() === li.innerText.toLowerCase()) {
            item.hasJustBeenDeleted = true
          }
        })
        li.remove()
      }
    }

    selectedItemsListElement.innerHTML = ''
    
    selectedItems.forEach(term => {
      const li = d.createElement('li')
      const checkbox = d.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = term.dt
      checkbox.setAttribute('checked', true)
      checkbox.classList.add('fl')
      checkbox.addEventListener('change', e => removeTermFromList({e, li}), true)
      const label = d.createElement('label')
      label.innerText = term.dt
      label.htmlFor = checkbox.id
      li.appendChild(checkbox)
      li.appendChild(label)
      selectedItemsListElement.appendChild(li)
    })
  }

  const addContentToPreviewContainer = ({previewTemplate, textContent, previewContainer}) => {
    const t = d.getElementById(previewTemplate.templateId)
    const clone = t.content.cloneNode(true)
    const p = clone.querySelector(previewTemplate.element)
    p.textContent = textContent
    previewContainer.appendChild(clone)
  }

  const createSection = ({typeId, typeText, typeTemplateName, sectionTemplate, sectionId}) => {
    const sectionClone = sectionTemplate.content.cloneNode(true)
    const sectionContainer = sectionClone.querySelector('section')
    const fieldset = sectionClone.querySelector('fieldset')
    const legend = sectionClone.querySelector('legend')
    const showAllOrIncludedBtn = sectionClone.querySelector('.show-all-or-include-only-btn')
    const parentContainer = sectionClone.querySelector('div')
    const addOrUpdateSectionAndPreviewBtn = sectionClone.getElementById('add-section-btn')
    const editSectionBtn = sectionClone.getElementById('edit-section-btn')
    const deleteSectionBtn = sectionClone.getElementById('delete-section-btn')    
    const typeTemplate = d.getElementById(typeTemplateName)
    const typeClone = typeTemplate.content.cloneNode(true)

    sectionContainer.setAttribute('id', sectionId)
    sectionContainer.addEventListener('dragstart', dragstartHandler)
    
    let input, label, texarea, datalist, previewContainer, selectedItems, images, cbParent = null

    legend.innerText = typeText

    previewContainer = typeClone.querySelector('.edit')

    switch(typeId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        input = typeClone.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionAndPreviewBtn), true)
        addOrUpdateSectionAndPreviewBtn.addEventListener('click', e => addOrUpdateSectionAndPreview({parent: e.target.parentElement, typeId, typeValue:input.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e, typeId, previewContainer, sectionId}), true)
        break
      case 'textarea-write-template':      
        texarea = typeClone.querySelector('textarea')
        texarea.addEventListener('input', e => handleInputChangeEvent(e, addOrUpdateSectionAndPreviewBtn), true)
        editSectionBtn.addEventListener('click', e => editSection({e, typeId, previewContainer, sectionId}), true)
        addOrUpdateSectionAndPreviewBtn.addEventListener('click', e => addOrUpdateSectionAndPreview({parent: e.target.parentElement, typeId, typeValue:texarea.value, previewContainer, sectionId}), true)
        break
      case 'observations':
      case 'species':                
        cloneImages({globalWrite, parent:typeClone.querySelector('div'), typeId, sectionId })
        break
      case 'terms':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionId}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionId}-dl-input-text`
        input.setAttribute('list', datalist.id)        
        label = typeClone.querySelector('label')
        label.htmlFor = input.id                  
        // addOrUpdateSectionAndPreviewBtn.addEventListener('click', e => addOrUpdateSectionAndPreview({parent: e.target.parentElement, typeId, typeValue:selectedItems, previewContainer, sectionId }), true)
        // editSectionBtn.addEventListener('click', e => editSection({e, typeId, previewContainer, sectionId}), true)
        break
      case 'images':
        const url1 = typeClone.getElementById('image-url-input-one')
        const title1 = typeClone.getElementById('image-title-input-one')
        url1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addOrUpdateSectionAndPreviewBtn, url1, title1}), true)
        title1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addOrUpdateSectionAndPreviewBtn, url1, title1}), true)
        
        addOrUpdateSectionAndPreviewBtn.addEventListener('click', e => addOrUpdateSectionAndPreview({parent: e.target.parentElement, typeId, typeValue:images, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e, typeId, previewContainer, sectionId}), true)
        break
      case 'inat-lookup':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionId}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionId}-dl-input-text`
        input.setAttribute('list', datalist.id)
        label = typeClone.querySelector('label')
        label.htmlFor = input.id
        cbParent = typeClone.querySelector('#inat-lookup-callback-parent')
        cbParent.id = `${sectionId}-lookup-parent`
        addOrUpdateSectionAndPreviewBtn.addEventListener('click', e => addOrUpdateSectionAndPreview({parent: e.target.parentElement, typeId, typeValue:selectedItems, previewContainer, sectionId }), true)
        editSectionBtn.addEventListener('click', e => editSection({e, typeId, previewContainer, sectionId}), true)
        break
    }
    
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
    
    deleteSectionBtn.addEventListener('click', e => deleteSection({d, sectionId, globalWrite}), true)

    // Add additional functionality once the DOM has been updated
    switch(typeId) {
      case 'h3-write-template':
      case 'h4-write-template':
      case 'xenocanto-write-template':
        Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()
        break
      case 'species':
      case 'observations':      
          showAllOrIncludedBtn.addEventListener('click', e => toggleAllOrIncludedInSpeciesList({btn:showAllOrIncludedBtn, fieldset}))
         break
      case 'textarea':
        Array.from(fieldset.getElementsByTagName('textarea'))[0]?.focus()
        break
      case 'terms':
        const parent = fieldset.querySelector('#selected-term')
        const addSelectedTermBtn = fieldset.querySelector('#add-selected-term-btn')
        const addNewTermBtn = fieldset.querySelector('#add-new-term-btn')
        
        selectedItems = globalWrite?.sections?.find(t => t.sectionId === sectionId)?.terms || []        

        const handleOnClickAddSelectedTermBtn = ({selectedItems, selectedItem}) => {
          const selectedItemsListElement = fieldset.querySelector('#selected-terms-list')
          addItemToList({selectedItems: selectedItems.filter(item => !item.hasJustBeenDeleted), selectedItem, selectedItemsListElement})
          addSelectedTermBtn.classList.add('disabled')
          addOrUpdateSectionAndPreviewBtn.classList.remove('disabled')
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
        dt.id = `${sectionId}-input-dt`
        d.querySelector('label[for="input-dt"]').htmlFor = dt.id
        dd.id = `${sectionId}-input-dd`
        d.querySelector('label[for="input-dd"]').htmlFor = dd.id
        ds.id = `${sectionId}-input-ds`
        d.querySelector('label[for="input-ds"]').htmlFor = ds.id
        da.id = `${sectionId}-input-da`
        d.querySelector('label[for="input-da"]').htmlFor = da.id
        dx.id = `${sectionId}-input-dx`
        d.querySelector('label[for="input-dx"]').htmlFor = dx.id
        
        dt.addEventListener('change', e => {
          updateBtnState({str: e.target.value, btn: addNewTermBtn })          
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
      case 'inat-lookup':
          showAllOrIncludedBtn.addEventListener('click', e => toggleAllOrIncludedInSpeciesList({btn:showAllOrIncludedBtn, fieldset}))
          Array.from(fieldset.getElementsByTagName('input'))[0]?.focus()

          // selectedItems = globalWrite?.sections?.find(t => t.sectionId === sectionId)?.items || []

          handleInatAutocomplete({ 
              inputText: input
            , dataList: datalist
            , globalWrite
            , id: 'taxa'
            , prop: 'name'
            , callback: createInatLookups
            , cbParent
            , typeId
            , sectionId
          })
      break
    }
    return sectionContainer
  }

  // Create a new type section when the user clicks on a type button
  selectionTypeBtns.forEach(btn => btn.addEventListener('click', e => { 
    const typeId = e.target.value
    const typeText = e.target.innerText
    
    createSection({typeId, typeText, typeTemplateName: typeId, sectionTemplate: getSectionTemplate({typeId}), sectionId: `section-${globalWrite.sectionIndex}`})
  }, true))

  const addOrUpdateSectionAndPreview = async ({parent, typeId, typeValue, previewContainer, sectionId}) => {
    previewContainer.innerHTML = ''

    let t, clone, header, input, sectionToUpdate, sectionIndex, sectionAddedOrUpdated, isEdit = null

    sectionToUpdate = globalWrite.sections.find(t => t.sectionId === sectionId) || null

    isEdit = !!sectionToUpdate

    sectionIndex = isEdit
      ? globalWrite.sections.findIndex(t => t.sectionId === sectionId)
      : 0

    const writeTemplate = writeTemplates.find(template => template.templateId === typeId)
    const previewTemplate = previewTemplates.find(template => template.id === writeTemplate.previewTemplateId)

    switch(typeId) {
      case 'h3-write-template':        
      case 'h4-write-template':
      case 'xenocanto-write-template':
        previewTemplate[previewTemplate.element] = typeValue
        sectionAddedOrUpdated = { ...previewTemplate, sectionId }
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
        sectionAddedOrUpdated = { ...previewTemplate, sectionId, paras }
        paras.forEach(text => addContentToPreviewContainer({previewTemplate, textContent:text.p, previewContainer}))
        break
      case 'terms':                
        const originalTerms = typeValue.filter(term => !term.hasJustBeenAdded)
        const updatedTerms = typeValue.filter(term => !term.hasJustBeenDeleted)
        if(isEdit) sectionToUpdate.terms = originalTerms.map(term => {
          if(term.hasJustBeenDeleted) delete term.hasJustBeenDeleted
          return term
        })
        sectionAddedOrUpdated = { 
            ...term
          , templateId: term.id
          , sectionId
          , terms: updatedTerms.map(term => {
            if(term.hasJustBeenAdded) delete term.hasJustBeenAdded
            return term
          })
        }
        addItemToList({selectedItems: updatedTerms, selectedItem: null, selectedItemsListElement: previewContainer})
        break
      case 'images':
        sectionAddedOrUpdated = { ...image, templateId: image.id, sectionId, imgs: typeValue }
        break
      case 'inat-lookup':
        break
    }
    // Show the preview section and hide the edit section
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))

    addOrUpdateSection({globalWrite, sectionIndex, sectionToUpdate, sectionAddedOrUpdated, isEdit})
  }

  const updateSection = async({parent, typeId, typeValue, previewContainer}) => {
    let t, clone, header, input, sectionToUpdate, sectionIndex, sectionAddedOrUpdated, isEdit = null

    sectionToUpdate = globalWrite.sections.find(t => t.sectionId === sectionId) || null

    isEdit = !!sectionToUpdate

    switch(typeId) {
      case 'terms':                
      const originalTerms = typeValue.filter(term => !term.hasJustBeenAdded)
      const updatedTerms = typeValue.filter(term => !term.hasJustBeenDeleted)
      if(isEdit) sectionToUpdate.terms = originalTerms.map(term => {
        if(term.hasJustBeenDeleted) delete term.hasJustBeenDeleted
        return term
      })
      sectionAddedOrUpdated = { 
          ...term
        , templateId: term.id
        , sectionId
        , terms: updatedTerms.map(term => {
          if(term.hasJustBeenAdded) delete term.hasJustBeenAdded
          return term
        })
      }
      addItemToList({selectedItems: updatedTerms, selectedItem: null, selectedItemsListElement: previewContainer})
      break
    }

    // Show the preview section and hide the edit section
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))

    addOrUpdateSection({globalWrite, sectionIndex, sectionToUpdate, sectionAddedOrUpdated, isEdit})
  }

  const editSection = ({e}) => {
    const parent = e.target.parentElement
    const addOrUpdateSectionAndPreviewBtn = parent.querySelector('#add-section-btn')
    addOrUpdateSectionAndPreviewBtn.innerText = 'Save changes'
    addOrUpdateSectionAndPreviewBtn.classList.remove('disabled')

    Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
  }

  // const editSection = ({e, typeId, previewContainer, sectionId, typeValue}) => {
  //   const parent = e.target.parentElement
  //   const updateSectionBtn = parent.querySelector('#update-section-btn')
  //   updateSectionBtn.classList.remove('hidden')
  //   const addOrUpdateSectionAndPreviewBtn = parent.querySelector('#add-section-btn')
  //   addOrUpdateSectionAndPreviewBtn.classList.add('hidden')

  //   updateSectionBtn.addEventListener('click', e => updateSection({parent: e.target.parentElement, typeId, typeValue, previewContainer, sectionId}), true)

  //   Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
  //   Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
  // }

  const handleInputChangeEvent = (e, addBtn) => {
    updateBtnState({str: e.target.value, btn: addBtn})
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

  const getSectionTemplate = ({typeId}) => {
    let sectionTemplate = null
    switch (typeId) {
      case 'species':
      case 'observations':
      case 'inat-lookup':
        sectionTemplate = d.getElementById('section-include-template')
        break
      default:
        sectionTemplate = d.getElementById('section-template')
    }
    return sectionTemplate
  }

  const enableExportFieldNotesContainer = () => {
    // Check fields added by the user
    let areFieldsValid = true
    
    // Title
    areFieldsValid = areFieldsValid && globalWrite.title.length > 2

    // Author
    areFieldsValid = areFieldsValid && globalWrite.author.length > 2

    // Date
    areFieldsValid = areFieldsValid && globalWrite.d1.length > 0 && Object.prototype.toString.call(new Date(globalWrite.d1)) === '[object Date]'
    areFieldsValid = areFieldsValid && globalWrite.d2.length > 0 && Object.prototype.toString.call(new Date(globalWrite.d2)) === '[object Date]'

    // Location
    areFieldsValid = areFieldsValid && globalWrite.location.place_guess.length > 2

    areFieldsValid
      ? exportFieldNotesContainer.classList.remove('disabled')
      : exportFieldNotesContainer.classList.add('disabled')
  }

  titleInputText.addEventListener('blur', e => { 
    globalWrite.title = e.target.value
    enableExportFieldNotesContainer()
  })
  authorInputText.addEventListener('blur', e => {
    globalWrite.author = e.target.value
    enableExportFieldNotesContainer()
  })
  dateInputText.addEventListener('blur', e => {
    const date = e.target.value
    if(date.length > 0 && Object.prototype.toString.call(new Date(date)) === '[object Date]') {
      globalWrite.d1 = date
      globalWrite.d2 = date
    }
    enableExportFieldNotesContainer()
  })
  placeInputText.addEventListener('blur', e => {
    globalWrite.location.place_guess = e.target.value
    enableExportFieldNotesContainer()
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

  // Export fieldnotes
  const exportFieldNotes = async() => {
    try {
      const notes = {}

      Object.assign(notes, {
        id: globalWrite.id || '',
        fnId: globalWrite.title,
        title: globalWrite.title,
        author: globalWrite.author,
        user: {
          id: globalWrite.user.id,
          icon: globalWrite.user.icon,
          identifications_count: globalWrite.user.identifications_count,
          login: globalWrite.user.login,
          observations_count: globalWrite.user.observations_count,
          species_count: globalWrite.user.species_count,
        },
        d1: globalWrite.d1,
        d2: globalWrite.d2,
        location: globalWrite.location,
        language: globalWrite.language,
        taxa: globalWrite.taxa,
        sections: globalWrite.sections.map(t => {
          const {templateId, ...validProps} = t
          return {
            ...validProps,
          }
        }),
        sectionOrder: globalWrite.sections.map(section => section.sectionId)
      })
      
      const response = await addFieldnotes({fieldnotes: notes})

      globalWrite.id = response.id

      // Show notification that Fieldnotes have been exported
      showNotificationsDialog({message: response.message, type: response.type, displayDuration: 2000})
    } catch (e) {
      showNotificationsDialog({message: e.message, type: 'error'})
    }
  }

  exportFieldNotesBtn.addEventListener('click', exportFieldNotes, true)

  // Import fieldnotes
  const importFieldNotes = async () => {
    try {
      importFieldNotesNotificationText.classList.remove('hidden')

      const fieldnotesStubs = globalWrite.fieldnotesStubs

      globalWrite = {
        ...initGlobalWrite(),
        fieldnotesStubs
      }
      
      const response = useLocal 
        ? await globalWrite.fieldnotesStubs
        : await getFieldnotesById({id: globalWrite.fieldnotesStubs.fieldnotesId})

      if(!response.success) return 

      const fieldnotes = response.data

      Object.assign(globalWrite, {
        ...fieldnotes,
        sections: fieldnotes.sectionOrder.map(sectionId => {
          return fieldnotes.sections.find(section => section.sectionId === sectionId)
        })      
      })

      const { title, author, d1, d2, location } = globalWrite

      titleInputText.value = title
      authorInputText.value = author
      dateInputText.value = d1
      placeInputText.value = location.place_guess

      // DON'T DELETE!!!!!
      // globalWrite.species = await getInatObservations({ 
      //   user_id: globalWrite.user.id,
      //   place_id: null,
      //   iconic_taxa: globalWrite.iconicTaxa,
      //   per_page: 200,
      //   locale: globalWrite.language.id,
      //   species_count: false,
      //   d1,
      //   d2,
      // })

      importFieldNotesNotificationText.classList.add('hidden')

      globalWrite.sectionIndex = globalWrite.sections.length > 0
        ? globalWrite.sections.map(s => Number(s.sectionId.replace('section-', ''))).sort(function (a, b) { return a - b })[globalWrite.sections.length -1 ] + 1
        : 0

      globalWrite.sections.forEach(section => {
        const sectionContainer = createSection({
            typeId: section.writeTemplateId
          , typeText: section.name
          , typeTemplateName: section.writeTemplateId
          , sectionTemplate: getSectionTemplate({typeId: section.writeTemplateId})
          , sectionId: section.sectionId     
        })

        const addOrUpdateSectionAndPreviewBtn = sectionContainer.querySelector('#add-section-btn')
        const editSectionBtn = sectionContainer.querySelector('#edit-section-btn')      

        if(addOrUpdateSectionAndPreviewBtn) addOrUpdateSectionAndPreviewBtn.classList.add('hidden')
        if(editSectionBtn) editSectionBtn.classList.remove('hidden')

        const previewContainer = sectionContainer.querySelector('.edit')
        previewContainer.classList.remove('hidden')
        const add = sectionContainer.querySelector('.add')
        if(sectionContainer.querySelector('.add:not(.edit)')) sectionContainer.querySelector('.add:not(.edit)').classList.add('hidden')

        const previewTemplate = previewTemplates.find(template => template.id === section.templateId)

        switch(section.type) {
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
          case 'species':
            const speciesCheckboxes = sectionContainer.querySelectorAll('input')
            speciesCheckboxes.forEach(checkbox => {
              if(section.species.includes(checkbox.value)) {
                checkbox.setAttribute('checked', true)
              }
            })            
            break
          case 'terms':
            const selectedItemsListElement = sectionContainer.querySelector('#selected-terms-list')
            addItemToList({selectedItems: section.terms, selectedItem: null, selectedItemsListElement})
            const editSectionBtn = sectionContainer.querySelector('#edit-section-btn')
            editSectionBtn.addEventListener('click', e => editSection({e, typeId: section.type, previewContainer: sectionContainer.querySelector('.edit'), sectionId: section.sectionId, typeValue: section.terms}), true)
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