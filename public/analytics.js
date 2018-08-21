class Analytics {
    constructor () {
        this.updateViewCount();
        this.loadChart();
    }
    
    updateViewCount () {
        const today = new Date();
        let mm = today.getMonth() + 1; // January is 0!
        if (mm < 10) mm = "0" + mm; // ensure two digits
        const yyyy = today.getFullYear() + "";
        const entryName = yyyy + mm;
        const ref = firebase.database().ref("ViewCount/" + entryName);// update viewcount in database
        ref.once('value').then(snapshot => {
            this.increaseViewCount(snapshot.val(), entryName);
          });
    }

    increaseViewCount (viewCount, entryName) {
        firebase.database().ref("ViewCount/" + entryName).set(viewCount + 1);
    }

    loadChart () {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.load('visualization', '1.0', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart);
        this.drawChart();
    }

    drawChart() {
        const options = {
            title: 'Website Visits Per Month',
            curveType: 'none',
            legend: { position: 'bottom' }
        };
        const months = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."];
        let dataArray = [['Month', 'View Count']];
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['ViewCount'];
            Object.keys(database).sort((a,b) => {
                return parseInt(a) - parseInt(b); // Sort by most recent
            }).map(key => dataArray.push([months[parseInt(key.substring(4)) - 1] + " " + key.substring(0,4), database[key]]));// Append to bloglist
            const dataTable = google.visualization.arrayToDataTable(dataArray);
            const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
            chart.draw(dataTable, options);
        });
    }
}

const app2 = new Analytics();