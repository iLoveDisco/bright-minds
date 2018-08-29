class Newsletter {
    constructor () {
        this.subscribeButton = document.querySelector("#subscribe_id");
        this.unsubscribeButton = document.querySelector("#unsubscribe_id");
        this.mailingList = document.querySelector("#mailing_list_id");
        this.mailingListButton = document.querySelector("#mailingListButton_id");
        this.renderSubscribe();
        this.renderUnsubscribe();
        this.showMailingList();
        this.renderCopyButton();
    }

    renderCopyButton () {
        document.querySelector('.copyButton').addEventListener('click',this.copyToClipboard.bind(this));
    }

    copyToClipboard () {
        document.querySelector('#mailing_list_id').select();
        document.execCommand("copy");
        document.querySelector('.copyButton').textContent = 'Emails are copied onto clipboard! Ctrl + V to paste'
    }

    renderSubscribe () {
        this.subscribeButton.addEventListener('click', this.handleSubmit.bind(this, 'sub'));
    }

    renderUnsubscribe () {
        this.unsubscribeButton.addEventListener('click', this.handleSubmit.bind(this, 'unsub'));
    }

    renderMailingListButton() {
        this.mailingListButton.addEventListener('click', this.showMailingList.bind(this));
    }

    showMailingList() {
        document.querySelector('.copyButton').style.display = 'block';
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            if (blog.isUnAuth()) return;
            const database = snapshot.val()['Subscribed Emails'];
            const toDisplay = [];
            Object.keys(database).forEach(key => {
                toDisplay.push(database[key]);
            })
            this.mailingList.value = toDisplay.toString();
        })
    }

    handleSubmit (type) {
        const input = document.querySelector('#newsletter_input_id');
        if (!input.value.includes('@')) {
            alert('Please enter a real email address');
            return;
        }
        if(type === 'sub') {
            this.addEmail(input.value);
        } else if (type === 'unsub') {
            this.removeEmail (input.value);
        }
    }

    disableButton (button) {
        button.disabled = true;
        button.style.opacity = .8;
    }

    addEmail (entry) {
        this.disableButton(this.subscribeButton);
        const id = new Date().getTime();
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['Subscribed Emails'];
            for(let i = 0; i < Object.keys(database).length; i++) {
                const key = Object.keys(database)[i];
                if (database[key] == entry) {
                    this.subscribeButton.textContent = "Already Subscribed!";
                    return; 
                };
            }
            firebase.database().ref('Subscribed Emails/' + id).set(entry);
            this.subscribeButton.textContent = 'Subscribed!';
        })
    }

    removeEmail (entry) {
        this.disableButton(this.unsubscribeButton);
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['Subscribed Emails'];
            for(let i = 0; i < Object.keys(database).length; i++) {
                const key = Object.keys(database)[i];
                if(database[key] === entry) {
                    firebase.database().ref('Subscribed Emails/' + key).remove();
                    this.unsubscribeButton.textContent = 'Unsubscribed!';
                    return;
                }
            }
            this.unsubscribeButton.textContent = 'Email not found';
        });
    }
}

const app4 = new Newsletter ();