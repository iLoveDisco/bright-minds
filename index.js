class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.renderItems()
        //this.carousel()
    }

    carousel() {
        for (let i = 0; i < this.pictures.length; i++) {
           this.pictures[i].style.display = "none";  
        }
        this.currentIndex++;
        if (this.currentIndex > this.pictures.length) {this.currentIndex = 1}    
        this.pictures[this.currentIndex - 1].style.display = "";
        setTimeout(this.carousel.bind(this), 7000); // Change image every 2 seconds
    }

    scrollIntoView (el_id) {
        const element = document.querySelector(`#${el_id}`)
        
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    renderItems() {
        for(let i = 0; i < this.navButtons.length; i++) {
            if (this.navButtons[i].innerHTML == "Home") {
                this.navButtons[i]
                    .addEventListener('click', this.scrollIntoView.bind(this, "home_id"))
            }
            else if (this.navButtons[i].innerHTML == "Programs") {
                this.navButtons[i]
                    .addEventListener('click', this.scrollIntoView.bind(this, "programs_id"))
            }
        }
    }
}

const app = new App()