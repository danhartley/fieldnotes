import { 
      snapSpeciesTraits
    , getByAutocomplete
    , getInatObservations
    , getInatTaxa
    , g
    , templates
} from './api.js'

Object.assign(g, {
    taxa: g.ICONIC_TAXA,
    language: g.LANGUAGES[1],
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

        g.template.scores.push(score)  
    })

    g.template.score = g.template.scores.filter(score => score.isCorrect).length
}

const toggleFilterCtrl = (({ ctrl, fieldsetId }) => {
    ctrl.addEventListener('click', () => {
        ctrl.classList.toggle('hide')
        ctrl.innerText = ctrl.innerText === 'HIDE' ? 'SHOW' : 'HIDE'

        const fieldset = document.getElementById(fieldsetId)
        fieldset.classList.toggle('hidden')
    })
})

const toggleLessonStyle = (({ ctrl, fieldsetId }) => {
    ctrl.addEventListener('click', () => {
        const fieldset = document.getElementById(fieldsetId)

        if(fieldset.classList.contains('hidden')) {
            
            fieldset.classList.toggle('hidden')

            let altFieldset

            switch(ctrl.value) {
                case 'Guides':
                    altFieldset = document.getElementById('inatSearchMain')
                    altFieldset.classList.toggle('hidden')                    
                    break
                case 'iNaturalist':
                    altFieldset = document.getElementById('curatedGuideMain')
                    altFieldset.classList.toggle('hidden')
                    g.templates = templates
                    break
            }
        }
        display.classList.add('disabled')
        g.templates = templates
        createRadioBtnTemplateGroup()
    })    
})

const lessonLegend = document.querySelector('#lesson > legend')
const speciesParent = document.getElementById('species-parent')
const rbTemplate = document.getElementById('radio-button-template')
const testSubmitBtn = document.getElementById('check-answers-btn')
const guideGroup = document.getElementById('guide-group')
const languageGroup = document.getElementById('language-group')
const inatAutocompleteGroup = document.getElementById('inat-autocomplete-group')
const display = document.getElementById('species-display')
const targetGroup = document.getElementById('target-group')
const iNatAutocompleteInput = document.getElementById('inat-autocomplete')
const iNatAutocompleteDatalist = document.getElementById('inat-autocomplete-list')
const inatSearchCtrl = document.getElementById('inatSearchCtrl')
const curatedGuideCtrl = document.getElementById('curatedGuideCtrl')
const lessonCtrl = document.getElementById('lessonCtrl')
const displayCtrl = document.getElementById('displayCtrl')
const progress = document.getElementById('progress')
const progressCtrl = document.getElementById('progressCtrl')
const preferencesCtrl = document.getElementById('preferencesCtrl')
const testbtn = document.getElementById('show-test-btn')
const targets = document.getElementById('targets')
const fetchInatSpeciesBtn = document.getElementById('fetch-inat-species-btn')
const fetchInatSpeciesNotification = document.getElementById('fetch-inat-species-notification')

let rbGuideGroup, rbTestForGroup, rbInatAutocompleteGroup, rbLanguageGroup

