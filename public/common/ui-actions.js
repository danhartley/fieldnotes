/* eslint-disable no-undef */
import {
  addElementToArray,
  addTerm,
  getIdByAutocomplete,
  getFieldnotesStubs,
  getFirebaseAuth,
  firebaseCreateAccount,
  firebaseLogin,
  firebaseSignOut,
  isFieldnotesTitleUnique,
  removeElementFromArray,
  updateElementFromArray,
  updateFieldnoteProperty,
  updateFieldnotesTitle,
} from '../data/api.js'

import {
  species,
  observations,
  inatlookup,
  terms,
  images,
} from './templates.js'

import {
  appLocalStorage,
  debounce,
  isValidDate,
  logger,
  validateSlug,
} from './utils.js'

const d = document

// iNaturalist
export const mapTaxon = ({ taxon }) => {
  return {
    iconic_taxon_id: taxon.iconic_taxon_id,
    name: taxon.name,
    id: taxon.id,
    default_photo: taxon.default_photo, // map again to remove properties that aren't needed
    iconic_taxon_name: taxon.iconic_taxon_name,
    preferred_common_name: taxon.preferred_common_name || '-',
  }
}

export const createInatLookups = ({
  globalWrite,
  parent,
  writeTemplateId,
  sectionIndex,
}) => {
  cloneImages({
    globalWrite,
    parent,
    writeTemplateId,
    sectionIndex,
  })
}

export const handleInatAutocomplete = ({
  globalWrite,
  inputText,
  dataList,
  id,
  prop,
  callback,
  cbParent,
  writeTemplateId,
  sectionIndex,
  searchInatObservationsBtn
}) => {
  inputText.addEventListener(
    'input',
    debounce(async (e) => {
      while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild)
      }

      const strToComplete = e.target.value

      if (strToComplete.length < 3) return

      const data = await getIdByAutocomplete({
        by: id,
        toComplete: strToComplete,
      })

      globalWrite.matches = data.results

      globalWrite.matches.forEach((match) => {
        const option = d.createElement('option')
        option.value = match[prop]
        dataList.appendChild(option)
      })
    }, 350)
  )

  inputText.addEventListener('change', (e) => {
    const { name } = globalWrite.inatAutocomplete
    const match = e.target.value

    globalWrite.inatAutocompleteOptions.forEach((option) => {
      if (option.id === id) {
        option.isActive = true
      }
    })

    if (match) {
      const option = globalWrite.inatAutocompleteOptions.find(
        (option) => option.id === id
      )
      if (option)
        option[name] = globalWrite.matches.find((m) => m[prop] === match)

      globalWrite[prop] = match
      if (callback)
        callback({
          globalWrite,
          parent: cbParent,
          writeTemplateId,
          sectionIndex,
      })
      searchInatObservationsBtn.enable()
    } else {
      searchInatObservationsBtn.disable()
    }
  })
}

export const mapUser = ({ user }) => {
  return {
    icon: user.icon,
    id: user.id,
    identifications_count: user.identifications_count || 0,
    journal_posts_count: user.journal_posts_count,
    login: user.login,
    name: user.name,
    observations_count: user.observations_count,
    species_count: user.species_count,
  }
}

export const mapInatSpeciesToRequiredSpecies = ({ species, taxa }) => {
  return species
    .filter((sp) =>
      taxa.map((t) => t.name).includes(sp.taxon.iconic_taxon_name.toLowerCase())
    )
    .map((sp) => {
      return {
        species_guess: sp.species_guess,
        observation_photos: sp.observation_photos,
        taxon: {
          ...sp.taxon,
          count: sp.count || 0,
        },
      }
    })
}

export const getTaxonGroupColour = ({ taxon }) => {
  return getComputedStyle(d.documentElement).getPropertyValue(
    `--${taxon.toLowerCase()}`
  )
}

// Terms
export const handleTermAutocomplete = async ({
  selectedTerms,
  inputText,
  dataList,
  globalWrite,
  data,
  parent,
  addSelectedTermBtn,
  handleOnClickAddSelectedTermBtn,
}) => {
  let termData

  inputText.addEventListener(
    'input',
    debounce(async (e) => {
      while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild)
      }

      const strToComplete = e.target.value

      if (strToComplete.length < 2) return

      termData = await data

      globalWrite.matches = termData.filter((td) =>
        td.dt.toLowerCase().startsWith(strToComplete.toLowerCase())
      )

      globalWrite.matches.forEach((match) => {
        const option = d.createElement('option')
        option.value = match['dt']
        dataList.appendChild(option)
      })
    }, 0)
  )

  inputText.addEventListener('change', async (e) => {
    const match = e.target.value

    if (match) {
      const term = termData.find((td) => td.dt === match)
      const spans = parent.querySelectorAll(
        '.centred-block > span:nth-child(2)'
      )

      spans[0].innerText = term.dt
      spans[1].innerText = term.dd
      spans[2].innerText = term.ds
      spans[3].innerText = term.da
      if (spans[4]) spans[4].innerText = term.dx || '--'

      if (selectedTerms.find((t) => t.dt.toLowerCase() === match.toLowerCase()))
        return

      addSelectedTermBtn.classList.remove('disabled')
      addSelectedTermBtn.addEventListener(
        'click',
        () =>
          handleOnClickAddSelectedTermBtn({
            terms: termData,
            selectedTerm: term,
          }),
        true
      )

      // Clear the input to make new search easier
      inputText.value = ''
    }
  })
}

