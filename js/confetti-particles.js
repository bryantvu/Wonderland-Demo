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
import { vec3, quat, quat2 } from "gl-matrix";

const floorHeight = 0;

let distance = new Float32Array(3);
const tmp = new Float32Array(4);

/**
@brief Confetti Particle System

Adaptation of the mesh particles example for a confetti effect.
Manages up to `maxParticles` objects and updates their position
with very basic physics with gravity, drag and floor collision.

Particle objects are preallocated to avoid a hitch when spawning
particles the first time. Later, particles are set visible and
activated when spawned.

To avoid having to update "sleeping" particles, the array of objects
is sorted into "active" and "inactive" particles. The first
`this.activeCount` particles are the ones being updated every frame.
If a inactive particle object becomes active, it is swapped in the
list with the first inactive particle and becomes active by incremementing
the `activeCount`.
*/
export class ConfettiParticles extends Component {
    static TypeName = "confetti-particles";
    static Properties = {
        /* Mesh for spawned particles */
        mesh: { type: Type.Mesh, default: null },
        material0: { type: Type.Material, default: null },
        material1: { type: Type.Material, default: null },
        material2: { type: Type.Material, default: null },
        /* Maximum number of particles, once limit is reached, particles are recycled first-in-first-out. */
        maxParticles: { type: Type.Int, default: 64 },
        /* Initial speed of emitted particles. */
        initialSpeed: { type: Type.Float, default: 30 },
        /* Size of a particle */
        particleScale: { type: Type.Float, default: 0.1 },

        particlesPerBurst: { type: Type.Int, default: 32 },
        debug: { type: Type.Bool, default: false },
    };

    init() {
        this.time = 0.0;
        this.count = 0;
    }

    start() {
        this.objects = [];
        this.velocities = [];
        this.spins = [];
        this.time = 2.0;

        this.origin = new Float32Array(3);
        this.activeCount = 0;

        /* Pre allocate all the particles to avoid hitches during the
         * first bursts */
        for (let i = 0; i < this.maxParticles; ++i) {
            this.velocities[i] = [0, 0, 0];
            this.spins[i] = [0, 0, 0, 0];
            let particle = (this.objects[i] = {
                object: this.engine.scene.addObject(),
                mesh: null,
            });
            particle.object.name = "particle" + this.count.toString();
            particle.mesh = particle.object.addComponent("mesh");

            particle.mesh.mesh = this.mesh;
            /* Activate component, otherwise it will not show up! */
            particle.mesh.active = true;
        }
    }

    burst() {
        for (let i = 0; i < this.particlesPerBurst; ++i) this.spawn();
    }

    update(dt) {
        this.time = (this.time || 0) + dt;
        if (this.debug && this.time > 3.0) {
            this.burst();
            this.time = 0;
        }

        /* Target for retrieving particles world locations */
        for (let i = 0; i < this.activeCount; ++i) {
            let o = this.objects[i];
            let obj = o.object;
            /* Get translation first, as object.translate() will mark
             * the object as dirty, which will cause it to recalculate
             * obj.transformWorld on access. We want to avoid this and
             * have it be recalculated in batch at the end of frame
             * instead */
            obj.getTranslationWorld(this.origin);

            /* Apply gravity */
            const vel = this.velocities[i];
            const spins = this.spins[i];

            if (vel[0] != 0 || vel[1] != 0 || vel[2] != 0) {
                /* Apply gravity with drag */
                vel[1] = Math.max(vel[1] - 9.81 * dt, -0.75);
            }

            /* Check if particle would collide */
            if (
                this.origin[1] + vel[1] * dt <= floorHeight + this.particleScale &&
                vel[1] <= 0
            ) {
                /* Pseudo friction */
                const frict = 1 / (1 - vel[1]);
                vel[0] = frict * vel[0];
                vel[2] = frict * vel[2];

                /* Reflect */
                vel[1] = -0.3 * vel[1];
                if (vel[1] > 0 && vel[1] < 0.1) {
                    vel[0] = vel[1] = vel[2] = 0;
                    spins[0] = spins[1] = spins[2] = 0;
                    spins[3] = 1;

                    /* Rotate particle such that it's flat on the ground */
                    obj.getUp(tmp);
                    quat.rotationTo(tmp, tmp, [0, 0, 1]);
                    obj.rotateObject(tmp);

                    /* swap with last active */
                    --this.activeCount;
                    this.swap(i, this.activeCount);
                    --i;
                }
            }
        }

        for (let i = 0; i < this.activeCount; ++i) {
            let obj = this.objects[i].object;
            /* Apply velocity */
            vec3.scale(distance, this.velocities[i], dt);
            obj.translate(distance);

            const spins = this.spins[i];
            if (spins[3] != 1) obj.rotateObject(spins);
        }
    }

    swap(a, b) {
        if (b >= this.maxParticles) return;
        if (a >= this.maxParticles) return;
        const o = this.objects[a];
        const vel = this.velocities[a];
        const spins = this.spins[a];

        this.objects[a] = this.objects[b];
        this.velocities[a] = this.velocities[b];
        this.spins[a] = this.spins[b];

        this.objects[b] = o;
        this.velocities[b] = vel;
        this.spins[b] = spins;
    }

    /** Spawn a particle */
    spawn() {
        let index = this.count % this.maxParticles;

        let particle = this.objects[index];
        particle.object.resetTransform();
        particle.object.scale([
            0.25 * this.particleScale,
            this.particleScale,
            0.02 * this.particleScale,
        ]);

        quat2.getTranslation(this.origin, this.object.transformWorld);
        particle.object.translate(this.origin);

        /* Choose a random material */
        particle.mesh.material = [this.material0, this.material1, this.material2][
            Math.floor(Math.random() * 3)
        ];

        this.velocities[index][0] = Math.random() - 0.5;
        this.velocities[index][1] = Math.random();
        this.velocities[index][2] = Math.random() - 0.5;
        vec3.normalize(this.velocities[index], this.velocities[index]);

        this.velocities[index][0] *= 0.2 * this.initialSpeed;
        this.velocities[index][1] *=
            Math.random(0.2 * this.initialSpeed) + 0.8 * this.initialSpeed;
        this.velocities[index][2] *= 0.2 * this.initialSpeed;

        quat.fromEuler(
            this.spins[index],
            Math.floor(Math.random() * 20.0),
            Math.floor(Math.random() * 20.0),
            Math.floor(Math.random() * 20.0)
        );
        this.count += 1;
        this.swap(index, this.activeCount);
        this.activeCount = Math.min(this.activeCount + 1, this.maxParticles);
    }
}
