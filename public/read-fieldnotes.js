// import posthog from 'posthog-js'

// posthog.init('phc_PI6IzYtZjRZA1iuKPhUhHM0yy2T979TYAUM7LqwBCop', { api_host: 'https://eu.posthog.com' })

import { 
      g
    , getFieldnotesById
    , getFirebaseAuth
    , getInatTaxa
    , getTerms
    , onUserLoggedIn
    , snapSpeciesTraits
} from './api.js'

import {
      addImageBlockCaption
    , checkForLocalisedCommonSpeciesNames
    , cloneSpeciesCardFromTemplate
    , fetchFieldnotesStubs
    , fieldnotesAutocomplete
    , getTaxonGroupColour
    , handleLanguagePreference
    , mapTaxon
    , scoreLesson
    , showNotificationsDialog
} from './ui-actions.js'

import {
      ButtonComponent
} from './ui-components.js'

import { 
      appLocalStorage 
    , logger
} from './utils.js'

const init = async () => {    
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
    
    // Select title
    const fnAutocompleteTitleInputText = d.getElementById('fn-autocomplete-title-input-text')
    const fnAutocompleteTitleDatalist = d.getElementById('fn-autocomplete-title-data-list')
    const importFieldNotesNotificationText = d.getElementById('fetching-fieldnotes-notification-text')
    
    // Display
    const firebaseAuthDisplay = d.getElementById('firebase-auth-display')
    const sectionsWithHeader = d.querySelectorAll('.section-with-header')
    const lessonFieldsetLegend = d.querySelector('#lesson-fieldset > legend')
    const article = d.getElementById('article')
    const rbTemplate = d.getElementById('radio-button-template')
    const languageGroupContainer = d.getElementById('language-group-container')
    const targetGroupContainer = d.getElementById('target-group-container')
    const targetsFieldset = d.getElementById('targets-fieldset')
    const speciesDisplayContainer = d.getElementById('species-display-container')
    const rememberLanguageCheckbox = d.getElementById('remember-language-checkbox')

    const showTestBtn = new ButtonComponent({
          elementSelector: 'show-test-btn'        
    })
    const testSubmitBtn = new ButtonComponent({
          elementSelector: 'test-submit-btn'        
    })

    let rbTestForGroup
    
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

    // Call this early to prevent delay to page loading (LCP)
    handleLanguagePreference({
        globalRead
      , createRadioBtnGroup
      , languageGroupContainer
      , rememberLanguageCheckbox
    })
    
    const addImgClickEventHandlers = () => {
        const speciesImages = d.querySelectorAll('img')
    
        const showSpeciesDetails = ({e, img}) => { 
            console.log(e)
            const container = img.parentElement            
            const grid = container.parentElement
            const speciesPanel = grid.querySelector('.species-panel')
            // If there is a species panel, remove it from the DOM
            if(speciesPanel) speciesPanel.remove()
            // Work out how many columns are in each row
            const colSpan = Math.round((grid.clientWidth / img.clientWidth))
            // Work out how many columns we need to count along the row
            // e.globalRead. if there are 3 columns, and the user clicks the first, we have to off set 2 to get to the end
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
            
            if(panel) panel.scrollIntoView({ 
                  behavior: 'smooth'
                , block: 'end'
                , inline: 'nearest' 
            })
        }
    
        speciesImages.forEach(img => {
            img.addEventListener('click', e => showSpeciesDetails({e,img}))
            img.addEventListener('keydown', e => showSpeciesDetails({e,img}))
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

                        const progressView = d.querySelector('.progress-view')
                        progressView.classList.toggle('hidden')

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
    
    const renderDisplayTemplate = () => {        
        try {
            let parentTemplate = d.getElementById(globalRead.template.parent)
            let parentClone = parentTemplate.content.cloneNode(true)
            let templateToClone = d.getElementById(globalRead.template.templateId) 
            let parent = null

            sectionsWithHeader.forEach(sh => sh.classList.remove('hidden'))
                
            lessonFieldsetLegend.innerText = globalRead.template.name
        
            if(globalRead.species) article.innerHTML = ''
        
            // Iterate the sections updating content according to type
            switch(globalRead.template.templateId) {
                case 'species-template':
                case 'observations-template':
                    const species = globalRead.template.templateId === 'observations-template'
                        ? globalRead.fieldnotes.observations
                        : globalRead.species
                    species.forEach((sp, i) => {
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
                        img.setAttribute('tabindex', 0)
                        
                        parent = parentClone.querySelector('div')          
                        parent.appendChild(clone)
                    })
                    article.appendChild(parent)
                    break
                case 'fieldnotes-template':
                    // Display metadata from the field trip to the fieldnotes
                    const metaTemplate = d.getElementById('meta-preview-template')
                    const metaClone = metaTemplate.content.cloneNode(true)
                    const metaList = metaClone.querySelector('ul')
                    const required = metaList.querySelectorAll('li > strong')
                    required[0].innerText = globalRead.fieldnotes.author
                    required[1].innerText = new Date(globalRead.fieldnotes.d1).toLocaleDateString('en-gb', { 
                          weekday: 'long'
                        , year: 'numeric'
                        , month: 'long'
                        , day: 'numeric'
                    })
                    const a = metaList.querySelector('a')
                    a.textContent = globalRead.fieldnotes.location.place_guess
                    a.setAttribute('href', `https://www.google.com/maps/place/${globalRead.fieldnotes.location.location}`)
                    // Optional metadata
                    const optional = metaList.querySelectorAll('li.optional')
                    if(globalRead.fieldnotes.startTime) {
                        if(globalRead.fieldnotes.endTime) {
                            optional[0].innerText = `Time: ${globalRead.fieldnotes.startTime}-${globalRead.fieldnotes.endTime}`
                        }
                    }
                    if(globalRead.fieldnotes.weather) {
                        optional[1].innerText = `Weather: ${globalRead.fieldnotes.weather}`
                    }
                    if(globalRead.fieldnotes.habitat) {
                        optional[2].innerText = `Habitat: ${globalRead.fieldnotes.habitat}`
                    }
                    article.appendChild(metaClone)
                    
                    // Iterate over the sections
                    globalRead.template.sections.forEach(section => {            
                        const template = d.getElementById(section.parent)
                        parentClone = template.content.cloneNode(true)
                        templateToClone = d.getElementById(section.templateId)
        
                        let clone, h3, h4, iframe, caption
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
                                addImageBlockCaption({
                                      caption: parentClone.querySelector('span')
                                    , text: section.name
                                    , parent: article
                                })
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
                            case 'inat-lookup-preview-template':                            
                                section.species.forEach((sp, i) => {
                                    try {
                                        const clone = cloneSpeciesCardFromTemplate({
                                            templateToClone
                                            , species: checkForLocalisedCommonSpeciesNames({
                                                      globalSpecies: globalRead.species.find(s => s.taxon.id === sp.taxon.id)
                                                    , sectionSpecies: sp
                                                })
                                            , index: i
                                        })                                  
                                        parent = parentClone.querySelector('div')
                                        parent.appendChild(clone)
                                    } catch (e) {
                                        logger({
                                            message: e.message
                                          , type: 'error'
                                        })
                                    }
                                })
                                article.appendChild(parent)
                                addImageBlockCaption({
                                      caption: parentClone.querySelector('span')
                                    , text: section.name
                                    , parent: article
                                })
                                break
                            case 'observations-preview-template':
                                section.species.forEach((sp, i) => {
                                    try {
                                        const clone = cloneSpeciesCardFromTemplate({
                                            templateToClone
                                            , species: checkForLocalisedCommonSpeciesNames({
                                                      globalSpecies: globalRead.species.find(s => s.taxon.name === sp.name)
                                                    , sectionSpecies: sp
                                                })
                                            , index: i
                                        })
                                        parent = parentClone.querySelector('div')
                                        parent.appendChild(clone)
                                    } catch (e) {
                                        logger({
                                            message: e.message
                                          , type: 'error'
                                        })
                                    }
                                })
                                article.appendChild(parent)
                                addImageBlockCaption({
                                      caption: parentClone.querySelector('span')
                                    , text: section.name
                                    , parent: article
                                })
                                break
                            case 'terms-preview-template':                                
                                section.terms.forEach(async(term) => {
                                    try {
                                        const clone = templateToClone.content.cloneNode(true)                      
                                        const dt = clone.querySelector('dt')
                                        const dd = clone.querySelector('dd')                        
                                        const div1 = clone.querySelectorAll('div')[0]
                                        const div2 = clone.querySelectorAll('div')[1]
                                        const eg = div1.querySelector('span')
                                        const dx = div1.querySelector('em')
                                        const ds = div2.querySelector('a')
                                                
                                        let def
                                        if(term?.dd) {
                                            def = term
                                        } else {
                                            def = globalRead.terms.find(t => t.dt === term.dt || t.dt === term)
                                        }                                        
                                        
                                        dt.textContent = def.dt
                                        dd.textContent = def.dd
            
                                        if(def.dx) {                                
                                            eg.textContent = 'e.g. '                          
                                            dx.append(
                                                Array.isArray(def.dx)
                                                    ? def.dx.join(', ')
                                                    : def.dx
                                                )
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
                                    } catch(e) {
                                        logger({
                                            message: e.message
                                          , type: 'error'
                                        })
                                    }              
                                })
                                article.appendChild(parent)
                                break
                        }
                    })
                    break
            }
            
            addImgClickEventHandlers()
        } catch (e) {
            showNotificationsDialog({
                  message: e.message
                , type: 'error'
            })
        }
    }         
    
    performance.mark('dom-content-loaded')
    const updateScore = () => {
        const scoreCountTd = d.getElementById('score-count-td')
        if(scoreCountTd) scoreCountTd.innerText = globalRead.species.length
        const scoreCorrectTd = d.getElementById('score-correct-td')
        if(scoreCorrectTd) scoreCorrectTd.innerText = globalRead.template.score
        const scoreIncorrectTd = d.getElementById('score-incorrect-td')
        if(scoreIncorrectTd) scoreIncorrectTd.innerText = globalRead.species.length - globalRead.template.score
    }

    const scoreHandler = () => {
        const answers = Array.from(article.getElementsByTagName('input'))          
        scoreLesson({
                answers
            , global: globalRead
        })
        updateScore()
    }

    testSubmitBtn.addClickHandler({
        clickHandler: scoreHandler
    })

    addImgClickEventHandlers()

    const fetchFieldnotes = async () => {
        performance.mark('fetch-field-notes: start')
        try {
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

            // Get the observations (only includes those selected by the author)
            fieldnotes.observations = fieldnotes.sections
                .filter(fn => fn.templateId === 'observations-preview-template')
                .map(section => section.species).flat()

            globalRead.fieldnotes = fieldnotes
            globalRead.template = globalRead.templates.find(template => template.templateId === 'fieldnotes-template')
            Object.assign(globalRead.template, fieldnotes)

            // Reorder the species list so that those with a binomial species name come first, 
            const inatLookupSections = globalRead.fieldnotes.sections.filter(s => s.templateId === 'inat-lookup-preview-template') || []
            const inatLookupSpecies = inatLookupSections?.map(s => s.species)?.flat() || []
            // Those with only a genus, or higher taxa, name come after. This reduces the number of records
            // we need to request from iNaturalist to match every taxon.
            const inatLookupSpeciesByRank = inatLookupSpecies.filter(s => s.taxon.name.indexOf(' ') > 0)
                .concat(inatLookupSpecies.filter(s => s.taxon.name.indexOf(' ') === 0))
            const inatLookupTaxaIds = inatLookupSpeciesByRank.map(s => s.taxon.id)
            const inatLookupTaxaNames = inatLookupSpeciesByRank.map(s => s.taxon.name)

            const taxaIds = [ ...new Set(globalRead.fieldnotes.taxa
                .map(t => t.id)
                .concat(inatLookupTaxaIds)) ]
            const taxaNames = [ ...new Set(globalRead.fieldnotes.taxa
                .map(t => t.name)
                .concat(inatLookupTaxaNames)) ]

            const inatTaxa = await getInatTaxa({ 
                taxaIds
                , locale: globalRead.language.id 
                , per_page: taxaIds.length
            })
            
            globalRead.species = inatTaxa.results
                .filter(t => t.default_photo)
                .map(t => { 
                    // Only allow one name for a taxon
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
            speciesDisplayContainer.classList.remove('disabled')
            
            globalRead.terms = await getTerms()

            renderDisplayTemplate()

            fnAutocompleteTitleInputText.closest('fieldset').classList.remove('border-solid')
            performance.mark('fetch-field-notes: end')
        } catch (e) {
            logger({
                message: e.message
                , type: 'error'
            })
        }
    }

    const fetchFieldnotesBtn = new ButtonComponent({
        elementSelector: 'fetch-fieldnotes-btn'
    , clickHandler: fetchFieldnotes
    })

    createRadioBtnTemplateGroup()

    globalRead.templates = g.templates.filter(template => template.types.includes('fieldnotes'))
    globalRead.template = globalRead.templates.find(template => template.templateId === 'fieldnotes-template')

    const printFieldnotesBtn = new ButtonComponent({
        elementSelector: 'print-fieldnotes-btn'
    , clickHandler: () => {
        Array.from(d.querySelectorAll('.grid')).forEach(grid => grid.classList.remove('page-breaks'))
        print()
    }
    })

    const printFieldnotesWithPageBreaksBtn = new ButtonComponent({
        elementSelector: 'print-fieldnotes-with-page-breaks-btn'
    , clickHandler: () => {
        Array.from(d.querySelectorAll('.grid')).forEach(grid => grid.classList.add('page-breaks'))
        print()
    }
    })

    // Check for saved language
    const language = appLocalStorage.get({
        key: 'language'
    })

    if(language) {
        globalRead.language = language
    }

    // Check for logged in users. Logged in users can preview their private fieldnotes
    onUserLoggedIn({ 
            auth: getFirebaseAuth()
        , globalRead
        , fetchFieldnotesStubs: fetchFieldnotesStubs({
                inputText: fnAutocompleteTitleInputText
            , dataList: fnAutocompleteTitleDatalist
            , global: globalRead
            , fetchFieldnotesBtn
            , readonly: true
        })
    })

    fnAutocompleteTitleInputText.focus()

    // Clear input so that user can select new title
    fnAutocompleteTitleInputText.addEventListener('focus', e => {
        if(fnAutocompleteTitleDatalist.innerHTML !== '') {
            fnAutocompleteTitleInputText.value = ''
            fieldnotesAutocomplete({ 
                inputText: fnAutocompleteTitleInputText
                , dataList: fnAutocompleteTitleDatalist
                , global: globalRead
                , fetchFieldnotesBtn
                , fieldnotesStubs: globalRead.fieldnotesStubsCollection
            })
        }
    })
    
    // Check for change in the titles list
    const titlesObserver = new MutationObserver(() => {
        // Check whether user is authenticated, and if they are logged in, let them know.
        const auth = getFirebaseAuth()
        if(auth?.currentUser?.email) {
            firebaseAuthDisplay.innerText = 'You can view your private and all published fieldnotes.'
            // firebaseAuthDisplay.innerText = `Your are logged in as ${auth.currentUser.email}. You can view your private and all public fieldnotes.`
        }    
    })

    titlesObserver.observe(fnAutocompleteTitleDatalist, {
            subtree: true
        , childList: true
    })
}

init()
