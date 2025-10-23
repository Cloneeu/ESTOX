import { API_TOKEN, STOCK_DATA_URL, EOD_URL, NEWS_URL } from "./environment.js"

/**
 * Diccionario con las primeras 50 empresas del S&P 500
 * Mapea el nombre de la empresa con su símbolo bursátil
 */
export const SP500_TOP_50 = {
  Apple: "AAPL",
  Microsoft: "MSFT",
  Amazon: "AMZN",
  NVIDIA: "NVDA",
  "Alphabet (Google) Class A": "GOOGL",
  "Alphabet (Google) Class C": "GOOG",
  "Meta Platforms (Facebook)": "META",
  "Berkshire Hathaway": "BRK.B",
  Tesla: "TSLA",
  "Eli Lilly": "LLY",
  Visa: "V",
  "UnitedHealth Group": "UNH",
  "Exxon Mobil": "XOM",
  "JPMorgan Chase": "JPM",
  "Johnson & Johnson": "JNJ",
  Mastercard: "MA",
  "Procter & Gamble": "PG",
  Broadcom: "AVGO",
  "Home Depot": "HD",
  Chevron: "CVX",
  Merck: "MRK",
  Costco: "COST",
  AbbVie: "ABBV",
  "Coca-Cola": "KO",
  PepsiCo: "PEP",
  Adobe: "ADBE",
  Walmart: "WMT",
  Netflix: "NFLX",
  "Cisco Systems": "CSCO",
  "McDonald's": "MCD",
  Oracle: "ORCL",
  "Thermo Fisher Scientific": "TMO",
  Salesforce: "CRM",
  Intel: "INTC",
  Pfizer: "PFE",
  Accenture: "ACN",
  "Abbott Laboratories": "ABT",
  Comcast: "CMCSA",
  Nike: "NKE",
  "Walt Disney": "DIS",
  "Texas Instruments": "TXN",
  Verizon: "VZ",
  AMD: "AMD",
  Qualcomm: "QCOM",
  "T-Mobile": "TMUS",
  Honeywell: "HON",
  Boeing: "BA",
  "Union Pacific": "UNP",
  IBM: "IBM",
  Danaher: "DHR",
}

/**
 * Obtiene un símbolo aleatorio del diccionario de empresas del S&P 500
 * @returns {string} Símbolo bursátil aleatorio
 */
const getRandomSymbol = () => {
  const symbols = Object.values(SP500_TOP_50)
  const randomIndex = Math.floor(Math.random() * symbols.length)
  return symbols[randomIndex]
}

/**
 * Convierte nombres de empresas a símbolos bursátiles
 * @param {string} companyNames - Nombres de empresas separados por comas
 * @returns {string} Símbolos bursátiles separados por comas, o el input original si no se encuentran coincidencias
 * @example
 * convertNamesToSymbols("Apple") // "AAPL"
 * convertNamesToSymbols("Apple,Microsoft") // "AAPL,MSFT"
 */
const convertNamesToSymbols = (companyNames) => {
  if (!companyNames) return null

  const names = companyNames.split(",").map((name) => name.trim())
  const symbols = names.map((name) => {
    // Buscar coincidencia exacta (si es case-insensitive)
    const exactMatch = Object.keys(SP500_TOP_50).find(
      (key) => key.toLowerCase() === name.toLowerCase()
    )
    if (exactMatch) return SP500_TOP_50[exactMatch]

    // Si no hay coincidencia exacta, buscar si el nombre esta contenido en alguna key
    const partialMatch = Object.keys(SP500_TOP_50).find((key) =>
      key.toLowerCase().includes(name.toLowerCase())
    )
    if (partialMatch) return SP500_TOP_50[partialMatch]

    // Si no se encuentra, asumir que ya es un simbolo
    return name
  })

  return symbols.join(",")
}

/**
 * Calcula una fecha en el pasado restando días a la fecha actual
 * @param {number} daysAgo - Número de días hacia atrás
 * @returns {string} Fecha en formato Y-m-d (por ejemplo: "2025-10-16")
 * @example
 * getDateDaysAgo(7) // "2025-10-16" (si hoy es 2025-10-23)
 */
const getDateDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Realiza una petición a la API de acciones y devuelve los datos para las empresas solicitadas (STOCK del dia de hoy).
 *
 * @async
 * @function
 * @param {string} [companyNames] - Una cadena con uno o varios nombres de empresas separados por comas (por ejemplo: "Apple,Microsoft,Amazon").
 *                                  También acepta símbolos bursátiles directamente (por ejemplo: "AAPL,MSFT,AMZN").
 *                                  Si no se proporciona, se selecciona una empresa aleatoria del S&P 500.
 * @returns {Promise<Object>} Promesa que se resuelve con el objeto JSON devuelto por la API que contiene los datos de las acciones.
 * @throws {Error} Lanza un error si la petición fetch falla o si la conversión a JSON no es posible.
 *
 * @example
 * // Obtener datos para Apple por nombre
 * const data = await getStocks("Apple");
 *
 * @example
 * // Obtener datos para varias empresas por nombre
 * const data = await getStocks("Apple,Microsoft,Amazon");
 *
 * @example
 * // Obtener datos para una empresa aleatoria del S&P 500
 * const data = await getStocks();
 *
 * @example
 * // También funciona con símbolos
 * const data = await getStocks("AAPL");
 *
 * @remarks
 * Esta función usa las constantes STOCK_DATA_URL y API_TOKEN importadas desde environment.js.
 * La función imprime los datos en consola antes de devolverlos.
 */
