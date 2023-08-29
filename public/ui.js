import { 
      snapSpeciesTraits
    , getByAutocomplete
    , getInatObservations
    , getInatTaxa
    , g
} from './api.js'

Object.assign(g, {
    taxa: g.ICONIC_TAXA,
    language: g.LANGUAGES[5],
    template: g.templates[0],
    guide: g.guides[0],
    // move score under template too (and rename?)
})

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

        g.lesson.scores.push(score)        
    })

    g.lesson.score = g.lesson.scores.filter(score => score.isCorrect).length
}

const toggleFilterCtrl = (({ ctrl, panelId }) => {
    ctrl.addEventListener('click', () => {
        ctrl.classList.toggle('hide')

        const panel = document.getElementById(panelId)
        panel.classList.toggle('hidden')
    }
)})

const rbTemplate = document.getElementById('radio-button-template')
const checkAnswersBtn = document.getElementById('check-answers-btn')
const guideGroup = document.getElementById('guide-group')
const languageGroup = document.getElementById('language-group')
const inatAutocompleteGroup = document.getElementById('inat-autocomplete-group')
const iNatAutocompleteInput = document.getElementById('inat-autocomplete')
const iNatAutocompleteDatalist = document.getElementById('inat-autocomplete-list')
const customGuideCtrl = document.getElementById('customGuideCtrl')
const curatedGuideCtrl = document.getElementById('curatedGuideCtrl')
const lessonCtrl = document.getElementById('lessonCtrl')
const displayCtrl = document.getElementById('displayCtrl')
const progressCtrl = document.getElementById('progressCtrl')
const preferencesCtrl = document.getElementById('preferencesCtrl')
const testbtn = document.getElementById('show-test-btn')

let rbGuideGroup, rbTestForGroup, rbInatAutocompleteGroup, rbLanguageGroup

