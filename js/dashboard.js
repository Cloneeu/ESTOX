import {getStocks, getEOD, getNews, getRandomCompanies} from "./app.js"
import { COINS_URL } from "./environment.js"


//VIEWS 

const empresas_container = document.getElementById('topEmpresasContainer')


//Vairables 


const init = async () =>{

  renderTop3()
  renderGraphics("Amazon",10)
  wireSearch()
}


const renderTop3 = async () =>{

  for (let i = 0; i < 3; i++) {
   
    const result = await getStocks()
   

    const card= document.createElement('div')
    
    card.classList.add('col-4', 'single-stock-card-sm', 'card-shadow') 
    card.innerHTML= `
      
            <div class="single-stock-header">
              <h3 class="single-stock-name">${result.data[0].name}</h3>
              <p class="single-stock-symbol">${result.data[0].ticker}</p>
            </div>
          
            <div class="single-stock-price-row">
              <p class="single-stock-price">${result.data[0].price}</p>
              <p class="single-stock-currency">${result.data[0].currency}</p>
            </div>
          
            <p class="single-stock-diff ${result.data[0].day_change >= 0 ? 'positive' : 'negative'}">${result.data[0].day_change}</p>
         
    
    
    `


    empresas_container.appendChild(card)

  }




}
let lineChartInstance = null;
let barChartInstance = null;
const renderGraphics = async (empresa,dias) => {
  // Obtener datos
  const result = await getEOD(empresa, dias);
  const data = result.data;
  const title = document.getElementById('stock-name')
  const title2 = document.getElementById('stock-name2')
  title.textContent = empresa.toUpperCase()
  title2.textContent = empresa.toUpperCase()
  // Preparar labels y datasets
  const { labels, openValues, closeValues, highValues, lowValues } = prepareChartData(data);

  // Colores dinámicos para la línea según suba/baje
  const openColors = openValues.map((val, i, arr) => i === 0 ? 'grey' : (val >= arr[i - 1] ? 'green' : 'red'));
  const closeColors = closeValues.map((val, i, arr) => i === 0 ? 'grey' : (val >= arr[i - 1] ? 'green' : 'red'));

  // --- GRÁFICA DE LÍNEA: Open vs Close ---
  const lineCtx = document.getElementById('miGrafica').getContext('2d');

  // Borrar gráfica anterior si existe
  if (lineChartInstance) lineChartInstance.destroy();

  lineChartInstance = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Open',
          data: openValues,
          fill: false,
          tension: 0.4,
          borderColor: 'rgba(0,123,255,0.5)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: openColors
        },
        {
          label: 'Close',
          data: closeValues,
          fill: false,
          tension: 0.4,
          borderColor: 'rgba(40,167,69,0.5)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: closeColors
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { ticks: { font: { size: 10, family: 'Poppins' }, color: '#333' } },
        y: { beginAtZero: false, ticks: { font: { size: 10, family: 'Poppins' }, color: '#555' } }
      },
      plugins: { legend: { display: true } }
    }
  });

  // --- GRÁFICA DE BARRAS: High vs Low ---
  const barCtx = document.getElementById('miGraficaBar').getContext('2d');

  // Borrar gráfica anterior si existe
  if (barChartInstance) barChartInstance.destroy();

  barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'High',
          data: highValues,
          backgroundColor: 'rgba(0,123,255,0.6)',
        },
        {
          label: 'Low',
          data: lowValues,
          backgroundColor: 'rgba(220,53,69,0.6)',
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { ticks: { font: { size: 10, family: 'Poppins' }, color: '#333' } },
        y: { beginAtZero: false, ticks: { font: { size: 10, family: 'Poppins' }, color: '#555' } }
      },
      plugins: { legend: { display: true } }
    }
  });
};

// Función para transformar la data a labels y valores
function prepareChartData(data) {
  const labels = data.map(item => {
    const d = new Date(item.date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  });

  const openValues = data.map(item => item.open);
  const closeValues = data.map(item => item.close);
  const highValues = data.map(item => item.high);
  const lowValues = data.map(item => item.low);

  return { labels, openValues, closeValues, highValues, lowValues };
}



//Funcion para la busqueda en el formulario

const wireSearch = () => {

  const form = document.getElementById('searchForm')
  const input = document.getElementById('searchInput')
  form.addEventListener('submit',async (e) =>{
    e.preventDefault()
    const empresa = input.value.trim()
    if(!empresa){
      return
    }

    console.log(empresa)

   const result = await getEOD(empresa,30)
  console.log(result)
   if(result.data.length  == 0)
   {
    const container = document.getElementById("alert-container");
    container.innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      No hay datos disponibles para la empresa .
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
   `;
     console.log("Error")
   }
  else
    renderGraphics(empresa,30)


   // console.log(result)
  })

}




// Función para cargar y mostrar las 3 criptomonedas del ranking
async function cargarCriptos() {
  try {
    const response = await fetch(COINS_URL+"/tickers");
    const data = await response.json();

    const top3 = data
      .filter(coin => coin.rank && coin.rank <= 3)
      .sort((a, b) => a.rank - b.rank);

    const container = document.getElementById("crypto-container");
    container.innerHTML = "";

    top3.forEach(coin => {
      const card = document.createElement("div");
      card.classList.add("col-4", "single-stock-card-sm", "card-shadow");
      card.innerHTML = `
        <div class="single-stock-header">
          <h3 class="single-stock-name">${coin.name}</h3>
          <p class="single-stock-symbol">${coin.symbol}</p>
        </div>
        <div class="single-stock-price-row">
          <p class="single-stock-price">${coin.quotes.USD.price.toFixed(2)}</p>
          <p class="single-stock-currency">USD</p>
        </div>
        <p class="single-stock-diff ${coin.quotes.USD.percent_change_24h >= 0 ? 'positive' : 'negative'}">
          ${coin.quotes.USD.percent_change_24h.toFixed(2)}%
        </p>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error al cargar criptomonedas:", error);
    const container = document.getElementById("crypto-container");
    container.innerHTML = `<p class="text-danger">⚠️ No se pudieron cargar las criptomonedas.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", cargarCriptos);



init()