import Chart from 'chart.js/auto';

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

  static drawChart(chartId, labels, data, type, title) {
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

    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        type: type,
        data: {
          labels,
          datasets: [
            {
              barThickness: 2,
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
                text: 't[s]',
              },
            },
            y: {
              scales: {
                beginAtZero: true,
              },
              title: {
                display: true,
                text: 'x(t)',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },

            title: {
              display: true,
              text: title,
              align: 'center',
              color: 'black',
              fullSize: true,
              position: 'top',
              font: {
                size: 16,
                weight: 'normal',
                family: 'Arial',
                style: 'normal',
              },
              padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              },
            },
          },
        },
      },
    )
  }
//method for drawing multiple charts on one plot
  static drawMultipleDataChart(
    chartId,
    labels,
    datasets,
    type = 'scatter',
    title,
    titleYAxis,
  ) {
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
    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        type: 'bar',
        //barThickness: 2,
        barPercentage: 50,
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
                text: 'f[Hz]',
              },
            },
            y: {
              scales: {
                beginAtZero: true,
              },
              title: {
                display: true,
                text: titleYAxis,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 18,
              },
            },
          },
        },
      },
    )
  }

  static drawScatterWithVerticalLines(
    chartId,
    labels,
    scatterData,
    title,
    titleYAxis,
  ) {
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

        backgroundColor: 'rgba(54,162,235,0.5)',
        type: 'bar',
        barThickness: 2,

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
                text: 'f[Hz]',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: titleYAxis,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },

            title: {
              display: true,
              text: title,
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
  }
}
export { ChartDrawer }
