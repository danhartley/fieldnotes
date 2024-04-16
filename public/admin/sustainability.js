import { hosting, co2 } from "@tgwf/co2"

const URL = 'www.ifieldnotes.org'

// See https://www.thegreenwebfoundation.org/news/start-calculating-digital-carbon-emissions-in-5-minutes-with-co2-js/

const isHostedSustainably = document.getElementById('is-hosted-sustainably')
hosting.check(URL).then((result) => {
  isHostedSustainably.innerText = result 
    ? 'The site ifieldnotes.org is hosted sustainably'
    : 'The site ifieldnotes.org is not hosted sustainably'
})

// See https://developers.thegreenwebfoundation.org/co2js/tutorials/getting-started-node/

// Sustainable Web Design selector
const swdEmissions = document.getElementById('swd-emissions')

// Initiate a new co2 object using the Sustainable Web Design (SWD) model.
const swd = new co2({ model: "swd" })

// Use the perByte method to calculate emissions for 1 GB
let emissions = swd.perByte(1000000000)

// Report emissions
swdEmissions.innerText = `Using the SWD perByte method the emissions for 1 GB is ${emissions.toFixed(2)} grams of CO2`

// OneByte selector
const oneByteEmissions = document.getElementById('one-byte-emissions')

// Using the oneByte model
const oneByte = new co2({ model: "1byte" })

emissions = oneByte.perByte(1000000000)

// Report emissions
oneByteEmissions.innerText = `Using the oneByte method the emissions for 1 GB is ${emissions.toFixed(2)} grams of CO2`
