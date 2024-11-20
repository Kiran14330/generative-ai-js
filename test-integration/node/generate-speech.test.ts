/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { GoogleGenerativeAI} from "../..";
import {GoogleAIFileManager} from "../../server";
use(chaiAsPromised);

/**
 * Integration tests against live backend.
 */

describe("generateSpeech", function () {
  this.timeout(60e3);
  this.slow(10e3);
  it("non-streaming, simple interface", async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getSpeechGenerationModel({
      model: "imagen-3.0-generate-001",
    });
    const result = await model.generateSpeech("A fluffy cat");
    expect(result.inlineData.data.length).greaterThan(1);
  });

  it("non-streaming, generate and download", async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getSpeechGenerationModel({
      model: "imagen-3.0-generate-001",
    });
    const result = await model.generateSpeech("A fluffy cat");
    const fileManager = new GoogleAIFileManager(
        process.env.GEMINI_API_KEY || "");
    const bytes = await fileManager.getFileBytes(result.fileData.fileUri)
    expect(bytes).greaterThan(1);
  });
});