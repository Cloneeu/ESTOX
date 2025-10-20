import { API_TOKEN, STOCK_DATA_URL } from "./environment.js"

export const getStocks = async (symbols = "AAPL") => {
  try {
    const response = await fetch(
      STOCK_DATA_URL + `?symbols=${symbols}&api_token=${API_TOKEN}`
    )
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
