import { Component } from "@wonderlandengine/api";
import {state} from "./game";

/*
      Copyright 2021. Futurewei Technologies Inc. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at
        http:  www.apache.org/licenses/LICENSE-2.0
      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      See the License for the specific language governing permissions and
      limitations under the License.
*/

/**
@brief Button to reset to placing a Wastebin

For WebXR AR sessions, we get the touch events reported through `select`
on the session. As they are reported in [-1.0, 1.0] range, we simply
check if the touch in within a range in the bottom right corner of the
screen.
*/
export class PlayAgainButton extends Component {
  static TypeName = "play-again-button";
  static Properties = {};

  start() {
    this.collision = this.object.getComponent("collision");
    this.soundPop = this.object.addComponent("howler-audio-source", {
      src: "sfx/pop-94319.mp3",
      volume: 1.9,
    });

    state.resetButton = this;
    this.hide();
  }

  restart() {
    state.restart();
    this.hide();
  }

  hide() {
    this.object.children[0].getComponent("mesh").active = false;
    this.object.children[1].getComponent("text").active = false;
    this.active = false;
  }

  unhide() {
    this.object.children[0].getComponent("mesh").active = true;
    this.object.children[1].getComponent("text").active = true;
    this.active = true;
  }

  update(dt) {
    let overlaps = this.collision.queryOverlaps();
    for (let i = 0; i < overlaps.length; ++i) {
      let p = overlaps[i].object.getComponent("bullet-physics");
      if (p) {
        this.restart();
        this.soundPop.play();
      }
    }
  }
}
