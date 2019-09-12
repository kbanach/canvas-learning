export default class Circle {
  constructor() {
    
    this.state = {
      x: 300,
      y: 300,
      r: 100,
      defR: 100,
      startAngle: 0,
      endAngle: Math.PI * 2,
      antiClockWise: false,
    };

    this.animationLen = 3;

  }

  update(time, dT) {
    this.state.r = (
      Math.sin( Math.PI * time / (1000 * this.animationLen)) + 1  
    ) * this.state.defR;
  }

  draw(ctx) {
    ctx.beginPath();

    ctx.arc(this.state.x, this.state.y, this.state.r, this.state.startAngle, this.state.endAngle, this.state.antiClockWise);

    ctx.stroke();
  }

}

