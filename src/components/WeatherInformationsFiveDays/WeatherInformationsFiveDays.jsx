import './WeatherInformationsFiveDays.css'

function WeatherInformations({ weatherFiveDays }) {
    console.log(weatherFiveDays)

    const dailyForecast = {

    }

    for (let forecast of weatherFiveDays.list) {
        const date = new Date(forecast.dt * 1000).toLocaleDateString()

        if (!dailyForecast[date]) {
            dailyForecast[date] = forecast
        }
    }

    const nextFiveDaysForeCast = Object.values(dailyForecast).slice(1, 6)

    function convertDate(date) {
        const newDate = new Date(date.dt * 1000).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',

        })

        return newDate
    }

    return (
        <div className="weather-container">
            <p>Previsão dos Próximos 5 Dias</p>
           <div className="wather-list">
             {nextFiveDaysForeCast.map(forecast => (
                <div key={forecast.dt} className="weather-">
                    <p className="forecast-day">{convertDate(forecast)}</p>
                    <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="" />
                    <p>{forecast.weather[0].description}</p>
                    <p>{Math.round(forecast.main.temp_min)}°C min / {Math.round(forecast.main.temp_max)}°C máx</p>
                </div>
            ))}
           </div>
        </div>
    )
}
