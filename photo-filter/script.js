'use strict'

const inputsFilters = document.querySelector('.filters');
const buttonNext = document.querySelector('.btn-next');
const buttonReset = document.querySelector('.btn-reset');
const buttonSave = document.querySelector('.btn-save');
const fileInput = document.querySelector('.btn-load--input');
const fullscreenButton = document.querySelector('.fullscreen');
const canvas = document.querySelector('.canvas');
const firstImage = document.querySelector('.image');
const linkForImages = 'https://raw.githubusercontent.com/spolienko/for-photo-filter/master/assets/images/';
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
    '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];

let indexArrayImages = 0;

function getDayPeriod() {
    const currentDate = new Date();
    let dayPeriod = '';
    const hours = currentDate.getHours();
    if (hours >= 6 && hours < 12) { dayPeriod = 'morning'; }
    else if (hours >= 12 && hours < 18) { dayPeriod = 'day' }
    else if (hours >= 18 && hours <= 23) { dayPeriod = 'evening'; }
    else { dayPeriod = 'night'; }
    return dayPeriod;
}

function fullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function downloadImages(src) {
    let image = new Image();
    image.src = src;
    image.onload = function () {
        firstImage.src = src;
    }
}

function savePicture() {
    const imageCanvas = new Image();
    imageCanvas.setAttribute('crossOrigin', 'anonymous');
    imageCanvas.src = firstImage.src;
    imageCanvas.onload = function () {
        canvas.width = imageCanvas.width;
        canvas.height = imageCanvas.height;
        const ctx = canvas.getContext('2d');
        let k = (imageCanvas.height / firstImage.height);
        ctx.filter = window.getComputedStyle(firstImage).getPropertyValue('filter')
            .replace(/blur\(\d+px\)/, `blur(${(inputsFilters.children[0].children[0].value) * k}px)`);
        ctx.drawImage(imageCanvas, 0, 0);
        let link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'download.png';
        link.click();
        link.delete;
    }
}

function takeNewImage() {
    const index = indexArrayImages % images.length;
    const imgLink = linkForImages + getDayPeriod() + '/' + images[index];
    downloadImages(imgLink);
    indexArrayImages++;
}

function loadFromUser() {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        firstImage.src = reader.result;
    }
    reader.readAsDataURL(file);
    fileInput.value = null;
}

function resetFilters() {
    for (let i = 0; i < inputsFilters.children.length; i++) {
        let currentInput = inputsFilters.children[i].children[0];
        let result = currentInput.nextElementSibling;
        if (currentInput.matches('input[name="saturate"]')) {
            result.value = 100;
            currentInput.value = 100;
            let suffix = currentInput.dataset.sizing;
            firstImage.style.setProperty(`--${currentInput.name}`, 100 + suffix);
        } else {
            result.value = 0;
            currentInput.value = 0;
            let suffix = currentInput.dataset.sizing;
            firstImage.style.setProperty(`--${currentInput.name}`, 0 + suffix);
        }
    }
}

function changesFilters(e) {
        let valueResult = e.target.nextElementSibling;
        let newValue = e.target.value;
        valueResult.value = newValue;
        let suffix = e.target.dataset.sizing;
        firstImage.style.setProperty(`--${e.target.name}`, newValue + suffix);
}

inputsFilters.addEventListener('input', changesFilters);
buttonReset.addEventListener('click', resetFilters);
fileInput.addEventListener('change', loadFromUser)
buttonNext.addEventListener('click', takeNewImage);
buttonSave.addEventListener('click', savePicture);
fullscreenButton.addEventListener('click', function (e) {
    fullScreen();
});