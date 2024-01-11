'use strict';

/* Section 1: Functions */

let progressBar = null;

function drawProgress(ajaxProgress, ajaxCode) {

    const progressCtx = document.querySelector('#progress-bar');
    progressCtx.dataset.indexNumber = ajaxCode;
    let compStyles = window.getComputedStyle(progressCtx);
    let customColor = compStyles.getPropertyValue("color");
    
    let progressData = {
        labels: [''],
        datasets: [
            {
                label: 'progress',
                data: [ajaxProgress],
                borderRadius: 5,
                backgroundColor: customColor
            }
        ],
    };
    
    const progressConfig = {
            type: 'bar',
            data: progressData,
            options: {
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        max: 100,
                        ticks: {
                            // display: false,
                            callback: value => `${value}%`
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            display: false
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        };

    if (progressBar == null) {
        progressBar = new Chart(progressCtx, progressConfig);
    }
    else {
        let newData = ajaxProgress;
        progressBar.config._config.data.datasets[0].data = [newData];
        progressBar.config._config.data.datasets[0].backgroundColor = customColor;
        progressBar.update();
    }
};


// time remaining pie chart
let timePie = null;

function drawPie(ajaxTime, ajaxCode) {

    const timePieCtx = document.querySelector('#spa-time-pie');
    timePieCtx.dataset.indexNumber = ajaxCode;
    let compStyles = window.getComputedStyle(timePieCtx);
    let customColor = compStyles.getPropertyValue("color");
    
    const timePieData = {
        labels: ['years from start', 'years remaining'],
        datasets: [
            {
                data: [
                    ajaxTime,
                    15 - ajaxTime
                ],
                backgroundColor: [
                    '#e1e1e1',
                    customColor
                ],
            },
       ]
    }

    const timePieConfig = {
        type: 'pie',
        data: timePieData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
    };

    if (timePie == null) {
        timePie = new Chart(timePieCtx, timePieConfig);
    }
    else {
        let newData = [ajaxTime, 15 - ajaxTime];
        timePie.config._config.data.datasets[0].data = newData;
        timePie.config._config.data.datasets[0].backgroundColor[1] = customColor;
        timePie.update();
    }
};


// burndown chart of progress and time
let burnChart = null;

function drawBurn(ajaxProgress, ajaxTime, ajaxCode) {

    const burnCtx = document.querySelector('#spa-burndown');
    burnCtx.dataset.indexNumber = ajaxCode;
    let compStyles = window.getComputedStyle(burnCtx);
    let customColor = compStyles.getPropertyValue("color");

    // to build the dotted segment of the actual line (expected up to 2023)
    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
    
    let burnData = {
        datasets: [{
            label: 'actual',
            data: [
                {x: 15, y: 0},
                {x: 15 + ajaxTime, y: ajaxProgress},
            ],
            backgroundColor: [
                customColor
            ],
            borderColor: [
                customColor
            ]
        }, {
            label: 'baseline',
            data: [
                {x: 15, y: 0}, 
                {x: 30, y: 100},
            ],
            backgroundColor: [
                'rgb(0,0,0.2)'
            ],
            borderColor: [
                'rgb(0,0,0.2)'
            ]
        }, {
            label: 'data last provided',
            data: [
                {x: 15 + ajaxTime, y: 0},
                {x: 15 + ajaxTime, y: NaN},
                {x: 15 + ajaxTime, y: 100}
            ],
            backgroundColor: ['#a8a7a7'],
            borderColor: ['#a8a7a7'],
            segment: {
                backgroundColor: ctx => skipped(ctx, '#a8a7a7'),
                borderColor: ctx => skipped(ctx, '#a8a7a7'),
                borderDash: ctx => skipped(ctx, [6,6])
            },
            spanGaps: true
        }, {
            label: '2023 reference',
            data: [
                {x: 23, y: 0},
                {x:23, y: NaN},
                {x: 23, y: 100}
            ],
            backgroundColor: ['#e1e1e1'],
            borderColor: ['#e1e1e1'],
            segment: {
                backgroundColor: ctx => skipped(ctx, '#e1e1e1'),
                borderColor: ctx => skipped(ctx, '#e1e1e1'),
                borderDash: ctx => skipped(ctx, [6,6])
            },
            spanGaps: true
        }]
    }

    const burnConfig = {
        type: 'line',
        data: burnData,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 15,
                    ticks: {
                        callback: value => `20${value}`
                    }
                },
                y: {
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            },
            showLine: true,
            plugins: {
                tooltip: {
                    enabled: false,
                }
            }
        }
    };

    if (burnChart == null) {
        burnChart = new Chart(burnCtx, burnConfig);
    }
    else {
        let newActual = {x: 15 + ajaxTime, y: ajaxProgress};
        let newMostRecent = [
            {x: 15 + ajaxTime, y: 0},
            {x: 15 + ajaxTime, y: NaN},
            {x: 15 + ajaxTime, y: 100}
        ];
        burnChart.config._config.data.datasets[0].data[1] = newActual;
        burnChart.config._config.data.datasets[2].data = newMostRecent;
        burnChart.config._config.data.datasets[0].backgroundColor[0] = customColor;
        burnChart.config._config.data.datasets[0].borderColor[0] = customColor;
        burnChart.update();
    }
};


