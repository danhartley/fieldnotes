import { 
  getByAutocomplete
, getInatObservations
, getInatTaxa
, inatControls
, g
} from './api.js'

let obj = {}

Object.assign(obj, {
  taxa: g.ICONIC_TAXA,
  language: g.LANGUAGES[1],
  useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
  species: [],
})

import { handleInatAutocomplete } from './ui-actions.js'

const iNatAutocompleteInputText = document.getElementById('inat-autocomplete-input-text')
const iNatAutocompleteDatalist = document.getElementById('inat-autocomplete-data-list')
const singleDate = document.getElementById('observations-date')
const fetchInatSpeciesBtn = document.getElementById('fetch-inat-species-btn')

const fetchInatSpecies = async () => {
  const user = obj.inatAutocompleteOptions.find(o => o.id === 'users')

  obj.species = await getInatObservations({ 
    user_id: user.id,
    place_id: null,
    iconic_taxa: obj.taxa,
    per_page: 200,
    locale: obj.language.id,
    species_count: false,
    d1: singleDate.value,
    d2: singleDate.value,
})
}

fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)

const init = () => {

  obj = {
    ...obj,
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

  handleInatAutocomplete({ inputText: iNatAutocompleteInputText, dataList: iNatAutocompleteDatalist, g: obj})
}

init()

