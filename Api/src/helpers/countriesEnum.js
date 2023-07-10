const countries = require("../constants/states")
const {Country,State} = require("../connection/db")


async function createRecordsFromData() {
    for (const countryData of countries) {
      const [country, created] = await Country.findOrCreate({
        where: { name: countryData.country }
      });
      if (created) {
        for (const stateData of countryData.states) {
          await State.create({
            name: stateData,
            CountryId: country.id // asignar el valor de id de Country a CountryId en State
          });
        }
      }
    }
  }
  
  

module.exports = createRecordsFromData