// WeatherInformationsFiveDays.detailed_comments.jsx
// Versão do arquivo com explicações extremamente detalhadas em formato de comentário

// Importa o CSS deste componente. Em projetos React gerenciados por bundlers
// (como Create React App, Vite, Webpack) essa instrução faz com que o bundler
// injete o CSS no bundle final. Não é uma importação de JS — é instrução ao
// bundler para incluir o arquivo de estilos.
import './WeatherInformationsFiveDays.css'

// Declaração do componente funcional React.
// - `WeatherInformationsFiveDays` é o nome do componente.
// - Entre parênteses está a lista de `props` recebidas pelo componente.
// - Aqui usamos *destructuring* ({ weatherFiveDays }) para extrair diretamente
//   a prop `weatherFiveDays` do objeto `props`. Se o componente for usado assim:
//   <WeatherInformationsFiveDays weatherFiveDays={algumObjeto} />
//   então a variável `weatherFiveDays` estará disponível no corpo da função.
function WeatherInformationsFiveDays({ weatherFiveDays }) {
    // --------------------------------------------------------------------------------
    // DEBUG / INSTRUMENTAÇÃO
    // --------------------------------------------------------------------------------
    // Mostra no console do navegador o conteúdo de `weatherFiveDays`.
    // - Útil durante desenvolvimento para inspecionar a estrutura retornada
    //   pela API (por exemplo OpenWeatherMap) e confirmar que os campos esperados
    //   (como `list`, `dt`, `weather`, `main`) existem.
    // - Em produção, idealmente remova ou restrinja este log para evitar muito ruído
    //   no console e possíveis vazamentos de dados.
    console.log(weatherFiveDays)

    // --------------------------------------------------------------------------------
    // AGRUPAMENTO POR DATA (MAP/DICIONÁRIO)
    // --------------------------------------------------------------------------------
    // `dailyForecast` será usado como um mapa (dicionário) onde a chave é uma
    // string de data (ex.: "24/09/2025") e o valor é o primeiro `forecast`
    // encontrado para essa data. Optamos por um objeto simples {} por praticidade,
    // mas em cenários onde a ordem ou operações frequentes de inserção/consulta
    // são críticas, `new Map()` pode ser mais semântico.
    const dailyForecast = {}

    // Percorre a lista de previsões retornada pela API.
    // - `weatherFiveDays?.list` usa *optional chaining* para evitar erro caso
    //   `weatherFiveDays` seja `undefined` ou `null` (ex.: antes de a requisição
    //   assíncrona terminar). Se `weatherFiveDays` for `undefined`, `weatherFiveDays?.list`
    //   também será `undefined` e o operador `|| []` garante que o `for...of`
    //   itere sobre um array vazio (nenhuma iteração) em vez de lançar um erro.
    // - Observação: a API do OpenWeatherMap para 5 dias costuma retornar uma lista
    //   com previsões a cada 3 horas (ex.: 00:00, 03:00, 06:00, ...). Esse loop
    //   percorre todos esses registros.
    for (let forecast of (weatherFiveDays?.list || [])) {
        // `forecast.dt` é um timestamp em segundos (Unix time) — por convenção
        // a API do OpenWeatherMap usa segundos. O construtor `Date()` em JS
        // espera milissegundos, então multiplicamos por 1000.
        // `toLocaleDateString()` converte a data para uma string legível contendo
        // apenas a parte da data (sem hora). Sem parâmetros adicionais, o formato
        // é determinado pelo ambiente (locale do navegador) — por isso pode variar.
        // Ex.: no Brasil tipicamente "24/09/2025".
        const date = new Date(forecast.dt * 1000).toLocaleDateString()

        // Se ainda não existe forecast armazenado para a chave `date`, grava o
        // forecast atual. Ou seja, mantém apenas a PRIMEIRA ocorrência por dia.
        // Consequências/limitações desta escolha:
        //  - Se a lista da API começa com registros do dia atual, esse método
        //    vai armazenar o primeiro registro desse dia (que pode ser hora baixa,
        //    p.ex. 00:00) — muitas vezes preferimos a previsão do meio-dia ou
        //    calcular médias/valores máximos/mínimos diários.
        //  - Se você quiser a temperatura máxima e mínima do dia, é necessário
        //    agregar todos os registros daquele dia (buscar min/max entre eles),
        //    e não apenas pegar o primeiro.
        //  - Outro ponto: a ordem das propriedades em `dailyForecast` reflete a
        //    ordem de inserção neste objeto, que normalmente seguirá a ordem
        //    cronológica dos elementos em `weatherFiveDays.list` (desde que a
        //    lista esteja ordenada). Se a API retornar itens fora de ordem,
        //    pode ser necessário ordenar explicitamente por `dt`.
        if (!dailyForecast[date]) {
            dailyForecast[date] = forecast
        }
    }

    // --------------------------------------------------------------------------------
    // SELEÇÃO DOS PRÓXIMOS 5 DIAS
    // --------------------------------------------------------------------------------
    // `Object.values(dailyForecast)` retorna um array com os *valores* do objeto
    // (ou seja, os forecasts que gravamos). Em muitos casos isso produzirá um
    // array ordenado cronologicamente por corresponder à ordem de criação das
    // chaves no objeto `dailyForecast`.
    // Em seguida `.slice(1, 6)` pega da posição 1 até 5 (exclusivo no índice 6),
    // ou seja, descarta o índice 0 (normalmente o dia atual) e pega os próximos 5 dias.
    // Observações:
    // - `slice(1, 6)` retornará menos de 5 itens se não houver dias suficientes.
    // - Se por algum motivo `dailyForecast` tiver entradas em ordem inesperada,
    //   o maior risco é mostrar dias fora de ordem — para evitar isso você poderia
    //   primeiro transformar em array e ordenar explicitamente por `dt`:
    //     Object.values(dailyForecast).sort((a,b) => a.dt - b.dt)
    // - Alternativa recomendada quando você precisa de controle rígido da ordem:
    //   usar `Map` e/ou ordenar por timestamp.
    const nextFiveDaysForeCast = Object.values(dailyForecast).slice(1, 6)

    // --------------------------------------------------------------------------------
    // FUNÇÃO AUXILIAR DE FORMATAÇÃO DE DATA
    // --------------------------------------------------------------------------------
    // Observação importante sobre o parâmetro: o nome `date` aqui é potencialmente
    // confuso, porque a função espera receber um objeto `forecast` (com `dt`),
    // não uma string de data. Mantivemos o nome original do seu código, mas
    // adicionamos este comentário para explicar o comportamento. Uma renomeação
    // para `forecast` deixaria a intenção mais clara.
    function convertDate(date) {
        // Constrói um objeto Date a partir do timestamp do forecast (multiplicado
        // por 1000 para converter segundos -> milissegundos).
        // `toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' })`
        // formata a data usando o locale pt-BR, exibindo o dia da semana por extenso
        // (opção `weekday: 'long'`) e o dia do mês com dois dígitos (`day: '2-digit'`).
        // - Exemplo possível de saída: "quarta-feira, 24" (dependendo do navegador
        //   a vírgula/ordenação pode variar).
        // - Lembre que `toLocaleDateString` usa o fuso do ambiente (navegador). Se
        //   os usuários estiverem em fusos diferentes, a data exibida pode mudar
        //   caso você esteja lidando com timestamps em UTC sem normalização.
        const newDate = new Date(date.dt * 1000).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
        })

        // Retorna a string formatada. Se quiser capitalizar a primeira letra do
        // weekday ou padronizar, você pode aplicar transformações aqui antes de retornar.
        return newDate
    }

    // --------------------------------------------------------------------------------
    // CONDIÇÃO DE RENDERIZAÇÃO ANTECIPADA - PROTEÇÃO CONTRA DADOS INCOMPLETOS
    // --------------------------------------------------------------------------------
    // Se `weatherFiveDays` não estiver disponível (por exemplo, requisição ainda
    // em andamento) ou se a propriedade `list` não existir, retornamos um JSX
    // simples indicando que está carregando. Isso impede que o componente tente
    // acessar `weatherFiveDays.list` quando `weatherFiveDays` é `undefined`, o
    // que causaria um erro de execução.
    if (!weatherFiveDays || !weatherFiveDays.list) {
        // JSX simples: parágrafo com mensagem de carregamento — você pode trocar
        // por um spinner ou skeleton para uma melhor experiência do usuário.
        return <p>Carregando previsão...</p>
    }

    // --------------------------------------------------------------------------------
    // JSX PRINCIPAL (RENDERIZAÇÃO)
    // --------------------------------------------------------------------------------
    return (
        <div className="weather-container">
            {/* Título ou cabeçalho simples para a seção de previsão */}
            <p>Previsão dos Próximos 5 Dias</p>

            {/*
              NOTE: há um provável *typo* aqui: "wather-list" parece querer ser
              "weather-list". Manter coerência nas classes facilita a leitura do CSS
              e evita bugs de estilo.
            */}
            <div className="wather-list">
                {/*
                  Percorre os forecasts selecionados (próximos 5 dias) e renderiza um
                  bloco para cada um. `map` retorna um array de elementos JSX.
                */}
                {nextFiveDaysForeCast.map(forecast => (
                    // `key` deve ser uma string/valor único por elemento. `forecast.dt`
                    // (timestamp) costuma ser único por registro, então é aceitável.
                    // Evite usar o índice do array como key quando a lista pode mudar.
                    <div key={forecast.dt} className="weather-">
                        {/* Exibe o dia formatado. Observação: `convertDate` espera um
                            objeto forecast (pois acessa `date.dt` internamente). */}
                        <p className="forecast-day">{convertDate(forecast)}</p>

                        {/*
                          Ícone do tempo:
                          - A API do OpenWeatherMap provê um código de ícone em
                          `forecast.weather[0].icon`. A URL abaixo monta o caminho
                          para a imagem do ícone.
                          - CUIDADO: a URL usa `http://`. Em aplicações servidas via
                          `https://` isso pode causar erro de conteúdo misto (mixed content)
                          e o navegador bloqueará a imagem. Prefira `https://`.
                          - Também é bom proteger contra `forecast.weather[0]` ser
                          `undefined` — acessar `forecast.weather[0].icon` sem checagem
                          pode lançar erro se a estrutura da API for diferente. Use
                          `forecast.weather?.[0]?.icon` em implementações mais robustas.
                        */}
                        <img
                            src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                            alt={forecast.weather[0].description}
                        />

                        {/* Descrição textual do tempo (p.ex. "céu limpo").
                            - A linguagem desta descrição segue a `lang` passada na
                            requisição; se você não pediu `lang=pt_br`, pode vir em inglês.
                        */}
                        <p className="forecast-description">{forecast.weather[0].description}</p>

                        {/*
                          Temperatura mínima e máxima: arredondadas com Math.round().
                          Observações importantes:
                          - A API retorna `temp_min` e `temp_max` para aquele registro
                            específico (ou para as condições daquele horário), não
                            necessariamente o min/max real do dia inteiro.
                          - Para obter o min/max diário real, agregue todos os
                            `forecast.main.temp_min` e `temp_max` daquele dia.
                          - Unidades: por padrão o OpenWeatherMap manda Kelvin. Para
                            Celsius você deve chamar a API com `units=metric`. Caso
                            contrário, esses valores estarão em Kelvin e os símbolos
                            °C serão incorretos.
                        */}
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

// Exporta o componente como padrão para que possa ser importado assim:
// `import WeatherInformationsFiveDays from './WeatherInformationsFiveDays'`
export default WeatherInformationsFiveDays
