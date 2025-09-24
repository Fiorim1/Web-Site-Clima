// WeatherInformations.detailed_comments.jsx
// Explicação linha-a-linha MUITO detalhada do componente WeatherInformations
// Todo o conteúdo abaixo é comentário explicativo + código para facilitar a leitura.

// ========================= IMPORTS =========================
// Importa o arquivo de estilos CSS para esse componente.
// - Em bundlers comuns (Create React App, Vite, Webpack) essa linha instrui o bundler
//   a incluir esse CSS no bundle; o import em si não retorna valores JS.
// - Alternativa: usar CSS Modules (ex: WeatherInformations.module.css) para escopo local,
//   styled-components ou Tailwind se preferir estilos componetizados.
import './WeatherInformations.css'

// ========================= COMPONENTE =========================
// Declaração de um componente funcional React chamado WeatherInformations.
// Recebe um objeto `props` e, nesse caso, o código espera que haja uma prop
// chamada `weather` que contenha os dados retornados pela API de clima.
function WeatherInformations({ weather }) {
  // ----------------- CHECAGEM E RENDERIZAÇÃO CONDICIONAL -----------------
  // Este bloco protege o restante do componente contra leituras em `undefined`.
  // Condições verificadas:
  // 1) `!weather` -> a prop `weather` é `null` ou `undefined` (dados não chegaram)
  // 2) `!weather.weather` -> a propriedade `weather` dentro do objeto pode não existir
  // 3) `weather.weather.length === 0` -> a propriedade existe mas é um array vazio
  // Se qualquer dessas condições for verdadeira, o componente retorna imediatamente
  // um parágrafo informando que os dados estão sendo carregados.
  // POR QUE ISSO É IMPORTANTE?
  // - Se tentássemos acessar `weather.weather[0]` sem essa verificação, o React
  //   lançaria um erro: "Cannot read property '0' of undefined" e o componente quebraria.
  // - Esse padrão é chamado de "guard clause" ou "early return" e é muito comum
  //   em componentes que dependem de dados assíncronos (fetch/axios/etc.).
  if (!weather || !weather.weather || weather.weather.length === 0) {
    // Aqui retornamos JSX simples — você pode melhorar a UX trocando por um spinner
    // (svg/css) ou por um skeleton placeholder para evitar saltos visuais.
    return <p className="changeInfo">Carregando informações do clima...</p>
  }

  // ----------------- MONTANDO A URL DO ÍCONE -----------------
  // A API do OpenWeatherMap fornece um código de ícone em `weather[0].icon`.
  // Exemplo de código: "01d", "02n" etc. Para montar a URL do ícone usamos
  // um template literal para inserir esse código na URL padrão.
  // Observações importantes:
  // - A URL original aqui usa `http://`. Em aplicações servidas por HTTPS isso
  //   causará "mixed content" (conteúdo inseguro) e o navegador pode bloquear a imagem.
  //   Troque para `https://openweathermap.org/img/wn/...` para evitar esse problema.
  // - Há variantes em maior resolução que terminam com `@2x.png` se quiser ícones maiores.
  // - Se `weather.weather[0]` não existir por alguma razão inesperada, acessar
  //   `.icon` lançaria erro. A checagem acima evita isso, mas em abordagens mais
  //   defensivas use `weather.weather?.[0]?.icon`.
  const srcImg = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`

  // ----------------- JSX PRINCIPAL (RENDERIZAÇÃO) -----------------
  // Aqui começa a estrutura visual renderizada pelo componente.
  // - `className` é a prop usada pelo React (equivalente a `class` no HTML)
  // - Procure manter nomes de classes semânticos e consistentes (BEM, por exemplo)
  return (
    // Container principal do componente — tipicamente usado para estilização geral
    // (background, padding, bordas, largura fixa/responsiva, etc.).
    <div className='weather-container'>
      {/*
        Exibe o nome do local recebido em `weather.name`.
        - `weather.name` é fornecido pela API (ex.: "São Paulo").
        - Aqui usamos <h2> — escolha do nível de heading depende da estrutura da página.
        - Boa prática: garantir que heading levels fiquem semânticos (não pular de h1 para h3)
      */}
      <h2>{weather.name}</h2>

      {/*
        Bloco com as informações principais (ícone + temperatura).
        - Manter uma área visual agrupada facilita a leitura e estilização.
      */}
      <div className='weather-info'>
        {/*
          Imagem do ícone do clima.
          - `src` aponta para `srcImg` construído anteriormente.
          - `alt` é importante para acessibilidade: descreve o conteúdo da imagem para leitores de tela.
          - Em muitos casos é melhor usar uma descrição dinâmica, por exemplo:
              alt={`Ícone: ${weather.weather[0].description}`}
            Isso dá contexto real ao usuário (ex.: "Ícone: céu limpo").
          - Se a imagem for puramente decorativa, poderia usar alt="" e adicionar
            aria-hidden="true" para ignorá-la em tecnologias assistivas.
        */}
        <img src={srcImg} alt="Ícone do clima" />

        {/*
          Temperatura atual mostrada como número inteiro arredondado.
          - `weather.main.temp` é geralmente enviado pela API.
          - IMPORTANTE: a unidade não é garantida aqui — depende da query usada
            para obter os dados. OpenWeatherMap por padrão retorna Kelvin se você
            não passar `units=metric` (Celsius) ou `units=imperial` (Fahrenheit).
          - Exemplo de chamada correta para Celsius: `...?units=metric&lang=pt_br`.
          - `Math.round()` arredonda para o inteiro mais próximo. Se preferir
            1 casa decimal use `Number(temp.toFixed(1))`.
        */}
        <p className='temperature'>{Math.round(weather.main.temp)}°C</p>
      </div>

      {/*
        Descrição textual do clima (ex: "céu limpo").
        - `weather.weather[0].description` tende a ser em inglês por padrão; para
          receber em português, solicite `lang=pt_br` na requisição à API.
        - Para i18n avançado, prefira mapear códigos (`weather[0].id`) para traduções
          no seu próprio dicionário, assim você não depende apenas do retorno da API.
      */}
      <p className='description'>{weather.weather[0].description}</p>

      {/*
        Bloco de detalhes adicionais: sensação térmica, umidade, pressão.
        - Aqui usamos três <p>, mas para acessibilidade e semântica pode ser melhor
          usar uma lista (<ul><li>...) ou <dl> (description list) para pares nome/valor.
      */}
      <div className='details'>
        {/* Sensação térmica (feels_like) - mesma observação sobre unidades se aplica */}
        <p>Sensação Térmica: {Math.round(weather.main.feels_like)}</p>

        {/* Umidade em porcentagem — normalmente já vem como número inteiro */}
        <p>Umidade: {weather.main.humidity}%</p>

        {/* Pressão atmosférica — normalmente em hPa (hectopascals) para OpenWeatherMap */}
        <p>Pressão: {weather.main.pressure}</p>
      </div>
    </div>
  )
}

// Export default para que outro arquivo possa importar este componente com:
// import WeatherInformations from './WeatherInformations'
export default WeatherInformations
