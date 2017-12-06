window.addEventListener('DOMContentLoaded', init);

function init () {

    function Slider () {
        // helpers variable
        this.maxCount = 10;
        this.currentCount = 1;
        this.root = 'https://jsonplaceholder.typicode.com/photos';
        this.translateX = 0; 
        
        // DOM
        this.listElement = document.querySelector('.slider__list');
        this.preloader = document.querySelector('.preloader');
        this.next = document.querySelector('#next');
        this.prev = document.querySelector('#prev');
       
        this._getData = (url, slide) => {
            fetch(`${url}/${slide}`).then(response => {
                return response.json();
            }).then(data => {
                this.appendImage(data);
            });
            
        }

        this.appendImage = obj => {
            let activeSlide = document.querySelector('.active-slide');
            const img = new Image();
            img.src = obj.url;
            img.addEventListener('load', () => {
                this.preloader.classList.add('preloader--hide');
            })
            activeSlide.appendChild(img);
        }

        this.activeSlide = current => {
            
            for (let i = 0; i < this.listElement.children.length; i++) {
                this.listElement.children[i].classList.remove('active-slide');
                if (i + 1 === current) {
                    this.listElement.children[i].classList.add('active-slide');

                    if (this.listElement.children[i].children.length === 0) {
                        this.preloader.classList.remove('preloader--hide');
                        this._getData(this.root, current);
                    }
                }
            }
        }


        /**
         * 
         *  CONTROLS
         * 
         */

        this._prevElement = () => {
            if (this.currentCount > 0) {
                this.currentCount--;
                this.translateX -= 600;
                this.listElement.style.transform = `translateX(-${this.translateX}px)`;
                this.activeSlide(this.currentCount);
            }
        }

        this._nextElement = () => {
            if (this.currentCount < this.maxCount) {
                this.currentCount++;
                this.translateX += 600;
                this.listElement.style.transform = `translateX(-${this.translateX}px)`;
                
                this.activeSlide(this.currentCount);
            }
        } 

        this._events = () => {
            this.prev.addEventListener('click', this._prevElement);
            this.next.addEventListener('click', this._nextElement);
        }

        this._init = () => {
            for (let i = 0; i < this.maxCount; i++) {
                let liElement = document.createElement('li');
                liElement.className = 'slider__item';
                this.listElement.appendChild(liElement);
            }
            this.listElement.children[0].classList.add('active-slide');

            this._events();
            this._getData(this.root, this.currentCount);
        }
        this._init();
    }

    const runSlider = new Slider();

}