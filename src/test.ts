import axios from 'axios'

async function teste () {
  let i = 0
  let pass = 0
  let errors = 0
  while (i < 200) {
    axios.get('http://127.0.0.1:8000')
      .then(response => {
        console.log(response.status)
        pass++
      })
      .catch(error => {
        console.log(error)
        errors++
      })
    await new Promise(resolve => setInterval(resolve, 100))
    i++
  }
  console.log(`Errors: ${errors}`)
  console.log(`Pass: ${pass}`)
}
teste()
