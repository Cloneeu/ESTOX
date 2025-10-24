// document.addEventListener('DOMContentLoaded', function() {
//   const ctx = document.getElementById('miGrafica');

//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
//       datasets: [{
        
//         data: [12, 19, 3, 5, 2,11,2,3,7],
//         fill: true,
//         tension: 0.4, // <= hace la curva suave
//         borderColor: 'rgba(0, 0, 0,0)',
//         backgroundColor: 'rgba(222, 222, 27,1)',
//         borderWidth: 0,
//         pointRadius: 2,
//         pointBackgroundColor: 'rgb(0, 0, 0)'
//       }]
//     },
//     options: {
//       responsive: true,
//       animation: true, // <- sin animaciones
//       scales: {
//         x: {
//           ticks: {
//             font: {
//               size: 5, // Tamaño de las etiquetas del eje X
//               family: 'Poppins'
//             },
//             color: '#333' // Color del texto
//           }
//         },
//         y: {
//           beginAtZero: true,
//           ticks: {
//             font: {
//               size: 5, // Tamaño de las etiquetas del eje Y
//               family: 'Poppins'
//             },
//             color: '#555'
//           }
//         }
//       },
//       plugins: {
//         legend: {
//           display: false,
         
//         }
//       }
//     }
//   });
// });
