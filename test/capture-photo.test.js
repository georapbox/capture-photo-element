import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import sinon from 'sinon';
import { CapturePhoto } from '../src/capture-photo.js';

CapturePhoto.defineCustomElement();

describe('<capture-photo>', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  describe('accessibility', () => {
    it('passes accessibility test', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);

      await expect(el).to.be.accessible();
    });
  });

  describe('attributes/properties', () => {
    // autoPlay property
    it('property autoPlay is true when attribute auto-play is set', async () => {
      const el = await fixture(html`<capture-photo auto-play></capture-photo>`);
      expect(el.autoPlay).to.be.true;
    });

    it('property autoPlay is false when attribute auto-play is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.autoPlay).to.be.false;
    });

    it('attribute auto-play is set when property autoPlay is set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.autoPlay = true;
      await elementUpdated(el);
      expect(el.hasAttribute('auto-play')).to.be.true;
    });

    it('attribute auto-play is removed when property autoPlay is false', async () => {
      const el = await fixture(html`<capture-photo auto-play></capture-photo>`);
      el.autoPlay = false;
      await elementUpdated(el);
      expect(el.hasAttribute('auto-play')).to.be.false;
    });

    // noImage property
    it('property noImage is true when attribute no-image is set', async () => {
      const el = await fixture(html`<capture-photo no-image></capture-photo>`);
      expect(el.noImage).to.be.true;
    });

    it('property noImage is false when attribute no-image is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.noImage).to.be.false;
    });

    it('attribute no-image is set when property noImage is set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.noImage = true;
      await elementUpdated(el);
      expect(el.hasAttribute('no-image')).to.be.true;
    });

    it('attribute no-image is removed when property noImage is false', async () => {
      const el = await fixture(html`<capture-photo no-image></capture-photo>`);
      el.noImage = false;
      await elementUpdated(el);
      expect(el.hasAttribute('no-image')).to.be.false;
    });

    // facingMode property
    it('property facingMode is user when attribute facing-mode is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.facingMode).to.equal('user');
    });

    it('property facingMode is environment when attribute facing-mode is set to environment', async () => {
      const el = await fixture(html`<capture-photo facing-mode="environment"></capture-photo>`);
      expect(el.facingMode).to.equal('environment');
    });

    it('attribute facing-mode is set to user when property facingMode is set to user', async () => {
      const el = await fixture(html`<capture-photo facing-mode="environment"></capture-photo>`);
      el.facingMode = 'user';
      await elementUpdated(el);
      expect(el.getAttribute('facing-mode')).to.equal('user');
    });

    it('attribute facing-mode is set to environment when property facingMode is set to environment', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.facingMode = 'environment';
      await elementUpdated(el);
      expect(el.getAttribute('facing-mode')).to.equal('environment');
    });

    // cameraResolution property
    it('property cameraResolution is empty when attribute camera-resolution is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.cameraResolution).to.equal('');
    });

    it('property cameraResolution is 320x240 when attribute camera-resolution is set to 320x240', async () => {
      const el = await fixture(html`<capture-photo camera-resolution="320x240"></capture-photo>`);
      expect(el.cameraResolution).to.equal('320x240');
    });

    it('attribute camera-resolution is set to 320x240 when property cameraResolution is set to 320x240', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.cameraResolution = '320x240';
      await elementUpdated(el);
      expect(el.getAttribute('camera-resolution')).to.equal('320x240');
    });

    // pan property
    it('property pan is 0 when attribute pan is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.pan).to.equal(0);
    });

    it('property pan is 2 when attribute pan is set to 2', async () => {
      const el = await fixture(html`<capture-photo pan="2"></capture-photo>`);
      expect(el.pan).to.equal(2);
    });

    it('attribute pan is set to 2 when property pan is set to 2', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.pan = 2;
      await elementUpdated(el);
      expect(el.getAttribute('pan')).to.equal('2');
    });

    // tilt property
    it('property tilt is 0 when attribute tilt is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.tilt).to.equal(0);
    });

    it('property tilt is 2 when attribute tilt is set to 2', async () => {
      const el = await fixture(html`<capture-photo tilt="2"></capture-photo>`);
      expect(el.tilt).to.equal(2);
    });

    it('attribute tilt is set to 2 when property tilt is set to 2', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.tilt = 2;
      await elementUpdated(el);
      expect(el.getAttribute('tilt')).to.equal('2');
    });

    // zoom property
    it('property zoom is 1 when attribute zoom is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.zoom).to.equal(1);
    });

    it('property zoom is 2 when attribute zoom is set to 2', async () => {
      const el = await fixture(html`<capture-photo zoom="2"></capture-photo>`);
      expect(el.zoom).to.equal(2);
    });

    it('attribute zoom is set to 2 when property zoom is set to 2', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.zoom = 2;
      await elementUpdated(el);
      expect(el.getAttribute('zoom')).to.equal('2');
    });

    // torch property
    it('property torch is false when attribute torch is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.torch).to.be.false;
    });

    it('property torch is true when attribute torch is set', async () => {
      const el = await fixture(html`<capture-photo torch></capture-photo>`);
      expect(el.torch).to.be.true;
    });

    it('attribute torch is set when property torch is set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.torch = true;
      await elementUpdated(el);
      expect(el.hasAttribute('torch')).to.be.true;
    });

    // calculateFileSize property
    it('property calculateFileSize is false when attribute calculate-file-size is not set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      expect(el.calculateFileSize).to.be.false;
    });

    it('property calculateFileSize is true when attribute calculate-file-size is set', async () => {
      const el = await fixture(html`<capture-photo calculate-file-size></capture-photo>`);
      expect(el.calculateFileSize).to.be.true;
    });

    it('attribute calculate-file-size is set when property calculateFileSize is set', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      el.calculateFileSize = true;
      await elementUpdated(el);
      expect(el.hasAttribute('calculate-file-size')).to.be.true;
    });
  });

  describe('slots', () => {
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

      expect(el).lightDom.to.equal(
        '<div slot="actions">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>'
      );
    });

    it('adds content in default slot', async () => {
      const el = await fixture(html`
        <capture-photo>
          <div class="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
        </capture-photo>
      `);

      expect(el).lightDom.to.equal(
        '<div class="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>'
      );
    });
  });

  describe('CSS Parts', () => {
    it('should have "video" CSS part', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const video = el.shadowRoot.querySelector('[part="video"]');
      expect(video).to.exist;
    });

    it('should have "actions-container" CSS part', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const actionsContainer = el.shadowRoot.querySelector('[part="actions-container"]');
      expect(actionsContainer).to.exist;
    });

    it('should have "capture-button" CSS part', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const captureButton = el.shadowRoot.querySelector('[part="capture-button"]');
      expect(captureButton).to.exist;
    });

    it('should have "facing-mode-button" CSS part', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const facingModeButton = el.shadowRoot.querySelector('[part="facing-mode-button"]');
      expect(facingModeButton).to.exist;
    });

    it('should have "output-container" CSS part', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const outputContainer = el.shadowRoot.querySelector('[part="output-container"]');
      expect(outputContainer).to.exist;
    });
  });

  describe('methods', () => {
    it('capture method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const captureSlot = el.shadowRoot.querySelector('slot[name="capture-button"]');
      const captureButton = captureSlot.assignedNodes({ flatten: true }).find(el => el.nodeName === 'BUTTON');
      const fn = sinon.spy(el, 'capture');

      captureButton.click();

      expect(fn).to.have.been.calledOnce;
    });

    it('startVideoStream method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const fn = sinon.spy(el, 'startVideoStream');
      el.startVideoStream();
      expect(fn).to.have.been.calledOnce;
    });

    it('stopVideoStream method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const fn = sinon.spy(el, 'stopVideoStream');
      el.stopVideoStream();
      expect(fn).to.have.been.calledOnce;
    });

    it('getTrackCapabilities method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const fn = sinon.spy(el, 'getTrackCapabilities');
      el.getTrackCapabilities();
      expect(fn).to.have.been.calledOnce;
    });

    it('getTrackSettings method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const fn = sinon.spy(el, 'getTrackSettings');
      el.getTrackSettings();
      expect(fn).to.have.been.calledOnce;
    });

    it('getSupportedConstraints method is called', async () => {
      const el = await fixture(html`<capture-photo></capture-photo>`);
      const fn = sinon.spy(el, 'getSupportedConstraints');
      el.getSupportedConstraints();
      expect(fn).to.have.been.calledOnce;
    });
  });
});
