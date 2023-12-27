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
    , toggleHideShow
    , handleFieldsnotesAutocomplete
    , showNotificationsDialog
} from './ui-actions.js'

import { templates } from './templates.js'

const init = () => {    
    Object.assign(g, {
        iconicTaxa: g.ICONIC_TAXA,
        language: g.LANGUAGES[1],
        useObservationsSpeciesCount: g.useObservationsSpeciesCountOptions[0],
    })

    const d = document   
        
    const fieldnotesInputRb = d.getElementById('fieldnotes-input-rb')
    const inatSearchInputRb = d.getElementById('inat-search-input-rb')
    const fieldnotesSearchView = d.getElementById('fieldnotes-search-view')
    const inatSearchView = d.getElementById('inat-search-view')
    const testView = d.getElementById('test-view')
    const ltpAutocompleteTitleInputText = d.getElementById('ltp-autocomplete-title-input-text')
    const ltpAutocompleteTitleDatalist = d.getElementById('ltp-autocomplete-title-data-list')
    const sectionsWithHeader = d.querySelectorAll('section:has(.section-header:not(.section-group))')
    const importFieldNotesBtn = d.getElementById('import-fieldnotes-btn')
    const importFieldNotesNotificationText = d.getElementById('import-fieldnotes-notification-text')
    const lessonToggleVisibilityBtn = d.getElementById('lesson-toggle-visibility-btn')
    const displayToggleVisibilityBtn = d.getElementById('display-toggle-visibility-btn')
    const progressFieldset = d.getElementById('progress-fieldset')
    const progressToggleVisibilityBtn = d.getElementById('progress-toggle-visibility-btn')
    const preferencesToggleVisibilityBtn = d.getElementById('preferences-toggle-visibility-btn')
    const lessonFieldsetLegend = d.querySelector('#lesson-fieldset > legend')
    const article = d.getElementById('article')
    const rbTemplate = d.getElementById('radio-button-template')
    const testSubmitBtn = d.getElementById('check-answers-btn')
    const languageGroupContainer = d.getElementById('language-group-container')
    const inatAutocompleteGroupContainer = d.getElementById('inat-autocomplete-group-container')
    const inatUseObservationSpeciesCountGroupContainer = d.getElementById('inat-use-observations-species-count-group-container')
    const targetGroupContainer = d.getElementById('target-group-container')
    const targetsFieldset = d.getElementById('targets-fieldset')
    const speciesDisplayContainer = d.getElementById('species-display-container')
    const iNatAutocompleteInputText = d.getElementById('inat-autocomplete-input-text')
    const iNatAutocompleteDatalist = d.getElementById('inat-autocomplete-data-list')
    const showTestBtn = d.getElementById('show-test-btn')
    const searchInatObservationsBtn = d.getElementById('search-inat-observations-btn')
    const searchInatObservationsNotificationText = d.getElementById('search-inat-observations-notification-text')
    const startDate = d.getElementById('observations-start-date')
    const endDate = d.getElementById('observations-end-date')
    const singleDate = d.getElementById('single-observations-input-date')
    const rbDateGroup = d.querySelectorAll('input[name="rbDate"]')

    const getInatSpecies = async ({user, place}) => {
    
        let d1 = null
        let d2 = null
    
        switch(g.dateOption) {
            case 'single':
                d2 = d1 = singleDate.value
            break
            case 'range':
                d1 = startDate.value
                d2 = endDate.value
            break
        }
    
        return await getInatObservations({ 
            user_id: user ? user.id : null,
            place_id: place ? place.id : null,
            iconic_taxa: g.iconicTaxa,
            per_page: g.count + 10,
            locale: g.language.id,
            species_count: (g.useObservationsSpeciesCount.id === "true"),
            d1,
            d2,
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
    
    const toggleView = e => {
        const view = e.target.value

        inatSearchView.classList.toggle('hidden')
        fieldnotesSearchView.classList.toggle('hidden')
        
        switch(view) {                    
            case 'fieldnotes':                
                ltpAutocompleteTitleInputText.focus()
                testView.classList.add('hidden')
                break
            case 'iNaturalist':
                iNatAutocompleteInputText.focus()            
                testView.classList.remove('hidden')
                break
        }
    
        // Reset the page
        speciesDisplayContainer.classList.add('disabled')
        g.templates = templates
        sectionsWithHeader.forEach(sh => sh.classList.add('hidden'))
        article.innerHTML = ''
    } 
    
    let rbTestForGroup, rbInatAutocompleteGroup, rbLanguageGroup, rbInatUseObservationSpeciesCountGroup
    handleFieldsnotesAutocomplete({ inputText: ltpAutocompleteTitleInputText, dataList: ltpAutocompleteTitleDatalist, global: g, fieldnotesStubsCallback: getFieldnotesStubs, importFieldNotesBtn}) 
    
    const createRadioBtnGroup = ({collection, checked, rbGroup, parent}) => {
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
            
            if(!!checked && checked.id === item.fnId) {
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
                e.g. if there are 3 columns, and the user clicks the first, we have to off set 2 to get to the end
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
            
            panel.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        }
    
        speciesImages.forEach(img => {
            img.addEventListener('click', e => showSpeciesDetails(img))
        })  
    }
    
    const resetTestOptions = () => {
        const cssClass = 'hidden'
        
        testSubmitBtn.classList.add(cssClass)
    
        if(g.template.isTestable) {
            showTestBtn.classList.remove(cssClass)
            showTestBtn.innerText = 'SHOW TESTS'
        } else {
            showTestBtn.classList.add(cssClass)
            targetsFieldset.classList.add(cssClass)
        }
    }
    
    const createTaxaCheckboxGroup = () => {
        const parent = d.getElementById('iconic-taxa-container')
        const t = d.getElementById('checkbox-template')
        
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
        
            if(g.iconicTaxa.map(t => t.name).includes(taxon.name)) {
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
                    g.template = g.templates.find(t => t.templateId === e.target.value) 
                    resetTestOptions()
                    const toggleTestableTemplate = () => {      
                        g.template = g.templates.find(t => t.id === g.template.pairedTemplateId)
    
                        if(g.template.targets) {
                            targetGroupContainer.innerHTML = ''
                            targetsFieldset.classList.remove('hidden')
                            g.target = g.template.targets[0]
                            rbTestForGroup = createRadioBtnGroup({collection: g.template.targets, checked:g.target, rbGroup:'target', parent:targetGroupContainer})
                            rbTestForGroup.forEach(test => {
                                test.addEventListener('change', e => {
                                    const testId = e.target.value
                                    g.target = g.template.targets.find(t => t.id === testId)
                                    renderDisplayTemplate()
                                })
                            })
                        }
    
                        if(g.template.isTest) {
                            showTestBtn.innerText = 'HIDE TESTS'                
                            testSubmitBtn.classList.remove('hidden')                        
                        } 
                        else {
                            showTestBtn.innerText = 'SHOW TESTS'                  
                            testSubmitBtn.classList.add('hidden')
                        }
    
                        progressFieldset.classList.toggle('disabled')
    
                        renderDisplayTemplate()
                    }
                    showTestBtn.addEventListener('click', toggleTestableTemplate, true)                                
                    renderDisplayTemplate()                
                })
            })            
        }
        
        speciesDisplayContainer.innerHTML = ''
  
        g.templates.filter(t => !t.isTest).forEach(t => {
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
    
            if(g.template && g.template.id === t.id) {
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
     
        figcaption.style.setProperty("background-color", getTaxonGroupColour({taxon:species.taxon.iconic_taxon_name}))
    
        spans[0].textContent = species.taxon.preferred_common_name
        spans[1].textContent = species.taxon.name
        spans[1].classList.add('latin')
        
        img.src = species.taxon.default_photo.square_url.replace('square', 'small') // or observation…
        img.alt = species.taxon.name
        img.id = species.taxon.id
        img.setAttribute('data-i', index + 1)
        img.setAttribute('loading', 'lazy')
    
        return clone
    }
    
    const renderDisplayTemplate = () => {
        try {
            let template = d.getElementById(g.template.parent)
            let parentClone = template.content.cloneNode(true)
            let templateToClone = d.getElementById(g.template.id) 
            let parent = null

            sectionsWithHeader.forEach(sh => sh.classList.toggle('hidden'))
                
            lessonFieldsetLegend.innerText = g.template.name
        
            if(g.species) article.innerHTML = ''
        
            switch(g.template.templateId) {
                case 'species-template':
                    g.species.forEach((sp, i) => {
                        const clone = cloneSpeciesCardFromTemplate({templateToClone, species: sp, index: i})
                        parent = parentClone.querySelector('div')
                        parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'species-list-template':            
                    g.species.forEach(sp => {
                    const clone = templateToClone.content.cloneNode(true)
                    const li = clone.querySelector('li')
                    
                    li.textContent = sp.taxon.name
            
                    parent = parentClone.querySelector('div')          
                    parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'species-test-template':
                    g.species.forEach((sp, i) => {
                        const clone = templateToClone.content.cloneNode(true)
            
                        const span = clone.querySelector('span')
                        const label = clone.querySelector('label')
                        const input = clone.querySelector('input')
                        const img = clone.querySelector('img')      
                        const div = clone.querySelector('img + figcaption')
            
                        input.id = sp.taxon.id
                        label.htmlFor = input.id
            
                        div.style.setProperty("background-color", getTaxonGroupColour({taxon:sp.taxon.iconic_taxon_name}))
                        
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
                    g.template.sections.forEach(section => {            
                        template = d.getElementById(section.parent)
                        parentClone = template.content.cloneNode(true)
                        templateToClone = d.getElementById(section.id)
        
                        let clone, h3, h4, iframe, a
                        switch(section.type) {
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
                            case 'author':
                                clone = templateToClone.content.cloneNode(true)
                                h3 = clone.querySelector('h3')
                                h3.textContent = section.author
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'xenocanto-preview-template':
                                clone = templateToClone.content.cloneNode(true)
                                iframe = clone.querySelector('iframe')
                                iframe.src = `https://xeno-canto.org/${section.input}/embed?simple=1`
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'date':
                                clone = templateToClone.content.cloneNode(true)
                                h3 = clone.querySelector('h3')
                                h3.textContent = new Date(section.date).toDateString()
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'location':
                                clone = templateToClone.content.cloneNode(true)
                                a = clone.querySelector('a')
                                a.textContent = section.location.place_guess
                                a.setAttribute('href', `https://www.google.com/maps/place/${section.location.location}`)
                                parent = parentClone.querySelector('div')
                                parent.appendChild(clone)
                                article.appendChild(parent)
                            break
                            case 'img':
                                section.imgs.forEach(img => {
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
                                section.species.forEach((sp, i) => {
                                    try{
                                        const s = g.species.find(s => s.taxon.name === sp)
                                        const clone = cloneSpeciesCardFromTemplate({templateToClone, species: s, index: i})
                                        parent = parentClone.querySelector('div')
                                        parent.appendChild(clone)
                                    } catch (e) {
        
                                        console.log(e)
                                    }
                                })
                                article.appendChild(parent)
                            break
                            case 'observations-preview-template':
                                section.species.forEach((sp, i) => {
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
        
                                    const def = g.terms.find(t => t.dt === term || term.dt)
                                    
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
                                article.appendChild(parent)
                            break
                        }
                    })
                    break
            }
            
            addImgClickEventHandlers()
        
            lessonToggleVisibilityBtn.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        } catch (e) {
            showNotificationsDialog({message: e.message, type: 'error'})
        }
    }     
    
    rbDateGroup.forEach(date => {
        date.addEventListener('click', e => {
            g.dateOption = e.target.value
        }, true)
    })
    
    d.addEventListener("DOMContentLoaded", (event) => {
    
        const updateScore = () => {
            const scoreCountTd = d.getElementById('score-count-td')
            scoreCountTd.innerText = g.species.length
            const scoreCorrectTd = d.getElementById('score-correct-td')
            scoreCorrectTd.innerText = g.template.score
            const scoreIncorrectTd = d.getElementById('score-incorrect-td')
            scoreIncorrectTd.innerText = g.species.length - g.template.score
        }
    
        const scoreHandler = () => {
            const answers = Array.from(article.getElementsByTagName('input'))          
            scoreLesson(answers)
            updateScore()
        }
    
        testSubmitBtn.addEventListener('click', scoreHandler, false)
    
        const fetchInatSpecies = async () => {
            const filters = Array.from(d.getElementById('iconic-taxa-container').querySelectorAll('input'))
            
            g.iconicTaxa = g.ICONIC_TAXA.filter(taxon => filters.filter(t => t.checked).map(t => t.id.toLowerCase()).includes(taxon.name))
            
            const user = g.inatAutocompleteOptions.find(o => o.id === 'users')
            const place = g.inatAutocompleteOptions.find(o => o.id === 'places')        
    
            searchInatObservationsNotificationText.classList.toggle('hidden')
            searchInatObservationsBtn.classList.toggle('disabled')
    
            g.inatSpecies = await getInatSpecies({
                  user: user.isActive ? user.user : null
                , place: place.isActive ? place.place : null
            })
    
            g.species = mapInatSpeciesToLTP({species: g.inatSpecies, count: g.count, taxa: g.iconicTaxa})
        
            renderDisplayTemplate()
    
            searchInatObservationsNotificationText.classList.toggle('hidden')
            searchInatObservationsBtn.classList.toggle('disabled')
            speciesDisplayContainer.classList.toggle('disabled')
            const input = speciesDisplayContainer.querySelector('input')
            if(input) input.click()
        }
    
        searchInatObservationsBtn.addEventListener('click', fetchInatSpecies, false)
    
        rbInatAutocompleteGroup.forEach(rb => {
            rb.addEventListener('change', e => {
                g.inatAutocomplete = g.inatAutocompleteOptions.find(o => o.id === e.target.value)
    
                iNatAutocompleteInputText.value = ''
                iNatAutocompleteInputText.setAttribute('placeholder', g.inatAutocomplete.placeholder)
            })
        })
    
        const speciesCountInputNumber = d.getElementById('species-count-input-number')
    
        speciesCountInputNumber.value = g.count
    
        speciesCountInputNumber.addEventListener('change', () => {
            g.count = Number(speciesCountInputNumber.value)
        })
    
        rbLanguageGroup.forEach(rb => {
            rb.addEventListener('change', () => g.language = g.LANGUAGES.find(l => l.id === rb.value))
        })
    
        rbInatUseObservationSpeciesCountGroup.forEach(rb => {
            rb.addEventListener('change', () => g.useObservationsSpeciesCount = g.useObservationsSpeciesCountOptions.find(o => o.id === rb.value))
        })
    
        fieldnotesInputRb.addEventListener('click', toggleView, true)
        inatSearchInputRb.addEventListener('click', toggleView, true)
    
        displayToggleVisibilityBtn.addEventListener('click', toggleHideShow, true)
        lessonToggleVisibilityBtn.addEventListener('click', toggleHideShow, true)
        progressToggleVisibilityBtn.addEventListener('click', toggleHideShow, true)
        preferencesToggleVisibilityBtn.addEventListener('click', toggleHideShow, true)
    
        addImgClickEventHandlers()
    
        const { id, prop } = g.inatAutocomplete
        handleInatAutocomplete({ 
              globalWrite:g
            , inputText: iNatAutocompleteInputText
            , dataList: iNatAutocompleteDatalist
            , g
            , id
            , prop
            , cbParent: d.getElementById('inat-params-input-check-box-group')
        })
    })

    rbInatAutocompleteGroup = createRadioBtnGroup({collection: g.inatAutocompleteOptions, checked:g.inatAutocomplete, rbGroup:'inat-autocomplete', parent:inatAutocompleteGroupContainer})    
    rbLanguageGroup = createRadioBtnGroup({collection: g.LANGUAGES, checked:g.language, rbGroup:'language', parent:languageGroupContainer})
    rbInatUseObservationSpeciesCountGroup = createRadioBtnGroup({collection: g.useObservationsSpeciesCountOptions, checked:g.useObservationsSpeciesCount, rbGroup:'inat-use-observations-species-count', parent:inatUseObservationSpeciesCountGroupContainer})

    createTaxaCheckboxGroup()

    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${("0" + date.getDate()).slice(-2)}`

    singleDate.value = today
    startDate.value = today
    endDate.value = today

    const setDateOption = date => {
        date.checked = true
        g.dateOption = date.value
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

    const importFieldNotes = async () => {
        importFieldNotesNotificationText.classList.remove('hidden')

        const response = false 
        ? await g.fieldnotesStubs
        : await getFieldnotesById({id: g.fieldnotesStubs.fieldnotesId})

        importFieldNotesNotificationText.innerText = 'Fetching iNaturalist species…'

        setTimeout(() => {
            importFieldNotesNotificationText.classList.add('hidden')
            importFieldNotesNotificationText.innerText = 'Fetching fieldnotes…'
        }, 2000)

        if(!response.success) return 

        const fieldnotes = { 
            ...response.data
            , name: 'Field notes'
            , templateId: 'fieldnotes-template'
            , isTestable: false
            , sections: response.data.sectionOrder.map(sectionIndex => {
                return response.data.sections.find(section => section.sectionIndex === sectionIndex)
            })  
        }

        g.fieldnotes = fieldnotes
        g.templates = [ ...g.templates, { 
                ...fieldnotes            
            , parent: 'non-grid-template' 
            , type: 'fieldnotes'
        }]

        const taxaIds = g.fieldnotes.taxa
            .map(t => t.id)
        const taxaNames = g.fieldnotes.taxa
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
                        taxon: mapTaxon({taxon: t})
                    }
                }
            })
            .filter(t => t)
            
        createRadioBtnTemplateGroup()
        
        article.innerHTML = ''
        // We've set the display option as checked by default, so we need to enable it (we don't want to programatically force a click event)
        g.template = g.templates.find(t => t.templateId === 'fieldnotes-template')        
        renderDisplayTemplate()
        speciesDisplayContainer.classList.remove('disabled')
    }

    importFieldNotesBtn.addEventListener('click', importFieldNotes, true)

    createRadioBtnTemplateGroup()

    sectionsWithHeader.forEach(sh => sh.classList.toggle('hidden'))
}

init()