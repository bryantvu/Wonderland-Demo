import { Component, Type } from "@wonderlandengine/api";
import {HowlerAudioSource} from "@wonderlandengine/components";
import {BulletPhysics} from "./bullet-physics";
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

const tempQuat2 = new Float32Array(8);

/**
@brief
*/
export class PaperballSpawner extends Component {
  static TypeName = "paperball-spawner";
  static Properties = {
    paperballMesh: { type: Type.Mesh },
    paperballMaterial: { type: Type.Material },
    spawnAnimation: { type: Type.Animation },
    ballSpeed: { type: Type.Float, default: 10.0 },
    debug: { type: Type.Bool, default: false },
  };

  static onRegister(engine) {
     engine.registerComponent(HowlerAudioSource);
     engine.registerComponent(BulletPhysics);
  }

  nextIndex = 0;
  lastTime = 0;
  laser = null;

  start() {
    this.engine.onXRSessionStart.add(this.xrSessionStart.bind(this));
    this.start = new Float32Array(2);

    if (this.debug) {
      this.active = true;
      this.object.getComponent("mesh").active = true;
    }
    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/9mm-pistol-shoot-short-reverb-7152.mp3",
      volume: 0.5,
    });

  }

  onTouchDown(e) {
    let curTime = Date.now();
    const ballTime = Math.abs(curTime - this.lastTime);
    if (ballTime > 50) {
      const dir = [0, 0, 0];

      this.object.getComponent("cursor").cursorRayObject.getForward(dir);

      this.pulse(e.inputSource.gamepad);
      this.shoot(dir);
      this.lastTime = curTime;
      this.soundClick.play();
    }
  }

  update(dt) {
    this.time = (this.time || 0) + dt;
  }

  shoot(dir) {
    const paper = this.spawnBullet();
    paper.object.setTransformLocal(this.object.getTransformWorld(tempQuat2));
    paper.object.setDirty();
    paper.physics.dir.set(dir);

    paper.physics.scored = false;
    paper.physics.active = true;

    ++state.shotCount;
    state.updateCounter();
  }

  spawnBullet() {
    const obj = this.engine.scene.addObject();
    obj.scaleLocal([0.05, 0.05, 0.05]);

    obj.addComponent("mesh", {
        mesh: this.paperballMesh,
        material: this.paperballMaterial,
    });
    obj.addComponent("collision", {
        shape: WL.Collider.Sphere,
        extents: [0.05, 0, 0],
        group: 1 << 0,
    });

    const physics = obj.addComponent("bullet-physics", {
      speed: this.ballSpeed,
    });

    return {
      object: obj,
      physics: physics,
    };
  }

  pulse(gamepad) {
    let actuator;
    if (!gamepad || !gamepad.hapticActuators) {
      return;
    }
    actuator = gamepad.hapticActuators[0];
    if (!actuator) return;
    actuator.pulse(1, 100);
  }

  onActivate() {
    if (!this.engine.xr) return;
    this.engine.xr.session.addEventListener(
      "selectstart", this.onTouchDown.bind(this));
  }

  xrSessionStart(session) {
    if (!this.active) return;
    session.addEventListener("selectstart", this.onTouchDown.bind(this));
  }
}
