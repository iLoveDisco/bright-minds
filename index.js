class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
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
}

const app = new App()