export const handleTermCheckState = ({
  e,
  globalWrite,
  selectedTerm,
  li,
  sectionIndex,
}) => {
  const checkbox = e.target
  const isChecked = checkbox.checked

  if (!isChecked) li.remove()

  let section = globalWrite.fieldnotes.sections.find(
    (t) => t.sectionIndex === sectionIndex
  )

  if (section) {
    isChecked
      ? section.terms.push(selectedTerm)
      : (section.terms = section.terms.filter((t) => t !== selectedTerm))
  } else {
    section = {
      ...terms,
      terms: [selectedTerm],
      templateId: terms.templateId,
      sectionIndex,
    }
    addSectionToFieldnotes({
      globalWrite,
      section,
    })
  }
}

export const addTermToList = ({
  selectedTerms,
  selectedTerm,
  selectedItemsListElement,
  globalWrite,
  sectionIndex,
}) => {
  let section = globalWrite.fieldnotes.sections.find(
    (t) => t.sectionIndex === sectionIndex
  )

  // Check the new term hasn't been added in memory i.e. not yet saved to db
  if (selectedTerms.findIndex((item) => item.dt === selectedTerm.dt) > -1)
    return

  if (section) {
    // Check that the new term hasn't previously been added i.e. has been saved to db
    if (section.terms.findIndex((term) => term.dt === selectedTerm.dt) === -1) {
      section.terms.push(selectedTerm)
    }
  } else {
    section = {
      ...terms,
      terms: [selectedTerm],
      templateId: terms.templateId,
      sectionIndex,
    }
    addSectionToFieldnotes({
      globalWrite,
      section,
    })
  }

  // Add the new term to the list
  ;[selectedTerm].forEach((term) => {
    const li = d.createElement('li')
    const checkbox = d.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = term.dt
    checkbox.setAttribute('checked', true)
    checkbox.classList.add('fl')
    checkbox.addEventListener(
      'change',
      (e) =>
        handleTermCheckState({
          e,
          globalWrite,
          selectedTerm,
          li,
          sectionIndex,
        }),
      true
    )
    const label = d.createElement('label')
    label.innerText = term.dt
    label.htmlFor = checkbox.id
    li.appendChild(checkbox)
    li.appendChild(label)
    selectedItemsListElement.appendChild(li)
  })
}

export const saveNewTerm = async ({ terms, term }) => {
  // Save new term to db
  if (terms.filter((td) => td.dt === term.dt).length === 0) {
    try {
      const response = await addTerm({
        term,
      })
      if (response.success) {
        showNotificationsDialog({
          message: response.message,
        })
      }
    } catch (e) {
      showNotificationsDialog({
        message: e.message,
        type: 'error',
      })
    }
  } else {
    showNotificationsDialog({
      message: 'There is already a definition for this term.',
    })
  }
}

// Observation, species and iNaturalist lookup images
export const cloneImages = ({
  globalWrite,
  parent,
  writeTemplateId,
  sectionIndex,
}) => {
  switch (writeTemplateId) {
    case 'species-write-template':
      if (globalWrite.observations.length > 0) {
        const uniqueSpecies = []
        globalWrite.observations.forEach((observation, index) => {
          // Check for duplicate species as there may be multiple observations of the same species
          if (
            uniqueSpecies.findIndex(
              (species) => species === observation.taxon.name
            ) === -1
          ) {
            const clone = cloneImageTemplate({
              observation: {
                taxon: observation.taxon,
              },
              index,
              sectionIndex,
              imgUrl: observation.taxon.default_photo.medium_url, // use taxon image
              globalWrite,
              writeTemplateId,
            })
            parent.appendChild(clone)
            uniqueSpecies.push(observation.taxon.name)
          }
        })
      }
      break
    case 'observations-write-template':
      if (globalWrite.observations.length > 0) {
        globalWrite.observations.forEach((observation, index) => {
          const clone = cloneImageTemplate({
            observation,
            index,
            sectionIndex,
            imgUrl: observation.photos[0].url, // use observation image
            globalWrite,
            writeTemplateId,
          })
          parent.appendChild(clone)
        })
      }
      break
    case 'inat-lookup-write-template': {
      const term = globalWrite.name || globalWrite.matched_term
      if (term) {
        // match.name is the scientific name, match.matched_term is the preferred common name in the given language (default en)
        const match = globalWrite.matches.find(
          (match) => match.name === term || match.matched_term === term
        )
        const imgUrl = match.default_photo.square_url
        const clone = cloneImageTemplate({
          observation: {
            taxon: match,
          },
          index: 0,
          sectionIndex,
          imgUrl,
          globalWrite,
          writeTemplateId,
        })
        parent.appendChild(clone)

        if (
          !globalWrite.fieldnotes.taxa.find((taxon) => taxon.id === match.id)
        ) {
          globalWrite.fieldnotes.taxa.push({
            id: match.id,
            name: match.name,
          })
        }
      }
      break
    }
  }
}

