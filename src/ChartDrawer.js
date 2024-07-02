//klasa do korzystania w View
class ChartDrawer {
  static drawChart(labels, data, type) {
    //nie wiem czy one na siebie nie nachodza
    if (this.sampleChart) {
      this.sampleChart.destroy()
    }

    let existingChartCloseButton = document.querySelector('.chartCloseButton')
    if (existingChartCloseButton) {
      existingChartCloseButton.remove()
    }

    let chartCloseButton = document.createElement('button')
    chartCloseButton.className = 'chartCloseButton'
    chartCloseButton.textContent = '\u00D7'
    chartCloseButton.onclick = () => {
      if (this.sampleChart) {
        this.sampleChart.destroy()
        this.sampleChart.null
      }
      chartCloseButton.remove()
    }
    //document.body.appendChild(chartCloseButton);
    document.querySelector('.boxofboxes--js').appendChild(chartCloseButton)
    this.sampleChart = new Chart(
      document.getElementById('sampleChart').getContext('2d'),
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
}

export {ChartDrawer};
