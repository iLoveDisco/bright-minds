class Blog {
    constructor () {
        this.blogList = document.querySelector("#blogList_id");
        this.loadEntries('entries', this.blogList, this.renderEntry.bind(this));
        this.renderForm();
    }

    renderForm () {
        const form = document.querySelector('#form_id');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        });
    }

    /**
     * Loads all entries from online database.
     * @param {*} directory - Directory name in database.  
     * @param {*} listElement - The node/ element where the data should be loaded on.
     * @param {*} renderMethod - Method passed in that determines HOW data should look.
     */
    loadEntries(directory, listElement, renderMethod) {
        firebase.database().ref().once("value").then(snapshot => {
            if (this.isUnAuth() && listElement.id != "blogList_id") return;
            const database = snapshot.val()[directory];// find the correct spot in database
            const sortedEntries = Object.keys(database).sort((a,b) => {
                return parseInt(b) - parseInt(a); // Sort database keys by most recent
            })
            sortedEntries.forEach(key => {
                listElement.appendChild(renderMethod(database[key]))
            });// Append to list
         })
    }

    isUnAuth () {
        if(document.querySelector("#form_id").name != "3a49z83!?3") console.log('Unauthorized Access');
        return document.querySelector("#form_id").name != "3a49z83!?3";
    }

    handleSubmit (ev) { // current user is visible
        ev.preventDefault();
        const titleTextBox = document.querySelector("#titleTextBox_id");
        const nameTextBox = document.querySelector('#nameTextBox_id')
        const descTextBox = document.querySelector("#descTextBox_id");
        const entry = {
            articleTitle: titleTextBox.value,
            body: descTextBox.value,
            displayName: nameTextBox.value,
            date: this.formatBlogDate(new Date()),
            id: ""
        }
        this.addEntry(entry);
    }

    formatBlogDate (today) {
        const dd = today.getDate();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const mm = months[today.getMonth()];
        const yyyy = today.getFullYear();
        return `~ ${mm} ${dd}, ${yyyy} ~`;
    }

    addEntry(entry) {
        if (this.isUnAuth()) return;
        const database = firebase.database();
        entry['id'] = new Date().getTime();
        database.ref('entries/' + new Date().getTime()).set(entry);
        location.reload();
    }

    deleteEntry(entryID, ev) {
        if (this.isUnAuth()) return;
        const database = firebase.database();
        database.ref('entries/' + entryID).remove();
        location.reload();
    }

    renderEntry(entry) {
        const item = document.querySelector("#blog_entry_id").cloneNode(true);
        const properties = Object.keys(entry);
        properties.forEach(property => {
            const el = item.querySelector(`.${property}`);// HTML element class has the same property name as entry keys.
            if (el) {
                // Special cases
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
              // Sets the text content for all properties.
              el.textContent = entry[property];
            }
          })
        item.style.display = "block";
        return item;
    }

    formatBody(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');// replaces all returns with <br>
    }
}

const blog = new Blog();