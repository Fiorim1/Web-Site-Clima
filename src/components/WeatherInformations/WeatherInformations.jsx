import './WeatherInformations.css'
function WeatherInformations({ weather }) {
  if (!weather || !weather.weather || weather.weather.length === 0) {
    return <p className="changeInfo">Carregando informações do clima...</p>
  }

  const srcImg = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`

  return (
    <div className='weather-container'>
      <h2>{weather.name}</h2>
      <div className='weather-info'>
        <img src={srcImg} alt="Ícone do clima" />
        <p className='temperature'>{Math.round(weather.main.temp)}°C</p>
      </div>
      <p className='description'>{weather.weather[0].description}</p>
      <div className='details'>
        <p>Sensação Térmica: {Math.round(weather.main.feels_like)}</p>
        <p>Umidade: {weather.main.humidity}%</p>
        <p>Pressão: {weather.main.pressure}</p>
      </div>
    </div>
  )
}

export default WeatherInformations