const createRadioBtnGroup = ({collection, checked, rbGroup, parent}) => {
    collection.forEach(item => {
        const clone = rbTemplate.content.cloneNode(true)

        const input = clone.querySelector('input')
        const label = clone.querySelector('label')

        input.setAttribute('name', rbGroup)
        input.id = item.name
        input.value = item.id
        label.textContent = item.name
        label.htmlFor = input.id
        label.setAttribute('position', 'absolute')
        
        if(!!checked && checked.id === item.id) {
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

const resetTestOptions = () => {
    const cssClass = 'hidden'
    
    testSubmitBtn.classList.add(cssClass)

    if(g.template.isTestable) {
        testbtn.classList.remove(cssClass)
        testbtn.innerText = 'SHOW TESTS'
    } else {
        testbtn.classList.add(cssClass)
        targets.classList.add(cssClass)
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
        label.htmlFor = input.id
    
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

        const input = clone.querySelector('input')
        const label = clone.querySelector('label')
        label.setAttribute('class', 'text-initial')
    
        input.setAttribute('name', 'inat-param')
        input.id = param.id
        if(param.isActive) input.setAttribute('checked', true)
        input.value = param.name
        label.textContent = param[param.name][param.prop]
        label.htmlFor = input.id

        parent.appendChild(clone)
    })

    attachListenersToInatParams()
}

const createRadioBtnTemplateGroup = () => {
    const addHandlers = () => {
        const rbGroupTemplate = document.querySelectorAll('input[name="template"]')        

        rbGroupTemplate.forEach(template => {
            template.addEventListener('change', e => {
                const templateId = e.target.value
                g.template = g.templates.find(t => t.id === templateId) 
                
                resetTestOptions()
                
                const toggleTestableTemplate = () => {      
                    g.template = g.templates.find(t => t.id === g.template.pairedTemplateId)

                    if(g.template.targets) {
                        targetGroup.innerHTML = ''
                        targets.classList.remove('hidden')
                        g.target = g.template.targets[0]
                        rbTestForGroup = createRadioBtnGroup({collection: g.template.targets, checked:g.target, rbGroup:'target', parent:targetGroup})
                        rbTestForGroup.forEach(test => {
                            test.addEventListener('change', e => {
                                const testId = e.target.value
                                g.target = g.template.targets.find(t => t.id === testId)
                                startLesson()
                            })
                        })
                    }

                    if(g.template.isTest) {
                        testbtn.innerText = 'HIDE TESTS'                
                        testSubmitBtn.classList.remove('hidden')                        
                    } 
                    else {
                        testbtn.innerText = 'SHOW TESTS'                  
                        testSubmitBtn.classList.add('hidden')
                    }

                    progress.classList.toggle('disabled')

                    startLesson()
                }

                testbtn.addEventListener('click', toggleTestableTemplate, true)
                            
                startLesson()                
            })
        })
    }
    
    display.innerHTML = ''

    g.templates.filter(t => !t.isTest).forEach(t => {
        const clone = rbTemplate.content.cloneNode(true)
    
        const input = clone.querySelector('input')
        const label = clone.querySelector('label')

        display.classList.add('disabled')
    
        input.setAttribute('name', 'template')
        input.id = t.name
        input.value = t.id
    
        label.textContent = t.name.replaceAll('-', ' ')
        label.htmlFor = input.id

        if(g.template && g.template.id === t.id) {
            input.setAttribute('checked', true)
        }
    
        display.appendChild(clone)
    })

    addHandlers()
}

const bgColour = taxon => {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${taxon.toLowerCase()}`)
}

const cloneSpeciesCardFromTemplate = ({templateToClone, species, index}) => {
    const clone = templateToClone.content.cloneNode(true)

    const spans = clone.querySelectorAll('span')
    const img = clone.querySelector('img')      
    const div = clone.querySelector('img + div')
 
    div.style.setProperty("background-color", bgColour(species.taxon.iconic_taxon_name))

    spans[0].textContent = species.taxon.preferred_common_name
    spans[1].textContent = species.taxon.name
    spans[1].classList.add('latin')
    
    img.src = species.taxon.default_photo.medium_url
    img.alt = species.taxon.name
    img.id = species.taxon.id
    img.setAttribute('data-i', index + 1)
    img.setAttribute('loading', 'lazy')

    return clone
}

const startLesson = () => {
    if(!g.template) return

    let template = document.getElementById(g.template.parent)
    let parentClone = template.content.cloneNode(true)
    let templateToClone = document.getElementById(g.template.id) 
    let parent = null
        
    lessonLegend.innerText = g.template.name.replaceAll('-', ' ')

    if(g.species) speciesParent.innerHTML = ''

    switch(g.template.id) {
    case 'species-card-template':
        g.species.forEach((sp, i) => {
            const clone = cloneSpeciesCardFromTemplate({templateToClone, species: sp, index: i})
            parent = parentClone.querySelector('div')          
            parent.appendChild(clone)
        })
        speciesParent.appendChild(parent)
        break
    case 'species-list-template':            
        g.species.forEach(sp => {
          const clone = templateToClone.content.cloneNode(true)
          const li = clone.querySelector('li')
        
          li.textContent = sp.taxon.name

          parent = parentClone.querySelector('div')          
          parent.appendChild(clone)
        })
        speciesParent.appendChild(parent)
        break
    case 'species-card-test-template':
        g.species.forEach((sp, i) => {
            const clone = templateToClone.content.cloneNode(true)

            const span = clone.querySelector('span')
            const label = clone.querySelector('label')
            const input = clone.querySelector('input')
            const img = clone.querySelector('img')      
            const div = clone.querySelector('img + div')

            input.id = sp.taxon.id
            label.htmlFor = input.id

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
            
            parent = parentClone.querySelector('div')          
            parent.appendChild(clone)
        })
        speciesParent.appendChild(parent)
        break
    }
    
    if(g.template.type === 'guide') {
        g.template.sections.forEach(section => {            
            section.templates.forEach(t => {
                template = document.getElementById(t.parent)
                parentClone = template.content.cloneNode(true)
                templateToClone = document.getElementById(t.id)

                let clone, h3, h4 
                switch(t.type) {
                    case 'h3-header':
                        clone = templateToClone.content.cloneNode(true)
                        h3 = clone.querySelector('h3')
                        h3.textContent = t.h3
                        parent = parentClone.querySelector('div')
                        parent.appendChild(clone)
                        speciesParent.appendChild(parent)
                    break
                    case 'h4-header':
                        clone = templateToClone.content.cloneNode(true)
                        h4 = clone.querySelector('h4')
                        h4.textContent = t.h4
                        parent = parentClone.querySelector('div')
                        parent.appendChild(clone)
                        speciesParent.appendChild(parent)
                    break
                    case 'img':
                        t.imgs.forEach(img => {
                            const clone = templateToClone.content.cloneNode(true)
                            const image = clone.querySelector('img')
                            const caption = clone.querySelector('figcaption')
                            image.src = img.src
                            if(img.contain) image.classList.add('object-fit-contain')
                            image.setAttribute('alt', img.alt)
                            image.setAttribute('loading', 'eager')
                            caption.textContent = img.alt
                            parent = parentClone.querySelector('div')
                            parent.appendChild(clone)
                        })
                        speciesParent.appendChild(parent)
                    break
                    case 'text':
                        t.texts.forEach(text => {
                            const clone = templateToClone.content.cloneNode(true)                      
                            const p = clone.querySelector('p')
                            p.textContent = text.text                            
                            parent = parentClone.querySelector('div')
                            parent.appendChild(clone)
                        })
                        speciesParent.appendChild(parent)
                        break
                    case 'species':
                        t.species.forEach((sp, i) => {
                            try{
                                const s = g.species.find(s => s.taxon.name === sp)
                                const clone = cloneSpeciesCardFromTemplate({templateToClone, species: s, index: i})
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                            } catch (e) {
                                console.log('species', sp)
                                console.log(e)
                            }
                        })
                        speciesParent.appendChild(parent)
                    break
                    case 'term':
                        t.terms.forEach(term => {
                            const clone = templateToClone.content.cloneNode(true)                      
                            const dt = clone.querySelector('dt')
                            const dd = clone.querySelector('dd')                            
                            const div1 = clone.querySelectorAll('div')[0]
                            const div2 = clone.querySelectorAll('div')[1]
                            const eg = div1.querySelector('span')
                            const dx = div1.querySelector('em')
                            const ds = div2.querySelector('a')

                            const def = g.terms.find(t => t.dt === term)
                            
                            dt.textContent = def.dt
                            dd.textContent = def.dd

                            if(def.dx) {                                
                                eg.textContent = 'e.g.'                                
                                dx.append(def.dx.join(', '))
                            } else {
                                clone.removeChild(div1)
                            }
                            if(def.ds) {
                                const spans = ds.querySelectorAll('span')                                 
                                spans[0].textContent = def.da || 'Source'
                                ds.setAttribute('href', def.ds)
                                ds.setAttribute('target', '_blank')
                            } else {
                                clone.removeChild(div2)
                            }

                            parent = parentClone.querySelector('dl')
                            parent.appendChild(clone)                            
                        })
                        speciesParent.appendChild(parent)
                    break
                }
            })
        })
    }

    addImgClickEventHandlers()

    lessonCtrl.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
}       

document.addEventListener("DOMContentLoaded", (event) => {

    const updateScore = () => {
        const scoreCount = document.getElementById('score-count')
        scoreCount.innerText = g.species.length
        const scoreCorrect = document.getElementById('score-correct')
        scoreCorrect.innerText = g.template.score
        const scoreIncorrect = document.getElementById('score-incorrect')
        scoreIncorrect.innerText = g.species.length - g.template.score
    }

    const scoreHandler = () => {
        const parent = document.getElementById('species-parent')
        const answers = Array.from(parent.getElementsByTagName('input'))          
        scoreLesson(answers)
        updateScore()
    }

    testSubmitBtn.addEventListener('click', scoreHandler, false)

    const fetchInatSpecies = async () => {
        const filters = Array.from(document.getElementById('iconic-taxa').querySelectorAll('input'))
        const f = filters.filter(t => t.checked)
        
        g.taxa = g.ICONIC_TAXA.filter(taxon => filters.filter(t => t.checked).map(t => t.id.toLowerCase()).includes(taxon.name))
        
        const user = g.inatAutocompleteOptions.find(o => o.id === 'users')
        const place = g.inatAutocompleteOptions.find(o => o.id === 'places')        

        fetchInatSpeciesNotification.classList.toggle('hidden')
        fetchInatSpeciesBtn.classList.toggle('disabled')

        g.inatSpecies = await getInatSpecies({
            user: user.isActive ? user.user : null
            , place: place.isActive ? place.place : null
        })

        g.species = mapInatSpeciesToLTP()
    
        startLesson()

        fetchInatSpeciesBtn.classList.toggle('disabled')
        fetchInatSpeciesNotification.classList.toggle('hidden')
        display.classList.toggle('disabled')
        display.querySelector('input').click()
    }

    fetchInatSpeciesBtn.addEventListener('click', fetchInatSpecies, false)

    rbInatAutocompleteGroup.forEach(rb => {
        rb.addEventListener('change', e => {
            g.inatAutocomplete = g.inatAutocompleteOptions.find(o => o.id === e.target.value)

            iNatAutocompleteInput.value = ''
            iNatAutocompleteInput.setAttribute('placeholder', g.inatAutocomplete.placeholder)
        })
    })

    const rbGuideGroupEventHander = rb => {
        rb.addEventListener('change', async (e) => {
            g.guide = g.guides.find(t => t.id === e.target.value)
            g.templates = g.guide.templates
 
            const taxaIds = g.guide.taxa
                .map(t => t.id)
            const taxaNames = g.guide.taxa
                .map(t => t.name)

            const inatTaxa = await getInatTaxa({ taxaIds, locale: g.language.id })

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
                .filter(t => t)
    
                
            createRadioBtnTemplateGroup()
            display.classList.remove('disabled')
            startLesson()
        })
    }

    rbGuideGroup.forEach(rb => rbGuideGroupEventHander(rb))

    const speciesCount = document.getElementById('species-count')

    speciesCount.value = g.count

    speciesCount.addEventListener('change', () => {
        g.count = Number(speciesCount.value)
    })

    rbLanguageGroup.forEach(rb => {
        rb.addEventListener('change', () => g.language = g.LANGUAGES.find(l => l.id === rb.value))
    })

    toggleLessonStyle({ ctrl: inatSearchCtrl, fieldsetId: 'inatSearchMain' })
    toggleLessonStyle({ ctrl: curatedGuideCtrl, fieldsetId: 'curatedGuideMain' })

    toggleFilterCtrl({ ctrl: displayCtrl, fieldsetId: 'display' })
    toggleFilterCtrl({ ctrl: lessonCtrl, fieldsetId: 'lesson' })
    toggleFilterCtrl({ ctrl: progressCtrl, fieldsetId: 'progress' })
    toggleFilterCtrl({ ctrl: preferencesCtrl, fieldsetId: 'preferences' })

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
    createRadioBtnTemplateGroup()
    createInatParamsCheckboxGroup()
}

init()