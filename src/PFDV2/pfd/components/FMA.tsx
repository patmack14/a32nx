import { DisplayComponent, EventBus, FSComponent, Subject, Subscribable, VNode } from 'msfssdk';
import { ArmedLateralMode, ArmedVerticalMode, isArmed, LateralMode, VerticalMode } from '@shared/autopilot.js';
import { Arinc429Word } from '../shared/arinc429';

import { Arinc429Values } from '../shared/ArincValueProvider';
import { PFDSimvars } from '../shared/PFDSimvarPublisher';

abstract class ShowForSecondsComponent<T> extends DisplayComponent<T> {
    private timeout: number = 0;

    protected modeChangedPathRef = FSComponent.createRef<SVGPathElement>();

    protected displayModeChangedPath = (timeout: number, cancel = false) => {
        if (cancel) {
            clearTimeout(this.timeout);
            this.modeChangedPathRef.instance.classList.remove('ModeChangedPath');
        } else {
            this.modeChangedPathRef.instance.classList.add('ModeChangedPath');
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.modeChangedPathRef.instance.classList.remove('ModeChangedPath');
            }, timeout) as unknown as number;
        }
    }
}

export class FMA extends DisplayComponent<{ bus: EventBus }> {
    private isAttExcessive = false;

    private isAttExcessiveSub = Subject.create(false);

    private hiddenClassSub = Subject.create('');

    private roll: Arinc429Word = new Arinc429Word(0);

    private pitch: Arinc429Word = new Arinc429Word(0);;

    private activeLateralMode: number = 0;

    private activeVerticalMode: number = 0;

    private armedVerticalModeSub = Subject.create(0);

    private athrModeMessage = 0;

    private machPreselVal = 0;

    private speedPreselVal = 0;

    private setHoldSpeed = false;

    private tcasRaInhibited = Subject.create(false);

    private trkFpaDeselected = Subject.create(false);

    private firstBorderRef = FSComponent.createRef<SVGPathElement>();

    private secondBorderRef = FSComponent.createRef<SVGPathElement>();

    private attExcessive(pitch: Arinc429Word, roll: Arinc429Word): boolean {
        if (!this.isAttExcessive && ((pitch.isNormalOperation() && (-pitch.value > 25 || -pitch.value < -13)) || (roll.isNormalOperation() && Math.abs(roll.value) > 45))) {
            this.isAttExcessive = true;
            return true;
        } if (this.isAttExcessive && pitch.isNormalOperation() && -pitch.value < 22 && -pitch.value > -10 && roll.isNormalOperation() && Math.abs(roll.value) < 40) {
            this.isAttExcessive = false;
            return false;
        }
        return false;
    }

    private handleFMABorders() {
        const isAttExcessive = this.attExcessive(this.pitch, this.roll);

        this.isAttExcessiveSub.set(isAttExcessive);
        const sharedModeActive = this.activeLateralMode === 32 || this.activeLateralMode === 33
        || this.activeLateralMode === 34 || (this.activeLateralMode === 20 && this.activeVerticalMode === 24);
        const BC3Message = getBC3Message(isAttExcessive, this.armedVerticalModeSub.get(),
            this.setHoldSpeed, this.trkFpaDeselected.get(), this.tcasRaInhibited.get())[0] !== null;

        const engineMessage = this.athrModeMessage;
        const AB3Message = (this.machPreselVal !== -1
            || this.speedPreselVal !== -1) && !BC3Message && engineMessage === 0;

        let secondBorder: string;
        if (sharedModeActive && !isAttExcessive) {
            secondBorder = '';
        } else if (BC3Message) {
            secondBorder = 'm66.241 0.33732v15.766';
        } else {
            secondBorder = 'm66.241 0.33732v20.864';
        }

        let firstBorder: string;
        if (AB3Message && !isAttExcessive) {
            firstBorder = 'm33.117 0.33732v15.766';
        } else {
            firstBorder = 'm33.117 0.33732v20.864';
        }

        this.firstBorderRef.instance.setAttribute('d', firstBorder);
        this.secondBorderRef.instance.setAttribute('d', secondBorder);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars & Arinc429Values>();

        sub.on('rollAr').handle((r) => {
            this.roll = r;
        });

        sub.on('pitchAr').handle((p) => {
            this.pitch = p;
        });

        sub.on('fmaVerticalArmed').whenChanged().handle((a) => {
            this.armedVerticalModeSub.set(a);
            this.handleFMABorders();
        });

        sub.on('activeLateralMode').whenChanged().handle((activeLateralMode) => {
            this.activeLateralMode = activeLateralMode;
            this.handleFMABorders();
        });
        sub.on('activeVerticalMode').whenChanged().handle((activeVerticalMode) => {
            this.activeVerticalMode = activeVerticalMode;
            this.handleFMABorders();
        });

        sub.on('speedPreselVal').whenChanged().handle((s) => {
            this.speedPreselVal = s;
            this.handleFMABorders();
        });

        sub.on('machPreselVal').whenChanged().handle((m) => {
            this.machPreselVal = m;
            this.handleFMABorders();
        });

        sub.on('setHoldSpeed').whenChanged().handle((shs) => {
            this.setHoldSpeed = shs;
            this.handleFMABorders();
        });

        sub.on('tcasRaInhibited').whenChanged().handle((tra) => {
            this.tcasRaInhibited.set(tra);
            this.handleFMABorders();
        });

        sub.on('trkFpaDeselectedTCAS').whenChanged().handle((trk) => {
            this.trkFpaDeselected.set(trk);
            this.handleFMABorders();
        });
    }

