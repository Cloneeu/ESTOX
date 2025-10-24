console.log('test')
import {getStocks, getEOD, getNews, getRandomCompanies} from "./app.js"
// PRUEBAS
const companies = getRandomCompanies()
//console.log(companies)
// Acceder a los datos:
// companies[0].name   // "Apple"
// companies[0].symbol // "AAPL"

// Por nombre de empresa
//await getStocks("Apple")
//await getStocks("Microsoft")
//await getStocks("Apple,Microsoft,Amazon")
//
//// Por simbolos
//await getStocks("AAPL")
//await getStocks("AAPL,MSFT,AMZN")
//
//// Por busqueda parcial
//await getStocks("google")  // Encontrara "Alphabet (Google) Class A"
//await getStocks("meta")    // Encontrara "Meta Platforms (Facebook)"
//
//// Aleatorio

var stocks = await getStocks()  // Empresa random 
//

console.log ('estocs',stocks)
//// Nombres y simbolos
//await getStocks("Apple,MSFT,Amazon")
//
//// Obtener EOD de los últimos 7 días para Apple
//await getEOD("Apple", 7)
//
//// Obtener EOD de los últimos 30 días para Microsoft
//await getEOD("Microsoft", 30)
//
//// Obtener EOD desde una fecha específica
//await getEOD("Tesla", "2025-10-01")
//
//// Obtener EOD desde octubre 2025
//await getEOD("Amazon", "2025-10")
//
//// Obtener EOD de todo el año 2025
//await getEOD("Google", "2025")
//
//// Obtener 10 noticias de Apple (por defecto)
//await getNews("Apple")
//
//// Obtener 20 noticias de Tesla
//await getNews("Tesla", 20)
//
//// Obtener noticias de varias empresas
//await getNews("Apple,Microsoft,Amazon", 15)
//
//// Obtener noticias de una empresa aleatoria
//await getNews()
//
//// Con símbolos
//await getNews("AAPL,MSFT", 5)