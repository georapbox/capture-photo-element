import { elementUpdated, expect, fixture, fixtureCleanup, html, oneEvent } from '@open-wc/testing';
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

    expect(el.noImage).to.be.false;
    expect(el.getAttribute('no-image')).to.be.null;

    expect(el.facingMode).to.be.null;
    expect(el.getAttribute('facing-mode')).to.be.null;

    expect(el.cameraResolution).to.be.null;
    expect(el.getAttribute('camera-resolution')).to.be.null;

    expect(el.pan).to.be.null;
    expect(el.getAttribute('pan')).to.be.null;

    expect(el.tilt).to.be.null;
    expect(el.getAttribute('tilt')).to.be.null;

    expect(el.zoom).to.be.null;
    expect(el.getAttribute('zoom')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`
      <capture-photo
        no-image
        facing-mode="environment"
        camera-resolution="320x240"
        pan="2"
        tilt="3"
        zoom="4"
      ></capture-photo>
    `);

    expect(el.noImage).to.be.true;
    expect(el.getAttribute('no-image')).to.equal('');

    expect(el.facingMode).to.equal('environment');
    expect(el.getAttribute('facing-mode')).to.equal('environment');

    expect(el.cameraResolution).to.equal('320x240');
    expect(el.getAttribute('camera-resolution')).to.equal('320x240');

    expect(el.pan).to.equal(2);
    expect(el.getAttribute('pan')).to.equal('2');

    expect(el.tilt).to.equal(3);
    expect(el.getAttribute('tilt')).to.equal('3');

    expect(el.zoom).to.equal(4);
    expect(el.getAttribute('zoom')).to.equal('4');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);

    el.noImage = true;
    el.facingMode = 'environment';
    el.cameraResolution = '320x240';
    el.pan = 2;
    el.tilt = 3;
    el.zoom = 4;

    await elementUpdated(el);

    expect(el.noImage).to.be.true;
    expect(el.getAttribute('no-image')).to.equal('');

    expect(el.facingMode).to.equal('environment');
    expect(el.getAttribute('facing-mode')).to.equal('environment');

    expect(el.cameraResolution).to.equal('320x240');
    expect(el.getAttribute('camera-resolution')).to.equal('320x240');

    expect(el.pan).to.equal(2);
    expect(el.getAttribute('pan')).to.equal('2');

    expect(el.tilt).to.equal(3);
    expect(el.getAttribute('tilt')).to.equal('3');

    expect(el.zoom).to.equal(4);
    expect(el.getAttribute('zoom')).to.equal('4');
  });

  it('change button slots', async () => {
    const el = await fixture(html`
      <capture-photo>
        <button type="button" slot="capture-button">Take picture</button>
        <button type="button" slot="facing-mode-button">Change camera</button>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal(`
      <button type="button" slot="capture-button">Take picture</button>
      <button type="button" slot="facing-mode-button">Change camera</button>
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
        <a href="#" slot="capture-button">Take picture</a>
        <a href="#" slot="facing-mode-button">Change camera</a>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal(`
      <a href="#" slot="capture-button" role="button">Take picture</a>
      <a href="#" slot="facing-mode-button" role="button">Change camera</a>
    `);
  });

  it('capture-photo:facing-mode-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const listener = oneEvent(el, 'capture-photo:facing-mode-change');

    el.facingMode = 'environment';

    await elementUpdated(el);

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      facingMode: 'environment'
    });
  });

  it('capture-photo:camera-resolution-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const listener = oneEvent(el, 'capture-photo:camera-resolution-change');

    el.cameraResolution = '320x240';

    await elementUpdated(el);

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      cameraResolution: '320x240'
    });
  });

  it('capture-photo:pan-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const listener = oneEvent(el, 'capture-photo:pan-change');

    el.pan = 2;

    await elementUpdated(el);

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      pan: 2
    });
  });

  it('capture-photo:tilt-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const listener = oneEvent(el, 'capture-photo:tilt-change');

    el.tilt = 2;

    await elementUpdated(el);

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      tilt: 2
    });
  });

  it('capture-photo:zoom-change event is emitted', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const listener = oneEvent(el, 'capture-photo:zoom-change');

    el.zoom = 2;

    await elementUpdated(el);

    const { detail } = await listener;

    expect(detail).to.deep.equal({
      zoom: 2
    });
  });

  it('capture method is called', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);
    const captureSlot = el.shadowRoot.querySelector('slot[name="capture-button"]');
    const captureButton = captureSlot.assignedNodes({ flatten: true }).find(el => el.nodeName === 'BUTTON');
    const fn = sinon.spy(el, 'capture');

    captureButton.click();

    expect(fn).to.have.been.calledOnce;
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
