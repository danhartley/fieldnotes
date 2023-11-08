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

let globalWrite = {}

Object.assign(globalWrite, {
  taxa: g.ICONIC_TAXA,
  language: g.LANGUAGES[1],
  useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
  species: [],
  templates: [],
})

import { handleInatAutocomplete } from './ui-actions.js'

const editCtrlInputRadio = document.getElementById('edit-ctrl-input-radio')
const previewCtrlInputRadio = document.getElementById('preview-ctrl-input-radio')
const editView = document.getElementById('edit-view')
const previewView = document.getElementById('preview-view')
const iNatAutocompleteInputText = document.getElementById('inat-autocomplete-input-text')
const iNatAutocompleteDatalist = document.getElementById('inat-autocomplete-data-list')
const singleDate = document.getElementById('observations-date')
const fetchInatSpeciesBtn = document.getElementById('fetch-inat-species-btn')
const fetchInatSpeciesNotificationText = document.getElementById('fetch-inat-species-notification-text')
const inatMetaDataDl = document.getElementById('inat-meta-data-dl')
const selectSectionTypeSection = document.getElementById('select-section-type-section')
const selectionTypeBtns = selectSectionTypeSection.querySelectorAll('button')

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
      iconic_taxa: globalWrite.taxa,
      per_page: 200,
      locale: globalWrite.language.id,
      species_count: false,
      d1: singleDate.value,
      d2: singleDate.value,
  })

  fetchInatSpeciesNotificationText.classList.toggle('hidden')
  fetchInatSpeciesBtn.classList.toggle('disabled')

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

  globalWrite.templates.push({...author, author: meta.author})
  globalWrite.templates.push({...date, date: meta.date})
  globalWrite.templates.push({...location, location: meta.location})
  
  console.log(globalWrite)
}

fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)

const init = () => {

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

  const addSection = ({typeId, typeValue}) => {
    switch(typeId) {
      case 'h3':
        globalWrite.templates.push({ ...h3,  h3: typeValue },)
        break
      case 'textarea':
        const ps = typeValue.split('\n').filter(p => p.length > 0)
        const paras = ps.map(p => {
          return {
            p
          }
        })
        globalWrite.templates.push({...text, paras})        
        break
    }
    console.log(globalWrite)
  }

  const handleInputChangeEvent = (e, addBtn) => {
    const inputValue = e.target.value
    updateAddBtnState({str: inputValue, btn: addBtn})
  }

  const handleTextareaChangeEvent = (e, addBtn) => {
    const textareaValue = e.target.value
    updateAddBtnState({str: textareaValue, btn: addBtn})
  }

  const selectType = e => {
    const sectionTemplate = document.getElementById('section-template')
    const parent = sectionTemplate.content.cloneNode(true)
    const legend = parent.querySelector('legend')
    const container = parent.querySelector('div')
    const addSectionBtn = parent.getElementById('addSectionBtn')

    const typeId = e.target.value
    const typeTemplate = document.getElementById(`${typeId}-template`)
    const type = typeTemplate.content.cloneNode(true)

    let input, texarea = null

    switch(typeId) {
      case 'h3':
        input = type.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', () => addSection({typeId, typeValue:input.value}), true)
        break
      case 'h4':
        input = type.querySelector('input')
        input.addEventListener('input', e => handleInputChangeEvent(e, addSectionBtn), true)
        break
      case 'textarea':
        texarea = type.querySelector('textarea')
        texarea.addEventListener('input', e => handleTextareaChangeEvent(e, addSectionBtn), true)
        addSectionBtn.addEventListener('click', () => addSection({typeId, typeValue:texarea.value}), true)
        break
    }  
    
    legend.innerText = typeId        
    container.appendChild(type)

    editView.appendChild(parent)
    editView.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })    
  }

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', selectType, true))
}

init()

