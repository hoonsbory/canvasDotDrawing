import Circle from './Circle.js';

class Canvas {
  CircleArr = [];
  constructor(img) {
    this.canvas = document.createElement('canvas');
    this.copyCanvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.copyCtx = this.copyCanvas.getContext('2d', { alpha: false });
    this.speedInput = document.getElementById('speed');
    //컨트롤 부분 height
    const controller = document.querySelector('.controller');
    const controllerHeight = controller.offsetHeight;
    const canvasHeight = window.innerHeight - controllerHeight;

    const nonRectPoint = 150;
    const rectPoint = 100;
    const radius = 16.667;
    //세로가 긴 직사각형
    if (img.height > img.width && img.height / img.width >= 1.5) {
      this.imgType = 0;
      this.canvas.height =
        Math.floor(canvasHeight / nonRectPoint) * nonRectPoint;
      this.canvas.width = this.canvas.height / 1.5;

      //세로길이에 의해 구해진 가로가 기기의 가로보다 크다면 가로를 기준으로.
      if (this.canvas.width > window.innerWidth) {
        this.canvas.width =
          Math.floor(window.innerWidth / nonRectPoint) * nonRectPoint;
        this.canvas.height = this.canvas.width * 1.5;
      }
      this.unit = Math.floor(this.canvas.height / nonRectPoint) * radius;
      //가로가 긴 직사각형
    } else if (img.height < img.width && img.width / img.height >= 1.5) {
      this.imgType = 1;
      this.canvas.width =
        Math.floor(window.innerWidth / nonRectPoint) * nonRectPoint;
      this.canvas.height = this.canvas.width / 1.5;

      if (this.canvas.height > canvasHeight) {
        this.canvas.height =
          Math.floor(canvasHeight / nonRectPoint) * nonRectPoint;
        this.canvas.width = this.canvas.height * 1.5;
      }
      this.unit = Math.floor(this.canvas.width / nonRectPoint) * radius;

      //정사각형
    } else {
      this.imgType = 2;
      this.canvas.height = Math.floor(canvasHeight / rectPoint) * rectPoint;
      if (this.canvas.height > window.innerWidth) {
        this.canvas.width =
          Math.floor(window.innerWidth / rectPoint) * rectPoint;
        this.canvas.height = this.canvas.width;
      } else this.canvas.width = this.canvas.height;

      this.unit = Math.floor(this.canvas.width / rectPoint) * radius;
    }

    this.copyCanvas.width = this.canvas.width;
    this.copyCanvas.height = this.canvas.height;

    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.copyCtx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    document.body.insertBefore(this.canvas, document.body.firstElementChild);
    this.copyCanvas.id = 'copyCanvas';
    document.body.appendChild(this.copyCanvas);

    controller.classList.add('fadeIn');

    if (this.imgType == 0) this.drawCircle(9, 6);
    else if (this.imgType == 1) this.drawCircle(6, 9);
    else this.drawCircle(6, 6);

    document
      .getElementById('autoBtn')
      .addEventListener('click', () => this.autoDivide());

    document
      .getElementById('originalBtn')
      .addEventListener('click', () => this.clearCanvas());

    const ua = navigator.userAgent.toUpperCase();
    if (ua.includes('MOBILE'))
      this.canvas.addEventListener('touchmove', e => this.touchMoveEvent(e));
    else this.canvas.addEventListener('mousemove', e => this.moveEvent(e));
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
    if (unit < 4) return;
    else {
      circle.isDivided = true;
      const x1 = (leftX + (leftX + rightX) / 2) / 2;
      const y1 = (leftY + (leftY + rightY) / 2) / 2;

      const x2 = (rightX + (leftX + rightX) / 2) / 2;
      const y2 = (rightY + (leftY + rightY) / 2) / 2;

      this.CircleArr.push(
        new Circle(
          x1,
          y1,
          unit / 2,
          centerX,
          centerY,
          this.ctx,
          this.copyCtx,
          1,
        ),
      );
      this.CircleArr.push(
        new Circle(
          x1,
          y2,
          unit / 2,
          centerX,
          centerY,
          this.ctx,
          this.copyCtx,
          2,
        ),
      );
      this.CircleArr.push(
        new Circle(
          x2,
          y2,
          unit / 2,
          centerX,
          centerY,
          this.ctx,
          this.copyCtx,
          3,
        ),
      );
      this.CircleArr.push(
        new Circle(
          x2,
          y1,
          unit / 2,
          centerX,
          centerY,
          this.ctx,
          this.copyCtx,
          4,
        ),
      );
    }
  }

  clearCanvas() {
    cancelAnimationFrame(this.ani_ID);
    this.CircleArr.forEach(i => i.clear());
    this.ani_ID = requestAnimationFrame(() => this.clearCanvas());
  }

  autoDivide(idx = 0) {
    cancelAnimationFrame(this.ani_ID);
    let range = Number(this.speedInput.value);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.CircleArr.length; i++) {
      if (!this.CircleArr[i].isDivided) {
        this.CircleArr[i].draw();
      }
    }

    for (let i = idx; i < idx + range; i++) {
      if (!this.CircleArr[i].isDivided)
        this.divideCircle(this.CircleArr[i], false);
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
      const y = this.unit * i + this.unit / 2;
      for (let j = 0; j < circleY; j++) {
        const x = this.unit * j + this.unit / 2;
        this.CircleArr.push(
          new Circle(x, y, this.unit, x, y, this.ctx, this.copyCtx),
        );
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

export default Canvas;
