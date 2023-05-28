import { Component, Type } from "@wonderlandengine/api";
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
@brief Marks an object with text component as "score display"

The center top text object that shows various helpful tutorial
texts and the score.
*/
export class BgMusic extends Component {
  static TypeName = "bg-music";
  static Properties = {};

  init() {
    state.bgMusic = this.object.addComponent("howler-audio-source", {
      src: "music/happy-funny-kids-111912.mp3",
      loop: true,
      volume: 0.4,
    });
    state.bgMusic.play();
    this.bgDucks = this.object.addComponent("howler-audio-source", {
      src: "sfx/recording-ducks-binaural-18742.mp3",
      loop: true,
      volume: 1.3,
    });
    this.bgDucks.play();
    this.bgCow = this.object.addComponent("howler-audio-source", {
      src: "sfx/cows-56001.mp3",
      loop: true,
      volume: 1.0,
    });
    this.bgCow.play();
    this.bgSheep = this.object.addComponent("howler-audio-source", {
      src: "sfx/sheep-23761.mp3",
      loop: true,
      volume: 1.0,
    });
    this.bgSheep.play();
    this.bgPig = this.object.addComponent("howler-audio-source", {
      src: "sfx/pig_grunts_snorts_breathing_hackney_city_farm-73959.mp3",
      loop: true,
      volume: 1.0,
    });
    this.bgPig.play();
  }
}