export const cloneImageTemplate = ({
  observation,
  index,
  sectionIndex,
  imgUrl,
  globalWrite,
  writeTemplateId,
}) => {
  const handleSpeciesCheckState = async ({
    e,
    observation,
    sectionIndex,
    globalWrite,
    writeTemplateId,
  }) => {
    const checkbox = e.target
    const name = checkbox.value
    const label = checkbox.nextElementSibling

    let section = globalWrite.fieldnotes.sections.find(
      (t) => t.sectionIndex === sectionIndex
    )
    let index = globalWrite.fieldnotes.sections.findIndex(
      (t) => t.sectionIndex === sectionIndex
    )

    const getSpeciesForInatLookup = ({ taxon }) => {
      return {
        taxon: {
          id: taxon.id,
          name: taxon.name,
          preferred_common_name: taxon.preferred_common_name || '-',
          iconic_taxon_name: taxon.iconic_taxon_name,
          default_photo: {
            square_url: taxon.default_photo.square_url,
          },
        },
      }
    }

    const getTaxon = ({ observation }) => {
      return {
        id: observation.taxon.id,
        name: observation.taxon.name,
        preferred_common_name: observation.taxon.preferred_common_name || '-',
        iconic_taxon_name: observation.taxon.iconic_taxon_name,
        default_photo: {
          square_url: observation.taxon.default_photo.square_url,
        },
      }
    }

    const getObservation = ({ observation }) => {
      return {
        species_guess: observation.species_guess,
        id: observation.id,
        default_photo: {
          url: observation.photos[0].url,
        },
        photos: observation.photos.map((photo) => {
          return {
            id: photo.id,
            url: photo.url,
            attribution: photo.attribution,
          }
        }),
      }
    }

    if (section) {
      switch (writeTemplateId) {
        case 'species-write-template':
          if (section.species.find((sp) => sp.taxon.name === name)) {
            section.species = section.species.filter(
              (sp) => sp.taxon.name !== name
            )
            label.innerText = 'Not included'
          } else {
            section.species.push({
              name,
              taxon: getTaxon({ observation }),
            })
            label.innerText = 'Included'
          }
          globalWrite.fieldnotes.sections[index] = section
          break
        case 'observations-write-template':
          if (
            section.species.find((sp) => sp.observation.id === observation.id)
          ) {
            section.species = section.species.filter(
              (sp) => sp.observation.id !== observation.id
            )
            label.innerText = 'Not included'
          } else {
            section.species.push({
              name,
              taxon: getTaxon({ observation }),
              observation: getObservation({ observation }),
            })
            label.innerText = 'Included'
          }
          globalWrite.fieldnotes.sections[index] = section
          break
        case 'inat-lookup-write-template':
          if (section.species.find((sp) => sp.taxon.name === name)) {
            section.species = section.species.filter(
              (sp) => sp.taxon.name !== name
            )
            label.innerText = 'Not included'
          } else {
            section.species.push(
              getSpeciesForInatLookup({ taxon: observation.taxon })
            )
            label.innerText = 'Included'
          }
          globalWrite.fieldnotes.sections[index] = section
          break
      }
    } else {
      label.innerText = 'Included'
      switch (writeTemplateId) {
        case 'species-write-template':
          section = {
            ...species,
            species: [
              {
                name,
                taxon: getTaxon({ observation }),
              },
            ],
            templateId: species.templateId,
            sectionIndex,
          }
          break
        case 'observations-write-template':
          section = {
            ...observations,
            species: [
              {
                name,
                taxon: getTaxon({ observation }),
                observation: getObservation({ observation }),
              },
            ],
            templateId: observations.templateId,
            sectionIndex,
          }
          break
        case 'inat-lookup-write-template':
          section = {
            ...inatlookup,
            species: [getSpeciesForInatLookup({ taxon: observation.taxon })],
            templateId: inatlookup.templateId,
            sectionIndex,
          }
          break
      }
      addSectionToFieldnotes({
        globalWrite,
        section,
      })
    }

    if (!globalWrite.fieldnotes.taxa.find((t) => t.name === name)) {
      globalWrite.fieldnotes.taxa.push({
        id: globalWrite.observations.find((sp) => sp.taxon.name === name)?.taxon
          ?.id,
        name,
      })
      // Check fieldnotes exist in the db before trying to update a field
      if (globalWrite.fieldnotes.id.length > 0) {
        updateFieldnoteProperty({
          fieldnotes: globalWrite.fieldnotes,
          prop: 'taxa',
          value: globalWrite.fieldnotes.taxa,
        })
      }
    }
  }

  const templateToClone = d.getElementById('images-preview-template')
  const clone = templateToClone.content.cloneNode(true)
  const spans = clone.querySelectorAll('span')
  const img = clone.querySelector('img')
  const figure = clone.querySelector('figure')
  const checkbox = clone.querySelector('input')
  const label = clone.querySelector('label')

  figure.style.setProperty(
    'background-color',
    getTaxonGroupColour({
      taxon: observation.taxon.iconic_taxon_name,
    })
  )

  spans[0].textContent = observation.taxon.preferred_common_name || '-'
  spans[1].textContent = observation.taxon.name
  spans[1].classList.add('latin')

  img.src = imgUrl
  img.alt = observation.taxon.name
  img.id = observation.taxon.id
  img.setAttribute('data-i', index + 1)
  img.setAttribute('loading', 'lazy')
  img.setAttribute('tabindex', 0)

  // In order to ensure ids are unique in the DOM, prefix the id with the section index
  checkbox.id = `${sectionIndex}-${observation.id || observation.taxon.id}`
  checkbox.value = observation.taxon.name
  checkbox.addEventListener(
    'change',
    (e) =>
      handleSpeciesCheckState({
        e,
        observation,
        sectionIndex,
        globalWrite,
        writeTemplateId,
      }),
    true
  )
  label.htmlFor = checkbox.id

  return clone
}

export const handleImageTextChange = ({
  globalWrite,
  sectionIndex,
  imageSrcs,
  index,
  strValue,
  property,
}) => {
  const image = imageSrcs[index]
  if (image) {
    image[property] = strValue
    imageSrcs[index] = image
  } else {
    imageSrcs.push({
      [property]: strValue,
    })
  }
  let section = globalWrite.fieldnotes.sections.find(
    (section) => section.sectionIndex === sectionIndex
  )
  if (section) {
    section.images = imageSrcs
  } else {
    section = {
      ...images,
      images: imageSrcs,
      templateId: images.templateId,
      sectionIndex: globalWrite.nextSectionIndex,
    }
    addSectionToFieldnotes({
      globalWrite,
      section,
    })
  }
}

