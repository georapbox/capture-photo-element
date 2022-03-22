import { elementUpdated, waitUntil, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import sinon from 'sinon';
import { CapturePhoto } from '../src/capture-photo.js';

CapturePhoto.defineCustomElement();

describe('<capture-photo>', () => {
  it('passes accessibility test', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);

    await expect(el).to.be.accessible();
  });

  it('default properties', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);

    expect(el.outputDisabled).to.be.false;
    expect(el.getAttribute('output-disabled')).to.be.null;

    expect(el.facingMode).to.be.null;
    expect(el.getAttribute('facing-mode')).to.be.null;

    expect(el.cameraResolution).to.be.null;
    expect(el.getAttribute('camera-resolution')).to.be.null;

    expect(el.zoom).to.be.null;
    expect(el.getAttribute('zoom')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`
      <capture-photo
        output-disabled
        facing-mode="environment"
        camera-resolution="320x240"
        zoom="3"
      ></capture-photo>
    `);

    expect(el.outputDisabled).to.be.true;
    expect(el.getAttribute('output-disabled')).to.equal('');

    expect(el.facingMode).to.equal('environment');
    expect(el.getAttribute('facing-mode')).to.equal('environment');

    expect(el.cameraResolution).to.equal('320x240');
    expect(el.getAttribute('camera-resolution')).to.equal('320x240');

    expect(el.zoom).to.equal(3);
    expect(el.getAttribute('zoom')).to.equal('3');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);

    el.outputDisabled = true;
    el.facingMode = 'environment';
    el.cameraResolution = '320x240';
    el.zoom = 3;

    await elementUpdated(el);

    expect(el.outputDisabled).to.be.true;
    expect(el.getAttribute('output-disabled')).to.equal('');

    expect(el.facingMode).to.equal('environment');
    expect(el.getAttribute('facing-mode')).to.equal('environment');

    expect(el.cameraResolution).to.equal('320x240');
    expect(el.getAttribute('camera-resolution')).to.equal('320x240');

    expect(el.zoom).to.equal(3);
    expect(el.getAttribute('zoom')).to.equal('3');
  });

  it('change button slots', async () => {
    const el = await fixture(html`
      <capture-photo>
        <button type="button" slot="capture-button" behavior="button">Take picture</button>
        <button type="button" slot="facing-mode-button" behavior="button">Change camera</button>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal(`
      <button type="button" slot="capture-button" behavior="button">Take picture</button>
      <button type="button" slot="facing-mode-button" behavior="button">Change camera</button>
    `);
  });

  it('change button content slots', async () => {
    const el = await fixture(html`
      <capture-photo>
        <span slot="capture-button-content">Take picture</span>
        <span slot="facing-mode-button-content">Change camera</span>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal(`
      <span slot="capture-button-content">Take picture</span>
      <span slot="facing-mode-button-content">Change camera</span>
    `);
  });

  it('role="button" is added on button slots if node is not button', async () => {
    const el = await fixture(html`
      <capture-photo>
        <a href="#" slot="capture-button" behavior="button">Take picture</a>
        <a href="#" slot="facing-mode-button" behavior="button">Change camera</a>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal(`
      <a href="#" slot="capture-button" behavior="button" role="button">Take picture</a>
      <a href="#" slot="facing-mode-button" behavior="button" role="button">Change camera</a>
    `);
  });

  it('capture-photo:facing-mode-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const handler = sinon.spy();

    el.addEventListener('capture-photo:facing-mode-change', handler);

    el.facingMode = 'environment';

    await elementUpdated(el);

    await waitUntil(() => handler.calledOnce);

    expect(handler).to.have.been.calledOnce;
  });

  it('capture-photo:camera-resolution-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const handler = sinon.spy();

    el.addEventListener('capture-photo:camera-resolution-change', handler);

    el.cameraResolution = '320x240';

    await elementUpdated(el);

    await waitUntil(() => handler.calledOnce);

    expect(handler).to.have.been.calledOnce;
  });

  it('capture-photo:zoom-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const handler = sinon.spy();

    el.addEventListener('capture-photo:zoom-change', handler);

    el.zoom = 2;

    await elementUpdated(el);

    await waitUntil(() => handler.calledOnce);

    expect(handler).to.have.been.calledOnce;
  });

  it('capture method is called', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const captureSlot = el.shadowRoot.querySelector('slot[name="capture-button"]');
    const captureButton = captureSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');
    const fn = sinon.spy(el, 'capture');

    captureButton.click();

    expect(fn).to.have.been.calledOnce;
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
