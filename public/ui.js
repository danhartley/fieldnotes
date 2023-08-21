import { 
      snapModules
    , snapSpeciesTraits
    , getByAutocomplete
    , getInatObservations 
    , staticInatSpeciesData
} from './api.js'

const ICONIC_TAXA = [
    {
        name: 'fungi',
    },
    {
        name: 'amphibia',
    },
    {
        name: 'mammalia',
    },
    {
        name: 'plantae',
    },
    {
        name: 'insecta',
    },
    {
        name: 'aves',
    },
    {
        name: 'reptilia',
    },
]

const LANGUAGES = [
    { name: 'Deutsche', id: 'de' },
    { name: 'English', id: 'en' },
    { name: 'Español', id: 'es' },
    { name: 'Français', id: 'fr' },
    { name: 'Italiano', id: 'it' },
    { name: 'Português', id: 'pt' },
    { name: 'Slovenščina', id: 'sl' },
]

let templates = [
    {
        id: 'species-list-template',
        name: 'species-list',
        parent: 'species-list-parent',
        isTest: false,
    },
    {
        id: 'species-card-test-template',
        name: 'species-card-tests',
        parent: 'species-grid-parent',
        isTest: true,
    },
    {
        id: 'species-card-template',
        name: 'species-cards',
        parent: 'species-card-parent',
        isTest: false,
    },
]
let template = templates[1]
let count = 10
let species = []
let targets = [
    {
        id: 'common',
        name: 'common name',
    },
    {
        id: 'latin',
        name: 'latin name',
    },
]
let target = targets[0]
let taxa = ICONIC_TAXA
let showFilters = true
let showLesson = true
let showScore = true
let showPreferences = true
let guides = [
    {
        id: 'Susun_Weed',
        name: 'Susun Weed',
        description: 'Susun Weed - Wild Plant Identification',
        lessons: [{ id: 1008 }],
    },
    {
        id: 'Adam_Haritan',
        name: 'Adam Haritan',
        description: 'New To Mushroom Hunting? Start Here!',
        lessons: [{ id: 10012 }],
    },
    {
        id: 'Jag_Singh',
        name: 'Jag Singh',
        description: 'Daisy Creek Farms - 10 Indoor Herbs',
        lessons: [],
    },
]
let guide = guides[0]
let language = LANGUAGES[1]
let matches = []
let place = null
let place_id = null
let user = null
let user_id = null
let inatSpecies = []
let inatAutocompleteOptions = [
    {
        id: 'users',
        name: 'users',
        prop: 'login'
    },
    {
        id: 'places',
        name: 'places',
        prop: 'display_name'
    },
    {
        id: 'projects',
        name: 'projects',
    }
]
let inatAutocomplete = inatAutocompleteOptions[0]

const getInatSpecies = async () => {
    return await getInatObservations({ 
        user_id,
        place_id,
        iconic_taxa: taxa,
        per_page: count + 10,
        locale: language.id,
    })
}

const mapTaxon = taxon => {
    return {
        iconic_taxon_id: taxon.iconic_taxon_id,
        name: taxon.name,
        id: taxon.id,
        default_photo: taxon.default_photo,
        iconic_taxon_name: taxon.iconic_taxon_name,
        preferred_common_name: taxon.preferred_common_name
    }
}

const mapInatSpeciesToLTP = () => {
    return inatSpecies
        .filter(sp => sp.taxon)
        .filter(sp => sp.taxon.preferred_common_name)
        .filter(sp => sp.taxon.default_photo)
        .filter(sp => taxa.map(t => t.name).includes(sp.taxon.iconic_taxon_name.toLowerCase()))
        .slice(0,count)
        .map(sp => {
            return {
                count: sp.count,
                taxon: mapTaxon(sp.taxon)
            }
        })
}

const lesson = {
    id: 0,
    scores: [],
    score: 0,
}

const lessons = [
    lesson,
]

const scoreLesson = answers => {
    answers.forEach(answer => {
        const sp = species.find(s => s.taxon.id === Number(answer.id))

        if(!sp) return

        let isCorrect = false

        if(answer.value.length) {
            isCorrect = target.name === 'common name' 
              ? sp.taxon.preferred_common_name.toLowerCase() === answer.value.toLowerCase()
              : sp.taxon.name.toLowerCase() === answer.value.toLowerCase()            
        }

        const score = {
          id: sp.taxon.id,
          isCorrect,               
        }

        lesson.scores.push(score)        
    })

    lesson.score = lesson.scores.filter(score => score.isCorrect).length
}

