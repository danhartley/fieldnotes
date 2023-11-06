import { 
, getByAutocomplete
, getInatObservations
, getInatTaxa
, inatControls
, g
} from './api.js'

Object.assign(g, {
taxa: g.ICONIC_TAXA,
language: g.LANGUAGES[1],
useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
})

const persistUserInputCheckBox = document.getElementById('persist-user-input-check-box')


