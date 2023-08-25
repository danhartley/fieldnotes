import { 
      guideResources
    , snapSpeciesTraits
    , getByAutocomplete
    , getInatObservations
    , getInatTaxa
} from './api.js'

const g = {
    ICONIC_TAXA: [
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
    ],
    taxa: [],
    LANGUAGES: [
        { name: 'Deutsche', id: 'de' },
        { name: 'English', id: 'en' },
        { name: 'Español', id: 'es' },
        { name: 'Français', id: 'fr' },
        { name: 'Italiano', id: 'it' },
        { name: 'Português', id: 'pt' },
        { name: 'Slovenščina', id: 'sl' },
    ],
    language: null,
    templates: [
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
    ],
    template: null,
    count: 10,
    species: [],
    targets: [
        {
            id: 'common',
            name: 'common name',
        },
        {
            id: 'latin',
            name: 'latin name',
        },
    ],
    target: null,
    showFilters: true,
    showLesson: true,
    showScore: true,
    showPreferences: true,
    guides: [
        {
            id: 'danielhartley',
            name: 'Daniel Hartley',
            lessons: [
                {
                    id: 1
                }
            ]
        }
    ],
    guide: null,
    inatSpecies: [],
    inatAutocompleteOptions: [
        {
            id: 'users',
            name: 'user',
            prop: 'login',
            placeholder: 'Username or user ID',
            isActive: false,
            user: null,
        },
        {
            id: 'places',
            name: 'place',
            prop: 'display_name',
            placeholder: 'Location',
            isActive: false,
            place: null,
        },
        {
            id: 'projects',
            name: 'project',
            placeholder: 'Name or URL slug, e.g. my-project',
            prop: '',
            isActive: false,
            project: null,
        }
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
    matches: []
}

g.template = g.templates[1]
g.target = g.targets[0]
g.taxa = g.ICONIC_TAXA
g.guide = g.guides[0]
g.language = g.LANGUAGES[1]

const debounce = (func, wait) => {
    let timeout

    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout)
        func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

const getInatSpecies = async ({user, place}) => {    
    return await getInatObservations({ 
        user_id: user ? user.id : null,
        place_id: place ? place.id : null,
        iconic_taxa: g.taxa,
        per_page: g.count + 10,
        locale: g.language.id,
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
    return g.inatSpecies
        .filter(sp => sp.taxon)
        .filter(sp => sp.taxon.preferred_common_name)
        .filter(sp => sp.taxon.default_photo)
        .filter(sp => g.taxa.map(t => t.name).includes(sp.taxon.iconic_taxon_name.toLowerCase()))
        .slice(0,g.count)
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
        const sp = g.species.find(s => s.taxon.id === Number(answer.id))

        if(!sp) return

        let isCorrect = false

        if(answer.value.length) {
            isCorrect = g.target.name === 'common name' 
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

    // if(item.id == checked.id) {
    //     input.setAttribute('checked', true)
    // }

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
    
    g.ICONIC_TAXA.forEach(taxon => {
        const clone = t.content.cloneNode(true)
    
        const div = clone.querySelector('div')
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'taxa')
        input.id = taxon.name
        input.value = taxon.name
        label.textContent = taxon.name
        label.setAttribute('for', taxon.name)
    
        if(g.taxa.map(t => t.name).includes(taxon.name)) {
            input.setAttribute('checked', true)
        }
    
        const bgColour = getComputedStyle(document.documentElement).getPropertyValue(`--${taxon.name.toLowerCase()}`)
        div.style.setProperty("background-color", bgColour)
    
        parent.appendChild(clone)
    })
}

const attachListenersToInatParams = () => {
    const cbInatParamGroup = document.querySelectorAll('input[name="inat-param"]')

    cbInatParamGroup.forEach(cb => {
        cb.addEventListener('click', e => {
            const name = e.target.value
            g.inatAutocompleteOptions.forEach(option => {
                if(option.name === name) {
                    option.isActive = !option.isActive
                }
            })
        })
    })
}

const createInatParamsCheckboxGroup = () => {
    const parent = document.getElementById('inat-params')
    const t = document.getElementById('checkbox-template')

    parent.innerHTML = ''

    g.inatAutocompleteOptions.filter(param => param.isActive).forEach(param => {
        const clone = t.content.cloneNode(true)

        const div = clone.querySelector('div')
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'inat-param')
        input.id = param.id
        if(param.isActive) input.setAttribute('checked', true)
        input.value = param.name
        label.textContent = param[param.name][param.prop]
        label.setAttribute('for', param.name)

        parent.appendChild(clone)
    })

    attachListenersToInatParams()
}

const createRadioLessonGroup = () => {
    const addHandlers = () => {
        const rbGroupLesson = document.querySelectorAll('input[name="lesson"]')
    
        rbGroupLesson.forEach(rb => {
            rb.addEventListener('change', e => {
            template = g.templates.find(t => t.id === e.target.value) 
                        
            startLesson()
        
            template.isTest 
                ? checkAnswersBtn.classList.remove('hidden')
                : checkAnswersBtn.classList.add('hidden')
            })
        })
    }

    const filters = document.getElementById('lesson-filters')

    g.templates.forEach(lesson => {
        const clone = rbTemplate.content.cloneNode(true)
    
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'lesson')
        input.id = lesson.name
        input.value = lesson.id
    
        label.textContent = lesson.name.replaceAll('-', ' ')
        label.setAttribute('for', lesson.name)
    
        if(lesson.id === g.template.id) {
            input.setAttribute('checked', true)
        }
    
        filters.appendChild(clone)
    })

    addHandlers()
}

const startLesson = () => {
    let parent = document.getElementById(g.template.parent)
    let templateToClone = document.getElementById(g.template.id) 
    
    document.querySelectorAll('.js-template').forEach(t => t.innerHTML = '')

    const bgColour = taxon => {
      return getComputedStyle(document.documentElement).getPropertyValue(`--${taxon.toLowerCase()}`)
    }

    switch(g.template.id) {
      case 'species-card-template':
        g.species.forEach((sp, i) => {
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
        g.species.forEach(sp => {
          const clone = templateToClone.content.cloneNode(true)
          const li = clone.querySelector('li')
          
          li.textContent = sp.taxon.name
          
          parent.appendChild(clone)
        })
        break
      case 'species-card-test-template':
        g.species.forEach((sp, i) => {
          const clone = templateToClone.content.cloneNode(true)

          const span = clone.querySelector('span')
          const label = clone.querySelector('label')
          const input = clone.querySelector('input')
          const img = clone.querySelector('img')      
          const div = clone.querySelector('img + div')

          label.setAttribute('for', sp.taxon.id)
          input.setAttribute('id', sp.taxon.id)

          div.style.setProperty("background-color", bgColour(sp.taxon.iconic_taxon_name))
          
          switch(g.target.name) {
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
        const parent = document.getElementById(g.template.parent)
        const answers = Array.from(parent.getElementsByTagName('input'))          
        scoreLesson(answers)
        updateScore()
    }

    checkAnswersBtn.addEventListener('click', scoreHandler, false)

    const fetchCustomInatSpeciesBtn = document.getElementById('fetch-custom-inat-species-btn')

    const filterInatSpecies = async () => {
        const filters = Array.from(document.getElementById('iconic-taxa').querySelectorAll('input'))
        const f = filters.filter(t => t.checked)
        
        g.taxa = g.ICONIC_TAXA.filter(taxon => filters.filter(t => t.checked).map(t => t.id.toLowerCase()).includes(taxon.name))
        
        const user = g.inatAutocompleteOptions.find(o => o.id === 'users')
        const place = g.inatAutocompleteOptions.find(o => o.id === 'places')

        g.inatSpecies = await getInatSpecies({
            user: user.isActive ? user.user : null
            , place: place.isActive ? place.place : null
        })

        g.species = mapInatSpeciesToLTP()
    
        startLesson()
    }

    fetchCustomInatSpeciesBtn.addEventListener('click', filterInatSpecies, false)

    const rbInatAutocompleteGroup = document.querySelectorAll('input[name="inat-autocomplete"]')

    rbInatAutocompleteGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            g.inatAutocomplete = g.inatAutocompleteOptions.find(o => o.id === e.target.value)

            iNatAutocompleteInput.value = ''
            iNatAutocompleteInput.setAttribute('placeholder', g.inatAutocomplete.placeholder)
            iNatAutocompleteInput.focus()
        })
    })

    const rbTestForGroup = document.querySelectorAll('input[name="target"]')

    rbTestForGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            g.target = g.targets.find(t => t.id === e.target.value)
            startLesson()
        })
    })

    const rbGuideGroup = document.querySelectorAll('input[name="guide"]')

    rbGuideGroup.forEach(rb => {
                
        rb.addEventListener('change', async (e) => {
            let fss = document.querySelectorAll('.module-fs')
            if(fss) fss.forEach(f => f.classList.add('hidden'))
            
            g.guide = g.guides.find(t => t.id === e.target.value)            
            
            lesson.id = g.guide.lessons[0].id
 
            const results = guideResources.results.find(gl => gl.id === lesson.id)
            const taxaIds = results.taxa
                .filter(t => t.rank === 10)
                .map(t => t.id)
            const taxaNames = results.taxa
                .map(t => t.name)

            const taxa = await getInatTaxa({ taxaIds: taxaIds })

            g.species = taxa.results
                .filter(t => t.default_photo)
                .map(t => { 
                    if(taxaNames.includes(t.name)) {
                        return {
                            taxon: mapTaxon(t)
                        }
                    }
                })
    
            startLesson()
        })
    })

    const speciesCount = document.getElementById('species-count')

    speciesCount.value = g.count

    speciesCount.addEventListener('change', () => {
        g.count = Number(speciesCount.value)
    })

    const rbLanguageGroup = document.querySelectorAll('input[name="language"]')

    rbLanguageGroup.forEach(rb => {
        rb.addEventListener('change', () => g.language = g.LANGUAGES.find(l => l.id === rb.value))
    })

    toggleFilterCtrl({ ctrl: customGuideCtrl, state: g.showFilters, panelId: 'custom' })
    toggleFilterCtrl({ ctrl: curatedGuideCtrl, state: g.showFilters, panelId: 'curated' })
    toggleFilterCtrl({ ctrl: lessonCtrl, state: g.showLesson, panelId: 'lesson' })
    toggleFilterCtrl({ ctrl: displayCtrl, state: g.showLesson, panelId: 'display' })
    toggleFilterCtrl({ ctrl: progressCtrl, state: g.showScore, panelId: 'progress' })
    toggleFilterCtrl({ ctrl: preferencesCtrl, state: g.showPreferences, panelId: 'preferences' })

    addImgClickEventHandlers()

    iNatAutocompleteInput.addEventListener('input', debounce(async (e) => {
        while (iNatAutocompleteDatalist.firstChild) {
            iNatAutocompleteDatalist.removeChild(iNatAutocompleteDatalist.firstChild)
        }

        const { id, prop } = g.inatAutocomplete
        const strToComplete = e.target.value

        if(strToComplete.length < 3) return

        const data = await getByAutocomplete({ by: id, toComplete: strToComplete })
        
        g.matches = data.results
        
        g.matches.forEach(match => {
            const option = document.createElement('option')
            option.value = match[prop]
            iNatAutocompleteDatalist.appendChild(option)
        })   
    }, 350))

    iNatAutocompleteInput.addEventListener('change', e => {
        const { id, name, prop } = g.inatAutocomplete
        const match = e.target.value

        g.inatAutocompleteOptions.forEach(option => {
            if(option.id === id) {
                option.isActive = true
            }
        })

        if(match) {
            const option = g.inatAutocompleteOptions.find(option => option.id === id)
            option[name] = g.matches.find(m => m[prop] === match)

            createInatParamsCheckboxGroup()
        }
    })
})

const init = () => {
    createRadioGroup({collection: g.targets, checked:g.target, rbGroup:'target', parent:targetGroup})    
    createRadioGroup({collection: g.inatAutocompleteOptions, checked:g.inatAutocomplete, rbGroup:'inat-autocomplete', parent:inatAutocompleteGroup})    
    createRadioGroup({collection: g.guides, checked:g.guide, rbGroup:'guide', parent:guideGroup})
    createRadioGroup({collection: g.LANGUAGES, checked:g.language, rbGroup:'language', parent:languageGroup})

    createTaxaCheckboxGroup()
    createRadioLessonGroup()
    createInatParamsCheckboxGroup()
}

init()