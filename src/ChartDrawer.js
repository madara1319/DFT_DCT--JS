//klasa do korzystania w View
class ChartDrawer {
  static charts = {}

  static killChart(chartId){
    if(this.charts[chartId]){
    this.charts[chartId].destroy();
    this.charts[chartId]=null
  }


    // Find the container and close button
    const chartContainer = document.getElementById(`${chartId}Container`)
    const chartCloseButton = chartContainer.querySelector('.chartCloseButton')
    if (chartCloseButton.style.display==='block')
    {
chartCloseButton.style.display='none';
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
              title: {
                display: true,
                text: 'X',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Y',
              },
            },
          },
        },
      },
    )
  }
  static drawMultipleDataChart(chartId, labels, datasets, type) {
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

    this.charts[chartId] = new Chart(
      document.getElementById(chartId).getContext('2d'),
      {
        type: type,
        data: {
          labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'k',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Magnitude',
              },
            },
          },
        },
      },
    )
  }
}

export { ChartDrawer }
