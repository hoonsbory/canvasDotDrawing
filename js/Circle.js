class Circle {
  constructor(
    centerX,
    centerY,
    unit,
    parentCenterX,
    parentCenterY,
    ctx,
    copyCtx,
    circlePos,
  ) {
    this.divideSpeedInput = document.getElementById('divideSpeed');

    this.radius = unit / 2;
    this.leftX = centerX - this.radius;
    this.leftY = centerY - this.radius;
    this.rightX = centerX + this.radius;
    this.rightY = centerY + this.radius;

    this.rectLeftX = Math.round(this.leftX);
    this.rectLeftY = Math.round(this.leftY);
    this.rectRightX = Math.ceil(this.rightX);
    this.rectRightY = Math.ceil(this.rightY);
    this.rectSize = this.rectRightX - this.rectLeftX;
    this.rectChangePoint = this.rectSize * 0.1;
    this.afterChangeRectSize = 1;
    this.rectImgData = null;

    this.ctx = ctx;
    this.unit = unit;
    this.circlePos = circlePos;
    this.copyCtx = copyCtx;
    this.centerX = centerX;
    this.centerY = centerY;
    this.parentCenterX = parentCenterX;
    this.parentCenterY = parentCenterY;
    this.pi = Math.PI * 2;
    this.distanceUnit = this.divideSpeedInput.value / 10;
    this.isDivided = false;
    this.rgbData = null;
  }

  draw() {
    this.distanceUnit = this.divideSpeedInput.value / 10;
    if (!this.rgbData) {
      const imgData = this.copyCtx.getImageData(
        this.leftX,
        this.leftY,
        this.rightX - this.leftX,
        this.rightY - this.leftY,
      ).data;

      this.rgbData = this.getAverageColor(imgData);
    }

    this.ctx.fillStyle = `rgb(${[...this.rgbData]})`;
    this.ctx.beginPath();

    const distanceX = Math.abs(this.parentCenterX - this.centerX);

    if (distanceX < this.distanceUnit) {
      this.parentCenterX = this.centerX;
      this.parentCenterY = this.centerY;
    } else
      switch (this.circlePos) {
        case 1:
          this.parentCenterX -= this.distanceUnit;
          this.parentCenterY -= this.distanceUnit;
          break;
        case 2:
          this.parentCenterX -= this.distanceUnit;
          this.parentCenterY += this.distanceUnit;
          break;
        case 3:
          this.parentCenterX += this.distanceUnit;
          this.parentCenterY += this.distanceUnit;
          break;
        case 4:
          this.parentCenterX += this.distanceUnit;
          this.parentCenterY -= this.distanceUnit;
          break;

        default:
          break;
      }
    this.ctx.arc(
      this.parentCenterX,
      this.parentCenterY,
      this.radius,
      0,
      this.pi,
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  clear() {
    if (this.afterChangeRectSize < this.rectSize)
      this.afterChangeRectSize += this.rectChangePoint;
    else this.isClear = true;

    if (!this.rectImgData)
      this.rectImgData = this.copyCtx.getImageData(
        this.rectLeftX,
        this.rectLeftY,
        this.rectSize,
        this.rectSize,
      );

    this.ctx.putImageData(
      this.rectImgData,
      this.rectLeftX,
      this.rectLeftY,
      0,
      0,
      this.afterChangeRectSize,
      this.afterChangeRectSize,
    );
  }

  getAverageColor(data) {
    const arr = [0, 0, 0];
    let cnt = 0;
    data.forEach((i, idx) => {
      if ((idx + 1) % 4 != 0) {
        //alpha수치를 스킵하여 계산
        arr[cnt] += i;
        cnt++;
      } else {
        cnt = 0;
      }
    });
    return arr.map(i => i / (data.length / 4));
  }
}

export default Circle;
