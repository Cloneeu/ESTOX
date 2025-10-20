import {
  API_TOKEN,
  STOCK_DATA_URL,
  EOD_URL
} from "./environment.js"

/**
 * Realiza una petición a la API de acciones y devuelve los datos para los símbolos solicitados.
 *
 * @async
 * @function
 * @param {string} [symbols="AAPL"] - Una cadena con uno o varios símbolos separados por comas (por ejemplo: "AAPL,MSFT,GOOGL").
 *                                        Si no se proporciona, por defecto se usa "AAPL".
 * @returns {Promise<Object>} Promesa que se resuelve con el objeto JSON devuelto por la API que contiene los datos de las acciones.
 * @throws {Error} Lanza un error si la petición fetch falla o si la conversión a JSON no es posible.
 *
 * @example
 * // Obtener datos para Apple
 * const data = await getStocks("AAPL");
 *
 * @example
 * // Obtener datos para varios símbolos
 * const data = await getStocks("AAPL,MSFT,GOOGL");
 *
 * @remarks
 * Esta función usa las constantes STOCK_DATA_URL y API_TOKEN importadas desde environment.js.
 * La función imprime los datos en consola antes de devolverlos.
 */
export const getStocks = async (symbols = "AAPL") => {
  try {
    const response = await fetch(
      STOCK_DATA_URL + `?symbols=${symbols}&api_token=${API_TOKEN}`
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
 * Obtiene datos End Of Day (EOD) para uno o varios símbolos 
 *
 * @async
 * @function getEOD
 * @param {string} [symbols="AAPL"] - Símbolos separados por comas para los cuales solicitar EOD (por ejemplo "AAPL,MSFT").
 * @returns {Promise<*>} Promesa que resuelve con el objeto JSON devuelto por la API.
 * @throws {Error} Si la petición falla o el parseo a JSON produce un error; el error se re-lanza.
 * @example
 * // Obtener datos para AAPL
 * const data = await getEOD("AAPL");
 * @remarks
 * Esta función usa las constantes STOCK_DATA_URL y API_TOKEN importadas desde environment.js.
 * La función imprime los datos en consola antes de devolverlos.
 */
export const getEOD = async (symbols = "AAPL") => {
  try {
    const response = await fetch(
      EOD_URL + `?symbols=${symbols}&api_token=${API_TOKEN}`
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