// text inputs on page
function updateText(ajaxCode, ajaxTitle, ajaxDescription, ajaxProgress, ajaxTime) {
    let dashCode = document.querySelector('main');
    let goalCode = document.querySelector('#goal-code');
    let navBrandCode = document.querySelector('#sdg-letters');
    let iconCode1 = document.querySelector('#section-icon-1');
    let iconCode2a = document.querySelector('#section-icon-2a');
    let iconCode2b = document.querySelector('#section-icon-2b');
    let iconCode3 = document.querySelector('#section-icon-3');
    let goalTitle = document.querySelector('#goal-title');
    let goalDescr = document.querySelector('#goal-description');
    let goalProg = document.querySelector('#progress-bar-header');
    let goalTime = document.querySelector('#pie-chart-header');
    let lastUpdated = document.querySelector('#last-updated');

    dashCode.dataset.indexNumber = ajaxCode;
    goalCode.innerText = ajaxCode;
    navBrandCode.dataset.indexNumber = ajaxCode;
    iconCode1.dataset.indexNumber = ajaxCode;
    iconCode2a.dataset.indexNumber = ajaxCode;
    iconCode2b.dataset.indexNumber = ajaxCode;
    iconCode3.dataset.indexNumber = ajaxCode;
    goalTitle.innerText = ajaxTitle;
    goalDescr.innerText = ajaxDescription;
    goalProg.innerText = `${Math.round(ajaxProgress)}% complete`;
    goalTime.innerText = `${Math.round(15 - ajaxTime)} years remaining`;
    lastUpdated.innerText = `For this SDG, data was last provided in ${Math.round(2015 + ajaxTime)}.`;
};


// indicators list
function listIndicators (ajaxIndicators) {

    let tableRef = document.querySelector('#indicators-tb');

    tableRef.innerHTML = null;

    for (const indicator of ajaxIndicators) {
        let newRow = tableRef.insertRow()
        let indId = newRow.insertCell(0)
        let indDescription = newRow.insertCell(1)
        let indProgress = newRow.insertCell(2)

        indId.innerText = indicator.id,
        indDescription.innerText = indicator.description,
        indProgress.innerText = `${Math.round(indicator.progress)}%`
    };
};


/* Section 2: Event Handler */

// Create event handler for each goal's image
const inputGoals = document.querySelectorAll('.list-group-item');

for (const inputGoal of inputGoals) {

    inputGoal.addEventListener('click', (evt) => {

        const inputGoalEle = inputGoal.querySelector('#spa-goal-code');
        const goalcode = inputGoalEle.dataset.indexNumber;
        
        fetch(`/progress_data.json/${goalcode}`)
        .then(response => response.json())
        .then(responseJson => {
            const progress_data = {
                code: responseJson.code,
                title: responseJson.title,
                description: responseJson.description,
                progress: responseJson.progress,
                years_from_start: responseJson.ytd,
                indicators: responseJson.indicators
            };
            
            // updateCss(progress_data.code);
            
            drawProgress(progress_data.progress, progress_data.code);

            drawPie(progress_data.years_from_start, progress_data.code);

            drawBurn(progress_data.progress, progress_data.years_from_start, progress_data.code);

            updateText(progress_data.code, progress_data.title, 
                progress_data.description, progress_data.progress, 
                progress_data.years_from_start);

            listIndicators(progress_data.indicators);
        });
    });
};