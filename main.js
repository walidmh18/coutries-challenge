const countriesGridContainer = document.querySelector('.countriesGridContainer')
const searchInp = document.querySelector('#searchCountryName')
const regionToggle = document.querySelector('#region')
let regions = []



fetch('https://restcountries.com/v3.1/all')
.then(res => res.json())
.then(countries =>
   countries.forEach(country => {
      let countryContainer = document.createElement('div')
      countryContainer.classList.add('countryCard')
      let Country = {
         name: country.name.common,
         nativeName: '',
         population: country.population,
         region: country.region,
         subRegion: country.subregion,
         topLevelDomain: '',
         currencies:'',
         capital: '',
         languages: '',
         borders: JSON.stringify(country.borders),
      }   
      if (country.capital != null) {
         Country.capital = country.capital[0]
      } else {
         Country.capital = country.name.common
      }
      if (country.name.nativeName != null) {
         Country.nativeName = Object.values(country.name.nativeName)[0].common
      } else {
         Country.nativeName = country.name.common
      }
      if (country.tld != null) {
         Country.topLevelDomain = country.tld[0]
      } else {
         Country.topLevelDomain = ''
      }

      if (country.currencies != null) {
         Country.currencies = Object.values(country.currencies)[0].name
      } else {
         Country.topLevelDomain = ''
      }

      if (country.languages != null) {
         Country.languages = Object.values(country.languages)
      } else {
         Country.topLevelDomain = country.languages
      }
      // console.log(Country.borders);
      countryContainer.setAttribute('data-region',Country.region)
      countryContainer.setAttribute('data-subRegion',Country.subRegion)
      countryContainer.setAttribute('data-nativeName',Country.nativeName)
      countryContainer.setAttribute('data-topLevelDomain',Country.topLevelDomain)
      countryContainer.setAttribute('data-currencies',Country.currencies)
      countryContainer.setAttribute('data-languages',Country.languages)
      countryContainer.setAttribute('data-cca2',country.cca2)
      countryContainer.setAttribute('data-cca3',country.cca3)
      countryContainer.setAttribute('borders', Country.borders)
      countryContainer.setAttribute('onclick','seeCountryDetails(this)')

      countryContainer.innerHTML = `
      <div class="flag">
            <img src="https://flagcdn.com/${country.cca2.toLowerCase()}.svg" alt="${Country.name} flag">

         </div>
         <div class="description">
            <div class="name">
               <h2>${Country.name}</h2>
            </div>
            <p class="population">Population: <span>${Country.population}</span></p>
            <p class="region">Region: <span>${Country.region}</span></p>
            <p class="capital">Capital: <span>${Country.capital}</span></p>
         </div>
   `

   countriesGridContainer.append(countryContainer)

   if (!regions.includes(Country.region)) {
      regions.push(Country.region)
      let newRegionOption = document.createElement('option')
      newRegionOption.setAttribute('value', Country.region)
      newRegionOption.innerText = Country.region
      regionToggle.append(newRegionOption)

   }
      

   })
   
   )

regionToggle.addEventListener('input', () => {
   const countries = [...document.querySelectorAll('.countryCard')]
   countries.forEach(country=>{
      if (country.getAttribute('data-region') == regionToggle.value || regionToggle.value == 'All') {
         country.style.display = 'block'
      } else {
         country.style.display = 'none'
         
      }
   })
   
})

searchInp.addEventListener('input', () => {
   const countries = [...document.querySelectorAll('.countryCard')]
   countries.forEach(country=>{
      if (country.querySelector('h2').innerText.toLowerCase().includes(searchInp.value)) {
         country.style.display = 'block'
      } else {
         country.style.display = 'none'
         
      }
   })
})


const themeToggleBtn = document.querySelector('.themeToggle')
function switchTheme() {
   document.body.classList.toggle('dark')
   themeToggleBtn.querySelector('i').classList.toggle('fa-regular')
   themeToggleBtn.querySelector('i').classList.toggle('fa-solid')
}

const countryPopupContainer = document.querySelector('.countryPopupContainer')
const countryPopup = countryPopupContainer.querySelector('.countryPopup')
function seeCountryDetails(el) {
   const countries = [...document.querySelectorAll('.countryCard')]
   
   countryPopupContainer.style.display = 'block'
   countryPopupContainer.classList.add('active')
   let Name = el.querySelector('h2').innerText
   let Population = el.querySelector('.population').querySelector('span').innerText
   let capital = el.querySelector('.capital').querySelector('span').innerText
   let NativeName = el.getAttribute('data-nativeName')
   let region = el.getAttribute('data-region')
   let subRegion = el.getAttribute('data-subRegion')
   let topLevelDomain = el.getAttribute('data-topLevelDomain')
   let currencies = el.getAttribute('data-currencies')
   let cca2 = el.getAttribute('data-cca2')
   let languages = el.getAttribute('data-languages').split(',')

   countryPopup.querySelector('h2').innerText = Name
   countryPopup.querySelector('.population').innerText = Population
   countryPopup.querySelector('.capital').innerText = capital
   countryPopup.querySelector('.nativeName').innerText = NativeName
   countryPopup.querySelector('.region').innerText = region
   countryPopup.querySelector('.topLevelDomain').innerText = topLevelDomain
   countryPopup.querySelector('.subRegion').innerText = subRegion
   countryPopup.querySelector('.currencies').innerText = currencies

   for (let i = 0; i < languages.length; i++) {
      if (i +1 <languages.length) {
         countryPopup.querySelector('.languages').innerText +=  languages[i] + ' , '
         
      } else {
         countryPopup.querySelector('.languages').innerText +=  languages[i] 
         
      }      
   }

   
   countryPopup.querySelector('img').setAttribute('src', `https://flagcdn.com/${cca2.toLowerCase()}.svg`)
   let borders
   if (el.getAttribute('borders') != 'undefined') {
      borders = JSON.parse(el.getAttribute('borders'))
   } else{
      borders = ''
   }
   let borderCountries = []
      if (typeof(borders) == 'object') {
         borders.forEach(borderCountry=>{
            countries.forEach(country=>{
               if (country.getAttribute('data-cca3') == borderCountry) {
                  countryPopup.querySelector('.borderCountries').querySelector('p').append(createBorderCountry(country.querySelector('h2').innerText))
                  createBorderCountry(country.querySelector('h2').innerText)
               } 
            })
         
         })
         
      }
}
function createBorderCountry(name) {
   let borderCountry = document.createElement('span')
   borderCountry.innerText = name
   return borderCountry
   
}

function closePopup(){

   countryPopupContainer.style.display = 'none'
   countryPopup.querySelector('.languages').innerText =''
   countryPopup.querySelector('.borderCountries').querySelector('p').innerText ='Border Countries: '
   countryPopupContainer.classList.remove('active')

}

