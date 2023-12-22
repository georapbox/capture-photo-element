import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
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

    expect(el.autoPlay).to.be.false;
    expect(el.getAttribute('auto-play')).to.be.null;

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

    expect(el.calculateFileSize).to.be.false;
    expect(el.getAttribute('calculate-file-size')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`
      <capture-photo
        auto-play
        no-image
        facing-mode="environment"
        camera-resolution="320x240"
        pan="2"
        tilt="3"
        zoom="4"
        calculate-file-size
      ></capture-photo>
    `);

    expect(el.autoPlay).to.be.true;
    expect(el.getAttribute('auto-play')).to.equal('');

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

    expect(el.calculateFileSize).to.be.true;
    expect(el.getAttribute('calculate-file-size')).to.equal('');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<capture-photo></capture-photo>`);

    el.autoPlay = true;
    el.noImage = true;
    el.facingMode = 'environment';
    el.cameraResolution = '320x240';
    el.pan = 2;
    el.tilt = 3;
    el.zoom = 4;
    el.calculateFileSize = true;

    await elementUpdated(el);

    expect(el.autoPlay).to.be.true;
    expect(el.getAttribute('auto-play')).to.equal('');

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

    expect(el.calculateFileSize).to.be.true;
    expect(el.getAttribute('calculate-file-size')).to.equal('');
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

  it('adds content in actions slot', async () => {
    const el = await fixture(html`
      <capture-photo>
        <div slot="actions">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal('<div slot="actions">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>');
  });

  it('adds content in default slot', async () => {
    const el = await fixture(html`
      <capture-photo>
        <div class="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
      </capture-photo>
    `);

    expect(el).lightDom.to.equal('<div class="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>');
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
