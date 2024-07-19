// FIREBASE

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import {
  setLogLevel,
  getFirestore,
  collection,
  query,
  and,
  where,
  or,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'

import { templates } from '../common/templates.js'
import { logger, sortBy } from '../common/utils.js'

setLogLevel('silent')

// INAT API

export const getInatObservations = async ({
  user_key = 'user_id',
  user_id = null,
  place_key = 'place_id',
  place_id = null,
  iconic_taxa,
  per_page = 20,
  page = 1,
  locale = 'en',
  species_count = false,
  d1,
  d2,
}) => {
  let params = ''

  params = user_id ? params + `&${user_key}=${user_id}` : params
  params = place_id ? params + `&${place_key}=${place_id}` : params
  params = iconic_taxa
    ? params +
      `&iconic_taxa=${iconic_taxa.map((taxon) => taxon.name).join(',')}`
    : params
  params = params + `&page=${page}&per_page=${per_page}`
  params = params + `&locale=${locale}`

  if (!!d1 & !!d2) {
    params = params + `&d1=${d1}`
    params = params + `&d2=${d2}`
  }

  const base = species_count
    ? 'https://api.inaturalist.org/v1/observations/species_counts'
    : 'https://api.inaturalist.org/v1/observations'
  const url = `${base}?order=desc&photos=true` + params

  const response = await fetch(url)
  const json = await response.json()
  const observations = await json.results
  return await observations
}

export const getIdByAutocomplete = async ({ by, toComplete }) => {
  const url = `https://api.inaturalist.org/v1/${by}/autocomplete?q=${toComplete}&per_page=10`
  const response = await fetch(url)
  const json = await response.json()
  return json
}

export const getInatTaxa = async ({ taxaIds, locale = 'en', per_page }) => {
  const buffer = 50 // request more records than species count to ensure we don't miss one…
  const url =
    `https://api.inaturalist.org/v1/taxa?locale=${locale}&per_page=${per_page + buffer}&taxon_id=` +
    taxaIds.join('%2C')
  const response = await fetch(url)
  const json = await response.json()
  return json
}

export const getFirebaseAuth = () => {
  return getAuth(getApp())
}

const getApp = () => {
  // Initialise Firebase
  const app = initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  })

  return app
}

// FIREBASE UI

export const firebaseAuthentication = () => {
  return getAuth(getApp())
}

export const firebaseLogin = ({ email, password, showNotificationsDialog }) => {
  const auth = getAuth(getApp())
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      return {
        success: true,
        message: 'Your log in was successful.',
      }
    })
    .catch((e) => {
      showNotificationsDialog({
        message: e.message,
        type: 'error',
        displayDuration: 5000,
      })
    })
}

export const firebaseSignOut = ({ auth, showNotificationsDialog }) => {
  signOut(auth)
    .then(() => {
      logger({ message: 'Sign-out successful' })
    })
    .catch((e) => {
      showNotificationsDialog({
        message: e.message,
        type: 'error',
        displayDuration: 5000,
      })
    })
}

export const firebaseCreateAccount = async ({
  email,
  password,
  showNotificationsDialog,
}) => {
  const auth = getAuth(getApp())
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      showNotificationsDialog({
        message: 'You successfully created a new account.',
        displayDuration: 5000,
      })
      return true
    } else {
      logger({ message: 'Could not create account' })
    }
  } catch (e) {
    showNotificationsDialog({
      message: e.message,
      type: 'error',
      displayDuration: 5000,
    })
  }
}

export const onFirebaseAuthStateChange = ({
  auth,
  globalWrite,
  authenticateBtn,
  signUpBtn,
  firebaseSignUpCheckbox,
  fetchFieldnotesStubs,
  isAuthenticatedSections,
}) => {
  const container = authenticateBtn.buttonElement.parentElement.closest(
    '.inat-preferences-section'
  )
  const text = container.querySelector('#authenticate-state-text')
  const loggedOut = container.querySelectorAll('.logged-out')

  return onAuthStateChanged(auth, (user) => {
    globalWrite.user = user
    if (user) {
      authenticateBtn.show()
      authenticateBtn.setText({
        text: 'Log out',
      })
      if (signUpBtn) signUpBtn.hide()
      if (firebaseSignUpCheckbox) firebaseSignUpCheckbox.uncheck()
      if (fetchFieldnotesStubs) fetchFieldnotesStubs({ user })
      text.innerText = `Logged in as ${user.email}`
      loggedOut.forEach((out) => out.classList.add('hidden'))
      // Enable site
      if (isAuthenticatedSections)
        isAuthenticatedSections.forEach((section) =>
          section.classList.remove('disabled')
        )
      logger({ message: `User is logged in` })
    } else {
      authenticateBtn.setText({
        text: 'Log in',
      })
      if (fetchFieldnotesStubs) fetchFieldnotesStubs({ user: null })
      text.innerText = 'You are logged out.'
      loggedOut.forEach((out) => out.classList.remove('hidden'))
      if (isAuthenticatedSections)
        isAuthenticatedSections.forEach((section) =>
          section.classList.add('disabled')
        )
      logger({ message: `User is logged out` })
    }
  })
}

