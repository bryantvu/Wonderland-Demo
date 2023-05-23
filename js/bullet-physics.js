import { Component, Type } from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";

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

const floorHeight = 0;
let newDir = new Float32Array(3);

/**
@brief Bullet Physics

*/
export class BulletPhysics extends Component {
  static TypeName = "bullet-physics";
  static Properties = {
    speed: { type: Type.Float, default: 10.0 },
  };

  init() {
    this.dir = new Float32Array(3);
    this.position = [0, 0, 0];
    this.object.getPositionWorld(this.position);
    this.correctedSpeed = this.speed;

    this.collision = this.object.getComponent("collision", 0);
    if (!this.collision) {
      console.warn(
        "'bullet-physics' component on object",
        this.object.name,
        "requires a collision component"
      );
    }
  }

  update(dt) {
    this.object.getPositionWorld(this.position);
    if (this.position[1] <= floorHeight + this.collision.extents[0]) {
      this.destroy();
      return;
    }

    if (vec3.length(this.position) > 175) {
      this.destroy();
      return;
    }

    newDir.set(this.dir);
    vec3.scale(newDir, newDir, this.correctedSpeed*dt);
    vec3.add(this.position, this.position, newDir);
    this.object.setPositionLocal(this.position);

    let overlaps = this.collision.queryOverlaps();
    for (let i = 0; i < overlaps.length; ++i) {
      let t = overlaps[i].object.getComponent("score-trigger");
      if(t && !this.scored) {
        t.onHit();
        this.destroy();
        return;
      }
    }
  }

  destroy() {
    /* Avoid destroying objects in update() */
    setTimeout(() => this.object.destroy(), 0);
  }
}