const toggleFilterCtrl = (({ ctrl, state, panelId }) => {
    ctrl.addEventListener('click', () => {
    state = !state
    state 
      ? ctrl.classList.remove('hide')
      : ctrl.classList.add('hide')

    const panel = document.getElementById(panelId)

    state
      ? panel.classList.remove('hidden')
      : panel.classList.add('hidden')
    }
)})

const rbTemplate = document.getElementById('radio-button-template')
const checkAnswersBtn = document.getElementById('check-answers-btn')
const guideGroup = document.getElementById('guide-group')
const languageGroup = document.getElementById('language-group')
const targetGroup = document.getElementById('target-group')
const inatAutocompleteGroup = document.getElementById('inat-autocomplete-group')

const iNatAutocompleteInput = document.getElementById('inat-autocomplete')
const iNatAutocompleteDatalist = document.getElementById('inat-autocomplete-list')

const customGuideCtrl = document.getElementById('customGuideCtrl')
const curatedGuideCtrl = document.getElementById('curatedGuideCtrl')
const lessonCtrl = document.getElementById('lessonCtrl')
const displayCtrl = document.getElementById('displayCtrl')
const progressCtrl = document.getElementById('progressCtrl')
const preferencesCtrl = document.getElementById('preferencesCtrl')

const createRadioGroup = ({collection, checked, rbGroup, parent}) => {
    collection.forEach(item => {
    const clone = rbTemplate.content.cloneNode(true)

    const input = clone.querySelector('input')
    const label = clone.querySelector('label')

    input.setAttribute('name', rbGroup)
    input.id = item.id
    input.value = item.id
    label.textContent = item.name
    label.setAttribute('for', item.id)

    if(item.id == checked.id) {
        input.setAttribute('checked', true)
    }

    parent.appendChild(clone)
    })
}

const addImgClickEventHandlers = () => {
    const speciesImages = document.querySelectorAll('img')

    const showSpeciesDetails = img => { 
        const container = img.parentElement            
        const grid = container.parentElement
        const speciesPanel = grid.querySelector('.species-panel')
        /*
            If there is a species panel, remove it from the DOM
        */
        if(speciesPanel) speciesPanel.remove()

        /*
            Work out how many columns are in each row
        */
        const colSpan = Math.round((grid.clientWidth / img.clientWidth))
        
        /*
            Work out how many columns we need to count along the row
            e.g. if there are 3 columns, and the user clicks the first, we have to off set 2 to get to the end
        */
        const i = img.getAttribute('data-i')
        const remainder = (Number(i) % colSpan)
        const offSet = remainder === 0 ? 0 : colSpan - remainder
        const endOfRowIndex = Number(i) + offSet
        
        const t = document.getElementById('species-detail-template')
        const clone = t.content.cloneNode(true)
        const panel = clone.querySelector('div')
        const hgroup = clone.querySelector('div > hgroup')
        const name = clone.querySelector('hgroup > h3')
        const descrption = clone.querySelector('div > p')
        const speciesName = img.getAttribute('alt')
        const traits = snapSpeciesTraits.find(t => t.name === speciesName)
        
        let endOfRowCard = grid.querySelector(`[data-i="${endOfRowIndex}"]`)

        if(!endOfRowCard) {
            const cardCount = grid.querySelectorAll('div > img').length
            const cardDiff = endOfRowIndex - cardCount
            for(let j = 1; j <= cardDiff; j++) {
                const div = document.createElement('div')
                div.setAttribute('data-i', cardCount + j)
                grid.appendChild(div)
            }
            endOfRowCard = grid.querySelector(`[data-i="${endOfRowIndex}"]`)
        }

        const endOfRowContainer = endOfRowCard.parentElement
                    
        panel.setAttribute('style', `grid-column-start: span ${colSpan}`)

        name.textContent = speciesName

        descrption.textContent = traits
            ? traits?.description?.value[0] || ''
            : 'No data for this species are available'

        hgroup.appendChild(name)
        hgroup.appendChild(descrption)
        panel.appendChild(hgroup)

        endOfRowContainer.after(panel)       
        
        panel.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }

    speciesImages.forEach(img => {
        img.addEventListener('click', e => showSpeciesDetails(img))
    })  
}

const createTaxaCheckboxGroup = () => {
    const parent = document.getElementById('iconic-taxa')
    const t = document.getElementById('checkbox-template')
    
    ICONIC_TAXA.forEach(taxon => {
        const clone = t.content.cloneNode(true)
    
        const div = clone.querySelector('div')
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'taxa')
        input.id = taxon.name
        input.value = taxon.name
        label.textContent = taxon.name
        label.setAttribute('for', taxon.name)
    
        if(taxa.map(t => t.name).includes(taxon.name)) {
            input.setAttribute('checked', true)
        }
    
        const bgColour = getComputedStyle(document.documentElement).getPropertyValue(`--${taxon.name.toLowerCase()}`)
        div.style.setProperty("background-color", bgColour)
    
        parent.appendChild(clone)
    })
}

