import { 
  getByAutocomplete
, getInatObservations
, getInatTaxa
, inatControls
, g
} from './api.js'

import { 
  templates
, h3
, h4
, date
, location
, text
, term
, species
, image
, annotation
, xenocanto 
, author
} from './templates.js'

import { 
    handleInatAutocomplete 
  , bgColour
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
  const singleDate = d.getElementById('observations-date')
  const fetchInatSpeciesBtn = d.getElementById('fetch-inat-species-btn')
  const fetchInatSpeciesNotificationText = d.getElementById('fetch-inat-species-notification-text')
  const inatMetaDataDl = d.getElementById('inat-meta-data-dl')
  const selectSectionTypeSection = d.getElementById('select-section-type-section')
  const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')
  const titleInputText = d.getElementById('title-input-text')
  const saveFieldNotesBtn = d.getElementById('save-field-notes-btn')

  const dragstartHandler = ev => {
    ev.dataTransfer.setData("text/plain", ev.target.id)
    const section = d.getElementById(ev.target.id)
    section.classList.add('moveable')
  }

  const dragoverHandler = ev => {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "move"
    
    if(ev.target.type === 'fieldset') {
      const sectionBeforeId = ev.target.parentNode.id
      const sectiontoJump = d.getElementById(sectionBeforeId)
      Array.from(d.getElementsByTagName('fieldset')).forEach(fs => fs.classList.remove('drop-before'))
      sectiontoJump.getElementsByTagName('fieldset')[0].classList.add('drop-before')
      sectiontoJump.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    }
  }

  const dropHandler = ev => {
    ev.preventDefault()
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain")

    if(ev.target.type === 'fieldset') {
      // Update the position of the section visually
      draggableSections.insertBefore(d.getElementById(data), ev.target.parentNode)
      
      // Update the position of the section in the templates array
      const sectionToMoveId = d.getElementById(data).id
      const sectionBeforeId = ev.target.parentNode.id
      const indexBefore = globalWrite.templates.findIndex(t => t.id === sectionBeforeId)

      const sectiontoJump = d.getElementById(sectionBeforeId)
      sectiontoJump.getElementsByTagName('fieldset')[0].classList.remove('drop-before')

      if(!indexBefore) return

      const sectionToMove = globalWrite.templates.find(t => t.id === sectionToMoveId)

      globalWrite.templates = globalWrite.templates.filter(t => t.id !== sectionToMoveId)
      globalWrite.templates.splice(indexBefore, 0, sectionToMove)
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

  const fetchInatSpecies = async () => {
    fetchInatSpeciesNotificationText.classList.toggle('hidden')
    fetchInatSpeciesBtn.classList.toggle('disabled')

    const user = globalWrite.inatAutocompleteOptions.find(o => o.id === 'users')

    globalWrite.species = await getInatObservations({ 
        user_id: user.user.id,
        place_id: null,
        iconic_taxa: globalWrite.iconicTaxa,
        per_page: 200,
        locale: globalWrite.language.id,
        species_count: false,
        d1: singleDate.value,
        d2: singleDate.value,
    })
    
    fetchInatSpeciesBtn.classList.toggle('disabled')

    fetchInatSpeciesNotificationText.innerText = 'Search complete'

    setTimeout(() => {
      fetchInatSpeciesNotificationText.classList.toggle('hidden')
      fetchInatSpeciesNotificationText.innerText = 'Waiting for response from iNaturalist…'
    },1500)

    if(globalWrite.species.length === 0) return

    const ddAuthor = inatMetaDataDl.querySelector('dd:nth-child(2)')
    const ddDate = inatMetaDataDl.querySelector('dd:nth-child(4)')
    const ddLocation = inatMetaDataDl.querySelector('dd:nth-child(6)')

    const meta = {
      author: globalWrite.species[0].user.name,
      date: globalWrite.species[0].observed_on,
      location: {
        location: globalWrite.species[0].location, place_guess: globalWrite.species[0].place_guess
      }
    }

    ddAuthor.innerText = meta.author
    ddDate.innerText = meta.date
    ddLocation.innerText = meta.location.place_guess

    globalWrite.author = meta.author
    globalWrite.d1 = meta.date
    globalWrite.d2 = meta.date
    globalWrite.templates.push({...author, author: meta.author})
    globalWrite.templates.push({...date, date: meta.date})
    globalWrite.templates.push({...location, location: meta.location})
  }

  fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)


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

  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, g: globalWrite})

  const updateAddBtnState = ({str, btn}) => {
    str.length > 0
    ? btn.classList.remove('disabled')
    : btn.classList.add('disabled')
  }

  const addSection = ({e, typeId, typeValue, previewContainer, sectionId}) => {
    previewContainer.innerHTML = ''

    let t, clone, header = null

    switch(typeId) {
      case 'h3-input':        
        globalWrite.templates.push({ ...h3, templateId: h3.id, id: sectionId, h3: typeValue },)
        t = d.getElementById('h3-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h3')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'h4-input':
        globalWrite.templates.push({ ...h4, templateId: h4.id, id: sectionId, h4: typeValue },)
        t = d.getElementById('h4-template')
        clone = t.content.cloneNode(true)
        header = clone.querySelector('h4')
        header.textContent = typeValue
        previewContainer.appendChild(clone)
        break
      case 'textarea':
        const ps = typeValue.split('\n').filter(p => p.length > 0)
        const paras = ps.map(p => {
          return {
            p
          }
        })
        const section = globalWrite.templates.find(t => t.id === sectionId)
        if(section) {
          const sectionIndex = globalWrite.templates.findIndex(t => t.id === sectionId)
          globalWrite.templates[sectionIndex] = {...text, templateId: text.id, id: sectionId, paras}
        } else {
          globalWrite.templates.push({...text, templateId: text.id, id: sectionId, paras})
        }

        paras.forEach(text => {
          const t = d.getElementById('text-template')
          const clone = t.content.cloneNode(true)
          const p = clone.querySelector('p')
          p.textContent = text.p    
          previewContainer.appendChild(clone)
        })
        break
    }
    const parent = e.target.parentElement
    Array.from(parent.getElementsByClassName('edit')).forEach(el => el.classList.remove('hidden'))
    Array.from(parent.getElementsByClassName('add')).forEach(el => el.classList.add('hidden'))
  }

  const editSection = ({e}) => {
    const parent = e.target.parentElement
    parent.querySelector('#add-section-btn').innerText = 'Save changes'

    Array.from(parent.getElementsByClassName('edit')).forEach(el => el.classList.add('hidden'))
    Array.from(parent.getElementsByClassName('add')).forEach(el => el.classList.remove('hidden'))
  }
  
  const deleteSection = ({e, sectionId}) => {
    const element = d.getElementById(sectionId)
    element.remove()
    globalWrite.templates = globalWrite.templates.filter(t => t.id !== sectionId) // check exits there first…
  }

  const handleInputChangeEvent = (e, addBtn) => {
    const inputValue = e.target.value
    updateAddBtnState({str: inputValue, btn: addBtn})
  }

  const handleTextareaChangeEvent = (e, addBtn) => {
    const textareaValue = e.target.value
    updateAddBtnState({str: textareaValue, btn: addBtn})
  }

  const handleSpeciesCheckState = ({e, sectionId}) => {
    const name = e.target.value
    const section = globalWrite.templates.find(t => t.id === sectionId)
    if(section) {
      section.species.find(sp => sp === name) 
        ? section.species = section.species.filter(sp => sp !== name)
        : section.species.push(name)
    } else {
      const sp = [ name ]
      globalWrite.templates.push({...species, species: sp, templateId: species.id, id: sectionId })
    }
    // We should check also if a taxon needs to be removed from the list i.e. it appears in no species or observation section
    // But for now, we will content ourselves with addding taxon (which is harmless)
    if(!globalWrite.taxa.find(t => t.name === name)) {
      globalWrite.taxa.push({
        id: globalWrite.species.find(sp => sp.taxon.name === name)?.taxon?.id,
        name
      })
    }
  }

  const cloneImageTemplate = ({species, index, sectionId, imgUrl}) => {
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
    checkbox.addEventListener('change', e => handleSpeciesCheckState({e, sectionId}), true)
    label.htmlFor = checkbox.id

    return clone
}