    render(): VNode {
        return (
            <g id="FMA">
                <g class="NormalStroke Grey">
                    <path ref={this.firstBorderRef} />
                    <path ref={this.secondBorderRef} />
                    <path d="m102.52 0.33732v20.864" />
                    <path d="m133.72 0.33732v20.864" />
                </g>

                <Row1 bus={this.props.bus} hiddenClassSub={this.hiddenClassSub} />
                <Row2 bus={this.props.bus} hiddenClassSub={this.hiddenClassSub} />
                <Row3
                    bus={this.props.bus}
                    hiddenClassSub={this.hiddenClassSub}
                    isAttExcessiveSub={this.isAttExcessiveSub}
                    verticalArmedModeSub={this.armedVerticalModeSub}
                />
            </g>
        );
    }
}

class Row1 extends DisplayComponent<{ bus:EventBus, hiddenClassSub: Subscribable<string> }> {
    render(): VNode {
        return (
            <g>
                <A1A2Cell bus={this.props.bus} />

                <>
                    <B1Cell visibility={this.props.hiddenClassSub} bus={this.props.bus} />
                    <C1Cell visibility={this.props.hiddenClassSub} bus={this.props.bus} />
                    <D1D2Cell visibility={this.props.hiddenClassSub} bus={this.props.bus} />
                    <BC1Cell visibility={this.props.hiddenClassSub} bus={this.props.bus} />
                </>
                <E1Cell bus={this.props.bus} />
            </g>
        );
    }
}

class Row2 extends DisplayComponent<{ bus:EventBus, hiddenClassSub: Subscribable<string> }> {
    render(): VNode {
        return (
            <g>
                <g visibility={this.props.hiddenClassSub}>
                    <B2Cell bus={this.props.bus} />
                    <C2Cell bus={this.props.bus} />
                </g>
                <E2Cell bus={this.props.bus} />
            </g>
        );
    }
}

class Row3 extends DisplayComponent<{ bus:EventBus, hiddenClassSub: Subscribable<string>, isAttExcessiveSub: Subscribable<boolean>, verticalArmedModeSub: Subscribable<number> }> {
    render(): VNode {
        return (
            <g>
                <A3Cell bus={this.props.bus} />
                <g visibility={this.props.hiddenClassSub}>
                    <AB3Cell bus={this.props.bus} />
                    <D3Cell bus={this.props.bus} />
                </g>
                <BC3Cell isAttExcessive={this.props.isAttExcessiveSub} bus={this.props.bus} />
                <E3Cell bus={this.props.bus} />
            </g>
        );
    }
}

class A1A2Cell extends ShowForSecondsComponent<{bus: EventBus}> {
    private athrModeSub = Subject.create(0);

    private cellRef = FSComponent.createRef<SVGGElement>();

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('AThrMode').whenChanged().handle((athrMode) => {
            this.athrModeSub.set(athrMode);

            let text: string = '';
            this.displayModeChangedPath(0, true);

            switch (athrMode) {
            case 1:
                text = `
                            <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">TOGA</text>
                        `;
                break;
            case 2:
                text = `<g>
                            <path class="NormalStroke White" d="m31.521 1.8143v13.506h-30.217v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">GA SOFT</text>
                        </g>`;
                break;
            case 3:
                const FlexTemp = Math.round(SimVar.GetSimVarValue('L:AIRLINER_TO_FLEX_TEMP', 'number'));
                const FlexText = FlexTemp >= 0 ? (`+${FlexTemp}`) : FlexTemp.toString();
                text = `<g>
                            <path class="NormalStroke White" d="m31.521 1.8143v13.506h-30.217v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">
                                <tspan xml:space="preserve">FLX  </tspan>
                                <tspan class="Cyan">${FlexText}</tspan>
                            </text>
                        </g>`;

                break;
            case 4:
                text = `<g>
                            <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">DTO</text>
                        </g>`;
                break;
            case 5:

                text = `<g>
                            <path class="NormalStroke White" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">MCT</text>
                        </g>`;
                break;
            case 6:
                text = `<g>
                            <path class="NormalStroke Amber" d="m25.114 1.8143v13.506h-16.952v-13.506z" />
                            <text class="FontMedium MiddleAlign White" x="16.782249" y="7.1280665">MAN</text>
                            <text class="FontMedium MiddleAlign White" x="16.869141" y="14.351689">THR</text>
                        </g>`;
                break;
            case 7:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">SPEED</text>';
                this.displayModeChangedPath(9000);
                break;
            case 8:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">MACH</text>';
                this.displayModeChangedPath(9000);
                break;
            case 9:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR MCT</text>';
                this.displayModeChangedPath(9000);
                break;
            case 10:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR CLB</text>';
                this.displayModeChangedPath(9000);
                break;
            case 11:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR LVR</text>';
                this.displayModeChangedPath(9000);
                break;
            case 12:
                text = '<text  class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">THR IDLE</text>';
                this.displayModeChangedPath(9000);
                break;
            case 13:
                text = `<g>
                            <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                            <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">A.FLOOR</text>
                        </g>`;
                break;
            case 14:
                text = `<g>
                            <path class="NormalStroke Amber BlinkInfinite" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />
                            <text class="FontMedium MiddleAlign Green" x="16.782249" y="7.1280665">TOGA LK</text>
                        </g>`;
                break;
            default:
                text = '';
            }

            this.cellRef.instance.innerHTML = text;
        });
    }

    render(): VNode {
        return (
            <>

                <path ref={this.modeChangedPathRef} visibility="hidden" class="NormalStroke White" d="m0.70556 1.8143h30.927v6.0476h-30.927z" />

                <g ref={this.cellRef} />
            </>
        );
    }
}

