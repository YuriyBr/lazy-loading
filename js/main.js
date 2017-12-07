window.addEventListener('DOMContentLoaded', init);

function init() {

    class Slider {

        constructor () {
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

            this._initLayout(this.listElement, 'slider__item', 'active-slide');
            this._initLayout(this.dotsList, 'dots__item', 'dots__item--active');
            this._getData(this.root, this.currentCount);
            this._events();
        }

        _events () {
            this.btns.forEach (btn => {
                btn.addEventListener('click', this._prevNext.bind(this));
            })
            this.dotsList.addEventListener('click', this._dotsSwitch.bind(this));
        };

        _initLayout (parent, childClass, activeClass) {
            for (let i = 0; i < this.maxCount; i++) {
                let liElement = document.createElement('li');
                
                liElement.className = childClass;
                liElement.setAttribute('data-slide', i);
                parent.appendChild(liElement);
            }
            parent.children[0].classList.add(activeClass);
        };

        _getData (url, slide) {
            fetch(`${url}/${slide}`).then(response => {
                return response.json();
            }).then(data => {
                this._appendImage(data);
            });
        };

        _appendImage (obj) {
            let activeSlide = document.querySelector('.active-slide'),
                img = new Image();

            img.src = obj.url;
            img.addEventListener('load', () => {
                this.preloader.classList.add('preloader--hide');
            });
            activeSlide.appendChild(img);
        };

        _activeSlide (current) {
            for (let i = 0; i < this.listElement.children.length; i++) {
                this.listElement.children[i].classList.remove('active-slide');
                if (i + 1 === current) {
                    this.listElement.children[i].classList.add('active-slide');

                    let dataAttr = this.listElement.children[i].dataset.slide;
                    this._activeDots(dataAttr);

                    if (this.listElement.children[i].children.length === 0) {
                        this.preloader.classList.remove('preloader--hide');
                        this._getData(this.root, current);
                    }
                }
            }
        };

        _prevNext (ev) {
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
            this._activeSlide(this.currentCount);
        }

        /**
         * 
         *  todo: Dots actions & dots active class
         * 
         */

        _activeDots (data) {
            let elements = document.querySelectorAll('.dots__item');

            elements.forEach (el => {
                el.classList.remove('dots__item--active');
                return;
            });
            elements.forEach (el => {
                if (el.dataset.slide === data) {
                    el.classList.add('dots__item--active');
                    return;
                }
            });
        };

        _dotsSwitch (ev) {
            let target = ev.target,
                dataAttr = target.dataset.slide,
                sliderItems = document.querySelectorAll('.slider__item');
                
            this.currentCount = +dataAttr + 1;
            this.translateX = this.widthPerOneImage * (this.currentCount - 1);

            this._activeSlide(this.currentCount);
            this.listElement.style.transform = `translateX(-${this.translateX}px)`;
            this._activeDots(dataAttr);
        };
    }

    const slider = new Slider();


}