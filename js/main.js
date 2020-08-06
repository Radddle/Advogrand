'use strict';
/* ===================================================================================================================== */
const burger = document.querySelector('.burger'),
	navBarMenu = document.querySelector('.header__nav-list'),
	body = document.querySelector('body');

burger.addEventListener('click', (event) => {
	burger.classList.toggle('active');
	navBarMenu.classList.toggle('active');
	body.classList.toggle('lock');
});
/* ===================================================================================================================== */
$('.tariff__menu-link').click(function () {
	$('.tariff__menu-link').removeClass('link-active');
	$(this).addClass('link-active');
});
/* ===================================================================================================================== */
const sliders = document.querySelectorAll('.swiper-container');

sliders.forEach((el) => {
	let mySwiper = new Swiper(el, {
		slidesPerView: 1,
		observer: true,
		observeParents: true,
		navigation: {
			nextEl: el.nextElementSibling,
			prevEl: el.previousElementSibling,
		},

		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 10,
			},
		}
	})
});
/*===================================================================================================================== */
const partners = document.querySelectorAll('.partners-swiper-container');
partners.forEach((item) => {
	let mySwiper = new Swiper(item, {
		loop: true,
		slidesPerView: 1,
		navigation: {
			nextEl: item.nextElementSibling,
			prevEl: item.previousElementSibling,
		},
		breakpoints: {
			576: {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 10,
			},
			1050: {
				slidesPerView: 4,
				spaceBetween: 10,
			},
		}
	});
});


/*===================================================================================================================== */
let tab = function () {
	let tabNav = document.querySelectorAll('.tabs-nav__link'),
		tabContent = document.querySelectorAll('.slider-body'),
		tabName;
	tabNav.forEach(item => {
		item.addEventListener('click', selectTabNav)
	});

	function selectTabNav() {
		tabNav.forEach(item => {
			item.classList.remove('tabs-nav__link--active');
		});
		this.classList.add('tabs-nav__link--active');
		tabName = this.getAttribute('data-tab-name');
		selectTabContent(tabName);
	}

	function selectTabContent(tabName) {
		tabContent.forEach(item => {
			item.classList.contains(tabName) ? item.classList.add('slider-body--active') : item.classList.remove('slider-body--active');
		});
	}
};
tab();
/* ===================================================================================================================== */
/* ===================================================================================================================== */
/* ===================================================================================================================== */

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = "max"; //Для MobileFirst поменять на min

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			} //Для MobileFirst поменять
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
/* ===================================================================================================================== */
const advP = document.querySelector('.adv-popup '),
	modalClose = document.querySelector('.modal-close'),
	advantagesStatsBtn = document.querySelector('.advantages__stats-btn'),
	consultationPopup = document.querySelector('.consultation-popup'),
	btnTariffConsul = document.querySelectorAll('.btn-tariff_consul'),
	mainBtn = document.querySelector('.main__btn'),
	headerNavBtn = document.querySelector('.header__nav-btn'),
	callbackPopup = document.querySelector('.callback-popup'),
	callbackPopupForm = document.querySelector('.callback-popup__form'),
	consultationPopupForm = document.querySelector('.consultation-popup__form');


headerNavBtn.addEventListener('click', event => {
	event.preventDefault();
	callbackPopup.classList.add('show');
	body.classList.add('lock');
	document.addEventListener('keydown', closeModalEsc);
	callbackPopupForm.reset();

});

mainBtn.addEventListener('click', event => {
	event.preventDefault();
	consultationPopup.classList.add('show');
	body.classList.add('lock');
	document.addEventListener('keydown', closeModalEsc);
	consultationPopupForm.reset();
});

btnTariffConsul.forEach((item) => {
	item.addEventListener('click', event => {
		event.preventDefault();
		consultationPopup.classList.add('show');
		body.classList.add('lock');
		document.addEventListener('keydown', closeModalEsc);
		consultationPopupForm.reset();
	})
});

advantagesStatsBtn.addEventListener('click', event => {
	event.preventDefault();
	advP.classList.add('show');
	body.classList.add('lock');
	document.addEventListener('keydown', closeModalEsc);
});

const closeModal = function (event) {
	const target = event.target;
	if (target.closest('.modal-close') || target === this) {
		this.classList.remove('show');
		body.classList.remove('lock');
	}
}

const closeModalEsc = event => {
	if (event.code === 'Escape') {
		callbackPopup.classList.remove('show');
		consultationPopup.classList.remove('show');
		advP.classList.remove('show');
		body.classList.remove('lock');
	}
};

advP.addEventListener('click', closeModal);
callbackPopup.addEventListener('click', closeModal);
consultationPopup.addEventListener('click', closeModal);
/* ===================================================================================================================== */