const toggleSpeciesList = ({e, fieldset}) => {
  {
    const btn = e.target

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

  const selectType = ({typeId, typeText, sectionTemplate}) => {
    const parent = sectionTemplate.content.cloneNode(true)
    const fieldset = parent.querySelector('fieldset')
    const legend = parent.querySelector('legend')
    const showIncludeOnlyBtn = parent.querySelector('#show-include-only-btn')
    const parentContainer = parent.querySelector('div')
    const addSectionBtn = parent.getElementById('add-section-btn')
    const editSectionBtn = parent.getElementById('edit-section-btn')
    const deleteSectionBtn = parent.getElementById('delete-section-btn')
    const sectionId = `section-${sectionIndex++}`
    const sectionContainer = parent.querySelector('section')

    sectionContainer.setAttribute('id', sectionId)
    sectionContainer.addEventListener('dragstart', dragstartHandler)
    
    const typeTemplate = d.getElementById(`${typeId}-template`)
    const type = typeTemplate.content.cloneNode(true)

    let input, texarea, previewContainer = null

    previewContainer = type.querySelector('div')

    switch(typeId) {
      case 'h3-input':
      case 'h4-input':
        input = type.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:input.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'textarea':
        texarea = type.querySelector('textarea')
        texarea.addEventListener('input', e => handleTextareaChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', e => addSection({e, typeId, typeValue:texarea.value, previewContainer, sectionId}), true)
        editSectionBtn.addEventListener('click', e => editSection({e}), true)
        break
      case 'observations':
      case 'species':                
        if(globalWrite.species.length > 0) {
          const parent = type.querySelector('div')
          globalWrite.species.forEach((species, index) => {
            const imgUrl = typeId === 'observations'
              ? species.photos[0].url
              : species.taxon.default_photo.medium_url
            const clone = cloneImageTemplate({species, index, sectionId, imgUrl})            
            parent.appendChild(clone)
          })
        }
        break
    }
        
    if(showIncludeOnlyBtn) showIncludeOnlyBtn.addEventListener('click', e => toggleSpeciesList({e, fieldset}))
    deleteSectionBtn.addEventListener('click', e => deleteSection({e, sectionId}), true)    
    
    legend.innerText = typeText        
    parentContainer.appendChild(type)

    draggableSections.appendChild(parent)
    draggableSections.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })
  }

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', e => { 
    const typeId = e.target.value
    const typeText = e.target.innerText

    let sectionTemplate = null

    switch(typeId) {
      case 'species':
      case 'observations':
        sectionTemplate = d.getElementById('section-include-template')
        break
      default:
        sectionTemplate = d.getElementById('section-template')
    }

    selectType({typeId, typeText, sectionTemplate})
  }, true))

  titleInputText.addEventListener('blur', e => {
    globalWrite.title = e.target.value
  })

  const saveFieldNotes = () => {
    const notes = {}

    Object.assign(notes, {
      id: globalWrite.title.replace(' ', '-'),
      title: globalWrite.title,
      author: globalWrite.author,
      d1: globalWrite.d1,
      d2: globalWrite.d2,
      taxa: globalWrite.taxa,
      templates: [{
        id: `${globalWrite.title.replace(' ', '-')}-template`,
        name: 'Field journal',
        parent: 'non-grid-template',
        type: 'fieldnotes',
        isTest: false,  
        sections: globalWrite.templates.map(t => {
          const {templateId, ...validProps} = t
          return {
            ...validProps,
            id: t.templateId || t.id,
          }
        }),
      },
      ...templates,
    ],
    })
    console.log(notes)
  }

  saveFieldNotesBtn.addEventListener('click', saveFieldNotes, true)
}

init()