export const calcImageIndex = (index) => {
  return index % 2 === 0 ? index / 2 : (index - 1) / 2
}

export const handleImageInputChangeEvent = ({
  addOrUpdateSectionBtn,
  url1,
  title1,
}) => {
  url1.value.length >= 5 && title1.value.length >= 2
    ? addOrUpdateSectionBtn.enable()
    : addOrUpdateSectionBtn.disable()
}

export const addImageBlockCaption = ({ caption, text, parent }) => {
  caption.innerText = text
  caption.classList.add('caption', 'smallish')
  parent.appendChild(caption)
}

// Drop & drag sections
let sectionToMove = null

export const dragstartHandler = (e) => {
  // The event target is the dragged section
  e.dataTransfer.setData('text/plain', e.target.id)
  sectionToMove = d.getElementById(e.target.id)
  sectionToMove.classList.add('moveable')
}

export const dragoverHandler = (e) => {
  // The event target is the section over which the section to move jumps
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'

  if (e.target.type === 'fieldset') {
    const sectionToJumpId = e.target.parentNode.id
    const sectiontoJump = d.getElementById(sectionToJumpId)

    // Find the index in the DOM of the section being moved, and the section we are jumping over
    const sectionToMoveDOMIndex = Array.from(
      d.querySelectorAll('.draggable')
    ).findIndex((section) => section.id === sectionToMove.id)
    const sectionToJumpDOMIndex = Array.from(
      d.querySelectorAll('.draggable')
    ).findIndex((section) => section.id === sectiontoJump.id)

    if (sectionToMoveDOMIndex === sectionToJumpDOMIndex) return

    sectionToMoveDOMIndex > sectionToJumpDOMIndex
      ? sectiontoJump.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        }) // Move up
      : sectiontoJump.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        }) // Move down
  }
}

export const dragenterHandler = (e) => {
  // The event target is the section we are jumping over
  e.preventDefault()
  if (e.target.type === 'fieldset') {
    const fieldset = e.target
    // We don't want to highlight the section we are moving
    if (sectionToMove.id === fieldset.parentNode.id) return
    const section = d.getElementById(fieldset.parentNode.id)
    if (section)
      section.getElementsByTagName('fieldset')[0].classList.add('drop-before')
  }
}

export const dragleaveHandler = (e) => {
  // The event target is the section we are jumping over
  e.preventDefault()
  if (e.target.type === 'fieldset') {
    const fieldset = e.target
    // We don't want to highlight the section we are moving
    if (sectionToMove.id === fieldset.parentNode.id) return
    const section = d.getElementById(fieldset.parentNode.id)
    // Allow time for the target area to be apparent to the user
    setTimeout(() => {
      if (section)
        section
          .getElementsByTagName('fieldset')[0]
          .classList.remove('drop-before')
    }, 500)
  }
}

export const dropHandler = async ({
  e,
  globalWrite,
  draggableSections,
  apiCallback,
}) => {
  // The event target is the section being moved (dragged and dropped)
  e.preventDefault()

  if (e.target.type === 'fieldset') {
    const sectionToDropId = Number(sectionToMove.id)
    const sectionToJumpId = Number(e.target.parentNode.id)

    // Find out whether we are moving the section up or down
    const sectionToMoveDOMIndex = Array.from(
      d.querySelectorAll('.draggable')
    ).findIndex((section) => Number(section.id) === sectionToDropId)
    const sectionToJumpDOMIndex = Array.from(
      d.querySelectorAll('.draggable')
    ).findIndex((section) => Number(section.id) === sectionToJumpId)

    if (sectionToMoveDOMIndex === sectionToJumpDOMIndex) return

    // Get the section to move
    const sectionTemplateToMoveId = globalWrite.fieldnotes.sectionOrder.find(
      (sectionIndex) => sectionIndex === sectionToDropId
    )

    // Get the section type
    const elementToMove = globalWrite.fieldnotes.sections.find(
      (t) => t.sectionIndex === sectionTemplateToMoveId
    )

    // Remove the section to move
    globalWrite.fieldnotes.sectionOrder =
      globalWrite.fieldnotes.sectionOrder.filter(
        (sectionIndex) => sectionIndex !== sectionToDropId
      )

    // Calculate position of the jumped section
    const indexOfJumpedSectionTemplate =
      globalWrite.fieldnotes.sectionOrder.findIndex(
        (sectionIndex) => sectionIndex === sectionToJumpId
      )

    if (indexOfJumpedSectionTemplate === -1) {
      throw new Error({
        message: 'Something went wrong, please try again.',
      })
    }

    let sectionOrder = globalWrite.fieldnotes.sectionOrder.map((so) => so)

    const moveUp = sectionToMoveDOMIndex > sectionToJumpDOMIndex

    try {
      moveUp
        ? sectionOrder.splice(
            indexOfJumpedSectionTemplate,
            0,
            sectionTemplateToMoveId
          )
        : sectionOrder.splice(
            indexOfJumpedSectionTemplate + 1,
            0,
            sectionTemplateToMoveId
          )

      // Save to the db
      const response = await apiCallback({
        fieldnotes: globalWrite.fieldnotes,
        data: {
          sectionOrder,
        },
      })

      if (response.success) {
        // Update changes in memory
        globalWrite.fieldnotes.sectionOrder = sectionOrder

        // Update changes to the DOM
        moveUp
          ? draggableSections.insertBefore(sectionToMove, e.target.parentNode)
          : draggableSections.insertBefore(
              sectionToMove,
              e.target.parentNode.nextSibling
            )

        // Update the mouse icon
        sectionToMove.classList.remove('moveable')
        sectionToMove.classList.add('pointer')

        // Notify user
        showNotificationsDialog({
          success: true,
          message: `${elementToMove.name} moved`,
        })
      }
    } catch (e) {
      showNotificationsDialog({ message: e.message, type: 'error' })
    }
  }
}

