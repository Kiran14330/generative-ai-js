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
import * as sinonChai from "sinon-chai";
import { getMockResponse } from "../../test-utils/mock-response";
import { match, restore, stub } from "sinon";
import * as request from "../requests/request";
import { SpeechGenerationModel } from "./audio-model";

use(sinonChai);

describe("GenerativeModel", () => {
  it("handles plain model name", () => {
    const genModel = new SpeechGenerationModel("apiKey", { model: "my-model" });
    expect(genModel.model).to.equal("models/my-model");
  });
  it("handles prefixed model name", () => {
    const genModel = new SpeechGenerationModel("apiKey", {
      model: "models/my-model",
    });
    expect(genModel.model).to.equal("models/my-model");
  });
  it("handles prefixed tuned model name", () => {
    const genModel = new SpeechGenerationModel("apiKey", {
      model: "tunedModels/my-model",
    });
    expect(genModel.model).to.equal("tunedModels/my-model");
  });
  it("passes params through to generateContent", async () => {
    const genModel = new SpeechGenerationModel(
      "apiKey",
      {
        model: "my-model",
      },
      {
        apiVersion: "v6",
      },
    );
    const mockResponse = getMockResponse(
      "unary-success-basic-reply-short.json",
    );
    const makeRequestStub = stub(request, "makeModelRequest").resolves(
      mockResponse as Response,
    );
    await genModel.generateSpeech("hello");
    expect(makeRequestStub).to.be.calledWith(
      "models/my-model",
      request.Task.GENERATE_SPEECH,
      match.any,
      false,
      match((value: string) => {
        return (
          value.includes("hello")
        );
      }),
      match((value) => {
        return value.apiVersion === "v6";
      }),
    );
    restore();
  });
});