const createRadioLessonGroup = () => {
    const addHandlers = () => {
        const rbGroupLesson = document.querySelectorAll('input[name="lesson"]')
    
        rbGroupLesson.forEach(rb => {
            rb.addEventListener('change', e => {
            template = templates.find(t => t.id === e.target.value) 
                        
            startLesson()
        
            template.isTest 
                ? checkAnswersBtn.classList.remove('hidden')
                : checkAnswersBtn.classList.add('hidden')
            })
        })
    }

    const filters = document.getElementById('lesson-filters')

    templates.forEach(lesson => {
        const clone = rbTemplate.content.cloneNode(true)
    
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'lesson')
        input.id = lesson.name
        input.value = lesson.id
    
        label.textContent = lesson.name.replaceAll('-', ' ')
        label.setAttribute('for', lesson.name)
    
        if(lesson.id === template.id) {
            input.setAttribute('checked', true)
        }
    
        filters.appendChild(clone)
    })

    addHandlers()
}

const startLesson = () => {
    let parent = document.getElementById(template.parent)
    let templateToClone = document.getElementById(template.id) 
    
    document.querySelectorAll('.js-template').forEach(t => t.innerHTML = '')

    const bgColour = taxon => {
      return getComputedStyle(document.documentElement).getPropertyValue(`--${taxon.toLowerCase()}`)
    }

    switch(template.id) {
      case 'species-card-template':
        species.forEach((sp, i) => {
          const clone = templateToClone.content.cloneNode(true)

          const spans = clone.querySelectorAll('span')
          const img = clone.querySelector('img')      
          const div = clone.querySelector('img + div')

          div.style.setProperty("background-color", bgColour(sp.taxon.iconic_taxon_name))

          spans[0].textContent = sp.taxon.preferred_common_name
          spans[1].textContent = sp.taxon.name
          spans[1].classList.add('latin')
          
          img.src = sp.taxon.default_photo.medium_url
          img.alt = sp.taxon.name
          img.id = sp.taxon.id
          img.setAttribute('data-i', i + 1)
          img.setAttribute('loading', 'lazy')
          
          parent.appendChild(clone)
        })
        break
      case 'species-list-template':            
        species.forEach(sp => {
          const clone = templateToClone.content.cloneNode(true)
          const li = clone.querySelector('li')
          
          li.textContent = sp.taxon.name
          
          parent.appendChild(clone)
        })
        break
      case 'species-card-test-template':
        species.forEach((sp, i) => {
          const clone = templateToClone.content.cloneNode(true)

          const span = clone.querySelector('span')
          const label = clone.querySelector('label')
          const input = clone.querySelector('input')
          const img = clone.querySelector('img')      
          const div = clone.querySelector('img + div')

          label.setAttribute('for', sp.taxon.id)
          input.setAttribute('id', sp.taxon.id)

          div.style.setProperty("background-color", bgColour(sp.taxon.iconic_taxon_name))
          
          switch(target.name) {
            case 'common name':
              span.textContent = sp.taxon.name
              span.classList.add('latin')
              label.textContent = 'common name'
              break
            case 'latin name':
              if(sp.taxon.preferred_common_name) {
                span.textContent = sp.taxon.preferred_common_name
              } else {
                span.textContent = sp.taxon.name
                span.classList.add('latin')
              }
              label.textContent = 'latin name'
              break
          }
          
          img.src = sp.taxon.default_photo.medium_url
          img.alt = sp.taxon.name
          img.id = sp.taxon.id
          img.setAttribute('data-i', i + 1)
          img.setAttribute('loading', 'lazy')
          
          parent.appendChild(clone)
        })
        break
    }

    addImgClickEventHandlers()

    document.getElementById('lessonCtrl').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
}       