class A3Cell extends DisplayComponent<{bus: EventBus}> {
    private classSub = Subject.create('');

    private textSub = Subject.create('');

    private onUpdateAthrModeMessage(message: number) {
        let text: string = '';
        let className: string = '';
        switch (message) {
        case 1:
            text = 'THR LK';
            className = 'Amber BlinkInfinite';
            break;
        case 2:
            text = 'LVR TOGA';
            className = 'White BlinkInfinite';
            break;
        case 3:
            text = 'LVR CLB';
            className = 'White BlinkInfinite';
            break;
        case 4:
            text = 'LVR MCT';
            className = 'White BlinkInfinite';
            break;
        case 5:
            text = 'LVR ASYM';
            className = 'Amber';
            break;
        }
        this.textSub.set(text);
        this.classSub.set(`FontMedium MiddleAlign ${className}`);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('athrModeMessage').whenChanged().handle((m) => {
            this.onUpdateAthrModeMessage(m);
        });
    }

    render(): VNode {
        return (
            <text class={this.classSub} x="16.989958" y="21.641243">{this.textSub}</text>
        );
    }
}

class AB3Cell extends DisplayComponent<{bus: EventBus}> {
    private speedPreselVal = -1;

    private machPreselVal = -1;

    private athrModeMessage = 0;

    private textSub = Subject.create('');

    private getText() {
        if (this.athrModeMessage === 0) {
            if (this.speedPreselVal !== -1 && this.machPreselVal === -1) {
                const text = Math.round(this.speedPreselVal);
                this.textSub.set(`SPEED SEL ${text}`);
            } else if (this.machPreselVal !== -1 && this.speedPreselVal === -1) {
                this.textSub.set(`MACH SEL ${this.machPreselVal.toFixed(2)}`);
            } else if (this.machPreselVal === -1 && this.speedPreselVal === -1) {
                this.textSub.set('');
            }
        } else {
            this.textSub.set('');
        }
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('speedPreselVal').whenChanged().handle((m) => {
            this.speedPreselVal = m;
            this.getText();
        });

        sub.on('machPreselVal').whenChanged().handle((m) => {
            this.machPreselVal = m;
            this.getText();
        });

        sub.on('athrModeMessage').whenChanged().handle((m) => {
            this.athrModeMessage = m;
            this.getText();
        });
    }

    render(): VNode {
        return (
            <text class="FontMedium MiddleAlign Cyan" x="35.434673" y="21.656223">{this.textSub}</text>
        );
    }
}

class B1Cell extends ShowForSecondsComponent<{bus: EventBus, visibility: Subscribable<string>}> {
    private boxClassSub = Subject.create('');

    private boxPathStringSub = Subject.create('');

    private activeVerticalModeSub = Subject.create(0);

    private inProtectionClassSub = Subject.create('Cyan');

    private speedProtectionPathRef = FSComponent.createRef<SVGPathElement>();

    private inModeReversionPathRef = FSComponent.createRef<SVGPathElement>();

    private fmaTextRef = FSComponent.createRef<SVGTextElement>();

    private selectedVS = 0;

    private inSpeedProtection = 0;

    private expediteMode = false;

    private FPA = 0;

