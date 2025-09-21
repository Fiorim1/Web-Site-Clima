import './WeatherInformationsFiveDays.css'

function WeatherInformations({ weatherFiveDays }) {
    console.log(weatherFiveDays)

    const dailyForecast = {

    }

    for(let forecast of weatherFiveDays.list) {
        const date = new Date(forecast.dt *1000).toLocaleDateString()

        if(!dailyForecast[date]){
            dailyForecast[date] = forecast
        }
    }

    const nextFiveDays = Object.values(dailyForecast).slice(1,6)
    
    const nextFiveDaysForeCast = Object.values(dailyForecast) 

    return (
        <div className="weather-container">
            <p>5 Days</p>
        </div>
    )
}
