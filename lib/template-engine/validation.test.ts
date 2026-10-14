import assert from "node:assert/strict";
import { componentRegistry } from "./registry";
import { demoPage, starterTemplate } from "./templates";
import { validatePageDocument } from "./validation";

const valid = validatePageDocument(demoPage, componentRegistry, starterTemplate);
assert.equal(valid.success, true);

const unknown = validatePageDocument({ ...demoPage, sections: [{ id: "bad", type: "not-registered", visible: true, settings: {} }] }, componentRegistry, starterTemplate);
assert.equal(unknown.success, false);
assert.match(unknown.issues[0].message, /desconocido/);

const invalidProperty = validatePageDocument({ ...demoPage, sections: [{ ...demoPage.sections[0], settings: { brand: 123 } }] }, componentRegistry, starterTemplate);
assert.equal(invalidProperty.success, false);
assert.match(invalidProperty.issues[0].path, /settings.brand/);

const duplicateIds = validatePageDocument({ ...demoPage, sections: [demoPage.sections[0], demoPage.sections[0]] }, componentRegistry, starterTemplate);
assert.equal(duplicateIds.success, false);
assert.match(duplicateIds.issues.at(-1)?.message || "", /único/);