// Notifications (toast)
export const showNotificationsDialog = ({
  message,
  type = 'success',
  displayDuration = 3500,
  stack,
}) => {
  const dialog = d.getElementById('state-notifications')
  const div1 = dialog.querySelector('div > div:nth-child(1)')

  div1.innerText = message
  div1.classList.remove(...div1.classList)

  let className, iconName

  if (type === 'success') {
    className = 'success-bg'
    iconName = 'success-icon'
  } else {
    className = 'error-bg'
    iconName = 'error-icon'
  }

  div1.classList.add(iconName)
  dialog.classList.remove(...dialog.classList)
  dialog.classList.add(className)

  dialog.show()
  setTimeout(() => {
    dialog.close()
  }, displayDuration)

  logger({
    message,
    type,
    stack,
  })
}

// Section actions
export const deleteSection = async ({ sectionIndex, globalWrite }) => {
  try {
    const elementToRemove = globalWrite.fieldnotes.sections.find(
      (section) => section.sectionIndex == sectionIndex
    )

    if (!elementToRemove) {
      showNotificationsDialog({
        message: 'Section not found',
        type: 'error',
      })
      return
    }

    // Remove section from fieldnotes in the db
    const response = await removeElementFromArray({
      fieldnotes: globalWrite.fieldnotes,
      array: 'sections',
      element: elementToRemove,
    })

    if (response.success) {
      const element = d.getElementById(sectionIndex)
      if (element) {
        // Remove section from the DOM
        element.remove()
      }

      // Remove section from the in-memory fieldnotes
      globalWrite.fieldnotes.sections = globalWrite.fieldnotes.sections.filter(
        (section) => section.sectionIndex !== sectionIndex
      )
      globalWrite.fieldnotes.sectionOrder =
        globalWrite.fieldnotes.sectionOrder.filter((id) => id !== sectionIndex)

      // Notify user
      showNotificationsDialog({
        message: response.message,
        type: 'success',
      })
    }
  } catch (e) {
    showNotificationsDialog({
      message: e.message,
      type: 'error',
    })
  }
}

export const isSectionBeingAdded = ({ globalWrite, sectionToUpdate }) => {
  let isBeingAdded =
    sectionToUpdate === null &&
    !hasOriginalTypeValues({ globalWrite, section: sectionToUpdate })

  return isBeingAdded
}

export const addSectionToFieldnotes = async ({ globalWrite, section }) => {
  const array = 'sections'
  const isBeingAdded = true

  const response = await addElementToArray({
    fieldnotes: globalWrite.fieldnotes,
    element: section,
    array,
    isBeingAdded,
  })

  // Update changes in memory where necessary (species and terms sections will already have been addded at this point)
  if (response.success) {
    const hasSectionAlreadyBeenAdded = globalWrite.fieldnotes.sections.find(
      (s) => s.sectionIndex === section.sectionIndex
    )
    if (hasSectionAlreadyBeenAdded) return

    globalWrite.fieldnotes.sections.push(section)
    globalWrite.fieldnotes.sectionOrder.push(section.sectionIndex)
    globalWrite.nextSectionIndex++

    // Set the original values to the updated values
    setOriginalTypeValues({
      section,
      globalWrite,
      type: section.type,
    })

    showNotificationsDialog({
      message: `${section.name} added`,
      type: 'success',
      displayDuration: 4000,
    })
  }

  return response
}

export const updateSectionArray = ({
  globalWrite,
  sectionToUpdate,
  sectionAddedOrUpdated,
}) => {
  addOrUpdateSectionArray({
    globalWrite,
    sectionToUpdate,
    sectionAddedOrUpdated,
    isBeingAdded: false,
  })
}

export const addOrUpdateSectionArray = async ({
  globalWrite,
  sectionToUpdate,
  sectionAddedOrUpdated,
  isBeingAdded,
}) => {
  try {
    const array = 'sections'

    // Save changes to the db
    let response

    if (isBeingAdded) {
      response = await addSectionToFieldnotes({
        globalWrite,
        section: sectionAddedOrUpdated,
      })
    } else {
      response = await updateElementFromArray({
        fieldnotes: globalWrite.fieldnotes,
        array,
        elementToUpdate: sectionToUpdate,
        elementAddedOrUpdated: sectionAddedOrUpdated,
        isBeingAdded,
      })
      // Set the original values to the updated values
      setOriginalTypeValues({
        section: sectionAddedOrUpdated,
        globalWrite,
        type: sectionToUpdate.type,
      })

      // Update the fieldnotes section
      Object.assign(
        globalWrite.fieldnotes.sections.find(
          (section) =>
            section.sectionIndex === sectionAddedOrUpdated.sectionIndex
        ),
        sectionAddedOrUpdated
      )
    }

    // Notify user
    showNotificationsDialog({
      message: response.message,
      type: 'success',
    })

    return response
  } catch (e) {
    showNotificationsDialog({
      message: e.message,
      type: 'error',
    })
  }
}

