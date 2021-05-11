class Trash {
  constructor(){
    this.r = 50;
    this.x = 0 - this.r;
    this.y = random(400, 500);
  }


  display(){
    let frameIndex=(int)(frameCount*0.05) % 4;
    console.log(`frameIndex=${frameIndex}`);
    image(trashAnimation[frameIndex], this.x, this.y, this.r, this.r);
    // stroke(0);
    //fill(0, 100, 200);
    // square(this.x, this.y, this.r);
  }

  move(){
    this.x++;
  }

}
