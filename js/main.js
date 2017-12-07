window.addEventListener('DOMContentLoaded', init);

function init () {

    function Slider () {
        // helpers variable
        this.maxCount = 10;
        this.currentCount = 1;
        this.root = 'https://jsonplaceholder.typicode.com/photos';
        this.translateX = 0; 
        this.widthPerOneImage = 600;
        
        // DOM
        this.listElement = document.querySelector('.slider__list');
        this.dotsList = document.querySelector('.dots__list');
        this.preloader = document.querySelector('.preloader');
        this.btns = document.querySelectorAll('.btn');
       

        /**
         * 
         *  todo: Get API images
         * 
         */
        this._getData = (url, slide) => {
            fetch(`${url}/${slide}`).then(response => {
                return response.json();
            }).then(data => {
                this.appendImage(data);
            });
            
        }

        /**
         * 
         * todo: Append image in LI element if we not have
         * 
         */

        this.appendImage = obj => {
            let activeSlide = document.querySelector('.active-slide');
            let img = new Image();
            img.src = obj.url;
            img.addEventListener('load', () => {
                this.preloader.classList.add('preloader--hide');
            });
            activeSlide.appendChild(img);
        };

        /**
         * 
         * todo: Change active slide
         * 
         */

        this.activeSlide = current => {
            for (let i = 0; i < this.listElement.children.length; i++) {
                this.listElement.children[i].classList.remove('active-slide');
                if (i + 1 === current) {
                    this.listElement.children[i].classList.add('active-slide');

                    let dataAttr = this.listElement.children[i].dataset.slide;
                    this.activeDots(dataAttr);

                    if (this.listElement.children[i].children.length === 0) {
                        this.preloader.classList.remove('preloader--hide');
                        this._getData(this.root, current);
                    }
                }
            }
        };

        /**
         * 
         * todo: Prev & Next actions
         * 
         */

        this._prevNext = ev => {
            let id = ev.currentTarget.getAttribute('id');
            if (id === 'next') {
                if (this.currentCount < this.maxCount) {
                    this.currentCount++;
                    this.translateX += this.widthPerOneImage;
                }
            } else {
                if (this.currentCount > 0) {
                    this.currentCount--;
                    this.translateX -= this.widthPerOneImage;
                }
            }
            this.listElement.style.transform = `translateX(-${this.translateX}px)`;
            this.activeSlide(this.currentCount);
        }

        /**
         * 
         *  todo: Dots actions & dots active class
         * 
         */
        
        this.activeDots = data => {
            let elements = document.querySelectorAll('.dots__item');
            elements.forEach(el => {
                el.classList.remove('dots__item--active');
                return;
            });
            elements.forEach(el => {
                if (el.dataset.slide === data) {
                    el.classList.add('dots__item--active');
                    return;
                }
            });
        };

        this._dotsSwitch = ev => {
            let target = ev.target,
                dataAttr = target.dataset.slide,
                sliderItems = document.querySelectorAll('.slider__item');
            this.currentCount = +dataAttr + 1;
            this.translateX = this.widthPerOneImage * (this.currentCount - 1);

            this.activeSlide(this.currentCount);
            this.listElement.style.transform = `translateX(-${this.translateX}px)`;
            this.activeDots(dataAttr);
        }

        this._initLayout = (parent, childClass, activeClass) => {
            for (let i = 0; i < this.maxCount; i++) {
                let liElement = document.createElement('li');
                liElement.className = childClass;
                liElement.setAttribute('data-slide', i);
                parent.appendChild(liElement);
            }
            parent.children[0].classList.add(activeClass);
        };

        /**
         * 
         * Basic constructor function's
         * 
         */
        
        this._events = () => {
            this.btns.forEach (btn => {
                btn.addEventListener('click', this._prevNext);
            })
            this.dotsList.addEventListener('click', this._dotsSwitch);
        };

        this._init = () => {
            this._initLayout(this.listElement, 'slider__item', 'active-slide');
            this._initLayout(this.dotsList, 'dots__item', 'dots__item--active');
            this._getData(this.root, this.currentCount);
            this._events();
        };
        this._init();
    }

    const runSlider = new Slider();

}