    private getText(): boolean {
        let text: string;
        let additionalText: string = '';

        switch (this.activeVerticalModeSub.get()) {
        case 31:
            text = 'G/S';
            break;
        // case 2:
        //     text = 'F-G/S';
        //     break;
        case 30:
            text = 'G/S*';
            break;
        // case 4:
        //     text = 'F-G/S*';
        //     break;
        case 40:
        case 41:
            text = 'SRS';
            break;
        case 50:
            text = 'TCAS';
            break;
        // case 9:
        //     text = 'FINAL';
        //     break;
        case 23:
            text = 'DES';
            break;
        case 13:
            if (this.expediteMode) {
                text = 'EXP DES';
            } else {
                text = 'OP DES';
            }
            break;
        case 22:
            text = 'CLB';
            break;
        case 12:
            if (this.expediteMode) {
                text = 'EXP CLB';
            } else {
                text = 'OP CLB';
            }
            break;
        case 10:
            if (SimVar.GetSimVarValue('L:A32NX_FMA_CRUISE_ALT_MODE', 'Bool')) {
                text = 'ALT CRZ';
            } else {
                text = 'ALT';
            }
            break;
        case 11:
            text = 'ALT*';
            break;
        case 21:
            text = 'ALT CST*';
            break;
        case 20:
            text = 'ALT CST';
            break;
        // case 18:
        //     text = 'ALT CRZ';
        //     break;
        case 15: {
            const FPAText = `${(this.FPA >= 0 ? '+' : '')}${(Math.round(this.FPA * 10) / 10).toFixed(1)}°`;

            text = 'FPA';
            additionalText = FPAText;
            break;
        }
        case 14: {
            const VSText = `${(this.selectedVS >= 0 ? '+' : '')}${Math.round(this.selectedVS).toString()}`.padStart(5, ' ');

            text = 'V/S';

            additionalText = VSText;
            break;
        }
        default:
            text = '';
        }

        const inSpeedProtection = this.inSpeedProtection && (this.activeVerticalModeSub.get() === 14 || this.activeVerticalModeSub.get() === 15);

        if (inSpeedProtection) {
            this.speedProtectionPathRef.instance.setAttribute('visibility', 'visible');
        } else {
            this.speedProtectionPathRef.instance.setAttribute('visibility', 'hidden');
        }

        const tcasModeDisarmedMessage = SimVar.GetSimVarValue('L:A32NX_AUTOPILOT_TCAS_MESSAGE_DISARM', 'bool');

        const boxclass = inSpeedProtection ? 'NormalStroke None' : 'NormalStroke White';
        this.boxClassSub.set(boxclass);

        const boxPathString = this.activeVerticalModeSub.get() === 50 && tcasModeDisarmedMessage ? 'm34.656 1.8143h29.918v13.506h-29.918z' : 'm34.656 1.8143h29.918v6.0476h-29.918z';

        this.boxPathStringSub.set(boxPathString);

        this.inProtectionClassSub.set(inSpeedProtection ? 'PulseCyanFill' : 'Cyan');

        this.fmaTextRef.instance.innerHTML = `<tspan>${text}</tspan><tspan xml:space="preserve" class=${inSpeedProtection ? 'PulseCyanFill' : 'Cyan'}>${additionalText}</tspan>`;

        return text.length > 0;
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('activeVerticalMode').whenChanged().handle((activeVerticalMode) => {
            this.activeVerticalModeSub.set(activeVerticalMode);
            const isShow = this.getText();
            if (isShow) {
                this.displayModeChangedPath(10000);
            } else {
                this.displayModeChangedPath(0, true);
            }
        });

        sub.on('selectedFpa').whenChanged().handle((fpa) => {
            this.FPA = fpa;
            this.getText();
        });

        sub.on('ap_vs_selected').whenChanged().handle((svs) => {
            this.selectedVS = svs;
            this.getText();
        });

        sub.on('fma_mode_reversion').whenChanged().handle((r) => {
            if (r) {
                this.inModeReversionPathRef.instance.setAttribute('visibility', 'visible');
                this.boxClassSub.set('NormalStroke None');
                this.displayModeChangedPath(10000);
            } else {
                this.inModeReversionPathRef.instance.setAttribute('visibility', 'hidden');
                this.boxClassSub.set('NormalStroke White');
                this.displayModeChangedPath(0, true);
            }
        });

        sub.on('fma_speed_protection').whenChanged().handle((protection) => {
            this.inSpeedProtection = protection;
            if (!protection) {
                this.displayModeChangedPath(0, true);
                this.speedProtectionPathRef.instance.setAttribute('visibility', 'hidden');
            } else {
                this.displayModeChangedPath(10000);
                this.speedProtectionPathRef.instance.setAttribute('visibility', 'visible');
            }
            this.getText();
        });

        sub.on('expediteMode').whenChanged().handle((e) => {
            this.expediteMode = e;
            this.getText();
        });
    }

    render(): VNode {
        return (
            <g visibility={this.props.visibility}>

                <path ref={this.modeChangedPathRef} class={this.boxClassSub} visibility="hidden" d={this.boxPathStringSub} />

                <path ref={this.speedProtectionPathRef} class="NormalStroke Amber BlinkInfinite" d="m34.656 1.8143h29.918v6.0476h-29.918z" />
                <path ref={this.inModeReversionPathRef} class="NormalStroke White BlinkInfinite" d="m34.656 1.8143h29.918v6.0476h-29.918z" />

                <text ref={this.fmaTextRef} style="white-space: pre" class="FontMedium MiddleAlign Green" x="49.921795" y="7.1040988">

                    {/* set directly via innerhtml as tspan was invisble for some reason when set here */}

                </text>
            </g>
        );
    }
}

