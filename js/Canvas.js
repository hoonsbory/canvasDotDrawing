import Circle from './Circle.js';

class Canvas {
  CircleArr = [];
  constructor(img) {
    this.canvas = document.createElement('canvas');
    this.copyCanvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.copyCtx = this.copyCanvas.getContext('2d', { alpha: false });
    this.speedInput = document.getElementById('autoSpeed');
    //컨트롤 부분 height
    const controller = document.querySelector('.controller');
    const controllerHeight = controller.offsetHeight;
    const canvasHeight = window.innerHeight - controllerHeight;

    const nonRectPoint = 150;
    const rectPoint = 100;
    const defaultRadius = 16.667;
    //세로가 긴 직사각형
    if (img.height > img.width && img.height / img.width >= 1.5) {
      this.imgWidthHeight = [9, 6];
      this.canvas.height =
        Math.floor(canvasHeight / nonRectPoint) * nonRectPoint;
      this.canvas.width = this.canvas.height / 1.5;

      //세로길이에 의해 구해진 가로가 기기의 가로보다 크다면 가로를 기준으로.
      if (this.canvas.width > window.innerWidth) {
        this.canvas.width =
          Math.floor(window.innerWidth / nonRectPoint) * nonRectPoint;
        this.canvas.height = this.canvas.width * 1.5;
      }
      this.radius =
        Math.floor(this.canvas.height / nonRectPoint) * defaultRadius;
      //가로가 긴 직사각형
    } else if (img.height < img.width && img.width / img.height >= 1.5) {
      this.imgWidthHeight = [6, 9];
      this.canvas.width =
        Math.floor(window.innerWidth / nonRectPoint) * nonRectPoint;
      this.canvas.height = this.canvas.width / 1.5;

      if (this.canvas.height > canvasHeight) {
        this.canvas.height =
          Math.floor(canvasHeight / nonRectPoint) * nonRectPoint;
        this.canvas.width = this.canvas.height * 1.5;
      }
      this.radius =
        Math.floor(this.canvas.width / nonRectPoint) * defaultRadius;

      //정사각형
    } else {
      this.imgWidthHeight = [6, 6];
      this.canvas.height = Math.floor(canvasHeight / rectPoint) * rectPoint;
      if (this.canvas.height > window.innerWidth) {
        this.canvas.width =
          Math.floor(window.innerWidth / rectPoint) * rectPoint;
        this.canvas.height = this.canvas.width;
      } else this.canvas.width = this.canvas.height;

      this.radius = Math.floor(this.canvas.width / rectPoint) * defaultRadius;
    }

    this.copyCanvas.width = this.canvas.width;
    this.copyCanvas.height = this.canvas.height;

    this.copyCtx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    document.body.insertBefore(this.canvas, document.body.firstElementChild);
    this.copyCanvas.id = 'copyCanvas';
    document.body.appendChild(this.copyCanvas);

    controller.classList.add('fadeIn');

    this.drawCircle(...this.imgWidthHeight);

    document
      .getElementById('autoBtn')
      .addEventListener('click', () => this.autoDivide());

    document
      .getElementById('originalBtn')
      .addEventListener('click', () => this.clearCanvas());
    document
      .getElementById('resetBtn')
      .addEventListener('click', () => this.resetCanvas());

    const ua = navigator.userAgent.toUpperCase();
    if (ua.includes('MOBILE'))
      this.canvas.addEventListener('touchmove', e => this.touchMoveEvent(e));
    else this.canvas.addEventListener('mousemove', e => this.moveEvent(e));
  }

  resetCanvas() {
    this.CircleArr = [];
    this.drawCircle(...this.imgWidthHeight);
  }

  moveEvent(e) {
    for (let i = 0; i < this.CircleArr.length; i++) {
      if (
        !this.CircleArr[i].isDivided &&
        this.CircleArr[i].leftX <= e.offsetX &&
        this.CircleArr[i].rightX >= e.offsetX &&
        this.CircleArr[i].leftY <= e.offsetY &&
        this.CircleArr[i].rightY >= e.offsetY
      ) {
        this.divideCircle(this.CircleArr[i]);
        break;
      }
    }
  }

  touchMoveEvent(e) {
    e = this.addTouchOffsets(e);
    this.moveEvent(e);
  }

  addTouchOffsets(event) {
    var touch = event.touches[0] || event.changedTouches[0];
    var realTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    event.offsetX = touch.clientX - realTarget.getBoundingClientRect().x;
    event.offsetY = touch.clientY - realTarget.getBoundingClientRect().y;
    return event;
  }

  divideCircle(circle) {
    const { leftX, leftY, rightX, rightY, unit, centerX, centerY } = circle;
    if (rightX - leftX <= 4) return; //반지름 4보다 작으면 리턴
    else {
      circle.isDivided = true;
      const radius = unit / 2;

      //중심에서부터 나뉘어질 x,y좌표
      const x1 = (leftX + centerX) / 2;
      const y1 = (leftY + centerY) / 2;

      const x2 = (rightX + centerX) / 2;
      const y2 = (rightY + centerY) / 2;

      //1번 좌상단, 2번 좌하단, 3번 우하단, 4번 우상단.
      this.CircleArr.push(
        new Circle(x1, y1, radius, centerX, centerY, this.ctx, this.copyCtx, 1),
      );
      this.CircleArr.push(
        new Circle(x1, y2, radius, centerX, centerY, this.ctx, this.copyCtx, 2),
      );
      this.CircleArr.push(
        new Circle(x2, y2, radius, centerX, centerY, this.ctx, this.copyCtx, 3),
      );
      this.CircleArr.push(
        new Circle(x2, y1, radius, centerX, centerY, this.ctx, this.copyCtx, 4),
      );
    }
  }

  clearCanvas() {
    cancelAnimationFrame(this.ani_ID);
    this.CircleArr.forEach(i => (i.isClear ? '' : i.clear()));
    this.ani_ID = requestAnimationFrame(() => this.clearCanvas());
  }

  autoDivide(idx = 0) {
    cancelAnimationFrame(this.ani_ID);
    let range = Number(this.speedInput.value);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let dividedLength = 0;
    //분열 되지않은 것들만 드로우
    for (let i = 0; i < this.CircleArr.length; i++) {
      if (!this.CircleArr[i].isDivided) this.CircleArr[i].draw();
      else dividedLength++;
    }

    //분열된 원이 5천개 이상이면 과부하걸리므로 10000개씩 분열.
    if (dividedLength > 5000) range = 10000;

    //분열되지 않은 것들만 분열
    for (let i = idx; i < idx + range; i++) {
      if (!this.CircleArr[i].isDivided) this.divideCircle(this.CircleArr[i]);
    }

    this.ani_ID = requestAnimationFrame(() => this.autoDivide(idx + range));
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.CircleArr.forEach(i => (i.isDivided ? '' : i.draw()));
    this.ani_ID = requestAnimationFrame(() => this.animate());
  }

  drawCircle(circleX, circleY) {
    for (let i = 0; i < circleX; i++) {
      const y = this.radius * i + this.radius / 2;
      for (let j = 0; j < circleY; j++) {
        const x = this.radius * j + this.radius / 2;
        this.CircleArr.push(
          new Circle(x, y, this.radius, x, y, this.ctx, this.copyCtx),
        );
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

export default Canvas;
