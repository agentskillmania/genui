import { describe, it, expect } from 'vitest';
import { SurfaceManager } from '../../../src/SurfaceManager';

/**
 * End-to-end test using the official A2UI v0.9 Contact Form example
 * from https://a2ui.org/specification/v0.9-a2ui/
 */
describe('A2UI v0.9 Contact Form — official spec example', () => {
  it('parses and renders the complete contact form stream', () => {
    const manager = new SurfaceManager();

    // These are the exact messages from the A2UI v0.9 specification
    const messages = [
      '{"version":"v0.9","createSurface":{"surfaceId":"contact_form_1","catalogId":"https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"}}',
      '{"version":"v0.9","updateComponents":{"surfaceId":"contact_form_1","components":[{"id":"root","component":"Card","child":"form_container"},{"id":"form_container","component":"Column","children":["header_row","name_row","email_group","phone_group","pref_group","divider_1","newsletter_checkbox","submit_button"],"justify":"start","align":"stretch"},{"id":"header_row","component":"Row","children":["header_icon","header_text"],"align":"center"},{"id":"header_icon","component":"Icon","name":"mail"},{"id":"header_text","component":"Text","text":"# Contact Us","variant":"h2"}]}}',
      '{"version":"v0.9","updateDataModel":{"surfaceId":"contact_form_1","path":"/contact","value":{"firstName":"John","lastName":"Doe","email":"john.doe@example.com","phone":"1234567890","preference":["email"],"subscribe":true}}}',
    ];

    manager.beginTextStream();
    for (const msg of messages) {
      manager.receiveTextChunk(msg + '\n');
    }
    manager.endTextStream();

    const engine = manager.getEngine();
    const surface = engine.getSurface('contact_form_1');

    // Surface was created
    expect(surface).toBeDefined();

    // Root component exists and is a Card
    const roots = surface!.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].component).toBe('Card');
    expect(roots[0].id).toBe('root');

    // Card has single child -> form_container
    const formContainer = surface!.getChildren('root');
    expect(formContainer).toHaveLength(1);
    expect(formContainer[0].component).toBe('Column');

    // Column has children -> header_row etc.
    const headerRow = surface!.getChildren('form_container');
    expect(headerRow.length).toBeGreaterThan(0);

    // Data model was set
    expect(surface!.resolveProperties({ path: '/contact/firstName' })).toBe('John');
    expect(surface!.resolveProperties({ path: '/contact/email' })).toBe('john.doe@example.com');
  });
});
