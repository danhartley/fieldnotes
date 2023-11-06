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

import { handleInatAutocomplete, createInatParamsCheckboxGroup } from './ui-actions.js'

const persistUserInputCheckBox = document.getElementById('persist-user-input-check-box')


