import { Component } from "@wonderlandengine/api";

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

import { state } from "./game";

/**
@brief Marks an object with text component as "score display"

The center top text object that shows various helpful tutorial
texts and the score.
*/
export class ShotCounter extends Component {
  static TypeName = "shot-counter";
  static Properties = {};

  init() {
    this.text = this.object.getComponent("text");

    state.updateCounter = () => {
      if (!state.gameOver) {
        this.text.text = "Shots Fired: " + state.shotCount;
      }
    };
  }
}
