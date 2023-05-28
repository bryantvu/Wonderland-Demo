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
import { Component, Type } from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";

/**
@brief (Unused) Moves a mesh back and forth

Feel free to extend the game with a PR!
*/
export class MouseMover extends Component {
  static TypeName = "mouse-mover";
  static Properties = {
    speed: { type: Type.Float, default: 1.0 },
  };

  time = 0;
  state = 0;
  currentPos = [0, 0, 0];
  pointA = [0, 0, 0];
  pointB = [0, 0, 0];
  moveDuration = 2;

  savedAngle = 0;
  previousAngle = 0;
  newAngle = 0;

  init() {
    this.travelDistance = this.moveDuration * 1.5;

    this.object.getPositionLocal(this.currentPos);

    vec3.add(this.pointA, this.pointA, this.currentPos);
    vec3.add(this.pointB, this.currentPos, [0, 0, 1.5]);
  }

  update(dt) {
    if (isNaN(dt)) return;

    this.time += dt;
    if (this.time >= this.moveDuration) {
      this.time -= this.moveDuration;

      this.state = Math.floor(Math.random() * 4);
      this.pointA = this.currentPos;

      let x = Math.random() * this.travelDistance;
      let z = Math.sqrt(Math.pow(this.travelDistance, 2) - Math.pow(x, 2));

      const randomNegative = Math.round(Math.random()) * 2 - 1;
      const randomNegative2 = Math.round(Math.random()) * 2 - 1;

      vec3.add(this.pointB, this.pointA, [
        x * randomNegative,
        0,
        z * randomNegative2,
      ]);

      this.newAngle = Math.floor(Math.random() * 180);
      this.previousAngle = this.savedAngle;
    }

    this.object.resetPosition();
    if (this.time <= this.moveDuration / 2) {
      this.object.resetRotation();
      this.savedAngle = this.time * this.newAngle + this.previousAngle;
      this.object.rotateAxisAngleDegLocal([0, 0, 1], this.savedAngle);
      this.object.rotateAxisAngleDegLocal([1, 0, 0], 90);
    } else {
      vec3.lerp(
        this.currentPos,
        this.pointA,
        this.pointB,
        this.time - this.moveDuration / 2
      );
    }
    this.object.translateLocal(this.currentPos);
  }
}