document.addEventListener("DOMContentLoaded", (event) => {

    const updateScore = () => {
        const scoreCount = document.getElementById('score-count')
        scoreCount.innerText = species.length
        const scoreCorrect = document.getElementById('score-correct')
        scoreCorrect.innerText = lesson.score
    }

    const scoreHandler = () => {
        const parent = document.getElementById(template.parent)
        const answers = Array.from(parent.getElementsByTagName('input'))          
        scoreLesson(answers)
        updateScore()
    }

    checkAnswersBtn.addEventListener('click', scoreHandler, false)

    const fetchCustomInatSpeciesBtn = document.getElementById('fetch-custom-inat-species-btn')

    const filterInatCustomSpecies = async () => {
        const filters = Array.from(document.getElementById('iconic-taxa').querySelectorAll('input'))
        const f = filters.filter(t => t.checked)
        taxa = ICONIC_TAXA.filter(taxon => filters.filter(t => t.checked).map(t => t.id.toLowerCase()).includes(taxon.name))

        inatSpecies = await getInatSpecies()

        species = mapInatSpeciesToLTP()
        
        startLesson()
    }

    fetchCustomInatSpeciesBtn.addEventListener('click', filterInatCustomSpecies, false)

    const rbInatAutocompleteGroup = document.querySelectorAll('input[name="inat-autocomplete"]')

    rbInatAutocompleteGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            inatAutocomplete = inatAutocompleteOptions.find(o => o.id === e.target.value)
            iNatAutocompleteInput.value = ''
            iNatAutocompleteInput.focus()
        })
    })

    const rbTestForGroup = document.querySelectorAll('input[name="target"]')

    rbTestForGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            target = targets.find(t => t.id === e.target.value)
            startLesson()
        })
    })

    const rbGuideGroup = document.querySelectorAll('input[name="guide"]')

    rbGuideGroup.forEach(rb => {
                
        rb.addEventListener('change', e => {
            let fss = document.querySelectorAll('.module-fs')
            if(fss) fss.forEach(f => f.classList.add('hidden'))
            guide = guides.find(t => t.id === e.target.value)            
            
            lesson.id = guide.lessons[0].id
            const results = snapModules.results.find(m => m.id === lesson.id)
            const names = results.species.map(sp => sp.name)
            
            species = staticInatSpeciesData
                .filter(taxon => names.includes(taxon.name))
                .map(taxon => { 
                    return {
                        taxon: mapTaxon(taxon)
                    }
            })                    
    
            startLesson()
        })
    })

    const speciesCount = document.getElementById('species-count')

    speciesCount.value = count

    speciesCount.addEventListener('change', () => {
        count = Number(speciesCount.value)
    })

    const rbLanguageGroup = document.querySelectorAll('input[name="language"]')

    rbLanguageGroup.forEach(rb => {
        rb.addEventListener('change', () => language = LANGUAGES.find(l => l.id === rb.value))
    })

    toggleFilterCtrl({ ctrl: customGuideCtrl, state: showFilters, panelId: 'custom' })
    toggleFilterCtrl({ ctrl: curatedGuideCtrl, state: showFilters, panelId: 'curated' })
    toggleFilterCtrl({ ctrl: lessonCtrl, state: showLesson, panelId: 'lesson' })
    toggleFilterCtrl({ ctrl: displayCtrl, state: showLesson, panelId: 'display' })
    toggleFilterCtrl({ ctrl: progressCtrl, state: showScore, panelId: 'progress' })
    toggleFilterCtrl({ ctrl: preferencesCtrl, state: showPreferences, panelId: 'preferences' })

    addImgClickEventHandlers()

    iNatAutocompleteInput.addEventListener('input', async (e) => {
        while (iNatAutocompleteDatalist.firstChild) {
            iNatAutocompleteDatalist.removeChild(iNatAutocompleteDatalist.firstChild);
        }

        const { id, prop } = inatAutocomplete
        const strToComplete = e.target.value
        const data = await getByAutocomplete({ by: id, toComplete: strToComplete })
        
        matches = data.results

        matches.forEach(match => {
            const option = document.createElement('option')
            option.value = match[prop]
            iNatAutocompleteDatalist.appendChild(option)
        })
    })

    iNatAutocompleteInput.addEventListener('change', e => {
        const { id, prop } = inatAutocomplete
        const name = e.target.value
                
        switch(id) {
            case 'users':
                user = matches.find(match => match[prop] === name)
                user_id = user.id
            break
            case 'places':
                place = matches.find(match => match[prop] === name)
                place_id = place.id
            break
        }        
    })
})

const init = () => {
    createRadioGroup({collection: targets, checked:target, rbGroup:'target', parent:targetGroup})    
    createRadioGroup({collection: inatAutocompleteOptions, checked:inatAutocomplete, rbGroup:'inat-autocomplete', parent:inatAutocompleteGroup})    
    createRadioGroup({collection: guides, checked:guide, rbGroup:'guide', parent:guideGroup})
    createRadioGroup({collection: LANGUAGES, checked:language, rbGroup:'language', parent:languageGroup})

    createTaxaCheckboxGroup()
    createRadioLessonGroup()
}

init()