export const editSection = ({
  e,
  addOrUpdateSectionBtn,
  editSectionBtn,
  cancelActionBtn,
  contentContainer,
}) => {
  const parent = e.target.parentElement
  contentContainer.classList.remove('disabled')

  addOrUpdateSectionBtn.setText({
    text: 'Save changes',
  })
  addOrUpdateSectionBtn.enable()
  editSectionBtn.hide()
  cancelActionBtn.show()

  Array.from(parent.querySelectorAll('.edit:not(.add')).forEach((el) =>
    el.classList.add('hidden')
  )
  Array.from(parent.querySelectorAll('.add')).forEach((el) =>
    el.classList.remove('hidden')
  )
}

// UI updates
export const addContentToPreviewContainer = ({
  previewTemplate,
  textContent,
  previewContainer,
}) => {
  const t = d.getElementById(previewTemplate.templateId)
  const clone = t.content.cloneNode(true)
  const p = clone.querySelector(previewTemplate.element)
  p.textContent = textContent
  previewContainer.appendChild(clone)
}

export const toggleSpeciesList = ({ btn, btnPair, fieldset }) => {
  if (btn.getText().toLowerCase() === 'show only included') {
    fieldset
      .querySelectorAll('input[type="checkbox"]:not(:checked)')
      .forEach((input) => {
        input.closest('figure').classList.add('hidden')
      })
    btn.setText({
      text: 'show all',
    })
    btnPair.setText({
      text: 'show all',
    })
  } else {
    fieldset.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.closest('figure').classList.remove('hidden')
    })
    btn.setText({
      text: 'show only included',
    })
    btnPair.setText({
      text: 'show only included',
    })
  }
}

export const scoreLesson = ({ answers, global }) => {
  answers.forEach((answer) => {
    const sp = global.species.find((s) => s.taxon.id === Number(answer.id))

    if (!sp) return

    let isCorrect = false

    if (answer.value.length) {
      isCorrect =
        global.target.name === 'common name'
          ? sp.taxon.preferred_common_name.toLowerCase() ===
            answer.value.toLowerCase()
          : sp.taxon.name.toLowerCase() === answer.value.toLowerCase()
    }

    const score = {
      id: sp.taxon.id,
      isCorrect,
    }

    const isRetry = global.template.scores.find((s) => s.id === score.id)

    if (isRetry) {
      const index = global.template.scores.findIndex((s) => s.id === score.id)
      global.template.scores[index] = score
    } else {
      global.template.scores.push(score)
    }
  })

  global.template.score =
    global.template.scores.filter((score) => score.isCorrect)?.length || 0
}

export const checkForLocalisedCommonSpeciesNames = ({
  globalSpecies,
  sectionSpecies,
}) => {
  // Check that there is a valid name for a taxa e.g. not the empty string or a placeholder (-)
  const prohibitedNames = [' ', '-']

  try {
    if (globalSpecies?.taxon?.preferred_common_name) {
      if (
        !prohibitedNames.includes(globalSpecies.taxon.preferred_common_name)
      ) {
        if (sectionSpecies.taxon) {
          sectionSpecies.taxon.preferred_common_name =
            globalSpecies.taxon.preferred_common_name || '-'
        } else {
          // observations (for now)
          sectionSpecies.taxon = {
            ...globalSpecies.taxon,
            default_photo: {
              ...globalSpecies.taxon.default_photo,
              src: sectionSpecies.src,
            },
          }
        }
      } else {
        sectionSpecies.taxon = {
          ...globalSpecies.taxon,
          default_photo: {
            ...globalSpecies.taxon.default_photo,
            src: sectionSpecies.src,
          },
        }
      }
    }
    return sectionSpecies
  } catch (e) {
    logger({
      message: e.message,
      type: 'warn',
    })
  }
}

export const enableSaveFieldNotesSection = ({
  globalWrite,
  saveFieldnotesSection,
}) => {
  // Check fieldnotes have not been saved
  if (globalWrite.isUserEditing) return

  // Check fields added by the user
  let areFieldsValid = true

  // Title
  areFieldsValid = areFieldsValid && globalWrite.fieldnotes.title.length > 2

  // Author
  areFieldsValid = areFieldsValid && globalWrite.fieldnotes.author.length > 2

  // Date
  areFieldsValid =
    areFieldsValid && isValidDate({ date: globalWrite.fieldnotes.d1 })
  areFieldsValid =
    areFieldsValid && isValidDate({ date: globalWrite.fieldnotes.d2 })

  // Location
  areFieldsValid =
    areFieldsValid && globalWrite.fieldnotes.location.place_guess.length > 2

  areFieldsValid
    ? saveFieldnotesSection.classList.remove('disabled')
    : saveFieldnotesSection.classList.add('disabled')
}

export const updateFieldnotesStateSection = ({
  globalWrite,
  updateFieldnotesStatusBtn,
  updateFieldnotesStatusText,
  updateFieldnotesCurrentStatusText,
}) => {
  if (globalWrite.fieldnotesStubs.status === 'public') {
    updateFieldnotesStatusBtn.setText({
      text: 'Set your fieldnotes to private',
    })
    updateFieldnotesStatusText.innerText =
      'If you set your fieldnotes to private, they will no longer viewable by others.'
  } else {
    updateFieldnotesStatusBtn.setText({
      text: 'Publish your fieldnotes',
    })
    updateFieldnotesStatusText.innerText =
      'Publishing your fieldnotes will make them available to others.'
  }
  updateFieldnotesCurrentStatusText.innerText =
    globalWrite.fieldnotesStubs.status
}

