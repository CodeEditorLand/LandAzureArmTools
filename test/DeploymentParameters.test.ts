// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

// tslint:disable:no-unused-expression max-func-body-length promise-function-async max-line-length insecure-random
// tslint:disable:object-literal-key-quotes no-function-expression no-non-null-assertion align no-http-string

import * as assert from "assert";
import { Uri } from "vscode";
import {
	DeploymentParametersDoc,
	ParameterValueDefinition,
} from "../extension.bundle";

const fakeId = Uri.file("https://fake-id");

suite("DeploymentParameters", () => {
	suite("constructor(string)", () => {
		test("Empty stringValue", () => {
			const dt = new DeploymentParametersDoc("", fakeId, 0);
			assert.deepStrictEqual("", dt.documentText);
			assert.deepStrictEqual(fakeId.fsPath, dt.documentUri.fsPath);
			assert.deepStrictEqual([], dt.parameterValueDefinitions);
		});

		test("Non-JSON stringValue", () => {
			const dt = new DeploymentParametersDoc(
				"I'm not a JSON file",
				fakeId,
				0
			);
			assert.deepStrictEqual("I'm not a JSON file", dt.documentText);
			assert.deepStrictEqual(fakeId.fsPath, dt.documentUri.fsPath);
			assert.deepStrictEqual([], dt.parameterValueDefinitions);
		});

		test("JSON stringValue with number parameters definition", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': 21 }",
				fakeId,
				0
			);
			assert.deepStrictEqual(fakeId.fsPath, dt.documentUri.fsPath);
			assert.deepStrictEqual([], dt.parameterValueDefinitions);
		});

		test("JSON stringValue with empty object parameters definition", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': {} }",
				fakeId,
				0
			);
			assert.deepStrictEqual("{ 'parameters': {} }", dt.documentText);
			assert.deepStrictEqual(fakeId.fsPath, dt.documentUri.fsPath);
			assert.deepStrictEqual([], dt.parameterValueDefinitions);
		});

		test("JSON stringValue with one parameter value", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': { 'num': { 'value': 1 } } }",
				fakeId,
				0
			);
			const parameterValues: ParameterValueDefinition[] =
				dt.parameterValueDefinitions;
			assert(parameterValues);
			assert.deepStrictEqual(parameterValues.length, 1);
			const pd0: ParameterValueDefinition = parameterValues[0];
			assert(pd0);
			assert.deepStrictEqual(pd0.nameValue.toString(), "num");
			assert.deepStrictEqual(pd0.value?.toShortFriendlyString(), "1");
		});

		test("JSON stringValue with one parameter definition with null value", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': { 'num': { 'value': null } } }",
				fakeId,
				0
			);
			const parameterValues: ParameterValueDefinition[] =
				dt.parameterValueDefinitions;
			assert(parameterValues);
			assert.deepStrictEqual(parameterValues.length, 1);
			const pd0: ParameterValueDefinition = parameterValues[0];
			assert(pd0);
			assert.deepStrictEqual(pd0.value?.toShortFriendlyString(), "null");
		});

		test("JSON stringValue with one parameter definition with no value", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': { 'num': { } } }",
				fakeId,
				0
			);
			const parameterValues: ParameterValueDefinition[] =
				dt.parameterValueDefinitions;
			assert(parameterValues);
			assert.deepStrictEqual(parameterValues.length, 1);
			const pd0: ParameterValueDefinition = parameterValues[0];
			assert(pd0);
			assert.deepStrictEqual(pd0.value, undefined);
		});

		test("JSON stringValue with one parameter definition defined as a string", () => {
			const dt = new DeploymentParametersDoc(
				"{ 'parameters': { 'num': 'whoops' } } }",
				fakeId,
				0
			);
			const parameterValues: ParameterValueDefinition[] =
				dt.parameterValueDefinitions;
			assert(parameterValues);
			assert.deepStrictEqual(parameterValues.length, 1);
			const pd0: ParameterValueDefinition = parameterValues[0];
			assert(pd0);
			assert.deepStrictEqual(pd0.value, undefined);
		});
	});
});