export const onUserLoggedIn = ({ auth, globalRead, fetchFieldnotesStubs }) => {
  return onAuthStateChanged(auth, (user) => {
    globalRead.user = user
    if (user) {
      if (fetchFieldnotesStubs) fetchFieldnotesStubs({ user })
    } else {
      if (fetchFieldnotesStubs) fetchFieldnotesStubs({ user: null })
    }
  })
}

const getDb = () => {
  // Get an instance of the Firestore
  return getFirestore(getApp())
}

const getFieldnotesCollectionRef = ({ db }) => {
  return collection(db, 'fieldnotes')
}

const getFieldnotesStubsCollectionRef = ({ db }) => {
  try {
    return collection(db, 'fieldnotes-stubs')
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const getFieldnotes = async () => {
  const db = getDb()
  const fieldnotesCollectionRef = getFieldnotesCollectionRef({ db })
  const notesDocsRef = await getDocs(fieldnotesCollectionRef)
  const notesList = notesDocsRef.docs.map((doc) => {
    return doc.data()
  })
  return notesList
}

export const getFieldnotesById = async ({ id }) => {
  let docRef = null

  try {
    docRef = doc(getDb(), 'fieldnotes', id)
    const docSnap = await getDoc(docRef)
    return {
      data: docSnap.data(),
      success: true,
      message: 'Fieldnotes returned',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const getFieldnotesStubs = async ({ user, readonly = false }) => {
  try {
    const db = getDb()
    const collectionRef = getFieldnotesStubsCollectionRef({
      db,
    })

    let notesDocsRef, q, or_q, or_notesDocsRef, or_stubsList

    if (readonly) {
      // Read fieldnotes: show public
      q = query(collectionRef, where('status', '==', 'public'))
      // And private when logged in
      if (user) {
        or_q = query(
          collectionRef,
          and(
            where('uid', '==', user.uid),
            or(where('status', '==', 'private'))
          )
        )
        or_notesDocsRef = await getDocs(or_q)
        or_stubsList = or_notesDocsRef.docs.map((doc) => {
          return doc.data()
        })
      } else {
        or_stubsList = []
      }
    } else {
      // Create and edit for logged in users
      // Allow only private and public states, not deleted
      q = query(
        collectionRef,
        and(
          where('uid', '==', user.uid),
          or(where('status', '==', 'private'), where('status', '==', 'public'))
        )
      )
    }

    notesDocsRef = await getDocs(q)

    const stubsList = notesDocsRef.docs.map((doc) => {
      return doc.data()
    })

    const list = readonly ? stubsList.concat(or_stubsList) : stubsList

    return sortBy({
      arr: list,
      prop: 'created',
      dir: 'desc',
    })
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const addTerm = async ({ term }) => {
  const db = getDb()
  let id,
    data = null

  try {
    const collectionRef = collection(db, 'fieldnotes-terms')
    const termRef = await doc(collectionRef)
    id = termRef.id
    data = {
      ...term,
      id,
    }
    await setDoc(termRef, data)

    return {
      success: true,
      message: 'Term added',
      id,
      type: 'success',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const getTerms = async () => {
  const db = getDb()
  const collectionRef = collection(db, 'fieldnotes-terms')
  const termsDocsRef = await getDocs(collectionRef)
  const terms = termsDocsRef.docs.map((doc) => {
    return doc.data()
  })
  return terms
}

export const addFieldnotes = async ({
  fieldnotes,
  status = 'private',
  user,
}) => {
  const db = getDb()
  let id,
    data = null

  try {
    // Add new fieldnotes to collection
    const fieldnotesCollectionRef = getFieldnotesCollectionRef({ db })
    const fieldNotesRef = await doc(fieldnotesCollectionRef)
    id = fieldNotesRef.id
    data = {
      ...fieldnotes,
      id,
    }
    await setDoc(fieldNotesRef, data)

    // Add new fieldnotes stub to collection
    const fieldnotesStubCollectionRef = getFieldnotesStubsCollectionRef({ db })
    const fieldNotesStubRef = await doc(fieldnotesStubCollectionRef)
    const stubId = fieldNotesStubRef.id
    data = {
      id: stubId,
      fieldnotesId: id,
      title: fieldnotes.title,
      author: fieldnotes.author,
      status,
      created: Date.now(),
      uid: user.uid,
      slug: fieldnotes.slug,
    }
    await setDoc(fieldNotesStubRef, data)

    const message =
      status === 'public'
        ? 'Your fieldnotes have been saved, and are available to others.'
        : 'Your fieldnotes have been saved, but can be viewed only be you.'

    return {
      success: true,
      message,
      id,
      type: 'success',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const updateFieldNotes = async ({ fieldnotes, data }) => {
  let docRef = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes', fieldnotes.id)
    await updateDoc(docRef, data)

    return {
      success: true,
      message: 'Fieldnotes updated',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const updateFieldNotesStubs = async ({ fieldnotesStubs, data }) => {
  let docRef = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes-stubs', fieldnotesStubs.id)
    updateDoc(docRef, data)

    return {
      success: true,
      message: 'Fieldnotes stubs updated',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const deleteFieldnoteProperty = async ({ fieldnotes, prop }) => {
  const db = getDb()
  const docRef = doc(db, 'fieldnotes', fieldnotes.id)
  const data = {
    [prop]: deleteField(),
  }
  await updateDoc(docRef, data)
}

export const updateFieldnoteProperty = async ({ fieldnotes, prop, value }) => {
  let docRef,
    data = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes', fieldnotes.id)
    data = {
      [prop]: value,
    }
    await updateDoc(docRef, data)

    return {
      success: true,
      message: `${prop.charAt(0).toUpperCase() + prop.slice(1)} updated`,
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const updateFieldnoteStubProperty = async ({
  fieldnotesStubs,
  prop,
  value,
}) => {
  let docRef,
    data = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes-stubs', fieldnotesStubs.id)
    data = {
      [prop]: value,
    }
    await updateDoc(docRef, data)

    return {
      success: true,
      message: `${prop.charAt(0).toUpperCase() + prop.slice(1)} updated`,
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const updateFieldnotesTitle = async ({
  fieldnotes,
  prop,
  value,
  fieldnotesStubs,
}) => {
  let response

  try {
    response = await updateFieldnoteProperty({ fieldnotes, prop, value })
    if (response.success) {
      response = await updateFieldnoteStubProperty({
        fieldnotesStubs,
        prop,
        value,
      })
      return {
        success: true,
        message: 'Title updated',
      }
    }
  } catch (e) {
    console.warn('API error: ', e)
  }
}

export const removeWhitespace = (str) => {
  return str.replace(/\s+/g, '')
}

export const isFieldnotesTitleUnique = ({ titles, title }) => {
  return !titles
    .map((t) => removeWhitespace(t.toLowerCase()))
    .includes(removeWhitespace(title.toLowerCase()))
}

export const addElementToArray = async ({
  fieldnotes,
  array,
  element,
  isBeingAdded = true,
}) => {
  let docRef,
    data = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes', fieldnotes.id)

    data = {
      [array]: arrayUnion(element),
    }
    await updateDoc(docRef, data)

    if (array === 'sections' && isBeingAdded) {
      data = {
        sectionOrder: arrayUnion(element.sectionIndex),
      }
      await updateDoc(docRef, data)

      return {
        success: true,
        message: `${element.name} added`,
      }
    } else {
      return {
        success: true,
        message: `${element.name} added`,
      }
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const removeElementFromArray = async ({
  fieldnotes,
  array,
  element,
  isBeingAdded = true,
}) => {
  let docRef,
    data = null

  try {
    const db = getDb()
    docRef = doc(db, 'fieldnotes', fieldnotes.id)

    data = {
      [array]: arrayRemove(element),
    }

    await updateDoc(docRef, data)

    if (array === 'sections' && isBeingAdded) {
      data = {
        sectionOrder: arrayRemove(element.sectionIndex),
      }
      await updateDoc(docRef, data)

      return {
        success: true,
        message: `${element.name} deleted`,
      }
    } else {
      return {
        success: true,
        message: `${element.name} deleted`,
      }
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const updateElementFromArray = async ({
  fieldnotes,
  array,
  elementToUpdate,
  elementAddedOrUpdated,
  isBeingAdded,
}) => {
  // There is no native operation to update the element of an array
  // Instead, we remove the element, then add (the now updated) element
  const response = await removeElementFromArray({
    fieldnotes,
    array,
    element: elementToUpdate,
    isBeingAdded,
  })
  if (response.success) {
    await addElementToArray({
      fieldnotes,
      array,
      element: elementAddedOrUpdated,
      isBeingAdded,
    })

    return {
      success: true,
      message: `${elementToUpdate.name} updated`,
    }
  }
}

// LTP API

// HARD-CODED DATA

export const snapSpeciesTraits = [
  {
    behaviour: {
      value: ['migratory'],
    },
    'caterpillar colour': {
      unit: 'colour',
      value: ['white', ' black'],
    },
    'caterpillar length': {
      unit: 'cm',
      value: ['2.5'],
    },
    description: {
      value: [
        "A medium-sized butterfly with black wings, orange to red bands, and white spots. It has a wingspan of about 5cm. \n\nTypically found in moist woodlands, the red admiral caterpillar's primary host plant is the stinging nettle (Urtica dioica); it can also be found on the false nettle (Boehmeria cylindrica). \n\nThe adult butterfly drinks from flowering plants (inc. Buddleia, blackthorn, crab apple, hawthorn, dogwood, bramble, ivy blossom, and wild cherry) and overripe fruit. \n\nThey roost head-downwards on the trunks or lower branches of oaks, larches and other trees, where the bark-like underside of the wings provides them with excellent camouflage. Male red admirals are highly territorial.",
      ],
    },
    food: {
      value: ['Buddleia', 'Rotten fruit'],
    },
    habitat: {
      type: 'commensalism',
      value: ['hedera', 'woodland'],
    },
    'hibernating stage': {
      value: ['adult'],
    },
    name: 'Vanessa atalanta',
    relationships: [
      {
        description:
          'Red admirals will lay a dozen or so eggs a sizeable patch of nettles (Urtica dioica), one per leaf.',
        symbiont: {
          name: 'Urtica dioica',
          role: 'Food source',
        },
        type: 'Predator',
        value: ['Predation'],
      },
    ],
    'wing span': {
      unit: 'cm',
      value: ['5.6', '6.2'],
    },
  },
  {
    'cap height': {
      unit: 'cm',
      value: ['3-8'],
    },
    'cap shape': {
      value: ['Conical', 'Ovate'],
    },
    characteristic: {
      value: ['Polymorphic'],
    },
    description: {
      value: [
        'Ridges darken with maturity. The pits and ridges are primarily vertically oriented.\n\nThe cap that is attached to the stem with a small but noticeable groove.\n\nIt may be both saprobic and mycorrhizal at different points in its life cycle. \n\nIt grows alone, or scattered, or gregariously under hardwoods, including white ash, green ash, and tulip tree. \n\nFound late winter to early spring. It is widely distributed east of the Rocky Mountains.',
      ],
    },
    'gill attachment': {
      value: ['Decurrent'],
    },
    'how edible': {
      value: ['Choice'],
    },
    name: 'Morchella angusticeps',
    'tree ecology': {
      value: ['Hardwoods'],
    },
  },
  {
    'cap colour': {
      value: ['Orange', 'Yellow'],
    },
    'cap diameter': {
      unit: 'cm',
      value: ['2-9'],
    },
    'cap shape': {
      value: ['Infundibuliform'],
    },
    'cap texture': {
      value: ['Tomentose'],
    },
    description: {
      value: [
        'An ectomycorrhizal species of edible fungus in the mushroom family Cantharellaceae.\n\nThe fruit bodies of the fungus are brightly coloured yellow-orange, usually highly conspicuous against the soil. \n\nAt maturity, the mushroom resembles a filled funnel with the spore-bearing surface along the sloping outer sides. The texture of the fertile undersurface (hymenium) of the caps is a distinguishing characteristic: much smoother than the well-known golden chanterelle.',
      ],
    },
    'ecological type': {
      value: ['Mycorrhizal'],
    },
    'gill attachment': {
      value: ['Decurrent'],
    },
    'gill colour': {
      value: ['Pale yellow'],
    },
    'how edible': {
      value: ['Edible'],
    },
    'hymenium type': {
      value: ['Ridges'],
    },
    name: 'Cantharellus lateritius',
    'spore print colour': {
      value: ['Cream', 'Mycorrhizal'],
    },
    'stem height': {
      unit: 'cm',
      value: ['.5-1.7'],
    },
    'stipe character': {
      value: ['Bare'],
    },
  },
  {
    'cap shape': {
      value: ['N/a'],
    },
    description: {
      value: [
        'The fruiting body is 8–16cm across, consisting of one, unbranched clump of 1-5cm long, soft spines hanging from a tough, hidden base that is attached to the tree. The spines are white, ageing to brown-yellow.\n\nThe species is saprobic and parasitic, usually growing alone or in pairs and fruiting from the wounds of living hardwoods (especially oaks) in late summer and autumn, and over winter and spring in warmer climates.\n\n',
      ],
    },
    'ecological type': {
      value: ['parasitic'],
    },
    ecology: {
      value: ['hardwoods', ' trunks', ' dead wood'],
    },
    flesh: {
      unit: 'colour',
      value: ['white'],
    },
    'gill attachment': {
      value: ['N/a'],
    },
    'how edible': {
      value: ['choice'],
    },
    'hymenium type': {
      value: ['teeth'],
    },
    name: 'Hericium erinaceus',
    'spore print colour': {
      unit: 'colour',
      value: ['white'],
    },
    'stipe character': {
      value: ['n/a'],
    },
    symbionts: {
      value: ['Fagus', 'Turkey oak'],
    },
  },
  {
    'cap colour': {
      value: ['White', 'Grey', 'Grey-brown', 'Tan', 'Dark brown'],
    },
    'cap shape': {
      value: ['offset'],
    },
    'cap width': {
      unit: 'cm',
      value: ['5-25'],
    },
    collective: {
      value: ['White'],
    },
    description: {
      value: [
        "The oyster mushroom is widespread in many temperate and subtropical forests. It is saprotrophic, mainly on deciduous trees, beech trees in particular. It appears not to be parasitic i.e. only acts on dead wood and dying trees.\n\nThe mushroom has a broad, fan or oyster-shaped cap spanning 5–25cm.\n\nThe cap is white to grey or tan to dark-brown; the flesh is white, firm, and varies in thickness due to stipe arrangement. The gills of the mushroom are white to cream, and descend on the stalk if present. If so, the stipe is off-centre with a lateral attachment to wood. The spore print of the mushroom is white to lilac-grey. \n\nThe cap margin is inrolled when young, and is smooth and often somewhat lobed or wavy (undulate). The mushroom's stipe is often absent. When present, it is short and thick (the Latin pleurotus - sideways - refers to the sideways growth of the stem with respect to the cap).\n\nIts mycelia can kill and digest nematodes, which is believed to be a way in which the mushroom obtains nitrogen. The oyster mushroom is one of the few known carnivorous mushrooms.\n",
      ],
    },
    'ecological type': {
      value: ['saprotrophic'],
    },
    ecology: {
      value: ['mixed woodland'],
    },
    flesh: {
      unit: 'colour',
      value: ['white', ' tough in stem'],
    },
    'gill attachment': {
      value: ['Decurrent'],
    },
    grouping: {
      value: ['large clusters'],
    },
    'how edible': {
      value: ['choice'],
    },
    'hymenium type': {
      value: ['gills'],
    },
    'look-alikes': {
      value: [],
    },
    name: 'Pleurotus ostreatus',
    role: {
      value: ['Mycoremediation'],
    },
    smell: {
      unit: 'odour',
      value: ['mushroomy'],
    },
    'spore print colour': {
      value: ['white', ' lilac'],
    },
    'stipe character': {
      value: ['bare'],
    },
    symbionts: {
      value: ['Dead wood', 'Fagus', 'Deciduous', 'Nematode'],
    },
    symbiosis: {
      value: ['Predation'],
    },
  },
  {
    'cap shape': {
      value: ['Infundibuliform'],
    },
    description: {
      value: [
        'Mycorrhizal with oaks, and possibly other hardwoods, spring to autumn and widely distributed east of the Rocky Mountains.\n\nVase-shaped fruiting body with fine scaly, grey-black upper surface and smooth or shallowly wrinkled outer surface;  initially black but develops yellow-orange shades as the spores mature.\n\nRecently established as a species distinct from Craterellus cornucopioides.',
      ],
    },
    'ecological type': {
      value: ['Saprotrophic'],
    },
    'fruit height': {
      unit: 'cm',
      value: ['3-9'],
    },
    'fruit width': {
      unit: 'cm',
      value: ['1-5'],
    },
    'gill attachment': {
      value: ['Decurrent'],
    },
    'how edible': {
      value: ['Edible'],
    },
    'hymenium type': {
      value: ['Ridges'],
    },
    name: 'Craterellus fallax',
    'spore print colour': {
      value: ['Orange-yellow'],
    },
    'stipe character': {
      value: ['Bare'],
    },
  },
  {
    'cap colour': {
      value: ['sulpur yellow', ' fading'],
    },
    'cap shape': {
      value: ['flat'],
    },
    'cap texture': {
      value: ['Smooth'],
    },
    description: {
      value: [
        'The fruiting body emerges directly from the trunk of a tree and is initially knob-shaped, but soon expands to fan-shaped shelves, typically growing in overlapping tiers. \n\nIt is sulphur-yellow to bright orange in colour, fading to tan or white. Soft when young, toughening with age. \n\nThe shelves are 5-60cm across and up to 4cm thick. The fertile surface is sulphur-yellow with small pores or tubes and produces a white spore print. \n\nWhen fresh, the flesh is succulent with a strong fungal aroma and exudes a yellow, transparent juice, but quickly becomes dry and brittle.\n\nParasitic and saprobic on living and dead oaks.',
      ],
    },
    'ecological type': {
      value: ['saprotrophic', ' parasitic'],
    },
    ecology: {
      value: ['dead wood', ' hardwoods', ' trunks', ' stumps'],
    },
    flesh: {
      unit: 'colour',
      value: ['yellow', ' orange', ' white'],
    },
    'gill attachment': {
      value: ['N/a'],
    },
    grouping: {
      value: ['large groups'],
    },
    'how edible': {
      value: ['choice'],
    },
    'hymenium type': {
      value: ['pores'],
    },
    lookalikes: [
      {
        description:
          'The pore surface is bright yellow. Grows in shelves at the base of the tree. Favours oaks.',
        lookalike: {
          description:
            'The pore surface is cream/white. Grows away from the tree in a rosette of individual caps. Favours oaks.',
          name: 'Laetiporus cincinnatus',
        },
      },
      {
        description:
          'The pore surface is bright yellow. Grows in shelves at the base of the tree. Favours oaks.',
        lookalike: {
          description:
            'Commonly attached to dead logs or stumps at one point with a thick stem. Body can be yellow to brown with squamules (scales) on its upper side. On the underside are pores characteristic of the genus Cerioporus; made up of tubes packed closely together.',
          name: 'Polyporus squamosus',
        },
      },
    ],
    name: 'Laetiporus sulphureus',
    role: {
      value: ['Carbon dioxide production', 'Nutrient cycling', 'Bioindicator'],
    },
    'shelf thickness': {
      unit: 'cm',
      value: ['0.5-4'],
    },
    'shelf width': {
      unit: 'cm',
      value: ['5-60'],
    },
    'spore print colour': {
      value: ['white', 'White'],
    },
    'stipe character': {
      value: ['N/a'],
    },
    symbionts: {
      value: [
        'Fagus',
        'Quercus',
        'Prunus',
        'Salix',
        'Robinia',
        'Eucalyptus',
        'Ceratonia',
        'Yew',
      ],
    },
  },
]

const keys = [
  {
    key: 'mediterranean',
    values: [
      'Biodiversity hotspot: Mediterranean Sea 4% to 18% of all identified marine species in 0.82% of the global ocean surface.',
      '26,000 people have died attemptig to cross the Mediterranean since 2014',
      'Average annual temperatures are now 1.4 °C higher than during the period 1880-1899.',
      'The estimated sea level rise during the last two decades was ~3 cm/decade.',
    ],
  },
]

export const g = {
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
  LANGUAGES: [
    { name: 'Deutsche', id: 'de' },
    { name: 'English', id: 'en' },
    { name: 'Español', id: 'es' },
    { name: 'Français', id: 'fr' },
    { name: 'Italiano', id: 'it' },
    { name: 'Português', id: 'pt' },
    { name: 'Slovenščina', id: 'sl' },
  ],
  templates: templates,
  count: 12,
  species: null,
  inatSpecies: [],
  inatAutocompleteOptions: [
    {
      id: 'users',
      name: 'user',
      prop: 'login',
      placeholder: 'Start typing a username or user ID…',
      isActive: false,
      user: null,
    },
    {
      id: 'places',
      name: 'place',
      prop: 'display_name',
      placeholder: 'Start typing a location…',
      isActive: false,
      place: null,
    },
    {
      id: 'projects',
      name: 'project',
      placeholder: 'Start typing a name or URL slug, e.g. my-project…',
      prop: '',
      isActive: false,
      project: null,
    },
    {
      id: 'taxa',
      name: 'taxon',
      placeholder: 'Start typing the common or scientific name…',
      prop: 'matched_term',
      isActive: false,
      species: null,
    },
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
  matches: [],
  useObservationsSpeciesCountOptions: [
    { name: 'Species (iNaturalist photos)', id: 'true' },
    { name: 'Observations (user photos)', id: 'false' },
  ],
  dateOption: 'none',
}

export const inatControls = [
  {
    id: 9,
    multivalued: false,
    values: [
      {
        id: 10,
        label: 'Female',
      },
      {
        id: 11,
        label: 'Male',
      },
      {
        id: 20,
        label: 'Cannot Be Determined',
      },
    ],
    label: 'Sex',
  },
  {
    id: 12,
    multivalued: true,
    values: [
      {
        id: 13,
        label: 'Flowering',
      },
      {
        id: 14,
        label: 'Fruiting',
      },
      {
        id: 15,
        label: 'Flower Budding',
      },
      {
        id: 21,
        label: 'No Evidence of Flowering',
      },
    ],
    label: 'Plant Phenology',
  },
  {
    id: 17,
    multivalued: false,
    values: [
      {
        id: 18,
        label: 'Alive',
      },
      {
        id: 19,
        label: 'Dead',
      },
      {
        id: 20,
        label: 'Cannot Be Determined',
      },
    ],
    label: 'Alive or Dead',
  },
  {
    id: 1,
    multivalued: false,
    values: [
      {
        id: 2,
        label: 'Adult',
      },
      {
        id: 3,
        label: 'Teneral',
      },
      {
        id: 4,
        label: 'Pupa',
      },
      {
        id: 5,
        label: 'Nymph',
      },
      {
        id: 6,
        label: 'Larva',
      },
      {
        id: 7,
        label: 'Egg',
      },
      {
        id: 8,
        label: 'Juvenile',
      },
      {
        id: 16,
        label: 'Subimago',
      },
    ],
    label: 'Life Stage',
  },
  {
    id: 22,
    multivalued: true,
    values: [
      {
        id: 23,
        label: 'Feather',
      },
      {
        id: 24,
        label: 'Organism',
      },
      {
        id: 25,
        label: 'Scat',
      },
      {
        id: 29,
        label: 'Gall',
      },
      {
        id: 26,
        label: 'Track',
      },
      {
        id: 27,
        label: 'Bone',
      },
      {
        id: 28,
        label: 'Molt',
      },
    ],
    label: 'Evidence of Presence',
  },
]

// Admin

export const onAdminFirebaseAuthStateChange = ({ auth, getStubs }) => {
  return onAuthStateChanged(auth, async (user) => {
    getStubs({ user })
  })
}

export const getAdminFieldnotesStubs = async ({}) => {
  try {
    const db = getDb()
    const collectionRef = getFieldnotesStubsCollectionRef({
      db,
    })

    const q = query(collectionRef)

    const notesDocsRef = await getDocs(q)

    return notesDocsRef.docs.map((doc) => {
      return doc.data()
    })
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
  }
}

export const deleteFieldnotesById = async ({ id, fieldnotesId }) => {
  const db = getDb()
  try {
    await deleteDoc(doc(db, 'fieldnotes', fieldnotesId))
    await deleteDoc(doc(db, 'fieldnotes-stubs', id))
    return {
      success: true,
      message: 'Fieldnotes deleted',
    }
  } catch (e) {
    logger({
      message: e.message,
      type: 'error',
    })
    throw e
  }
}