class B2Cell extends DisplayComponent<{bus: EventBus}> {
    private text1Sub = Subject.create('');

    private text2Sub = Subject.create('');

    private classSub = Subject.create('');

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('fmaVerticalArmed').whenChanged().handle((fmv) => {
            const altArmed = (fmv >> 0) & 1;
            const altCstArmed = (fmv >> 1) & 1;
            const clbArmed = (fmv >> 2) & 1;
            const desArmed = (fmv >> 3) & 1;
            const gsArmed = (fmv >> 4) & 1;
            const finalArmed = (fmv >> 5) & 1;

            let text1: string;
            let color1 = 'Cyan';
            if (clbArmed) {
                text1 = 'CLB';
            } else if (desArmed) {
                text1 = 'DES';
            } else if (altCstArmed) {
                text1 = 'ALT';
                color1 = 'Magenta';
            } else if (altArmed) {
                text1 = 'ALT';
            } else {
                text1 = '';
            }

            let text2;
            // case 1:
            //     text2 = 'F-G/S';
            //     break;
            if (gsArmed) {
                text2 = 'G/S';
            } else if (finalArmed) {
                text2 = 'FINAL';
            } else {
                text2 = '';
            }

            this.text1Sub.set(text1);
            this.text2Sub.set(text2);
            this.classSub.set(`FontMedium MiddleAlign ${color1}`);
        });
    }

    render(): VNode {
        return (
            <g>
                <text class={this.classSub} x="41.477474" y="14.329653">{this.text1Sub}</text>
                <text class="FontMedium MiddleAlign Cyan" x="54.59803" y="14.382949">{this.text2Sub}</text>
            </g>
        );
    }
}

class C1Cell extends ShowForSecondsComponent<{visibility: Subscribable<string>, bus: EventBus}> {
    private textSub = Subject.create('');

    private activeLateralMode = 0;

    private activeVerticalMode = 0;

    private armedVerticalMode = 0;

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('activeLateralMode').whenChanged().handle((lm) => {
            this.activeLateralMode = lm;

            const isShown = this.updateText();
            if (isShown) {
                this.displayModeChangedPath(10000);
            } else {
                this.displayModeChangedPath(0, true);
            }
        });

        sub.on('activeVerticalMode').whenChanged().handle((lm) => {
            this.activeVerticalMode = lm;

            const isShown = this.updateText();
            if (isShown) {
                this.displayModeChangedPath(10000);
            } else {
                this.displayModeChangedPath(0, true);
            }
        });

        sub.on('fmaVerticalArmed').whenChanged().handle((va) => {
            this.armedVerticalMode = va;

            const isShown = this.updateText();
            if (isShown) {
                this.displayModeChangedPath(10000);
            } else {
                this.displayModeChangedPath(0, true);
            }
        });
    }

    private updateText(): boolean {
        const finalArmed = (this.armedVerticalMode >> 5) & 1;

        let text: string;
        if (this.activeLateralMode === LateralMode.GA_TRACK) {
            text = 'GA TRK';
        } else if (this.activeLateralMode === LateralMode.LOC_CPT) {
            text = 'LOC *';
        } else if (this.activeLateralMode === LateralMode.HDG) {
            text = 'HDG';
        } else if (this.activeLateralMode === LateralMode.RWY) {
            text = 'RWY';
        } else if (this.activeLateralMode === LateralMode.RWY_TRACK) {
            text = 'RWY TRK';
        } else if (this.activeLateralMode === LateralMode.TRACK) {
            text = 'TRACK';
        } else if (this.activeLateralMode === LateralMode.LOC_TRACK) {
            text = 'LOC';
        } else if (this.activeLateralMode === LateralMode.NAV && !finalArmed && this.activeVerticalMode !== VerticalMode.FINAL) {
            text = 'NAV';
        } else if (this.activeLateralMode === LateralMode.NAV && finalArmed && this.activeVerticalMode !== VerticalMode.FINAL) {
            text = 'APP NAV';
        } else {
            text = '';
        }

        const hasChanged = text.length > 0 && text !== this.textSub.get();

        if (hasChanged || text.length === 0) {
            this.textSub.set(text);
        }
        return hasChanged;
    }

    render(): VNode {
        // case 2:
        //     text = 'LOC B/C*';
        //     id = 2;
        //     break;
        // case 4:
        //     text = 'F-LOC*';
        //     id = 4;
        //     break;
        // case 9:
        //     text = 'LOC B/C';
        //     id = 9;
        //     break;
        // case 11:
        //     text = 'F-LOC';
        //     id = 11;
        //     break;
        // case 12:
        //     text = 'APP NAV';
        //     id = 12;
        //     break;

        return (
            <g visibility={this.props.visibility}>
                <path ref={this.modeChangedPathRef} class="NormalStroke White" visibility="hidden" d="m100.87 1.8143v6.0476h-33.075l1e-6 -6.0476z" />
                <text class="FontMedium MiddleAlign Green" x="84.856567" y="6.9873109">{this.textSub}</text>
            </g>
        );
    }
}

