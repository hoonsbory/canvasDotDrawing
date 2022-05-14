import Canvas from './Canvas';
import Typed from 'typed.js';

const fileTypeCheck = fileName => {
  const pathpoint = fileName.lastIndexOf('.');

  const filepoint = fileName.substring(pathpoint + 1, fileName.length);

  const filetype = filepoint.toLowerCase();

  if (!(filetype == 'jpg' || filetype == 'png' || filetype == 'jpeg')) {
    alert('jpg, jpeg, png  확장자만 가능합니다.');
    return false;
  }
  return true;
};

const onChange = e => {
  const file = e.target.files[0];
  if (fileTypeCheck(file.name)) {
    const mainWrapper = document.querySelector('.mainWrapper');
    mainWrapper.classList.add('hide');
    const reader = new FileReader();
    reader.onload = e => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = img => {
        new Canvas(img.target);
      };
    };
    reader.readAsDataURL(file);
  }
};

const ImageInput = document.getElementById('imageInput');
ImageInput.addEventListener('change', onChange);

var options = {
  strings: ['Dot Image On Canvas'],
  typeSpeed: 55,
};

var typed = new Typed('.typedTitle', options);
