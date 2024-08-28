//klasa do korzystania w View
class ChartDrawer {
  static charts = {}

  static killChart(chartId) {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy()
      this.charts[chartId] = null
    }

    // Find the container and close button
    const chartContainer = document.getElementById(`${chartId}Container`)
    const chartCloseButton = chartContainer.querySelector('.chartCloseButton')
    if (chartCloseButton.style.display === 'block') {
      chartCloseButton.style.display = 'none'
    }
  }
  static drawChart(chartId, labels, data, type) {
    // Destroy existing chart if it exists
    if (this.charts[chartId]) {
      this.charts[chartId].destroy()
      this.charts[chartId] = null
    }

    // Find the container and close button
    const chartContainer = document.getElementById(`${chartId}Container`)
    const chartCloseButton = chartContainer.querySelector('.chartCloseButton')

    // Ensure the close button exists and is visible
    chartCloseButton.style.display = 'block'
    chartCloseButton.onclick = () => {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy()
        this.charts[chartId] = null
      }
      chartCloseButton.style.display = 'none'
    }

    //this.sampleChart = new Chart(
    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        //type: data.length > 0 ? 'bar' : 'line',
        type: type,
        data: {
          labels,
          datasets: [
            {
              barThickness: 5,
              // barPercentage:0.1,
              label: 'Signal',
              data,
              fill: false,
              backgroundColor: 'rgba(255,99,132,0.5)',
              borderColor: 'rgb(255,99,132,1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              scales: {
                type: 'linear',
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'X',
              },
            },
            y: {
              scales: {
                beginAtZero: true,
              },
              title: {
                display: true,
                text: 'Y',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },

           // title: {
           //   display: true,
           //   text: 'test',
           //   font:{
           //     size:18,
           //   },
           // },
            title:{
            display: true,    
            text: 'Title Text', 
            align: 'center',   
            color: 'black',    
            fullSize: true,    
            position: 'top',   
            font: {
                size: 16,       
                weight: 'normal', 
                family: 'Arial',  
                style: 'normal'  
            },
            padding: {
                top: 10,         
                bottom: 10,      
                left: 10,        
                right: 10        
            },

          },
        },
      },
      },
    )
    console.log(this.charts[chartId].options.plugins.title.display)
this.charts[chartId].options.plugins.title.text = 'Nowy tytuł';
this.charts[chartId].options.scales.x.title.text = 'Nowa oś X';
this.charts[chartId].options.scales.y.title.text = 'Nowa oś Y';
this.charts[chartId].update();
//console.log('tytul' + this.charts[chartId].options.plugins.title.text )
  }

  static drawMultipleDataChart(chartId, labels, datasets, type = 'scatter') {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy()
      this.charts[chartId] = null
    }

    const chartContainer = document.getElementById(`${chartId}Container`)
    const chartCloseButton = chartContainer.querySelector('.chartCloseButton')

    chartCloseButton.style.display = 'block'
    chartCloseButton.onclick = () => {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy()
        this.charts[chartId] = null
      }
      chartCloseButton.style.display = 'none'
    }

    const signalsDatasets = datasets.map((dataset) => ({
      ...dataset,
      type: dataset.type || type,
    }))
    console.log(signalsDatasets)
//console.log('chart title to' + this.charts[chartId].options.plugins.title);
    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        type: 'bar',
        data: {
          labels,
          datasets: signalsDatasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              scales: {
                type: 'linear',
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'k',
              },
            },
            y: {
              scales: {
                beginAtZero: true,
              },
              title: {
                display: true,
                text: 'Magnitude',
              },
            },
          },
          plugins:{
              legend:{
                display:true,
              },
            title:{
              display:true,
              text:'test',
              font:{
                size:18,
              },
            }
          },
        },
      },
    )
this.charts[chartId].options.plugins.title.text = 'Nowy tytuł';
this.charts[chartId].options.scales.x.title.text = 'Nowa oś X';
this.charts[chartId].options.scales.y.title.text = 'Nowa oś Y';
this.charts[chartId].update();
  }

  static drawScatterWithVerticalLines(chartId, labels, scatterData) {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy()
      this.charts[chartId] = null
    }

    const chartContainer = document.getElementById(`${chartId}Container`)
    const chartCloseButton = chartContainer.querySelector('.chartCloseButton')

    chartCloseButton.style.display = 'block'
    chartCloseButton.onclick = () => {
      this.killChart(chartId)
    }

    const datasets = [
      {
        data: scatterData,
        backgroundColor: 'rgba(255,99,132,0.5)',
        type: 'scatter',
        label: 'Spectrum (scatter)',
      },
      {
        data: scatterData.map((point) => point.y),

        //     data: barData.map((point) => ({ x: point.x, y: point.y })),
        backgroundColor: 'rgba(54,162,235,0.5)',
        type: 'bar',
        barThickness: 1,
        // barPercentage:1,

        label: 'Spectrum (bar)',
      },
    ]

    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        type: 'bar',
        data: {
          labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'k',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Magnitude',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },

            title: {
              display: true, 
              text: 'test', 
              font: {
                size: 18, 
              },
              padding: {
                top: 10,
                bottom: 10,
              },
            },
          },
        },
      },
    )

this.charts[chartId].options.plugins.title.text = 'Nowy tytuł';
this.charts[chartId].options.scales.x.title.text = 'Nowa oś X';
this.charts[chartId].options.scales.y.title.text = 'Nowa oś Y';
this.charts[chartId].update();
  }
}
export { ChartDrawer }