class C2Cell extends DisplayComponent<{bus: EventBus}> {
    private fmaLateralArmed: number = 0;

    private fmaVerticalArmed: number = 0;

    private activeVerticalMode: number = 0;

    private textSub = Subject.create('');

    private getText() {
        const navArmed = isArmed(this.fmaLateralArmed, ArmedLateralMode.NAV);
        const locArmed = isArmed(this.fmaLateralArmed, ArmedLateralMode.LOC);

        const finalArmed = isArmed(this.fmaVerticalArmed, ArmedVerticalMode.FINAL);

        let text: string = '';
        if (locArmed) {
            // case 1:
            //     text = 'LOC B/C';
            //     break;
            text = 'LOC';
            // case 3:
            //     text = 'F-LOC';
            //     break;
        } else if (navArmed && (finalArmed || this.activeVerticalMode === VerticalMode.FINAL)) {
            text = 'APP NAV';
        } else if (navArmed) {
            text = 'NAV';
        }
        this.textSub.set(text);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('fmaLateralArmed').whenChanged().handle((fla) => {
            this.fmaLateralArmed = fla;
            this.getText();
        });

        sub.on('fmaVerticalArmed').whenChanged().handle((fva) => {
            this.fmaVerticalArmed = fva;
            this.getText();
        });

        sub.on('activeVerticalMode').whenChanged().handle((avm) => {
            this.activeVerticalMode = avm;
            this.getText();
        });
    }

    render(): VNode {
        return (
            <text class="FontMedium MiddleAlign Cyan" x="84.734184" y="14.440415">{this.textSub}</text>
        );
    }
}

class BC1Cell extends ShowForSecondsComponent<{bus:EventBus, visibility: Subscribable<string>}> {
    private lastLateralMode = 0;

    private lastVerticalMode = 0;

    private textSub = Subject.create('');

    private setText() {
        let text: string;
        if (this.lastVerticalMode === VerticalMode.ROLL_OUT) {
            text = 'ROLL OUT';
        } else if (this.lastVerticalMode === VerticalMode.FLARE) {
            text = 'FLARE';
        } else if (this.lastVerticalMode === VerticalMode.LAND) {
            text = 'LAND';
        } else if (this.lastVerticalMode === VerticalMode.FINAL && this.lastLateralMode === LateralMode.NAV) {
            text = 'FINAL APP';
        } else {
            text = '';
        }
        if (text !== '') {
            this.displayModeChangedPath(9000);
        } else {
            this.displayModeChangedPath(0, true);
        }
        this.textSub.set(text);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('activeVerticalMode').whenChanged().handle((v) => {
            this.lastVerticalMode = v;
            this.setText();
        });

        sub.on('activeLateralMode').whenChanged().handle((l) => {
            this.lastLateralMode = l;
            this.setText();
        });
    }

    render(): VNode {
        return (
            <g>
                <path ref={this.modeChangedPathRef} class="NormalStroke White" visibility="hidden" d="m50.178 1.8143h35.174v6.0476h-35.174z" />
                <text class="FontMedium MiddleAlign Green" x="67.9795" y="6.8893085">{this.textSub}</text>
            </g>
        );
    }
}

const getBC3Message = (isAttExcessive: boolean, armedVerticalMode: number, setHoldSpeed: boolean, trkFpaDeselectedTCAS: boolean, tcasRaInhibited: boolean) => {
    const armedVerticalBitmask = armedVerticalMode;
    const TCASArmed = (armedVerticalBitmask >> 6) & 1;

    let text: string;
    let className: string;
    // All currently unused message are set to false
    if (false) {
        text = 'MAN PITCH TRIM ONLY';
        className = 'Red Blink9Seconds';
    } else if (false) {
        text = 'USE MAN PITCH TRIM';
        className = 'PulseAmber9Seconds Amber';
    } else if (false) {
        text = 'FOR GA: SET TOGA';
        className = 'PulseAmber9Seconds Amber';
    } else if (TCASArmed && !isAttExcessive) {
        text = '  TCAS               ';
        className = 'Cyan';
    } else if (false) {
        text = 'DISCONNECT AP FOR LDG';
        className = 'PulseAmber9Seconds Amber';
    } else if (tcasRaInhibited && !isAttExcessive) {
        text = 'TCAS RA INHIBITED';
        className = 'White';
    } else if (trkFpaDeselectedTCAS && !isAttExcessive) {
        text = 'TRK FPA DESELECTED';
        className = 'White';
    } else if (false) {
        text = 'SET GREEN DOT SPEED';
        className = 'White';
    } else if (false) {
        text = 'T/D REACHED';
        className = 'White';
    } else if (false) {
        text = 'MORE DRAG';
        className = 'White';
    } else if (false) {
        text = 'CHECK SPEED MODE';
        className = 'White';
    } else if (false) {
        text = 'CHECK APPR SELECTION';
        className = 'White';
    } else if (false) {
        text = 'TURN AREA EXCEEDANCE';
        className = 'White';
    } else if (setHoldSpeed) {
        text = 'SET HOLD SPEED';
        className = 'White';
    } else if (false) {
        text = 'VERT DISCONT AHEAD';
        className = 'Amber';
    } else if (false) {
        text = 'FINAL APP SELECTED';
        className = 'White';
    } else {
        return [null, null];
    }

    return [text, className];
};

