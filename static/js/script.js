document.addEventListener("DOMContentLoaded", function() {
    const yearSelect = document.getElementById("year-select");
    const crimeTable = document.getElementById("crime-table").getElementsByTagName("tbody")[0];

    const barCtx = document.getElementById("bar-chart").getContext("2d");
    const pieCtx = document.getElementById("pie-chart").getContext("2d");
    const lineCtx = document.getElementById("line-chart").getContext("2d");
    const doughnutCtx = document.getElementById("doughnut-chart").getContext("2d");

    let barChart, pieChart, lineChart, doughnutChart;

    // Function to update the table with crime data
    function updateTable(data, year) {
        crimeTable.innerHTML = "";  // Clear the table

        // If data is an object containing the array in a property
        const crimeData = data.data || data;  // Adjust this based on the structure
        console.log('Crime Data for Table:', crimeData); // Log data to check its structure

        crimeData.forEach(item => {
            const row = crimeTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = item.region;
            cell2.textContent = item[`IPC_${year}`] || "N/A";
        });
    }

    // Function to update charts
    function updateCharts(data, year) {
        const labels = data.map(item => item.region);
        const ipcData = data.map(item => item[`IPC_${year}`]);

        // Bar Chart
        if (barChart) barChart.destroy();
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Crime Data for ${year}`,
                    data: ipcData,
                    backgroundColor: '#4CAF50',
                    borderColor: '#45a049',
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

        // Pie Chart
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: ipcData,
                    backgroundColor: ['#FF6347', '#FF7F50', '#FFD700', '#98FB98', '#FF4500'],
                }]
            },
            options: { responsive: true }
        });

        // Line Chart
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Crime Data Over Time (${year})`,
                    data: ipcData,
                    borderColor: '#FF6347',
                    fill: false
                }]
            },
            options: { responsive: true }
        });

        // Doughnut Chart
        if (doughnutChart) doughnutChart.destroy();
        doughnutChart = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: ipcData,
                    backgroundColor: ['#FF6347', '#FF7F50', '#FFD700', '#98FB98', '#FF4500'],
                }]
            },
            options: { responsive: true }
        });
    }

    // Event listener for year selection
    yearSelect.addEventListener("change", function() {
        const selectedYear = yearSelect.value;

        // Fetch the crime data from Flask backend
        fetch(`/get_crime_data/${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data);  // Log data to check its structure
                if (data.error) {
                    console.error(data.error);
                } else {
                    updateTable(data, selectedYear);
                    updateCharts(data, selectedYear);
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    });

    // Trigger change event on page load to display data for the first year
    yearSelect.dispatchEvent(new Event("change"));
});