export const cloneSpeciesCardFromTemplate = ({
  templateToClone,
  species,
  index,
}) => {
  try {
    const clone = templateToClone.content.cloneNode(true)

    const img = clone.querySelector('img')
    const figcaption = clone.querySelector('figcaption')
    const spans = figcaption.querySelectorAll('span')

    const commonName =
      species.species_guess || species.taxon.preferred_common_name || '-'
    const taxonName = species.taxon.name
    // Check for observations saved (fieldnotes), then observations directly from inat (inat search), then finally use the taxon fallback (i.e. species)
    const url =
      species?.observation?.default_photo.url ||
      species?.observation_photos?.[0]?.photo?.url ||
      species.taxon.default_photo.square_url
    const taxonId = species.taxon.id

    figcaption.style.setProperty(
      'background-color',
      getTaxonGroupColour({
        taxon: species.taxon.iconic_taxon_name,
      })
    )

    spans[0].textContent = commonName
    spans[1].textContent = taxonName
    spans[1].classList.add('latin')

    img.src = url.replace('square', 'small')
    img.alt = taxonName
    img.id = taxonId
    img.setAttribute('data-i', index + 1)
    img.setAttribute('loading', 'lazy')
    img.setAttribute('tabindex', 0)

    return clone
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const handleLanguagePreference = ({
  globalRead,
  rememberLanguageCheckbox,
}) => {
  const rbLanguageGroup = d.querySelectorAll('input[name="language"]')

  rbLanguageGroup.forEach((rb) => {
    // If language preference was saved in local storage, preselect it
    if (globalRead.language && rb.value === globalRead.language.id) {
      rb.checked = true
    }

    // Update preference on selecting a language, if save option is checked
    rb.addEventListener('change', () => {
      globalRead.language = globalRead.LANGUAGES.find((l) => l.id === rb.value)
      if (rememberLanguageCheckbox.checked) {
        appLocalStorage.set({
          key: 'language',
          value: globalRead.language,
        })
        showNotificationsDialog({
          message: 'Your preferred language has been saved.',
        })
      }
    })
  })

  // Save currently selected language if user checks save option
  rememberLanguageCheckbox.addEventListener('change', () => {
    if (rememberLanguageCheckbox.checked) {
      appLocalStorage.set({
        key: 'language',
        value: globalRead.language,
      })
      showNotificationsDialog({
        message: 'Your preferred language has been saved.',
      })
    }
  })

  // Now the languages are ready, and the current language selected, display the language section
  // languageGroupContainer.classList.remove('hidden')
}

// Section state
export const setOriginalTypeValues = ({ globalWrite, section, type }) => {
  // Updating an element in an array such as section in sections, requires us first to delete
  // the original element as it was before it was changed. Which is why we need to track original values.
  const typeValues = structuredClone({
    values:
      section[type] || section.paras || section.h3 || section.h4 || section.p,
    sectionIndex: section['sectionIndex'],
  })
  const hasOriginalValues = globalWrite.originalTypeValues.find(
    (type) => type.sectionIndex === section['sectionIndex']
  )
  if (hasOriginalValues) {
    globalWrite.originalTypeValues.forEach((type) => {
      if (type.sectionIndex === section['sectionIndex']) {
        type.values = typeValues.values
      }
    })
  } else {
    globalWrite.originalTypeValues.push(typeValues)
  }
}

export const getOriginalTypeValues = ({ globalWrite, section, type }) => {
  const typeValues =
    section === null
      ? []
      : structuredClone(
          globalWrite.originalTypeValues.find(
            (values) => values.sectionIndex === section['sectionIndex']
          )?.values
        ) || section[type]

  return typeValues
}

export const hasOriginalTypeValues = ({ globalWrite, section }) => {
  const typeValues =
    section === null
      ? []
      : structuredClone(
          globalWrite.originalTypeValues.find(
            (values) => values.sectionIndex === section['sectionIndex']
          )?.values
        ) || []

  return typeValues.length > 0
}

export const handleInputChangeEvent = (e, addBtn) => {
  addBtn.toggleActiveStateByInput({
    str: e.target.value,
  })
}

export const fetchFieldnotesStubs = ({
  inputText,
  dataList,
  global,
  fetchFieldnotesBtn,
  readonly = false,
  fnAutocompleteTitleInputText,
  window,
}) => {
  return async ({ user }) => {
    const fieldnotesStubs = user
      ? await getFieldnotesStubs({
          user,
          readonly,
        })
      : await getFieldnotesStubs({
          user: null,
          readonly: true,
        })

    global.fieldnotesStubsCollection = await fieldnotesStubs

    // Check for slug
    const { slug } = validateSlug({
      pathname: window.location.pathname,
      slugs: global.fieldnotesStubsCollection.map(
        (fieldnotes) => fieldnotes.slug
      ),
    })

    const stubs = global.fieldnotesStubsCollection
    const fieldnotesFromSlug = stubs.find((stub) => stub.slug === slug)

    if (fieldnotesFromSlug) {
      fnAutocompleteTitleInputText.value = fieldnotesFromSlug?.title
      fetchFieldnotesBtn.focus()

      if (window) {
        updateHistoryAndTitle({
          window,
          slug: fieldnotesFromSlug.slug,
          title: fieldnotesFromSlug.title,
        })
      }
    }

    fieldnotesAutocomplete({
      inputText,
      dataList,
      global,
      fetchFieldnotesBtn,
      fieldnotesStubs,
      fieldnotesFromSlug,
    })
  }
}

// Firebase authentication
export const authenticateUserEmailAndPassword = ({
  global,
  user,
  email,
  password,
  showNotificationsDialog,
}) => {
  if (user) {
    global.fieldnotesStubsCollection = []
    firebaseSignOut({
      auth: getFirebaseAuth(),
      showNotificationsDialog,
    })
  } else {
    if (email.validity.valid) {
      firebaseLogin({
        email: email.value,
        password: password.value,
        showNotificationsDialog,
      })
    }
  }
}

export const authenticateNewUserEmailAndPassword = async ({
  email,
  password,
  showNotificationsDialog,
  signUpBtn,
  callback,
}) => {
  try {
    let success = false
    if (email.validity.valid) {
      success = await firebaseCreateAccount({
        email: email.value,
        password: password.value,
        showNotificationsDialog,
      })
      if (success) {
        signUpBtn.hide()
        callback()
      }
    }
  } catch (e) {
    showNotificationsDialog({
      message: e.message,
      type: 'error',
    })
  }
}

// Additional Firebase calls
export const fieldnotesAutocomplete = async ({
  inputText,
  dataList,
  global,
  fieldnotesStubs,
  fetchFieldnotesBtn,
  fieldnotesFromSlug,
}) => {
  const addTitlesToList = async ({
    dataList,
    strToComplete,
    fieldnotesStubs,
  }) => {
    try {
      const stubs = await fieldnotesStubs

      while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild)
      }

      const matches = stubs.filter((item) =>
        item.title.toLowerCase().startsWith(strToComplete.toLowerCase())
      )

      dataList.replaceChildren()

      matches.forEach((match) => {
        const option = d.createElement('option')
        option.value = match['title']
        dataList.appendChild(option)
      })

      return stubs
    } catch (e) {
      showNotificationsDialog({
        message: 'You are not logged in.',
        type: 'error',
      })
      console.log(e)
    }
  }

  // The list of titles will initially be short, so we load it at once, in its entirety
  let stubs = await addTitlesToList({
    dataList,
    strToComplete: '',
    fieldnotesStubs,
  })

  inputText.addEventListener(
    'input',
    debounce(async (e) => {
      stubs = await addTitlesToList({
        dataList,
        strToComplete: e.target.value,
        fieldnotesStubs,
      })
    }, 0)
  )

  inputText.addEventListener('change', (e) => {
    const match = e.target.value

    if (match) {
      global.fieldnotesStubs = stubs.find((option) => option.title === match)
      fetchFieldnotesBtn.enable()
      fetchFieldnotesBtn.focus()
    } else {
      fetchFieldnotesBtn.disable()
    }
  })

  if (fieldnotesFromSlug) {
    global.fieldnotesStubs = stubs.find(
      (option) => option.title === fieldnotesFromSlug.title
    )
    fetchFieldnotesBtn.enable()
  }
}

