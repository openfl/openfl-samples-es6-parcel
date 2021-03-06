import {
  Event,
  FPS,
  IOErrorEvent,
  Loader,
  MouseEvent,
  Sprite,
  Tilemap,
  Tileset,
  URLRequest
} from "openfl";
import Bunny from "./Bunny";
import wabbit_alpha from "../assets/wabbit_alpha.png";

export class Main extends Sprite {
  constructor() {
    super();

    this.addingBunnies = false;
    this.bunnies = [];

    this.addEventListener(Event.ADDED_TO_STAGE, () => {
      var loader = new Loader();
      loader.contentLoaderInfo.addEventListener(Event.COMPLETE, event => {
        this.start(loader.content.bitmapData);
      });
      loader.contentLoaderInfo.addEventListener(
        IOErrorEvent.IO_ERROR,
        event => {
          console.error(event.text);
        }
      );
      loader.load(new URLRequest(wabbit_alpha));
    });
  }

  start(bitmapData) {
    this.minX = 0;
    this.maxX = this.stage.stageWidth;
    this.minY = 0;
    this.maxY = this.stage.stageHeight;
    this.gravity = 0.5;

    this.tileset = new Tileset(bitmapData);
    this.tileset.addRect(bitmapData.rect);

    this.tilemap = new Tilemap(
      this.stage.stageWidth,
      this.stage.stageHeight,
      this.tileset
    );
    //this.tilemap = new Tilemap (100, 100, tileset);
    this.addChild(this.tilemap);

    // this.fps = new FPS ();
    // this.addChild (this.fps);

    this.stage.addEventListener(
      MouseEvent.MOUSE_DOWN,
      this.stage_onMouseDown.bind(this)
    );
    this.stage.addEventListener(
      MouseEvent.MOUSE_UP,
      this.stage_onMouseUp.bind(this)
    );
    this.stage.addEventListener(
      Event.ENTER_FRAME,
      this.stage_onEnterFrame.bind(this)
    );

    for (var i = 0; i < 10; i++) {
      this.addBunny();
    }
  }

  addBunny() {
    var bunny = new Bunny();
    bunny.x = 0;
    bunny.y = 0;
    bunny.speedX = Math.random() * 5;
    bunny.speedY = Math.random() * 5 - 2.5;
    this.bunnies.push(bunny);
    this.tilemap.addTile(bunny);
  }

  // Event Handlers

  stage_onEnterFrame(event) {
    for (var i = 0; i < this.bunnies.length; i++) {
      var bunny = this.bunnies[i];
      bunny.x += bunny.speedX;
      bunny.y += bunny.speedY;
      bunny.speedY += this.gravity;

      if (bunny.x > this.maxX) {
        bunny.speedX *= -1;
        bunny.x = this.maxX;
      } else if (bunny.x < this.minX) {
        bunny.speedX *= -1;
        bunny.x = this.minX;
      }

      if (bunny.y > this.maxY) {
        bunny.speedY *= -0.8;
        bunny.y = this.maxY;

        if (Math.random() > 0.5) {
          bunny.speedY -= 3 + Math.random() * 4;
        }
      } else if (bunny.y < this.minY) {
        bunny.speedY = 0;
        bunny.y = this.minY;
      }
    }

    if (this.addingBunnies) {
      for (var i = 0; i < 100; i++) {
        this.addBunny();
      }
    }
  }

  stage_onMouseDown(event) {
    this.addingBunnies = true;
  }

  stage_onMouseUp(event) {
    this.addingBunnies = false;
    console.log(this.bunnies.length + " bunnies");
  }
}

export default Main;
