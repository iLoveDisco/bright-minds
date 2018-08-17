class App {
    constructor () {
        this.blogList = document.querySelector("#blogList_id");
        this.admins = ["erictu32@gmail.com", "brightmind111@gmail.com"];
        this.loadStylesheet();
        this.initializeFireBase();
        this.updateViewCount();
        this.checkUser();
        this.renderItems();
        this.loadEntries();
        this.loadChart();
    }

    updateViewCount () {
        const today = new Date();
        let mm = today.getMonth() + 1; // January is 0!
        if (mm < 10) mm = "0" + mm;
        const yyyy = today.getFullYear() + "";
        const entryName = yyyy + mm;
        let viewCount = 0;
        const ref = firebase.database().ref("ViewCount/" + entryName);
        ref.once('value').then(snapshot => {
            this.increaseViewCount(snapshot.val(), entryName);
          });
    }

    increaseViewCount (viewCount, entryName) {
        firebase.database().ref("ViewCount/" + entryName).set(viewCount + 1);
    }

    loadChart () {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart.bind(this));
        this.drawChart();
    }

    drawChart() {
        const data = google.visualization.arrayToDataTable([
            ['Date', 'View Count'],
            ['2004',  1000,      400],
            ['2005',  1170,      460],
            ['2006',  660,       1120],
            ['2007',  1030,      540]
        ]);

        const options = {
            title: 'Company Performance',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }

    loadStylesheet () {
        if (window.innerWidth <= 420)
            $("#indexCSS_id").attr("href", "mobile-bright-minds-tutoring.css");
    }

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            
        };
        firebase.initializeApp(config);
    }

    checkUser () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                document.querySelector("#avatar_id").src = user.photoURL;
                // show sign out (avatar)
                document.querySelector("#signIn_id").style.display = "none";
                document.querySelector("#signOut_id").style.display = "block";
                // if right user
                if (this.admins.includes(user.email)) {
                    // show admin-only tools
                    const elements = document.getElementsByClassName("admin-only");
                    for(let i = 0; i < elements.length; i++) {
                        elements[i].style.display = "block";
                        elements[i].name = "3a49z83!?3";
                    }
                }
            } else {
                // show sign in button
                document.querySelector("#signIn_id").style.display = "block";
                document.querySelector("#signOut_id").style.display = "none";
            }
        });
    }

    loadEntries() {
        const space = document.createElement("div");
        space.style.paddingBottom = "0vw";
        this.blogList.appendChild(space);

        const ref = firebase.database().ref();
        ref.on("value", snapshot => {
            const database = snapshot.val()['entries'];
            Object.keys(database).sort((a,b) => {
                return parseInt(b) - parseInt(a); // Sort by most recent
            }).map(key => this.blogList.appendChild(this.renderEntry(database[key])));// Append to bloglist
         })
    }

    renderItems() {
        this.renderNavButtons();
        this.renderDropDown();
        this.renderForm();
        this.renderSignIn();
        this.renderSignOut();
    }

    renderNavButtons() {
        const navButtons = document.getElementsByClassName("nav");
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < navButtonIds.length; i++) {
            navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
    }

    scrollIntoView (el_id) {
        const element = document.querySelector(`#${el_id}`)
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
    
    renderDropDown () {
        $('.learnMore').click(function (event) {
            event.preventDefault();
            $(this).next('.learnMore_drop').toggleClass('in');
        })    
    }

    renderForm () {
        const form = document.querySelector('#form_id');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        });
        const adminList = document.createElement("h3");
        adminList.appendChild(document.createTextNode(`Current administrators: ${this.admins}`))
        form.appendChild(adminList)
    }

    isUnAuth () {
        return document.querySelector("#form_id").name != "3a49z83!?3";
    }
    
    updateWriteLogs (type, isAuthorized) {
        const database = firebase.database();
        const entry = {
            type: type,
            authorized: isAuthorized
        };
        database.ref('Access Logs/' + new Date().toString()).set(entry);
    }

    handleSubmit (ev) { // current user is visible
        ev.preventDefault();
        if (this.isUnAuth()) {
            alert("Unauthorized Access");
            this.updateWriteLogs("submission", false);
            return;
        }
        this.updateWriteLogs("submission", true);
        const titleTextBox = document.querySelector("#titleTextBox_id");
        const nameTextBox = document.querySelector('#nameTextBox_id')
        const descTextBox = document.querySelector("#descTextBox_id");
        const entry = {
            articleTitle: titleTextBox.value,
            body: descTextBox.value,
            displayName: nameTextBox.value,
            date: this.formatDate(new Date()),
            id: ""
        }
        this.addEntry(entry);
    }

    formatDate (today) {
        const dd = today.getDate();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const mm = months[today.getMonth()];
        const yyyy = today.getFullYear();
        return `~ ${mm} ${dd}, ${yyyy} ~`;
    }

    addEntry(entry) {
        const database = firebase.database();
        const currentTime = new Date().getTime();
        entry['id'] = currentTime;
        database.ref('entries/' + currentTime).set(entry);
        location.reload();
    }

    deleteEntry(entryID, ev) {
        if (this.isUnAuth()) {
            alert("Unauthorized Access");
            this.updateWriteLogs("deletion", false);
            return;
        }
        this.updateWriteLogs("deletion", true);
        const database = firebase.database();
        database.ref('entries/' + entryID).remove();
        location.reload();
    }

    renderEntry(entry) {
        const item = document.querySelector("#blog_entry_id").cloneNode(true);
        const properties = Object.keys(entry);
        properties.forEach(property => {
            const el = item.querySelector(`.${property}`) // get the children inside item.
            if (el) { // if el != null
                switch (property) {
                    case "icon":
                        el.src = entry[property];
                        break;
                    case "body": 
                        el.innerHTML = this.formatBody(entry.body);
                        return;
                    case "id":
                        el.addEventListener('click', this.deleteEntry.bind(this, entry.id))
                        return;
                }
              // else
              el.textContent = entry[property];
            }
          })
        item.style.display = "block";
        return item;
    }

    formatBody(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');// replaces all returns with <br>
    }

    signIn () {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
         });
        firebase.auth().signInWithRedirect(googleProvider);
    }

    signOut () {
        firebase.auth().signOut();
        location.reload();
    }

    renderSignOut () {
        document.querySelector("#signOut_id").addEventListener('click', this.signOut);
    }

    renderSignIn () {
        document.querySelector("#signIn_id").addEventListener('click', this.signIn);
    }
}

const app = new App()

