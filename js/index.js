import {getStocks, getEOD} from "./app.js"

// PRUEBAS
// Por nombre de empresa
await getStocks("Apple")
await getStocks("Microsoft")
await getStocks("Apple,Microsoft,Amazon")
await getEOD("Microsoft")

// Por simbolos
await getStocks("AAPL")
await getStocks("AAPL,MSFT,AMZN")
await getEOD("AAPL")

// Por busqueda parcial
await getStocks("google")  // Encontrara "Alphabet (Google) Class A"
await getStocks("meta")    // Encontrara "Meta Platforms (Facebook)"
await getEOD("coca") // Encontrara coca-cola


// Aleatorio
await getStocks()  // Empresa random 
await getEOD() // Random :P

// Nombres y simbolos
await getStocks("Apple,MSFT,Amazon")
await getEOD("Apple,MSFT,Amazon")
