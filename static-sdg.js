'use strict';


// Section 1: Chart Functions
let progressBar = null;

function drawProgressBar(progressPercentage, progressCode) {
    
    const progressCtx = document.querySelector("#progress-bar");
    progressCtx.dataset.indexNumber = progressCode;
    let compStyles = window.getComputedStyle(progressCtx);
    let customColor = compStyles.getPropertyValue("color");
    
    let progressData = {
        labels: [""],
        datasets: [
            {
                label: "progress",
                data: [progressPercentage],
                borderRadius: 5,
                backgroundColor: customColor,
            },
        ],
    };

    const progressConfig = {
        type: "bar",
        data: progressData,
        options: {
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
                x: {
                    max: 100,
                    ticks: {
                        callback: value => `${value}%`
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
        },
    };

    if (progressBar == null) {
        progressBar = new Chart(progressCtx, progressConfig);
    } 
    else {
        let newData = progressPercentage;
        progressBar.config._config.data.datasets[0].data = [newData];
        progressBar.config._config.data.datasets[0].backgroundColor = customColor;
        progressBar.update();
    }
};


let timePieChart = null;

function drawPieChart(progressYears, progressCode) {

    const timePieCtx = document.querySelector("#spa-time-pie");
    timePieCtx.dataset.indexNumber = progressCode;
    let compStyles = window.getComputedStyle(timePieCtx);
    let customColor = compStyles.getPropertyValue("color");

    const timePieData = {
        labels: ["years from start", "years remaining"],
        datasets: [
            {
                data: [
                    progressYears,
                    15 - progressYears
                ],
                backgroundColor: [
                    "#e1e1e1",
                    customColor,
                ],
            },
        ],
    };

    const timePieConfig = {
        type: "pie",
        data: timePieData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
        },
    };

    if (timePieChart == null) {
        timePieChart = new Chart(timePieCtx, timePieConfig);
    }
    else {
        let newData = [progressYears, 15 - progressYears];
        timePieChart.config._config.data.datasets[0].data = newData;
        timePieChart.config._config.data.datasets[0].backgroundColor[1] = customColor;
        timePieChart.update();
    }
};


let burndownChart = null;

function drawBurndownChart(progressPercentage, progressYears, progressCode) {

    const burndownCtx = document.querySelector("#spa-burndown");
    burndownCtx.dataset.indexNumber = progressCode;
    let compStyles = window.getComputedStyle(burndownCtx);
    let customColor = compStyles.getPropertyValue("color");

    // dotted segment of the actual line, expected up to 2023
    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

    let burndownData = {
        datasets: [
            {
                label: "actual",
                data: [
                    {x: 15, y: 0},
                    {x: 15 + progressYears, y: progressPercentage},
                ],
                backgroundColor: [customColor],
                borderColor: [customColor,],
            },
            {
                label: "baseline",
                data: [
                    {x: 15, y: 0},
                    {x: 30, y: 100},
                ],
                backgroundColor: ["rgb(0,0,0.2)"],
                borderColor: [ "rgb(0,0,0.2)"],
            },
            {
                label: "data last provided",
                data: [
                    {x: 15 + progressYears, y: 0},
                    {x: 15 + progressYears, y: NaN},
                    {x: 15 + progressYears, y: 100},
                ],
                backgroundColor: ["#a8a7a7",],
                borderColor: ["#a8a7a7"],
                segment: {
                    backgroundColor: ctx => skipped(ctx, "#a8a7a7"),
                    borderColor: ctx => skipped(ctx, "#a8a7a7"),
                    borderDash: ctx => skipped(ctx, [6,6]),
                },
                spanGaps: true
            },
            {
                label: "2023 reference",
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
            },
        ]
    };

    const burndownConfig = {
        type: 'line',
        data: burndownData,
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

    if (burndownChart == null) {
        burndownChart = new Chart(burndownCtx, burndownConfig);
    }
    else {
        let newActual = {x: 15 + progressYears, y: progressPercentage};
        let newMostRecent = [
            {x: 15 + progressYears, y: 0},
            {x: 15 + progressYears, y: NaN},
            {x: 15 + progressYears, y: 100}
        ];
        burndownChart.config._config.data.datasets[0].data[1] = newActual;
        burndownChart.config._config.data.datasets[2].data = newMostRecent;
        burndownChart.config._config.data.datasets[0].backgroundColor[0] = customColor;
        burndownChart.config._config.data.datasets[0].borderColor[0] = customColor;
        burndownChart.update();
    }
};

function updateDashboardText(progressCode, progressTitle, progressDescription, progressYears, progressPercentage) {
    let dashboardCode = document.querySelector("main");
    let goalCode = document.querySelector("#goal-code");
    let navBrandCode = document.querySelector("#sdg-letters");
    let iconCode1 = document.querySelector("#section-icon-1");
    let iconCode2a = document.querySelector("#section-icon-2a");
    let iconCode2b = document.querySelector("#section-icon-2b");
    let iconCode3 = document.querySelector("#section-icon-3");
    let goalTitle = document.querySelector("#goal-title");
    let goalDescription = document.querySelector("#goal-description");
    let goalProgress = document.querySelector("#progress-bar-header");
    let goalTime = document.querySelector("#pie-chart-header");
    let lastUpdated = document.querySelector("#last-updated");

    dashboardCode.dataset.indexNumber = progressCode;
    goalCode.innerText = progressCode;
    navBrandCode.dataset.indexNumber = progressCode;
    iconCode1.dataset.indexNumber = progressCode;
    iconCode2a.dataset.indexNumber = progressCode;
    iconCode2b.dataset.indexNumber = progressCode;
    iconCode3.dataset.indexNumber = progressCode;
    goalTitle.innerText = progressTitle;
    goalDescription.innerText = progressDescription;
    goalProgress.innerText = `${Math.round(progressPercentage)}% complete`;
    goalTime.innerText = `${Math.round(15 - progressYears)} years remaining`;
    lastUpdated.innerText = `For this SDG, data was last provided in ${Math.round(2015 + progressYears)}.`;

};


function listIndicators (indicatorsList) {
    let tableRef = document.querySelector("#indicators-tb");

    tableRef.innerHTML = null;

    for (const indicator of indicatorsList) {
        let newRow = tableRef.insertRow()
        let indicatorCode = newRow.insertCell(0)
        let indicatorDescription = newRow.insertCell(1)
        let indicatorPercentage = newRow.insertCell(2)

        indicatorCode.innerText = indicator.code,
        indicatorDescription.innerText = indicator.description,
        indicatorPercentage.innerText = `${Math.round(indicator.percentage)}%`
    }
}

// Fetching a specific goal's data and updating the page

function getGoalData(goalNumber) {
    fetch("/goals.json")
    .then(response => response.json())
    .then(data => {
        let goalData = data[goalNumber - 1];

        drawProgressBar(goalData.percentage, goalData.code);
        drawPieChart(goalData.years, goalData.code);
        drawBurndownChart(goalData.percentage, goalData.years, goalData.code);
        updateDashboardText(
            goalData.code, 
            goalData.title,
            goalData.description,
            goalData.years,
            goalData.percentage
        );
    })
}
    
    
function getIndicatorData(goalNumber) {
    fetch("/indicators.json")
    .then(response => response.json())
    .then(data => {
        let indicatorsData = data[goalNumber - 1];
        
        listIndicators(indicatorsData.indicators);
    })
}

// Event listeners for the list of goals in the navigation
const inputGoals = document.querySelectorAll(".list-group-item");

for (const inputGoal of inputGoals) {
    inputGoal.addEventListener("click", (event) => {
        let inputGoalElement = inputGoal.querySelector("#spa-goal-code");
        let goalCode = inputGoalElement.dataset.indexNumber;

        getGoalData(goalCode);
        getIndicatorData(goalCode);
    })
}