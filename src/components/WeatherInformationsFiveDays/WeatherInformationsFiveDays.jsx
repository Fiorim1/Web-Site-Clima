import './WeatherInformationsFiveDays.css'

function WeatherInformationsFiveDays({ weatherFiveDays }) {
    console.log(weatherFiveDays)
    /* Explicação do código:
        Esse trecho de código percorre a lista de previsões climáticas (weatherFiveDays.list) — se ela existir, caso contrário usa uma lista vazia —
        e, para cada previsão (forecast), converte a data/hora fornecida em segundos (forecast.dt) 
        para uma data legível em formato de string (toLocaleDateString()). Em seguida, 
        ele verifica se ainda não existe nenhuma previsão armazenada para aquela data dentro do objeto dailyForecast; 
        se não existir, ele registra a primeira previsão encontrada para esse dia. Na prática, 
        isso significa que o código está organizando os dados recebidos, 
        agrupando-os por dia e guardando apenas a primeira previsão de cada data no objeto dailyForecast. */
    for (let forecast of (weatherFiveDays?.list || [])) {
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
    if (!weatherFiveDays || !weatherFiveDays.list) {
        return <p>Carregando previsão...</p>
    }
    return (
        <div className="weather-container">
            <p>Previsão dos Próximos 5 Dias</p>
            <div className="wather-list">
                {nextFiveDaysForeCast.map(forecast => (
                    <div key={forecast.dt} className="weather-">
                        <p className="forecast-day">{convertDate(forecast)}</p>
                        <img
                            src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                            alt={forecast.weather[0].description}
                        />
                        <p className="forecast-description">{forecast.weather[0].description}</p>
                        <p>
                            {Math.round(forecast.main.temp_min)}°C min 
                            {Math.round(forecast.main.temp_max)}°C máx
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default WeatherInformationsFiveDays