export const updateMetadataFields = async ({ globalWrite, prop, value }) => {
  // Check fieldnotes have been saved
  if (!globalWrite.isUserEditing) return

  let response
  try {
    if (prop === 'title') {
      if (
        isFieldnotesTitleUnique({
          titles: globalWrite.fieldnotesStubsCollection.map(
            (stub) => stub.title
          ),
          title: value,
        })
      ) {
        response = await updateFieldnotesTitle({
          fieldnotes: globalWrite.fieldnotes,
          prop,
          value,
          fieldnotesStubs: globalWrite.fieldnotesStubs,
        })
        // Update currently selected fieldnotes stub
        globalWrite.fieldnotesStubs.title = value
      } else {
        response = {
          message: 'Titles must be unique. Your new title is already in use.',
          type: 'error',
        }
      }
    } else {
      response = await updateFieldnoteProperty({
        fieldnotes: globalWrite.fieldnotes,
        prop,
        value,
      })
    }

    showNotificationsDialog({
      message: response.message,
      type: response.type,
      displayDuration: 2000,
    })

    return response
  } catch (e) {
    showNotificationsDialog({
      message: `${e.message} for ${prop}`,
      type: 'error',
    })
  }
}

export const updateHistoryAndTitle = ({ window, slug, title }) => {
  // Once the newly selected fieldnotes have loaded, update the browser history
  if (slug) {
    window.history.pushState({}, title, `/${slug}`)
    window.document.title = `iFieldnotes | ${title}`

    // Add canonical link to self
    window.document
      .querySelector("link[rel='canonical']")
      .setAttribute('href', `https://ifieldnotes.org/${slug}`)
  } else {
    window.history.pushState({}, title, '/')
  }
}

// export const storeFieldnotes = async ({id, article}) => {
//     try {
//         const url = `${process.env.FUNCTIONS_URL}/.netlify/functions/storeFieldnotes` || 'https://ifieldnotes.org/.netlify/functions/storeFieldnotes'

//         // Create a Blob with HTML content
//         const blob = new Blob([article], { type: 'text/html' })

//         // Create a FileReader object to read the Blob
//         const reader = new FileReader()

//         reader.onload = function(event) {
//             const content = event.target.result
//             console.log('content', content)
//         }

//         // Start reading the Blob
//         reader.readAsText(blob)

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'text/html',
//                 'Context-ID': id
//             },
//             body: blob,
//         })
//         const text = await response.text()
//         console.log(text)
//     } catch (e) {
//         logger({
//             message: e.message
//           , type: 'error'
//           , stack: e.stack
//         })
//     }
// }

// export const getFieldnotesFromStore = async ({id}) => {
//     try {
//         const url = `${process.env.FUNCTIONS_URL}/.netlify/functions/storeFieldnotes` || 'https://ifieldnotes.org/.netlify/functions/storeFieldnotes'
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//             'Context-ID': id
//             },
//         })
//         const html = await response.text()
//         console.log(html)
//     } catch (e) {
//         logger({
//             message: e.message
//           , type: 'error'
//           , stack: e.stack
//         })
//     }

//     // Optionally, insert the HTML into the DOM
//     //   document.getElementById('html-container').innerHTML = html
// }