export const getStocks = async (companyNames = null) => {
  const symbols = companyNames
    ? convertNamesToSymbols(companyNames)
    : getRandomSymbol()
  const selectedSymbols = symbols || getRandomSymbol()
  try {
    const response = await fetch(
      STOCK_DATA_URL + `?symbols=${selectedSymbols}&api_token=${API_TOKEN}`
    )
    const data = await response.json()
    // TODO: Borrar despues el console.log
    console.log(data)
    return data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

/**
 * Obtiene datos End Of Day (EOD) para una o varias empresas
 *
 * @async
 * @function getEOD
 * @param {string} [companyNames] - Nombres de empresas separados por comas (por ejemplo "Apple,Microsoft").
 *                                  Tambien acepta simbolos directamente (por ejemplo: "AAPL,MSFT").
 *                                  Si no se proporciona, se selecciona una empresa aleatoria del S&P 500.
 * @param {number|string} [daysAgo] - Número de días hacia atrás para recuperar datos (por ejemplo: 7 para últimos 7 días).
 *                                    También acepta una fecha específica en formato Y-m-d, Y-m o Y (por ejemplo: "2025-10-23", "2025-10", "2025").
 *                                    Si no se proporciona, obtiene todos los datos disponibles.
 * @returns {Promise<*>} Promesa que resuelve con el objeto JSON devuelto por la API.
 * @throws {Error} Si la petición falla o el parseo a JSON produce un error; el error se re-lanza.
 * @example
 * // Obtener datos para Apple por nombre
 * const data = await getEOD("Apple");
 * @example
 * // Obtener datos de los últimos 7 días
 * const data = await getEOD("Apple", 7);
 * @example
 * // Obtener datos desde una fecha específica
 * const data = await getEOD("Apple", "2025-10-01");
 * @example
 * // Obtener datos para varias empresas
 * const data = await getEOD("Apple,Microsoft");
 * @example
 * // Obtener datos para una empresa aleatoria del S&P 500
 * const data = await getEOD();
 * @remarks
 * Esta función usa las constantes EOD_URL y API_TOKEN importadas desde environment.js.
 * La función imprime los datos en consola antes de devolverlos.
 */
export const getEOD = async (companyNames = null, daysAgo = null) => {
  const symbols = companyNames
    ? convertNamesToSymbols(companyNames)
    : getRandomSymbol()
  const selectedSymbols = symbols || getRandomSymbol()

  // Construir la URL con el parámetro date_from si se proporciona
  let url = EOD_URL + `?symbols=${selectedSymbols}&api_token=${API_TOKEN}`

  if (daysAgo !== null) {
    // Si daysAgo es un número, calcular la fecha
    const dateFrom =
      typeof daysAgo === "number" ? getDateDaysAgo(daysAgo) : daysAgo
    url += `&date_from=${dateFrom}`
  }

  try {
    const response = await fetch(url)
    const data = await response.json()
    // TODO: Borrar despues el console.log
    console.log(data)
    return data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

/**
 * Obtiene noticias para una o varias empresas
 *
 * @async
 * @function getNews
 * @param {string} [companyNames] - Nombres de empresas separados por comas (por ejemplo "Apple,Microsoft").
 *                                  También acepta símbolos bursátiles directamente (por ejemplo: "AAPL,MSFT").
 *                                  Si no se proporciona, obtiene noticias de una empresa aleatoria del S&P 500.
 * @param {number} [limit=3] - Número máximo de noticias a obtener (por defecto es 3 por que la API no da para mas :P).
 * @returns {Promise<*>} Promesa que resuelve con el objeto JSON devuelto por la API conteniendo las noticias.
 * @throws {Error} Si la petición falla o el parseo a JSON produce un error; el error se re-lanza.
 * @example
 * // Obtener noticias para Apple
 * const news = await getNews("Apple");
 * @example
 * // Obtener noticias para varias empresas
 * const news = await getNews("Apple,Microsoft");
 * @example
 * // Obtener 20 noticias para Tesla
 * const news = await getNews("Tesla", 20);
 * @example
 * // Obtener noticias de una empresa aleatoria del S&P 500
 * const news = await getNews();
 * @remarks
 * Esta función usa las constantes NEWS_URL y API_TOKEN importadas desde environment.js.
 * La función imprime los datos en consola antes de devolverlos.
 */
export const getNews = async (companyNames = null, limit = 3) => {
  const symbols = companyNames
    ? convertNamesToSymbols(companyNames)
    : getRandomSymbol()
  const selectedSymbols = symbols || getRandomSymbol()

  try {
    const response = await fetch(
      NEWS_URL +
        `?symbols=${selectedSymbols}&limit=${limit}&language=en&api_token=${API_TOKEN}`
    )
    const data = await response.json()
    // TODO: Borrar despues el console.log
    console.log(data)
    return data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
