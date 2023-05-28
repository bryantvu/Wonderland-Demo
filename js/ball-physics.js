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

const tmp = new Float32Array(3);

/**
@brief Ball Physics

Very rudimentary physics with gravity, pseudo-friction, bounciness
and floor collisions.

Computes velocity and position each frame until the velocity falls
below a certain threshold, after which the component is deactivated.

This component is also used to attach a "scored" property to track
already scored paper balls. (See score-trigger and paperball-spawner).
*/
export class BallPhysics extends Component {
    static TypeName = "ball-physics";
    static Properties = {
        bounciness: { type: Type.Float, default: 0.5 },
        weight: { type: Type.Float, default: 1.0 },
    };

    init() {
        this.pos = new Float32Array(3);
        this.velocity = new Float32Array(3);

        this.collision = this.object.getComponent("collision", 0);
        if (!this.collision) {
            console.warn(
                "'ball-physics' component on object",
                this.object.name,
                "requires a collision component"
            );
        }
    }

    update(dt) {
        /* Remember the last position */
        this.object.getPositionWorld(this.pos);

        /* Don't fall through the floor */
        if (this.pos[1] <= floorHeight + this.collision.extents[0]) {
            if (Math.abs(this.velocity[0]) <= 0.001) {
                this.velocity[1] = 0;
            } else {
                /* bounce */
                this.velocity[1] *= -this.bounciness;
            }
            /* friction */
            this.velocity[0] *= 0.5;
            this.velocity[2] *= 0.5;
        }

        if (this.pos[1] > 100 || Math.abs(this.pos[0]) > 100 || Math.abs(this.pos[2]) > 100) {
            /* Flew out of the world - mark for destroy */
            this.velocity.fill(0);
        }

        if (
            Math.abs(this.velocity[0]) <= 0.01 &&
            Math.abs(this.velocity[1]) <= 0.01 &&
            Math.abs(this.velocity[2]) <= 0.01
        ) {
            /* Deactivating this object preserves performance,
             * update() will no longer be called */
            setTimeout(() => this.destroy(), 0);
            return;
        }

        /* Apply velocity to position */
        vec3.scale(tmp, this.velocity, dt);
        if (this.object.parent) {
            this.object.parent.transformPointInverseWorld(tmp, tmp);
        }
        this.object.translateLocal(tmp);

        /* Apply gravity to velocity */
        this.velocity[1] -= this.weight * 9.81 * dt;
    }
}
