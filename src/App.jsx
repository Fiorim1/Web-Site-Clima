import { useState, useRef } from 'react'
import axios from 'axios'
import './App.css'
import WeatherInformations from '../src/components/WeatherInformations/WeatherInformations'

function App() {
  const [weather, setWeather] = useState({})
  const [weatherFiveDays, setWeatherFiveDays] = useState({})
  const inputRef = useRef()

  async function searchCity() {
    const city = inputRef.current.value
    const key = "ba088e17bc0c502e4feb94d89371d28d"

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`

    const urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`

    const apiInfo = await axios.get(url)

    const apiInfoFiveDay = await axios.get(urlFiveDays)
    setWeather(apiInfo.data)
    setWeatherFiveDays(apiInfoFiveDay.data)


    
  }

  return (
    <div className='container'>
        <h1>GFE Services Previsão Do Tempo</h1>
        <input ref={inputRef} type="text" placeholder='Digite o Nome da Cidade'/>
        <button onClick={searchCity}>Buscar</button>

        {weather && <WeatherInformations weather={weather}/>}
        {weatherFiveDays && <WeatherInformationsFiveDays weatherFiveDays={weatherFiveDays} />}
    </div>
    
  )
}

export default App
