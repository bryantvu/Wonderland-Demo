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
import { vec3, quat2 } from "gl-matrix";

/**
@brief (Unused) Moves a mesh back and forth

Feel free to extend the game with a PR!
*/
export class Target extends Component {
  static TypeName = "target";
  static Properties = {
    speed: { type: Type.Float, default: 1.0 },
  };

  init() {
    this.time = 0;
    this.state = 0;
    this.position = [0, 0, 0];
    this.pointA = [0, 0, 0];
    this.pointB = [0, 0, 0];
    this.position = [0, 0, 0];
    quat2.getTranslation(this.position, this.object.transformLocal);

    vec3.add(this.pointA, this.pointA, this.position);
    vec3.add(this.pointB, this.position, [0, 0, 1.5]);

    this.angle = 0;
  }

  update(dt) {
    if (isNaN(dt)) return;

    this.time += dt;
    const moveDuration = 2;
    if (this.time >= moveDuration) {
      this.time -= moveDuration;
      this.state = Math.floor(Math.random() * 4);
      this.pointA = this.position;

      const randomPathZ = Math.random() < 0.5;
      const randomNegative = Math.random() < 0.5;
      var travelDistance = 1.5 * moveDuration;

      if (randomNegative) {
        travelDistance = -travelDistance;
      }

      if (randomPathZ) {
        vec3.add(this.pointB, this.pointA, [0, 0, travelDistance]);
      }
      //new position in X axis.
      else {
        vec3.add(this.pointB, this.pointA, [travelDistance, 0, 0]);
      }
      //find angle between point A and B
      let radAngle = vec3.angle(this.pointA, this.pointB);
      this.angle = radAngle * (180 / Math.PI);
    }

    this.object.resetTranslation();
    if (this.time <= moveDuration / 2) {
      this.object.resetRotation();
      this.object.rotateAxisAngleDeg([0, 1, 0], this.time * this.angle);
    } else {
      vec3.lerp(
        this.position,
        this.pointA,
        this.pointB,
        this.time - moveDuration / 2
      );
    }
    this.object.translate(this.position);
  }
}
