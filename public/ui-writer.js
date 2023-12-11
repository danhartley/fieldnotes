import {   
  getInatObservations
, g
, getTerms
, getFieldNotes
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
  , handleFieldsNotesAutocomplete
  , cloneImages
  , toggleFilterCtrl
} from './ui-actions.js'

const init = () => {

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
  const fetchInatSpeciesBtn = d.getElementById('fetch-inat-species-btn')
  const fetchInatSpeciesNotificationText = d.getElementById('fetch-inat-species-notification-text')
  const authorInputText = d.getElementById('author-input-text')
  const dateInputText = d.getElementById('date-input-text')
  const placeInputText = d.getElementById('place-input-text')
  const selectSectionTypeSection = d.getElementById('select-section-type-section')
  const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')
  const titleInputText = d.getElementById('title-input-text')
  const exportFieldNotesBtn = d.getElementById('export-fieldnotes-btn')
  const importFieldNotesBtn = d.getElementById('import-fieldnotes-btn')
  const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')

  let sectionToMove = null

  const dragstartHandler = e => {
    // The event target is the dragged section
    e.dataTransfer.setData("text/plain", e.target.id)
    sectionToMove = d.getElementById(e.target.id)
    sectionToMove.classList.add('moveable')
  }

  const dragoverHandler = e => {
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

  const dragenterHandler = e => {
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

  const dragleaveHandler = e => {
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

  const dropHandler = e => {
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

  draggableSections.addEventListener('dragover', dragoverHandler)
  draggableSections.addEventListener('drop', dropHandler)

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

  const fetchInatSpecies = async ({userId}) => {
    fetchInatSpeciesNotificationText.classList.toggle('hidden')
    fetchInatSpeciesBtn.classList.toggle('disabled')

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
    
    fetchInatSpeciesBtn.classList.toggle('disabled')

    fetchInatSpeciesNotificationText.innerText = 'Search complete'

    setTimeout(() => {
      fetchInatSpeciesNotificationText.classList.toggle('hidden')
      fetchInatSpeciesNotificationText.innerText = 'Waiting for response from iNaturalist…'
    },1500)

    if(globalWrite.species.length === 0) return

    const { author, date, location } = getMeta({species: globalWrite.species})

    titleInputText.value = `${location.place_guess}, ${(new Date(date)).toDateString()}`
    authorInputText.value = author
    dateInputText.value = date
    placeInputText.value = location.place_guess

    globalWrite.author = author
    globalWrite.d1 = date
    globalWrite.d2 = date

    // Enable the create observation and species section buttons
    selectSectionTypeSection.querySelector('#observations').classList.remove('disabled')
    selectSectionTypeSection.querySelector('#species').classList.remove('disabled')

    // Enable saving fieldnotes
    exportFieldNotesBtn.classList.remove('disabled')
  }

  fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)

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
  handleFieldsNotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, g: globalWrite, data: getFieldNotes(), importFieldNotesBtn}) 

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

  const addSection = ({e, typeId, typeValue, previewContainer, sectionId}) => {
    previewContainer.innerHTML = ''

    let t, clone, header, input, section, sectionIndex = null

    section = globalWrite.templates.find(t => t.sectionId === sectionId)

    if(section) sectionIndex = globalWrite.templates.findIndex(t => t.sectionId === sectionId)

    switch(typeId) {
      case 'h3-input':        
        globalWrite.templates.push({ ...h3, templateId: h3.id, sectionId, h3: typeValue },)
        t = d.getElementById('h3-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h3')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'h4-input':
        globalWrite.templates.push({ ...h4, templateId: h4.id, sectionId, h4: typeValue })
        t = d.getElementById('h4-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h4')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'birdsong-input':
        globalWrite.templates.push({ ...xenocanto, templateId: xenocanto.id, sectionId, xenocanto: typeValue })
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
        section      
          ? globalWrite.templates[sectionIndex] = {...text, templateId: text.id, sectionId, paras}
          : globalWrite.templates.push({...text, templateId: text.id, sectionId, paras})        

        paras.forEach(text => {
          const t = d.getElementById('text-template')
          const clone = t.content.cloneNode(true)
          const p = clone.querySelector('p')
          p.textContent = text.p    
          previewContainer.appendChild(clone)
        })
        break
      case 'terms':        
        section
          ? globalWrite.templates[sectionIndex] = {...term, templateId: term.id, sectionId, selectedTerms: typeValue}
          : globalWrite.templates.push({ ...term, templateId: term.id, sectionId, terms: typeValue })

        addTermToList({selectedTerms: typeValue, selectedTerm: null, selectedTermsList: previewContainer})  
        break
      case 'images':
        section
          ? globalWrite.templates[sectionIndex] = {...image, templateId: image.id, sectionId, imgs: typeValue}
          : globalWrite.templates.push({ ...image, templateId: image.id, sectionId, imgs: typeValue })        
        break
    }
    const parent = e.target.parentElement
    Array.from(parent.querySelectorAll('.edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.querySelectorAll('.add:not(.edit)')).forEach(el => el.classList.add('hidden'))
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
    globalWrite.templates = globalWrite.templates.filter(t => t.sectionId !== sectionId) // check exits there first…
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

  const handleSelectType = ({typeId, typeText, typeTemplateName, sectionTemplate}) => {
    const parent = sectionTemplate.content.cloneNode(true)
    const fieldset = parent.querySelector('fieldset')
    const legend = parent.querySelector('legend')
    const showAllOrIncludedBtn = parent.querySelector('.show-all-or-include-only-btn')
    const parentContainer = parent.querySelector('div')
    const addSectionBtn = parent.getElementById('add-section-btn')
    const editSectionBtn = parent.getElementById('edit-section-btn')
    const deleteSectionBtn = parent.getElementById('delete-section-btn')
    const sectionId = `section-${sectionIndex++}`
    const sectionContainer = parent.querySelector('section')    
    const typeTemplate = d.getElementById(typeTemplateName)
    const type = typeTemplate.content.cloneNode(true)

    sectionContainer.setAttribute('id', sectionId)
    sectionContainer.addEventListener('dragstart', dragstartHandler)
    
    let input, label, texarea, datalist, previewContainer, selectedTerms, images, cbParent = null

    legend.innerText = typeText

    previewContainer = type.querySelector('.edit')

    switch(typeId) {
      case 'h3-input':
      case 'h4-input':
      case 'birdsong-input':
        input = type.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:input.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'textarea':
        texarea = type.querySelector('textarea')        
        texarea.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:texarea.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'observations':
      case 'species':                
        cloneImages({global:globalWrite, parent:type.querySelector('div'), typeId, sectionId })
        break
      case 'terms':
        datalist = type.querySelector('datalist')
        datalist.id = `${sectionId}-dl-list`
        input = type.querySelector('input')
        input.id = `${sectionId}-dl-input-text`
        input.setAttribute('list', datalist.id)        
        label = type.querySelector('label')
        label.htmlFor = input.id                  
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:selectedTerms, previewContainer, sectionId }), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'images':
        const url1 = type.getElementById('image-url-input-one')
        const title1 = type.getElementById('image-title-input-one')
        url1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addSectionBtn, url1, title1}), true)
        title1.addEventListener('input', e => handleImageInputChangeEvent({e, addBtn: addSectionBtn, url1, title1}), true)
        
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:images, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'inat-lookup':
        datalist = type.querySelector('datalist')
        datalist.id = `${sectionId}-dl-list`
        input = type.querySelector('input')
        input.id = `${sectionId}-dl-input-text`
        input.setAttribute('list', datalist.id)
        label = type.querySelector('label')
        label.htmlFor = input.id
        cbParent = type.querySelector('#inat-lookup-callback-parent')
        cbParent.id = `${sectionId}-lookup-parent`
        break
    }
    
    // Add the child to its parent container
    parentContainer.appendChild(type)

    // Add the parent container (the HTML cloned fragment) to the DOM
    draggableSections.appendChild(parent)
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

        // Update the Ids so that they are unique in the DOM
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

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', e => { 
    const typeId = e.target.value
    const typeText = e.target.innerText
    
    handleSelectType({typeId, typeText, typeTemplateName: `${typeId}-template`, sectionTemplate: getSectionTemplate({typeId})})
  }, true))

  titleInputText.addEventListener('blur', e => globalWrite.title = e.target.value)
  authorInputText.addEventListener('blur', e => globalWrite.author = e.target.value)
  dateInputText.addEventListener('blur', e => {
    globalWrite.d1 = e.target.value
    globalWrite.d2 = e.target.value
  })
  placeInputText.addEventListener('blur', e => globalWrite.location.place_guess = e.target.value)
  
  const checkSearchBtnState = () => {
    const hasUser = globalWrite.login && globalWrite.login.length > 0
    const date = new Date(singleObservationsInputDate.value)
    const hasDate = singleObservationsInputDate.value .length > 0 && Object.prototype.toString.call(date) === '[object Date]'

    hasUser && hasDate
      ? fetchInatSpeciesBtn.classList.remove('disabled')
      : fetchInatSpeciesBtn.classList.add('disabled')
  }
  
  singleObservationsInputDate.addEventListener('blur', checkSearchBtnState, true)
  iNatAutocompleteInputText.addEventListener('blur', checkSearchBtnState, true)

  const exportFieldNotes = () => {
    const notes = {}

    Object.assign(notes, {
      id: globalWrite.title,
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
      templates: [{
        id: globalWrite.title,
        name: 'Field journal',
        parent: 'non-grid-template',
        type: 'fieldnotes',
        isTest: false,  
        sections: globalWrite.templates.map(t => {
          const {templateId, sectionId, ...validProps} = t
          return {
            ...validProps,
          }
        }),
      },
      ...templates,
    ],
    })
    console.log(notes)
    console.log(notes.templates[0].sections)
  }

  exportFieldNotesBtn.addEventListener('click', exportFieldNotes, true)

  titleInputText.addEventListener('blur', e => {
    e.target.value.length > 2
      ? exportFieldNotesBtn.classList.remove('disabled')
      : exportFieldNotesBtn.classList.add('disabled')
  })
  
  const importFieldNotes = async () => {
    importFieldNotesNotificationText.classList.remove('hidden')
    
    const guide = globalWrite.fieldnote

    Object.assign(globalWrite, {
      iconicTaxa: g.ICONIC_TAXA,
      ...guide,
      templates: guide.templates[0].sections
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

    globalWrite.templates.forEach((section, index) => {
      section.sectionId = `section-${index}`
      const sectionContainer = handleSelectType({
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
    exportFieldNotesBtn.classList.remove('disabled')

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