const createRadioBtnGroup = ({collection, checked, rbGroup, parent}) => {
    collection.forEach(item => {
    const clone = rbTemplate.content.cloneNode(true)

    const input = clone.querySelector('input')
    const label = clone.querySelector('label')

    input.setAttribute('name', rbGroup)
    input.id = item.id
    input.value = item.id
    label.textContent = item.name
    label.setAttribute('for', item.id)

    if(collection.length > 1 && item.id == checked.id) {
        input.setAttribute('checked', true)
    }

    parent.appendChild(clone)
    })

    return document.querySelectorAll(`input[name="${rbGroup}"]`)
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

const showOrHideTestOption = ({ element, condition, css }) => {
    if(condition) {
        element.classList.remove(css)
    } else {
        element.classList.add(css)
    }
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
    
        /**
         * Only allow a radio button to be pre-selected if there is more than one in the group
         */
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

const createRadioBtnLessonGroup = () => {
    const addHandlers = () => {
        const rbGroupTemplate = document.querySelectorAll('input[name="template"]')        

        rbGroupTemplate.forEach(rb => {
            rb.addEventListener('change', e => {
            g.template = g.templates.find(t => t.id === e.target.value) 
                        
            showOrHideTestOption({element: testbtn, condition: g.template.isTestable, css: 'hidden'})
            
            testbtn.addEventListener('click', () => {
                if(g.template.isTestable) {
                    g.template = g.templates.find(t => t.id === g.template.testTemplateId)

                    if(g.template.targets) {
                        const targetGroup = document.getElementById('target-group')
                        targetGroup.innerHTML = ''
                        g.target = g.template.targets[0]
                        rbTestForGroup = createRadioBtnGroup({collection: g.template.targets, checked:g.target, rbGroup:'target', parent:targetGroup})
                        rbTestForGroup.forEach(rb => {
                            rb.addEventListener('change', e => {
                                g.target = g.template.targets.find(t => t.id === e.target.value)
                                startLesson()
                            })
                        })
                    }

                    testbtn.innerHTML = 'Hide test'
                } else {
                    g.template = g.templates.find(t => t.id === g.template.testedTemplateId)

                    testbtn.innerHTML = 'Show test'
                }

                startLesson()
            })
                        
            startLesson()
            })
        })
    }

    const display = document.getElementById('species-display')
    display.innerHTML = ''

    g.templates.filter(t => !t.isTest).forEach(t => {
        const clone = rbTemplate.content.cloneNode(true)
    
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
    
        input.setAttribute('name', 'template')
        input.id = t.name
        input.value = t.id
    
        label.textContent = t.name.replaceAll('-', ' ')
        label.setAttribute('for', t.name)
    
        if(t.id === g.template.id) {
            input.setAttribute('checked', true)
        }
    
        display.appendChild(clone)
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

    lessonCtrl.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
}       

document.addEventListener("DOMContentLoaded", (event) => {

    const updateScore = () => {
        const scoreCount = document.getElementById('score-count')
        scoreCount.innerText = g.species.length
        const scoreCorrect = document.getElementById('score-correct')
        scoreCorrect.innerText = g.lesson.score
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

    rbInatAutocompleteGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            g.inatAutocomplete = g.inatAutocompleteOptions.find(o => o.id === e.target.value)

            iNatAutocompleteInput.value = ''
            iNatAutocompleteInput.setAttribute('placeholder', g.inatAutocomplete.placeholder)
            iNatAutocompleteInput.focus()
        })
    })

    rbGuideGroup.forEach(rb => {
                
        rb.addEventListener('change', async (e) => {
            let fss = document.querySelectorAll('.module-fs')
            if(fss) fss.forEach(f => f.classList.add('hidden'))

            g.guide = g.guides.find(t => t.id === e.target.value)
            g.lesson.id = g.guide.lesson.id
            g.guide.templates.forEach(t => g.templates.push(t))
 
            const taxaIds = g.guide.taxa
                .filter(t => t.rank === 10)
                .map(t => t.id)
            const taxaNames = g.guide.taxa
                .map(t => t.name)

            const inatTaxa = await getInatTaxa({ taxaIds: taxaIds, locale: g.language.id })

            g.species = inatTaxa.results
                .filter(t => t.default_photo)
                .map(t => { 
                    /**
                     * Only allow one name for a taxon
                     */
                    if(taxaNames.includes(t.name)) {
                        return {
                            taxon: mapTaxon(t)
                        }
                    }
                })
                /**
                 * Remove undefined members
                 */
                .filter(t => t)
    
            createRadioBtnLessonGroup()
            startLesson()
        })        
    })

    const speciesCount = document.getElementById('species-count')

    speciesCount.value = g.count

    speciesCount.addEventListener('change', () => {
        g.count = Number(speciesCount.value)
    })

    rbLanguageGroup.forEach(rb => {
        rb.addEventListener('change', () => g.language = g.LANGUAGES.find(l => l.id === rb.value))
    })

    toggleFilterCtrl({ ctrl: customGuideCtrl, panelId: 'custom' })
    toggleFilterCtrl({ ctrl: curatedGuideCtrl, panelId: 'curated' })
    toggleFilterCtrl({ ctrl: displayCtrl, panelId: 'display' })
    toggleFilterCtrl({ ctrl: lessonCtrl, panelId: 'lesson' })
    toggleFilterCtrl({ ctrl: progressCtrl, panelId: 'progress' })
    toggleFilterCtrl({ ctrl: preferencesCtrl, panelId: 'preferences' })

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
    rbInatAutocompleteGroup = createRadioBtnGroup({collection: g.inatAutocompleteOptions, checked:g.inatAutocomplete, rbGroup:'inat-autocomplete', parent:inatAutocompleteGroup})    
    rbGuideGroup = createRadioBtnGroup({collection: g.guides, checked:g.guide, rbGroup:'guide', parent:guideGroup})
    rbLanguageGroup = createRadioBtnGroup({collection: g.LANGUAGES, checked:g.language, rbGroup:'language', parent:languageGroup})

    createTaxaCheckboxGroup()
    createRadioBtnLessonGroup()
    createInatParamsCheckboxGroup()
}

init()