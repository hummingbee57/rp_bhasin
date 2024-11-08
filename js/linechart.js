/* Fetch CSV temp data and display via chart.js 
    All temp values are differences from the mean of 14 deg-C */

    async function getData(filePath) {
        const response = await fetch(filePath);  // .. moves up one folder level
        const data = await response.text();
        // console.log(data);
        
        const trials = [];
        const meanAbsErrorTrain = [];
        const meanAbsErrorTest = [];
        const r2ScoreTrain = [];
        const r2ScoreTest = [];
    
        // \n - new line character
        // split('\n') separate the table into an array of separate rows
        // slice(start, end) - return array starting at index start and ending at end-1
        const table = data.split('\n').slice(1);
        // console.log(table);
    
        table.forEach(row => {
            const columns = row.split(',');  // split row into columns using commas 
            const trial = parseFloat(columns[0]); // assign trial value
            trials.push(trial);
            
            const maeTrain = parseFloat(columns[1]); // mae = mean absolute error
            meanAbsErrorTrain.push(maeTrain);
    
            const maeTest = parseFloat(columns[2]); // mae = mean absolute error
            meanAbsErrorTest.push(maeTest);
    
            const r2Train = parseFloat(columns[3]); // mae = mean absolute error
            r2ScoreTrain.push(r2Train);

            const r2Test = parseFloat(columns[4]); // mae = mean absolute error
            r2ScoreTest.push(r2Test);
    
            // console.log(year, temp, nhtemp, shtemp);
        })
        return {trials, meanAbsErrorTrain, meanAbsErrorTest, r2ScoreTrain, r2ScoreTest}  // return multiple values as a object
    }
    
    async function createChart(metric, train) {    // metric can be 'mae' or 'r2', train can be true or false
        // Get formatted data for all three area predictors
        const controlData = await getData('../data/control_area.csv'); // wait for getData to get formatted data
        const mlpData = await getData('../data/mlp_area.csv');
        const mlrData = await getData('../data/mlr_area.csv');

        const chartId = `${metric}-${train ? 'train' : 'test'}`
        console.log(chartId)
        const lineChart = document.getElementById(chartId);

        // Declare String Values based on metric and train/test
        const prefix = metric === 'mae' ? 'meanAbsError' : 'r2Score';
        const suffix = train ? 'Train' : 'Test';
        const property = prefix + suffix;
        console.log(property)
        const metricTitle = metric === 'mae' ? 'Mean Absolute Error in sq. km.' : 'R^2 Score';
        const metricTitleWithoutUnit = metric === 'mae' ? 'Mean Absolute Error' : 'R^2 Score'
        const withIng = train ? 'Training' : 'Testing';

        const myChart = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: controlData.trials,
                datasets: [
                    {
                        label: `${metricTitle} of the Control Area Predictor`,
                        data: controlData[property],
                        fill: false,
                        backgroundColor: 'rbga(255, 0, 132, 0.2)',
                        borderColor: 'rgba(255, 0, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: `${metricTitle} of the Multilayer Perceptron Area Predictor`,
                        data: mlpData[property],
                        fill: false,
                        backgroundColor: 'rbga(0, 102, 255, 0.2)',
                        borderColor: 'rgba(0, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: `${metricTitle} of the Mulitple Linear Regression Area Predictor`,
                        data: mlrData[property],
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
                            text: 'Trial #',         // x-axis title
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            callback: function(val, index) {
                                return index % 5 === 4 ? this.getLabelForValue(val) : '';
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
                            text: metricTitle,         // y-axis title
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            min: 0,
                            major: {
                                enabled: true
                            },
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: '#6c767e'
                        },
                        type: (metric === 'mae' && !train) ? 'logarithmic' : 'linear'
                    }
                },
                plugins: {  // Display options for title and legends
                    title: {
                        display: true,
                        text: `${metricTitleWithoutUnit} for Area Predictors over ${withIng} Datasets`,
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
    
createChart('mae', true);
createChart('mae', false);
createChart('r2', true);
createChart('r2', false);