class BC3Cell extends DisplayComponent<{ isAttExcessive: Subscribable<boolean>, bus: EventBus, }> {
    private bc3Cell = FSComponent.createRef<SVGTextElement>();

    private classNameSub = Subject.create('');

    private isAttExcessive = false;

    private armedVerticalMode = 0;

    private setHoldSpeed = false;

    private tcasRaInhibited = false;

    private trkFpaDeselected = false;

    private fillBC3Cell() {
        const [text, className] = getBC3Message(this.isAttExcessive, this.armedVerticalMode, this.setHoldSpeed, this.trkFpaDeselected, this.tcasRaInhibited);
        this.classNameSub.set(`FontMedium MiddleAlign ${className}`);
        if (text !== null) {
            this.bc3Cell.instance.innerHTML = text;
        }
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        this.props.isAttExcessive.sub((e) => {
            this.isAttExcessive = e;
            this.fillBC3Cell();
        });

        sub.on('fmaVerticalArmed').whenChanged().handle((v) => {
            this.armedVerticalMode = v;
            this.fillBC3Cell();
        });

        sub.on('setHoldSpeed').whenChanged().handle((shs) => {
            this.setHoldSpeed = shs;
            this.fillBC3Cell();
        });

        sub.on('tcasRaInhibited').whenChanged().handle((tra) => {
            this.tcasRaInhibited = tra;
            this.fillBC3Cell();
        });

        sub.on('trkFpaDeselectedTCAS').whenChanged().handle((trk) => {
            this.trkFpaDeselected = trk;
            this.fillBC3Cell();
        });
    }

    render(): VNode {
        return (
            <text ref={this.bc3Cell} class={this.classNameSub} x="68.087875" y="21.627102" style="white-space: pre" />
        );
    }
}

class D1D2Cell extends ShowForSecondsComponent<{bus: EventBus, visibility: Subscribable<string>}> {
    private text1Sub = Subject.create('');

    private text2Sub = Subject.create('');

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('approachCapability').whenChanged().handle((c) => {
            let text1: string;
            let text2: string | undefined;
            switch (c) {
            case 1:
                text1 = 'CAT1';
                break;
            case 2:
                text1 = 'CAT2';
                break;
            case 3:
                text1 = 'CAT3';
                text2 = 'SINGLE';
                break;
            case 4:
                text1 = 'CAT3';
                text2 = 'DUAL';
                break;
            case 5:
                text1 = 'AUTO';
                text2 = 'LAND';
                break;
            case 6:
                text1 = 'F-APP';
                break;
            case 7:
                text1 = 'F-APP';
                text2 = '+ RAW';
                break;
            case 8:
                text1 = 'RAW';
                text2 = 'ONLY';
                break;
            default:
                text1 = '';
            }

            this.text1Sub.set(text1);
            if (text2) {
                this.text2Sub.set(text2);
                this.modeChangedPathRef.instance.setAttribute('d', 'm104.1 1.8143h27.994v13.506h-27.994z');
            } else {
                this.text2Sub.set('');
                this.modeChangedPathRef.instance.setAttribute('d', 'm104.1 1.8143h27.994v6.0476h-27.994z');
            }
            if (text1.length === 0 && !text2) {
                this.displayModeChangedPath(0, true);
            } else {
                this.displayModeChangedPath(9000);
            }
        });
    }

    render(): VNode {
        return (
            <g visibility={this.props.visibility}>
                <text class="FontMedium MiddleAlign White" x="118.45866" y="7.125926">{this.text1Sub}</text>
                <text class="FontMedium MiddleAlign White" x="118.39752" y="14.289783">{this.text2Sub}</text>
                <path ref={this.modeChangedPathRef} class="NormalStroke White" visibility="hidden" />
            </g>
        );
    }
}

class D3Cell extends DisplayComponent<{bus: EventBus}> {
    private textRef = FSComponent.createRef<SVGTextElement>();

    private classNameSub = Subject.create('');

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('mda').whenChanged().handle((mda) => {
            if (mda !== 0) {
                const MDAText = Math.round(mda).toString().padStart(6, ' ');

                this.textRef.instance.innerHTML = `<tspan>BARO</tspan><tspan class="Cyan" xml:space="preserve">${MDAText}</tspan>`;
            } else {
                this.textRef.instance.innerHTML = '';
            }
        });

