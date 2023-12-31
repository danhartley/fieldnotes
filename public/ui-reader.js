import { 
      snapSpeciesTraits
    , getInatObservations
    , getInatTaxa
    , g
    , getFieldnotesStubs
    , getFieldnotesById
} from './api.js'

import { 
      handleInatAutocomplete
    , mapInatSpeciesToLTP
    , mapTaxon
    , getTaxonGroupColour
    , handleFieldsnotesAutocomplete
    , showNotificationsDialog
} from './ui-actions.js'

import {
      ButtonComponent
    , ButtonHideShowComponent
    , MenuNavComponent
} from './ui-components.js'

import { 
    Router
} from './router.js'

const init = () => {    
    const initGlobalRead = () => {
        const globalRead = {}
        Object.assign(globalRead, {
            ...g
          , iconicTaxa: g.ICONIC_TAXA
          , language: g.LANGUAGES[1]
          , useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0]          
          , template: g.templates.find(template => template.templateId === 'species-template')
      })
      return globalRead
    }

    const globalRead = initGlobalRead()

    const d = document   
        
    const ltpAutocompleteTitleInputText = d.getElementById('ltp-autocomplete-title-input-text')
    const ltpAutocompleteTitleDatalist = d.getElementById('ltp-autocomplete-title-data-list')
    const sectionsWithHeader = d.querySelectorAll('.section-with-header')
    const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')
    const lessonFieldsetLegend = d.querySelector('#lesson-fieldset > legend')
    const article = d.getElementById('article')
    const rbTemplate = d.getElementById('radio-button-template')
    const languageGroupContainer = d.getElementById('language-group-container')
    const inatAutocompleteGroupContainer = d.getElementById('inat-autocomplete-group-container')
    const inatUseObservationSpeciesCountGroupContainer = d.getElementById('inat-use-observations-species-count-group-container')
    const targetGroupContainer = d.getElementById('target-group-container')
    const targetsFieldset = d.getElementById('targets-fieldset')
    const speciesDisplayContainer = d.getElementById('species-display-container')
    const iNatAutocompleteInputText = d.getElementById('inat-autocomplete-input-text')
    const iNatAutocompleteDatalist = d.getElementById('inat-autocomplete-data-list')
    const searchInatObservationsNotificationText = d.getElementById('search-inat-observations-notification-text')
    const startDate = d.getElementById('observations-start-date')
    const endDate = d.getElementById('observations-end-date')
    const singleDate = d.getElementById('single-observations-input-date')
    const rbDateGroup = d.querySelectorAll('input[name="rbDate"]')

    const displayOptionsToggleVisibilityBtn = new ButtonHideShowComponent({
        elementId: 'display-options-toggle-visibility-btn'
    })    
    const contentToggleVisibilityBtn = new ButtonHideShowComponent({
        elementId: 'content-toggle-visibility-btn'
    })    
    const progressToggleVisibilityBtn = new ButtonHideShowComponent({
        elementId: 'progress-toggle-visibility-btn'
    })    
    const preferencesToggleVisibilityBtn = new ButtonHideShowComponent({
        elementId: 'preferences-toggle-visibility-btn'
    })
    const showTestBtn = new ButtonComponent({
          elementId: 'show-test-btn'        
    })
    const testSubmitBtn = new ButtonComponent({
          elementId: 'test-submit-btn'        
    })

    const getInatSpecies = async ({user, place}) => {
    
        let d1 = null
        let d2 = null
    
        switch(globalRead.dateOption) {
            case 'single':
                d2 = d1 = singleDate.value
            break
            case 'range':
                d1 = startDate.value
                d2 = endDate.value
            break
        }
    
        return await getInatObservations({ 
              user_id: user ? user.id : null
            , place_id: place ? place.id : null
            , iconic_taxa: globalRead.iconicTaxa
            , per_page: globalRead.count + 10
            , locale: globalRead.language.id
            , species_count: (globalRead.useObservationsSpeciesCount.id === "true")
            , d1
            , d2
        })
    }
    
    const scoreLesson = answers => {
        answers.forEach(answer => {
            const sp = globalRead.species.find(s => s.taxon.id === Number(answer.id))
    
            if(!sp) return
    
            let isCorrect = false
    
            if(answer.value.length) {
                isCorrect = globalRead.target.name === 'common name' 
                  ? sp.taxon.preferred_common_name.toLowerCase() === answer.value.toLowerCase()
                  : sp.taxon.name.toLowerCase() === answer.value.toLowerCase()            
            }
    
            const score = {
                id: sp.taxon.id
              , isCorrect
            }
    
            globalRead.template.scores.push(score)  
        })
    
        globalRead.template.score = globalRead.template.scores.filter(score => score.isCorrect)?.length || 0
    }
    
    const toggleView = ({e, matchedView}) => {
        const view = matchedView || e.target.dataset.view

        const sectionViews = d.querySelectorAll('section')
        sectionViews.forEach(v => v.classList.add('hidden'))
        
        const views = d.querySelectorAll(`.${view}`)
        views.forEach(v => v.classList.remove('hidden'))
        
        switch(view) {                    
            case 'fieldnotes-search-view':                
                iNatAutocompleteInputText.value = ''
                handleFieldsnotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, global: globalRead, fieldnotesStubsCallback: getFieldnotesStubs, importFieldnotesBtn})
                ltpAutocompleteTitleInputText.focus()
                globalRead.templates = g.templates.filter(template => template.types.includes('fieldnotes'))
                globalRead.template = globalRead.templates.find(template => template.templateId === 'fieldnotes-template')
                break
            case 'inaturalist-search-view':
                ltpAutocompleteTitleInputText.value = ''
                iNatAutocompleteInputText.focus()            
                globalRead.templates = g.templates.filter(template => template.types.includes('inatSearch'))
                globalRead.template = globalRead.templates.find(template => template.templateId === 'species-template')        
                break
            case 'preferences-view':
                const rbLanguageGroup = createRadioBtnGroup({collection: globalRead.LANGUAGES, checked:globalRead.language, rbGroup:'language', parent:languageGroupContainer})
                rbLanguageGroup.forEach(rb => {
                    rb.addEventListener('change', () => globalRead.language = globalRead.LANGUAGES.find(l => l.id === rb.value))
                })        
                break
        }
    
        // Reset the page
        sectionsWithHeader.forEach(sh => sh.classList.add('hidden'))
        article.innerHTML = ''
    }
    
    let rbTestForGroup, rbInatAutocompleteGroup, rbInatUseObservationSpeciesCountGroup    
    
    const createRadioBtnGroup = ({collection, checked, rbGroup, parent}) => {
        parent.innerHTML = ''

        collection.forEach(item => {
            const clone = rbTemplate.content.cloneNode(true)
    
            const input = clone.querySelector('input')
            const label = clone.querySelector('label')
    
            input.setAttribute('name', rbGroup)
            input.id = item.name || item.title
            input.value = item.fnId || item.id
            label.textContent = item.name || item.title
            label.htmlFor = input.id
            label.setAttribute('position', 'absolute')
            
            if(!!checked && (checked.id === item.id || checked.id === item.fnId)) {
                input.setAttribute('checked', true)
            }
    
            parent.appendChild(clone)
        })
    
        return d.querySelectorAll(`input[name="${rbGroup}"]`)
    }
    
    const addImgClickEventHandlers = () => {
        const speciesImages = d.querySelectorAll('img')
    
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
                e.globalRead. if there are 3 columns, and the user clicks the first, we have to off set 2 to get to the end
            */
            const i = img.getAttribute('data-i')
            const remainder = (Number(i) % colSpan)
            const offSet = remainder === 0 ? 0 : colSpan - remainder
            const endOfRowIndex = Number(i) + offSet
            
            const t = d.getElementById('species-detail-template')
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
                    const div = d.createElement('div')
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
            
            panel.scrollIntoView({ 
                  behavior: 'smooth'
                , block: 'end'
                , inline: 'nearest' 
            })
        }
    
        speciesImages.forEach(img => {
            img.addEventListener('click', e => showSpeciesDetails(img))
        })  
    }
    
    const resetTestOptions = () => {
        const cssClass = 'hidden'
        
        testSubmitBtn.hide()
        
        if(globalRead.template.isTestable) {
            showTestBtn.show()
            showTestBtn.setText({
                text: 'SHOW TESTS'
            })      
        } else {
            showTestBtn.hide()
            targetsFieldset.classList.add(cssClass)
        }
    }
    
    const createTaxaCheckboxGroup = () => {
        const parent = d.getElementById('iconic-taxa-container')
        const t = d.getElementById('checkbox-template')
        
        globalRead.ICONIC_TAXA.forEach(taxon => {
            const clone = t.content.cloneNode(true)
        
            const div = clone.querySelector('div')
            const input = clone.querySelector('input')
            const label = clone.querySelector('label')
        
            input.setAttribute('name', 'taxa')
            input.id = taxon.name
            input.value = taxon.name
            label.textContent = taxon.name
            label.htmlFor = input.id
        
            if(globalRead.iconicTaxa.map(t => t.name).includes(taxon.name)) {
                input.setAttribute('checked', true)
            }
        
            div.style.setProperty("background-color", getTaxonGroupColour({taxon:taxon.name.toLowerCase()}))
        
            parent.appendChild(clone)
        })
    }
    
    const createRadioBtnTemplateGroup = () => {
        const addHandlers = () => {
            const rbGroupTemplate = d.querySelectorAll('input[name="display-option-template"]')
    
            rbGroupTemplate.forEach(template => {
                template.addEventListener('change', e => {
                    globalRead.template = globalRead.templates.find(t => t.templateId === e.target.value) 
                    resetTestOptions()
                    const toggleTestableTemplate = () => {      
                        globalRead.template = globalRead.templates.find(t => t.id === globalRead.template.pairedTemplateId)
    
                        if(globalRead.template.targets) {
                            targetGroupContainer.innerHTML = ''
                            targetsFieldset.classList.remove('hidden')
                            globalRead.target = globalRead.template.targets[0]
                            rbTestForGroup = createRadioBtnGroup({
                                  collection: globalRead.template.targets
                                , checked:globalRead.target
                                , rbGroup:'target'
                                , parent:targetGroupContainer
                            })
                            rbTestForGroup.forEach(test => {
                                test.addEventListener('change', e => {
                                    const testId = e.target.value
                                    globalRead.target = globalRead.template.targets.find(t => t.id === testId)
                                    renderDisplayTemplate()
                                })
                            })
                        }
    
                        if(globalRead.template.isTest) {
                            showTestBtn.setText({
                                text: 'HIDE TESTS'
                            })
                            testSubmitBtn.show()                 
                        } 
                        else {
                            showTestBtn.setText({
                                text: 'SHOW TESTS'
                            })   
                            testSubmitBtn.hide()
                        }
                        renderDisplayTemplate()
                    }
                    showTestBtn.addClickHandler({
                        clickHandler: toggleTestableTemplate
                    })                       
                    renderDisplayTemplate()                
                })
            })            
        }
        
        speciesDisplayContainer.innerHTML = ''
  
        globalRead.templates.filter(t => !t.isTest).forEach(t => {

            if(t.requiresSpecies && (!globalRead.species || globalRead.species.length === 0)) return

            const clone = rbTemplate.content.cloneNode(true)
        
            const input = clone.querySelector('input')
            const label = clone.querySelector('label')
    
            speciesDisplayContainer.classList.add('disabled')
        
            input.setAttribute('name', 'display-option-template')
            input.id = t.name
            input.value = t.templateId
            input.checked = t.templateId === 'fieldnotes-template'        
            label.textContent = t.name
            label.htmlFor = input.id
    
            if(globalRead.template && globalRead.template.templateId === t.templateId) {
                input.setAttribute('checked', true)
            }
        
            speciesDisplayContainer.appendChild(clone)
        })
    
        addHandlers()        
    }    
    
    const cloneSpeciesCardFromTemplate = ({templateToClone, species, index}) => {
        const clone = templateToClone.content.cloneNode(true)
    
        const img = clone.querySelector('img')      
        const figcaption = clone.querySelector('figcaption')
        const spans = figcaption.querySelectorAll('span')
     
        figcaption.style.setProperty("background-color", getTaxonGroupColour({
            taxon:species.taxon.iconic_taxon_name
        }))
    
        spans[0].textContent = species.taxon.preferred_common_name
        spans[1].textContent = species.taxon.name
        spans[1].classList.add('latin')
        
        const url = species.observation_url || species.taxon.default_photo.square_url
        img.src = url.replace('square', 'small')
        img.alt = species.taxon.name
        img.id = species.taxon.id
        img.setAttribute('data-i', index + 1)
        img.setAttribute('loading', 'lazy')
    
        return clone
    }
    
    const renderDisplayTemplate = () => {
        try {
            let parentTemplate = d.getElementById(globalRead.template.parent)
            let parentClone = parentTemplate.content.cloneNode(true)
            let templateToClone = d.getElementById(globalRead.template.templateId) 
            let parent = null

            sectionsWithHeader.forEach(sh => sh.classList.remove('hidden'))
                
            lessonFieldsetLegend.innerText = globalRead.template.name
        
            if(globalRead.species) article.innerHTML = ''
        
            switch(globalRead.template.templateId) {
                case 'species-template':
                    globalRead.species.forEach((sp, i) => {
                        const clone = cloneSpeciesCardFromTemplate({
                              templateToClone
                            , species: sp
                            , index: i
                        })
                        parent = parentClone.querySelector('div')
                        parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'species-list-template':            
                    globalRead.species.forEach(sp => {
                        const clone = templateToClone.content.cloneNode(true)
                        const li = clone.querySelector('li')
                        
                        li.textContent = sp.taxon.name
                
                        parent = parentClone.querySelector('div')          
                        parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'species-test-template':
                    globalRead.species.forEach((sp, i) => {
                        const clone = templateToClone.content.cloneNode(true)
            
                        const span = clone.querySelector('span')
                        const label = clone.querySelector('label')
                        const input = clone.querySelector('input')
                        const img = clone.querySelector('img')      
                        const div = clone.querySelector('img + figcaption')
            
                        input.id = sp.taxon.id
                        label.htmlFor = input.id
            
                        div.style.setProperty("background-color", getTaxonGroupColour({
                            taxon:sp.taxon.iconic_taxon_name
                        }))
                        
                        switch(globalRead.target.name) {
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
                        
                        img.src = sp.taxon.default_photo.square_url.replace('square', 'small')
                        img.alt = sp.taxon.name
                        img.id = sp.taxon.id
                        img.setAttribute('data-i', i + 1)
                        img.setAttribute('loading', 'lazy')
                        
                        parent = parentClone.querySelector('div')          
                        parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'fieldnotes-template':
                    // Display metadata from the fieldtrip to the fieldnotes
                    const metaTemplate = d.getElementById('meta-preview-template')
                    const metaClone = metaTemplate.content.cloneNode(true)
                    const metaList = metaClone.querySelector('ul')
                    const items = metaList.querySelectorAll('li > strong')
                    items[0].innerText = globalRead.fieldnotes.author
                    items[1].innerText = new Date(globalRead.fieldnotes.d1).toLocaleDateString('en-gb', { 
                          weekday: 'long'
                        , year: 'numeric'
                        , month: 'long'
                        , day: 'numeric'
                    })
                    const a = metaList.querySelector('a')
                    a.textContent = globalRead.fieldnotes.location.place_guess
                    a.setAttribute('href', `https://www.google.com/maps/place/${globalRead.fieldnotes.location.location}`)
                    article.appendChild(metaClone)
                    // Then iterate through the sections
                    globalRead.template.sections.forEach(section => {            
                        const template = d.getElementById(section.parent)
                        parentClone = template.content.cloneNode(true)
                        templateToClone = d.getElementById(section.templateId)
        
                        let clone, h3, h4, iframe, a
                        switch(section.templateId) {
                            case 'h3-preview-template':
                                clone = templateToClone.content.cloneNode(true)
                                h3 = clone.querySelector('h3')
                                h3.textContent = section.h3
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'h4-preview-template':
                                clone = templateToClone.content.cloneNode(true)
                                h4 = clone.querySelector('h4')
                                h4.textContent = section.h4
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'xenocanto-preview-template':
                                clone = templateToClone.content.cloneNode(true)
                                iframe = clone.querySelector('iframe')
                                iframe.src = `https://xeno-canto.org/${section.p}/embed?simple=1`
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'images-preview-template':
                                section.images.forEach(img => {
                                    const clone = templateToClone.content.cloneNode(true)
                                    const image = clone.querySelector('img')
                                    const caption = clone.querySelector('figcaption')
                                    image.src = img.src
                                    image.setAttribute('alt', img.alt)
                                    image.setAttribute('loading', 'eager')
                                    caption.textContent = img.alt
                                    parent = parentClone.querySelector('div')
                                    parent.appendChild(clone)
                                })
                                article.appendChild(parent)
                            break
                            case 'textarea-preview-template':
                                section.paras.forEach(text => {
                                    const clone = templateToClone.content.cloneNode(true)                      
                                    const md = clone.querySelector('p')
                                    md.textContent = text.p                            
                                    parent = parentClone.querySelector('div')
                                    parent.appendChild(clone)
                                })
                                article.appendChild(parent)
                                break
                            case 'species-preview-template':
                            case 'observations-preview-template':
                            case 'inat-lookup-preview-template':
                                section.species.forEach((sp, i) => {
                                    try {
                                        let s = globalRead.species.find(s => s.taxon.name === sp) || globalRead.species.find(s => s.taxon.name === sp) || globalRead.species.find(s => s.taxon.name === sp.name)
                                        if(sp.src) s.observation_url = sp.src
                                        const clone = cloneSpeciesCardFromTemplate({
                                              templateToClone
                                            , species: s || sp
                                            , index: i
                                        })
                                        parent = parentClone.querySelector('div')
                                        parent.appendChild(clone)
                                    } catch (e) {
                                        console.log('species', sp)
                                        console.log(e)
                                    }
                                })
                                article.appendChild(parent)
                            break
                            case 'terms-preview-template':
                                section.terms.forEach(term => {
                                    const clone = templateToClone.content.cloneNode(true)                      
                                    const dt = clone.querySelector('dt')
                                    const dd = clone.querySelector('dd')                        
                                    const div1 = clone.querySelectorAll('div')[0]
                                    const div2 = clone.querySelectorAll('div')[1]
                                    const eg = div1.querySelector('span')
                                    const dx = div1.querySelector('em')
                                    const ds = div2.querySelector('a')
        
                                    const def = globalRead.terms.find(t => t.dt === term || term.dt)
                                    
                                    dt.textContent = def.dt
                                    dd.textContent = def.dd
        
                                    if(def.dx) {                                
                                        eg.textContent = 'e.globalRead.'                                
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
                                article.appendChild(parent)
                            break
                        }
                    })
                    break
            }
            
            addImgClickEventHandlers()
        
            contentToggleVisibilityBtn.scrollIntoView({})
        } catch (e) {
            showNotificationsDialog({message: e.message, type: 'error'})
        }
    }     
    
    rbDateGroup.forEach(date => {
        date.addEventListener('click', e => {
            globalRead.dateOption = e.target.value
        }, true)
    })
    
    d.addEventListener("DOMContentLoaded", (event) => {
    
        const updateScore = () => {
            const scoreCountTd = d.getElementById('score-count-td')
            scoreCountTd.innerText = globalRead.species.length
            const scoreCorrectTd = d.getElementById('score-correct-td')
            scoreCorrectTd.innerText = globalRead.template.score
            const scoreIncorrectTd = d.getElementById('score-incorrect-td')
            scoreIncorrectTd.innerText = globalRead.species.length - globalRead.template.score
        }
    
        const scoreHandler = () => {
            const answers = Array.from(article.getElementsByTagName('input'))          
            scoreLesson(answers)
            updateScore()
        }
    
        testSubmitBtn.addClickHandler({
            clickHandler: scoreHandler
        })
    
        const fetchInatSpecies = async () => {
            const filters = Array.from(d.getElementById('iconic-taxa-container').querySelectorAll('input'))
            
            globalRead.iconicTaxa = globalRead.ICONIC_TAXA.filter(taxon => filters.filter(t => t.checked).map(t => t.id.toLowerCase()).includes(taxon.name))
            
            const user = globalRead.inatAutocompleteOptions.find(o => o.id === 'users')
            const place = globalRead.inatAutocompleteOptions.find(o => o.id === 'places')        
    
            searchInatObservationsNotificationText.classList.toggle('hidden')
            searchInatObservationsBtn.toggleActiveState()
    
            globalRead.inatSpecies = await getInatSpecies({
                  user: user.isActive ? user.user : null
                , place: place.isActive ? place.place : null
            })
    
            globalRead.species = mapInatSpeciesToLTP({
                  species: globalRead.inatSpecies
                , count: globalRead.count
                , taxa: globalRead.iconicTaxa
            })
        
            createRadioBtnTemplateGroup()
            renderDisplayTemplate()
    
            searchInatObservationsNotificationText.classList.toggle('hidden')
            searchInatObservationsBtn.toggleActiveState()
            speciesDisplayContainer.classList.toggle('disabled')
            const input = speciesDisplayContainer.querySelector('input')
            if(input) input.click()
        }
    
        const searchInatObservationsBtn = new ButtonComponent({
            elementId: 'search-inat-observations-btn'
          , clickHandler: fetchInatSpecies
        })
    
        rbInatAutocompleteGroup.forEach(rb => {
            rb.addEventListener('change', e => {
                globalRead.inatAutocomplete = globalRead.inatAutocompleteOptions.find(o => o.id === e.target.value)
    
                iNatAutocompleteInputText.value = ''
                iNatAutocompleteInputText.setAttribute('placeholder', globalRead.inatAutocomplete.placeholder)
            })
        })
    
        const speciesCountInputNumber = d.getElementById('species-count-input-number')
    
        speciesCountInputNumber.value = globalRead.count
    
        speciesCountInputNumber.addEventListener('change', () => {
            globalRead.count = Number(speciesCountInputNumber.value)
        })
        
        rbInatUseObservationSpeciesCountGroup.forEach(rb => {
            rb.addEventListener('change', () => globalRead.useObservationsSpeciesCount = globalRead.useObservationsSpeciesCountOptions.find(o => o.id === rb.value))
        })
    
        addImgClickEventHandlers()
    
        const { id, prop } = globalRead.inatAutocomplete
        handleInatAutocomplete({ 
              globalWrite:globalRead
            , inputText: iNatAutocompleteInputText
            , dataList: iNatAutocompleteDatalist
            // , g
            , id
            , prop
            , cbParent: d.getElementById('inat-params-input-check-box-group')
        })
    })

    rbInatAutocompleteGroup = createRadioBtnGroup({collection: globalRead.inatAutocompleteOptions, checked:globalRead.inatAutocomplete, rbGroup:'inat-autocomplete', parent:inatAutocompleteGroupContainer})        
    rbInatUseObservationSpeciesCountGroup = createRadioBtnGroup({collection: globalRead.useObservationsSpeciesCountOptions, checked:globalRead.useObservationsSpeciesCount, rbGroup:'inat-use-observations-species-count', parent:inatUseObservationSpeciesCountGroupContainer})

    createTaxaCheckboxGroup()

    const date = new Date()
    const month = date.getMonth() + 1
    const today = `${date.getFullYear()}-${month.length === 2 ? month : `0${month}`}-${("0" + date.getDate()).slice(-2)}`

    singleDate.value = today
    startDate.value = today
    endDate.value = today

    const setDateOption = date => {
        date.checked = true
        globalRead.dateOption = date.value
    }

    startDate.addEventListener('focus', () => {
        setDateOption(d.getElementById('rbDateRange'))
    }, true)

    endDate.addEventListener('focus', () => {
        setDateOption(d.getElementById('rbDateRange'))
    }, true)

    singleDate.addEventListener('focus', () => {
        setDateOption(d.getElementById('rbSingleDate'))
    }, true)

    const importFieldnotes = async () => {
        importFieldNotesNotificationText.classList.remove('hidden')

        const response = false 
        ? await globalRead.fieldnotesStubs
        : await getFieldnotesById({id: globalRead.fieldnotesStubs.fieldnotesId})

        importFieldNotesNotificationText.innerText = 'Fetching iNaturalist species…'

        setTimeout(() => {
            importFieldNotesNotificationText.classList.add('hidden')
            importFieldNotesNotificationText.innerText = 'Fetching fieldnotes…'
        }, 2000)

        if(!response.success) return 

        const fieldnotes = { 
              ...response.data
            , sections: response.data.sectionOrder.map(sectionIndex => {
                return response.data.sections.find(section => section.sectionIndex === sectionIndex)
            })  
        }

        globalRead.fieldnotes = fieldnotes
        globalRead.template = globalRead.templates.find(template => template.templateId === 'fieldnotes-template')
        Object.assign(globalRead.template, fieldnotes)

        const taxaIds = globalRead.fieldnotes.taxa
            .map(t => t.id)
        const taxaNames = globalRead.fieldnotes.taxa
            .map(t => t.name)

        const inatTaxa = await getInatTaxa({ 
              taxaIds
            , locale: globalRead.language.id 
        })
        
        globalRead.species = inatTaxa.results
            .filter(t => t.default_photo)
            .map(t => { 
                /**
                 * Only allow one name for a taxon
                 */
                if(taxaNames.includes(t.name)) {
                    return {
                        taxon: mapTaxon({
                            taxon: t
                        })
                    }
                }
            })
            .filter(t => t)
            
        createRadioBtnTemplateGroup()
        
        article.innerHTML = ''
        renderDisplayTemplate()
        speciesDisplayContainer.classList.remove('disabled')
    }

    const importFieldnotesBtn = new ButtonComponent({
        elementId: 'import-fieldnotes-btn'
      , clickHandler: importFieldnotes
    })

    createRadioBtnTemplateGroup()

    sectionsWithHeader.forEach(sh => sh.classList.toggle('hidden'))

    const routes = [
        {
              view: 'fieldnotes-search-view'
            , path: '/'
        },
        {
              view: 'fieldnotes-search-view'
            , path: '/fieldnotes'
        },
        {
              view: 'inaturalist-search-view'
            , path: '/inaturalist'
        },
        {
              view: 'preferences-view'
            , path: '/preferences'
        },
    ]
    
    const router = new Router({
          routes
        , callback: toggleView
    })    

    const links = d.querySelectorAll('menu > ul > li > a')
    links.forEach(link => {
        new MenuNavComponent({
            links,
            link,
            router
        })
    })
}

init()