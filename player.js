class Player {
  constructor(){
    this.r = 60;
    this.x = w/2;
    this.y = height*0.2;
    this.speed = 2;
    this.direction = 'still';
  }

  display(){
    let frameIndex=(int)(frameCount*0.05) % 4;
    image(playerAnimation[frameIndex], this.x, this.y, this.r, this.r);
  }

  move() {
    switch (this.direction) {
      case 'still':
      //don't move anything
      break;

      case 'up':
      //decrease y position
      if (this.y > 0){
        this.y-=this.speed;
      }
      break;

      case 'down':
      //increase y position
      if (this.y < height-this.r){
        this.y+=this.speed;
      }
      break;

      case 'left':
      //decrease x position
      if (this.x > 0){
        this.x-=this.speed;
      }
      break;

      case 'right':
      //increase x position
      if (this.x < w-this.r){
        this.x+=this.speed;
      }
      break;

      default:
      break;
    }

  }

}