        sub.on('dh').whenChanged().handle((dh) => {
            let fontSize = 'FontSmallest';

            if (dh !== -1 && dh !== -2) {
                const DHText = Math.round(dh).toString().padStart(4, ' ');

                this.textRef.instance.innerHTML = `
                        <tspan>RADIO</tspan><tspan class="Cyan" xml:space="preserve">${DHText}</tspan>
                    `;
            } else if (dh === -2) {
                this.textRef.instance.innerHTML = '<tspan>NO DH</tspan>';
                fontSize = 'FontMedium';
            } else {
                this.textRef.instance.innerHTML = '';
            }
            this.classNameSub.set(`${fontSize} MiddleAlign White`);
        });
    }

    render(): VNode {
        return (
            <text ref={this.textRef} class={this.classNameSub} x="118.38384" y="21.104172" />
        );
    }
}

class E1Cell extends ShowForSecondsComponent<{bus: EventBus}> {
    private ap1Active = false;

    private ap2Active = false;

    private textSub = Subject.create('');

    private setText() {
        let text: string;
        if (this.ap1Active && !this.ap2Active) {
            text = 'AP1';
        } else if (this.ap2Active && !this.ap1Active) {
            text = 'AP2';
        } else if (!this.ap2Active && !this.ap1Active) {
            text = '';
            this.displayModeChangedPath(0, true);
        } else {
            text = 'AP1+2';
        }
        this.textSub.set(text);
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('ap1Active').whenChanged().handle((ap) => {
            this.ap1Active = ap;
            this.displayModeChangedPath(9000);
            this.setText();
        });

        sub.on('ap2Active').whenChanged().handle((ap) => {
            this.ap2Active = ap;
            this.displayModeChangedPath(9000);
            this.setText();
        });
    }

    render(): VNode {
        return (
            <g>
                <path ref={this.modeChangedPathRef} visibility="hidden" class="NormalStroke White" d="m156.13 1.8143v6.0476h-20.81v-6.0476z" />
                <text class="FontMedium MiddleAlign White" x="145.61546" y="6.9559975">{this.textSub}</text>
            </g>
        );
    }
}

class E2Cell extends ShowForSecondsComponent<{bus: EventBus}> {
    private fd1Active = false;

    private fd2Active = false;

    private ap1Active = false;

    private ap2Active = false;

    private textSub = Subject.create('');

    private getText() {
        if (!this.ap1Active && !this.ap2Active && !this.fd1Active && !this.fd2Active) {
            this.textSub.set('');
        } else {
            const text = `${this.fd1Active ? '1' : '-'} FD ${this.fd2Active ? '2' : '-'}`;
            this.textSub.set(text);
        }
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('fd1Active').whenChanged().handle((fd) => {
            this.fd1Active = fd;
            if (fd || this.fd2Active) {
                this.displayModeChangedPath(9000);
            } else {
                this.displayModeChangedPath(0, true);
            }
            this.getText();
        });

        sub.on('ap1Active').whenChanged().handle((fd) => {
            this.ap1Active = fd;
            this.getText();
        });

        sub.on('ap2Active').whenChanged().handle((fd) => {
            this.ap2Active = fd;
            this.getText();
        });

        sub.on('fd2Active').whenChanged().handle((fd) => {
            this.fd2Active = fd;
            if (fd || this.fd1Active) {
                this.displayModeChangedPath(9000);
            } else {
                this.displayModeChangedPath(0, true);
            }
            this.getText();
        });
    }

    render(): VNode {
        return (
            <g>
                <path ref={this.modeChangedPathRef} d="m156.13 9.0715v6.0476h-20.81v-6.0476z" visibility="hidden" class="NormalStroke White" />
                <text class="FontMedium MiddleAlign White" x="145.95045" style="word-spacing: -1.9844px" y="14.417698">{this.textSub}</text>

            </g>
        );
    }
}

class E3Cell extends ShowForSecondsComponent<{bus: EventBus}> {
    private classSub = Subject.create('');

    private getClass(athrStatus: number): string {
        let color: string = '';
        switch (athrStatus) {
        case 1:
            color = 'Cyan';
            break;
        case 2:
            color = 'White';
            break;
        }
        return color;
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars>();

        sub.on('athrStatus').whenChanged().handle((a) => {
            const color = this.getClass(a);
            this.classSub.set(`FontMedium MiddleAlign ${color}`);
            if (color !== '') {
                this.displayModeChangedPath(9000);
            } else {
                this.displayModeChangedPath(0, true);
            }
        });
    }

    render(): VNode {
        return (
            <g>
                <path ref={this.modeChangedPathRef} class="NormalStroke White" visibility="hidden" d="m135.32 16.329h20.81v6.0476h-20.81z" />
                <text class={this.classSub} x="145.75578" y="21.434536">A/THR</text>
            </g>
        );
    }
}
