/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

/* wle:auto-imports:start */
import {BgMusic} from './bg-music.js';
import {ConfettiParticles} from './confetti-particles.js';
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {FingerCursor} from '@wonderlandengine/components';
import {HandTracking} from '@wonderlandengine/components';
import {HowlerAudioListener} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {MouseMover} from './mouse-mover.js';
import {MouseSpawner} from './mouse-spawner.js';
import {PaperballSpawner} from './projectile-spawner.js';
import {PlayAgainButton} from './play-again-button.js';
import {PlayerHeight} from '@wonderlandengine/components';
import {ScoreDisplay} from './score-display.js';
import {ShotCounter} from './shot-counter.js';
import {TeleportComponent} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
/* wle:auto-imports:end */
import * as API from '@wonderlandengine/api'; // Deprecated: Backward compatibility.
import { loadRuntime } from '@wonderlandengine/api';
import { ScoreTrigger } from './score-trigger.js';
import { HowlerAudioSource } from '@wonderlandengine/components';

/* wle:auto-constants:start */
const ProjectName = 'MyWonderland';
const RuntimeBaseName = 'WonderlandRuntime';
const WithPhysX = false;
const WithLoader = false;
/* wle:auto-constants:end */

const engine = await loadRuntime(RuntimeBaseName, {
    physx: WithPhysX,
    loader: WithLoader
});
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.onSceneLoaded.add(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

const arButton = document.getElementById('ar-button');
if (arButton) {
    arButton.dataset.supported = engine.arSupported;
}
const vrButton = document.getElementById('vr-button');
if (vrButton) {
    vrButton.dataset.supported = engine.vrSupported;
}

/* wle:auto-register:start */
engine.registerComponent(BgMusic);
engine.registerComponent(ConfettiParticles);
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FingerCursor);
engine.registerComponent(HandTracking);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(MouseMover);
engine.registerComponent(MouseSpawner);
engine.registerComponent(PaperballSpawner);
engine.registerComponent(PlayAgainButton);
engine.registerComponent(PlayerHeight);
engine.registerComponent(ScoreDisplay);
engine.registerComponent(ShotCounter);
engine.registerComponent(TeleportComponent);
engine.registerComponent(VrModeActiveSwitch);
/* wle:auto-register:end */
engine.registerComponent(ScoreTrigger);
engine.registerComponent(HowlerAudioSource);

engine.scene.load(`${ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
