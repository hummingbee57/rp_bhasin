/* Fetch CSV temp data and display via chart.js 
    All temp values are differences from the mean of 14 deg-C */

    async function getData() {
        const response = await fetch('../data/control_area.csv');  // .. moves up one folder level
        const data = await response.text();
        // console.log(data);
        
        const xYears = [];
        const yTemps = [];
        const yNHtemps = [];
        const ySHtemps = [];
    
        // \n - new line character
        // split('\n') separate the table into an array of separate rows
        // slice(start, end) - return array starting at index start and ending at end-1
        const table = data.split('\n').slice(1);
        // console.log(table);
    
        table.forEach(row => {
            const columns = row.split(',');  // split row into columns using commas 
            const year = parseFloat(columns[0]); // assign year value
            xYears.push(year);
            
            const temp = parseFloat(columns[1]); // Global temp value
            yTemps.push(temp + 14);
    
            const nhtemp = parseFloat(columns[2]); // Global temp value
            yNHtemps.push(nhtemp + 14);
    
            const shtemp = parseFloat(columns[3]); // Global temp value
            ySHtemps.push(shtemp + 14);
    
            // console.log(year, temp, nhtemp, shtemp);
        })
        return {xYears, yTemps, yNHtemps, ySHtemps}  // return multiple values as a object
    }
    
    async function createChart() {
        const data = await getData(); // wait for getData to get formatted data
        console.log(data.ySHtemps);
        const lineChart = document.getElementById('lineChart');
        const degreeSymbol = String.fromCharCode(176);
    
        const myChart = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: data.xYears,
                datasets: [
                    {
                        label: `Combined Global Land-Surface, Air, and Water-Surface Temperatures in ${degreeSymbol}C`,
                        data: data.yTemps,
                        fill: false,
                        backgroundColor: 'rbga(255, 0, 132, 0.2)',
                        borderColor: 'rgba(255, 0, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: `Combined Nothern Hemisphere Land-Surface, Air, and Water-Surface Temperatures in ${degreeSymbol}C`,
                        data: data.yNHtemps,
                        fill: false,
                        backgroundColor: 'rbga(0, 102, 255, 0.2)',
                        borderColor: 'rgba(0, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: `Combined Southern Hemisphere Land-Surface, Air, and Water-Surface Temperatures in ${degreeSymbol}C`,
                        data: data.ySHtemps,
                        fill: false,
                        backgroundColor: 'rbga(0, 153, 51, 0.2)',
                        borderColor: 'rgba(0, 153, 51, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true, // resize chart based on screen size
                maintainAspectRatio: false,
                scales: {                            // display options for x and y axes
                    x: {
                        title: {
                            display: true,
                            text: 'Year',         // x-axis title
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            callback: function(val, index) {
                                return index % 5 === 0 ? this.getLabelForValue(val) : '';
                            },
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: '#6c767e'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Mean Temperatures',         // y-axis title
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            min: 0,
                            maxTicksLimit: data.yTemps.length/10,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: '#6c767e'
                        }
                    }
                },
                plugins: {  // Display options for title and legends
                    title: {
                        display: true,
                        text: 'Global Mean Temperature vs. Year (since 1880)',
                        font: {
                            size: 24
                        },
                        color: '#black',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    },
                    legend: {
                        align: 'start',
                        position: 'bottom'
                    }
                }
            }
        })
    }
    
    createChart();