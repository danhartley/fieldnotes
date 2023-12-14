import {   
  getInatObservations
, g
, getTerms
, _getFieldnotes
, getFieldnotes
, getFieldnotesStubs
, getFieldnotesById
, addFieldnotes
, updateFieldNotes
, addElementToArray
, updateElementFromArray
} from './api.js'

import { 
  templates
, h3
, h4
, text
, term
, image
, xenocanto 
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
} from './ui-actions.js'

const init = () => {

  const useLocal = false

  let globalWrite = {}

  Object.assign(globalWrite, {
    iconicTaxa: g.ICONIC_TAXA,
    language: g.LANGUAGES[1],
    useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
    species: [],
    taxa: [],
    templates: [],
  })

  const d = document
  const editCtrlInputRadio = d.getElementById('edit-ctrl-input-radio')
  const previewCtrlInputRadio = d.getElementById('preview-ctrl-input-radio')
  const editView = d.getElementById('edit-view')
  const draggableSections = d.getElementById('draggable-sections')
  const previewView = d.getElementById('preview-view')
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

  draggableSections.addEventListener('dragover', dragoverHandler)
  draggableSections.addEventListener('drop', e => dropHandler({e, globalWrite, draggableSections, apiCallback: updateFieldNotes}))

  let sectionIndex = 0

  const toggleView = () => {
    editView.classList.toggle('hidden')
    previewView.classList.toggle('hidden')
  }

  editCtrlInputRadio.addEventListener('click', toggleView, true)
  previewCtrlInputRadio.addEventListener('click', toggleView, true)

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
    exportFieldNotesBtn.classList.remove('disabled')
  }

  searchInatObservationsBtn.addEventListener('click', searchInatObservations, false)

  const initGlobalWrite = () => {
    globalWrite = {
      ...globalWrite,
      inatAutocompleteOptions: [
        {
          id: 'users',
          name: 'user',
          prop: 'login',
          placeholder: 'Start typing a username or user ID…',
          isActive: false,
          user: null,
        },
      ],
      inatAutocomplete: {
        id: 'users',
        name: 'user',
        prop: 'login',
        placeholder: 'Username or user ID',
        isActive: false,
        user: null,
        project: null,
        place: null,
      },
    }
  }

  initGlobalWrite()

  const { id, prop } = g.inatAutocomplete
  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, g: globalWrite, id, prop, callback: createInatParamsCheckboxGroup, cbParent: d.getElementById('inat-params-input-check-box-group')})  
  handleFieldsnotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, g: globalWrite, fieldnotesStubsCallback: useLocal ? _getFieldnotes : getFieldnotesStubs, importFieldNotesBtn}) 

  const updateBtnState = ({str, btn}) => {
    str.length > 0
    ? btn.classList.remove('disabled')
    : btn.classList.add('disabled')
  }

  const addTermToList = ({selectedTerms, selectedTerm, selectedTermsList}) => {
    
    if(selectedTerm) {
      if(selectedTerms.findIndex(item => item.dt === selectedTerm.dt) === -1) selectedTerms.push(selectedTerm)
    }
    
    const removeTermFromList = ({e, li}) => {
      const checkbox = e.target
      if(!checkbox.checked) li.remove()
    }

    selectedTermsList.innerHTML = ''
    
    selectedTerms.forEach(term => {
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
      selectedTermsList.appendChild(li)
    })
  }

  const addSection = async ({e, typeId, typeValue, previewContainer, sectionId}) => {
    previewContainer.innerHTML = ''

    let t, clone, header, input, section, sectionIndex, sectionToAdd, sectionToUpdate = null

    globalWrite.sections = globalWrite.sections || []

    section = globalWrite.sections.find(t => t.sectionId === sectionId) || null

    if(section) sectionIndex = globalWrite.sections.findIndex(t => t.sectionId === sectionId)

    switch(typeId) {
      case 'h3-input':        
        sectionToAdd = { ...h3, templateId: h3.id, sectionId, h3: typeValue }
        // globalWrite.sections.push({ ...h3, templateId: h3.id, sectionId, h3: typeValue })
        t = d.getElementById('h3-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h3')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'h4-input':
        sectionToAdd = { ...h4, templateId: h4.id, sectionId, h4: typeValue }
        // globalWrite.sections.push({ ...h4, templateId: h4.id, sectionId, h4: typeValue })
        t = d.getElementById('h4-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h4')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'birdsong-input':
        sectionToAdd = { ...xenocanto, templateId: xenocanto.id, sectionId, xenocanto: typeValue }
        t = d.getElementById('xenocanto-template')
        clone = t.content.cloneNode(true)
        input = clone.querySelector('input')
        input.value = typeValue
        previewContainer.appendChild(clone)
        break
      case 'textarea':
        const ps = typeValue.split('\n').filter(p => p.length > 0)
        const paras = ps.map(p => {
          return {
            p
          }
        })
        sectionToAdd = { ...text, templateId: text.id, sectionId, paras }
        sectionToUpdate = { ...text, templateId: text.id, sectionId, paras }

        paras.forEach(text => {
          const t = d.getElementById('text-template')
          const clone = t.content.cloneNode(true)
          const p = clone.querySelector('p')
          p.textContent = text.p    
          previewContainer.appendChild(clone)
        })
        break
      case 'terms':        
        sectionToAdd = { ...term, templateId: term.id, sectionId, selectedTerms: typeValue }
        sectionToUpdate = { ...term, templateId: term.id, sectionId, terms: typeValue }

        addTermToList({selectedTerms: typeValue, selectedTerm: null, selectedTermsList: previewContainer})  
        break
      case 'images':
        sectionToAdd = {...image, templateId: image.id, sectionId, imgs: typeValue }
        sectionToUpdate = { ...image, templateId: image.id, sectionId, imgs: typeValue }        
        break
    }
    const parent = e.target.parentElement
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))

    // Update DOM
    !!section
      ? globalWrite.sections.push(sectionToAdd)
      : globalWrite.sections[sectionIndex] = sectionToUpdate

    // Save to db
    const response = !!section 
      ? await addElementToArray({fieldnotes: globalWrite, array: 'sections',  element: sectionToAdd})
      : await updateElementFromArray({fieldnotes: globalWrite, array: 'sections',  element: sectionToUpdate})

    console.log(response)
  }

  const editSection = ({e}) => {
    const parent = e.target.parentElement
    parent.querySelector('#add-section-btn').innerText = 'Save changes'

    Array.from(parent.querySelectorAll('.edit:not(.add')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.querySelectorAll('.add')).forEach(el => el.classList.remove('hidden'))
  }
  
  const deleteSection = ({e, sectionId}) => {
    const element = d.getElementById(sectionId)
    element.remove()
    globalWrite.sections = globalWrite.sections.filter(t => t.sectionId !== sectionId) // check exits there first…
  }

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

  const handleSelectSectionType = ({typeId, typeText, typeTemplateName, sectionTemplate}) => {
    const sectionClone = sectionTemplate.content.cloneNode(true)
    const fieldset = sectionClone.querySelector('fieldset')
    const legend = sectionClone.querySelector('legend')
    const showAllOrIncludedBtn = sectionClone.querySelector('.show-all-or-include-only-btn')
    const parentContainer = sectionClone.querySelector('div')
    const addSectionBtn = sectionClone.getElementById('add-section-btn')
    const editSectionBtn = sectionClone.getElementById('edit-section-btn')
    const deleteSectionBtn = sectionClone.getElementById('delete-section-btn')
    const sectionId = `section-${sectionIndex++}`
    const sectionContainer = sectionClone.querySelector('section')    
    const typeTemplate = d.getElementById(typeTemplateName)
    const typeClone = typeTemplate.content.cloneNode(true)

    sectionContainer.setAttribute('id', sectionId)
    sectionContainer.addEventListener('dragstart', dragstartHandler)
    
    let input, label, texarea, datalist, previewContainer, selectedTerms, images, cbParent = null

    legend.innerText = typeText

    previewContainer = typeClone.querySelector('.edit')

    switch(typeId) {
      case 'h3-input':
      case 'h4-input':
      case 'birdsong-input':
        input = typeClone.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:input.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'textarea':
        texarea = typeClone.querySelector('textarea')        
        texarea.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:texarea.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'observations':
      case 'species':                
        cloneImages({global:globalWrite, parent:typeClone.querySelector('div'), typeId, sectionId })
        break
      case 'terms':
        datalist = typeClone.querySelector('datalist')
        datalist.id = `${sectionId}-dl-list`
        input = typeClone.querySelector('input')
        input.id = `${sectionId}-dl-input-text`
        input.setAttribute('list', datalist.id)        
        label = typeClone.querySelector('label')
        label.htmlFor = input.id                  
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:selectedTerms, previewContainer, sectionId }), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'images':
        const url1 = typeClone.getElementById('image-url-input-one')
        const title1 = typeClone.getElementById('image-title-input-one')
        url1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addSectionBtn, url1, title1}), true)
        title1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addSectionBtn, url1, title1}), true)
        
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:images, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
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
    
    deleteSectionBtn.addEventListener('click', e => deleteSection({e, sectionId}), true)

    // Add additional functionality once the DOM has been updated
    switch(typeId) {
      case 'h3-input':
      case 'h4-input':
      case 'birdsong-input':
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
        const selectedTermsList = fieldset.querySelector('#selected-terms-list')
        
        // Add a pre-existing term
        selectedTerms = globalWrite?.templates?.find(t => t.sectionId === sectionId)?.terms || []
        const handleAddSelectedTerm = ({e, selectedTerm}) => {
          addTermToList({selectedTerms, selectedTerm, selectedTermsList})
          addSelectedTermBtn.classList.add('disabled')
          addSectionBtn.classList.remove('disabled')
          input.value = ''             
        }
        input.focus()
        handleTermAutocomplete({ inputText: input, selectedTerms, dataList: datalist, g: globalWrite, data: getTerms(), parent, addSelectedTermBtn, handleAddSelectedTerm})
        
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
          
          handleAddSelectedTerm({selectedTerm: newTerm})
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

          handleInatAutocomplete({ 
              inputText: input
            , dataList: datalist
            , g: globalWrite
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
    
    handleSelectSectionType({typeId, typeText, typeTemplateName: `${typeId}-template`, sectionTemplate: getSectionTemplate({typeId})})
  }, true))

  // Persist updated metadata values to the fieldnotes object
  titleInputText.addEventListener('blur', e => { 
    globalWrite.title = e.target.value 
    e.target.value.length > 2
    ? exportFieldNotesBtn.classList.remove('disabled')
    : exportFieldNotesBtn.classList.add('disabled')
  })
  authorInputText.addEventListener('blur', e => globalWrite.author = e.target.value)
  dateInputText.addEventListener('blur', e => {
    globalWrite.d1 = e.target.value
    globalWrite.d2 = e.target.value
  })
  placeInputText.addEventListener('blur', e => globalWrite.location.place_guess = e.target.value)
  
  // Check state of iNat search button (enabled or disabled)
  const checkSearchBtnState = () => {
    const hasUser = globalWrite.login && globalWrite.login.length > 0
    const date = new Date(singleObservationsInputDate.value)
    const hasDate = singleObservationsInputDate.value .length > 0 && Object.prototype.toString.call(date) === '[object Date]'

    hasUser && hasDate
      ? searchInatObservationsBtn.classList.remove('disabled')
      : searchInatObservationsBtn.classList.add('disabled')
  }
  
  singleObservationsInputDate.addEventListener('blur', checkSearchBtnState, true)
  iNatAutocompleteInputText.addEventListener('blur', checkSearchBtnState, true)

  // Export fieldnotes
  const exportFieldNotes = () => {
    const notes = {}

    Object.assign(notes, {
      id: globalWrite.id,
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
    console.log(notes)
    
    addFieldnotes({fieldnotes: notes})
  }

  exportFieldNotesBtn.addEventListener('click', exportFieldNotes, true)

  // Import fieldnotes
  const importFieldNotes = async () => {
    importFieldNotesNotificationText.classList.remove('hidden')
    
    const fieldnotes = useLocal 
      ? await globalWrite.fieldnotesStubs
      : await getFieldnotesById({id: globalWrite.fieldnotesStubs.fieldnotesId})

    Object.assign(globalWrite, {
      iconicTaxa: g.ICONIC_TAXA,
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

    globalWrite.species = await getInatObservations({ 
      user_id: globalWrite.user.id,
      place_id: null,
      iconic_taxa: globalWrite.iconicTaxa,
      per_page: 200,
      locale: globalWrite.language.id,
      species_count: false,
      d1,
      d2,
    })

    importFieldNotesNotificationText.classList.add('hidden')

    globalWrite.sections.forEach((section, index) => {
      section.sectionId = `section-${index}`
      const sectionContainer = handleSelectSectionType({
          typeId: section.type
        , typeText: section.name
        , typeTemplateName: section.id
        , sectionTemplate: getSectionTemplate({typeId: section.type})              
      })

      const addSectionBtn = sectionContainer.querySelector('#add-section-btn')
      const editSectionBtn = sectionContainer.querySelector('#edit-section-btn')      

      if(addSectionBtn) addSectionBtn.classList.add('hidden')
      if(editSectionBtn) editSectionBtn.classList.remove('hidden')

      let target

      switch(section.type) {
        case 'text':
          target = sectionContainer.querySelector('p')    
          target.innerText = section.paras.map(para => para.p).join('\n\n')
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
          const selectedTermsList = sectionContainer.querySelector('#selected-terms-list')
          addTermToList({selectedTerms: section.terms, selectedTerm: null, selectedTermsList})
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
    exportFieldNotesBtn.classList.remove('disabled')
  }

  importFieldNotesBtn.addEventListener('click', importFieldNotes, true)
}

init()