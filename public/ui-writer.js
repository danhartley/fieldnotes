import { 
  getByAutocomplete
, getInatObservations
, getInatTaxa
, inatControls
, g
} from './api.js'

let writeGlobal = {}

Object.assign(writeGlobal, {
  taxa: g.ICONIC_TAXA,
  language: g.LANGUAGES[1],
  useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
  species: [],
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

  const user = writeGlobal.inatAutocompleteOptions.find(o => o.id === 'users')

  writeGlobal.species = await getInatObservations({ 
      user_id: user.user.id,
      place_id: null,
      iconic_taxa: writeGlobal.taxa,
      per_page: 200,
      locale: writeGlobal.language.id,
      species_count: false,
      d1: singleDate.value,
      d2: singleDate.value,
  })

  fetchInatSpeciesNotificationText.classList.toggle('hidden')
  fetchInatSpeciesBtn.classList.toggle('disabled')

  if(writeGlobal.species.length === 0) return

  const ddAuthor = inatMetaDataDl.querySelector('dd:nth-child(2)')
  const ddDate = inatMetaDataDl.querySelector('dd:nth-child(4)')
  const ddLocation = inatMetaDataDl.querySelector('dd:nth-child(6)')

  ddAuthor.innerText = writeGlobal.species[0].user.name
  ddDate.innerText = writeGlobal.species[0].observed_on
  ddLocation.innerText = writeGlobal.species[0].place_guess

}

fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)

const init = () => {

  writeGlobal = {
    ...writeGlobal,
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

  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, g: writeGlobal})

  const addSection = typeId => {
    console.log(typeId)
  }

  const enableAddSectionBtn = e => {
    const inputValue = e.target.value

    inputValue.length > 0
      ? addSectionBtn.classList.remove('disabled')
      : addSectionBtn.classList.add('disabled')
  }

  const selectType = e => {
    const typeId = e.target.value
    const typeTemplate = document.getElementById(`${typeId}-template`)
    const type = typeTemplate.content.cloneNode(true)

    let input = null

    switch(typeId) {
      case 'h2':
        input = type.querySelector('input')
        input.addEventListener('input', enableAddSectionBtn, true)
        break
      case 'h3':
        input = type.querySelector('input')
        input.addEventListener('input', enableAddSectionBtn, true)
        break
    }
    
    const sectionTemplate = document.getElementById('section-template')
    const parent = sectionTemplate.content.cloneNode(true)    
    const legend = parent.querySelector('legend')
    const container = parent.querySelector('div')
    const addSectionBtn = parent.getElementById('addSectionBtn')
    
    legend.innerText = typeId
    addSectionBtn.addEventListener('click', () => addSection(typeId), true)
    
    container.appendChild(type)

    editView.appendChild(parent)
    editView.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })    
  }

  selectionTypeBtns.forEach(btn => btn.addEventListener('click', selectType, true))
}

init()

