import { ClockEvents, ComponentProps, DisplayComponent, EventBus, FSComponent, Subject, Subscribable, VNode } from 'msfssdk';
import { Arinc429Values, ArincValueProvider } from 'PFDV2/pfd/shared/ArincValueProvider';
import { Arinc429Word } from '../shared/arinc429';
import { PFDSimvars } from '../shared/PFDSimvarPublisher';
import { LagFilter } from './PFDUtils';

interface VerticalSpeedIndicatorProps {
    bus: EventBus,
    instrument: BaseInstrument,
}

interface TcasState {
    tcasState: number;
    isTcasCorrective: boolean;
    tcasRedZoneL: number;
    tcasRedZoneH: number;
    tcasGreenZoneL: number;
    tcasGreenZoneH: number;
}

export class VerticalSpeedIndicator extends DisplayComponent<VerticalSpeedIndicatorProps> {
    private yOffsetSub = Subject.create(0);

    private isAmberSub = Subject.create(-1);

    private raSub = Subject.create(false);

    private vsFailed = FSComponent.createRef<SVGGElement>();

    private vsNormal = FSComponent.createRef<SVGGElement>();

    private lagFilter = new LagFilter(2);

    private needsUpdate = false;

    private vspeedTcas = FSComponent.createRef<VSpeedTcas>();

    private tcasState: TcasState = {
        tcasState: 0,
        isTcasCorrective: false,
        tcasRedZoneL: 0,
        tcasRedZoneH: 0,
        tcasGreenZoneL: 0,
        tcasGreenZoneH: 0,
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<PFDSimvars & Arinc429Values & ClockEvents>();

        sub.on('tcasState').whenChanged().handle((s) => {
            this.tcasState.tcasState = s;
            this.needsUpdate = true;
        });

        sub.on('tcasCorrective').whenChanged().handle((s) => {
            this.tcasState.isTcasCorrective = s;
            this.needsUpdate = true;
        });
        sub.on('tcasRedZoneL').whenChanged().handle((s) => {
            this.tcasState.tcasRedZoneL = s;
            this.needsUpdate = true;
        });
        sub.on('tcasRedZoneH').whenChanged().handle((s) => {
            this.tcasState.tcasRedZoneH = s;
            this.needsUpdate = true;
        });
        sub.on('tcasGreenZoneL').whenChanged().handle((s) => {
            this.tcasState.tcasGreenZoneL = s;
            this.needsUpdate = true;
        });
        sub.on('tcasGreenZoneH').whenChanged().handle((s) => {
            this.tcasState.tcasGreenZoneH = s;
            this.needsUpdate = true;
        });

        sub.on('realTime').handle((_r) => {
            if (this.needsUpdate) {
                if (this.tcasState.tcasState === 2) {
                    this.isAmberSub.set(3);
                }
                this.vspeedTcas.instance.update(this.tcasState);
            }
        });

        sub.on('vs').handle((vs) => {
            const filteredVS = this.lagFilter.step(vs.value, this.props.instrument.deltaTime / 1000);

            const absVSpeed = Math.abs(filteredVS);

            const radioAlt = SimVar.GetSimVarValue('PLANE ALT ABOVE GROUND MINUS CG', 'feet');
            if (!vs.isNormalOperation()) {
                this.vsFailed.instance.style.visibility = 'visible';
                this.vsNormal.instance.style.visibility = 'hidden';
            } else {
                this.vsFailed.instance.style.visibility = 'hidden';
                this.vsNormal.instance.style.visibility = 'visible';
            }

            if (this.tcasState.tcasState !== 2) {
                if (absVSpeed > 6000 || (radioAlt < 2500 && radioAlt > 1000 && filteredVS < -2000) || (radioAlt < 1000 && filteredVS < -1200)) {
                    this.isAmberSub.set(1);
                } else {
                    this.isAmberSub.set(2);
                }
            }

            const sign = Math.sign(filteredVS);

            if (absVSpeed < 1000) {
                this.yOffsetSub.set(filteredVS / 1000 * -27.22);
            } else if (absVSpeed < 2000) {
                this.yOffsetSub.set((filteredVS - sign * 1000) / 1000 * -10.1 - sign * 27.22);
            } else if (absVSpeed < 6000) {
                this.yOffsetSub.set((filteredVS - sign * 2000) / 4000 * -10.1 - sign * 37.32);
            } else {
                this.yOffsetSub.set(sign * -47.37);
            }
        });
    }

    render(): VNode {
        return (
            <g>
                <path class="TapeBackground" d="m151.84 131.72 4.1301-15.623v-70.556l-4.1301-15.623h-5.5404v101.8z" />

                <g id="VSpeedFailText" ref={this.vsFailed}>
                    <text class="Blink9Seconds FontLargest Red EndAlign" x="153.13206" y="77.501472">V</text>
                    <text class="Blink9Seconds FontLargest Red EndAlign" x="153.13406" y="83.211388">/</text>
                    <text class="Blink9Seconds FontLargest Red EndAlign" x="152.99374" y="88.870819">S</text>
                </g>

                <VSpeedTcas ref={this.vspeedTcas} bus={this.props.bus} />

                <g id="VerticalSpeedGroup" ref={this.vsNormal}>
                    <g class="Fill White">
                        <path d="m149.92 54.339v-1.4615h1.9151v1.4615z" />
                        <path d="m149.92 44.26v-1.4615h1.9151v1.4615z" />
                        <path d="m149.92 34.054v-1.2095h1.9151v1.2095z" />
                        <path d="m151.84 107.31h-1.9151v1.4615h1.9151z" />
                        <path d="m151.84 117.39h-1.9151v1.4615h1.9151z" />
                        <path d="m151.84 127.59h-1.9151v1.2095h1.9151z" />
                    </g>
                    <g class="SmallStroke  White">
                        <path d="m149.92 67.216h1.7135h0" />
                        <path d="m151.84 48.569h-1.9151h0" />
                        <path d="m151.84 38.489h-1.9151h0" />
                        <path d="m149.92 94.43h1.7135h0" />
                        <path d="m151.84 113.08h-1.9151h0" />
                        <path d="m151.84 123.16h-1.9151h0" />
                    </g>
                    <g class="FontSmallest MiddleAlign Fill White">
                        <text x="148.47067" y="109.72845">1</text>
                        <text x="148.24495" y="119.8801">2</text>
                        <text x="148.27068" y="129.90607">6</text>
                        <text x="148.49667" y="55.316456">1</text>
                        <text x="148.26495" y="45.356102">2</text>
                        <text x="148.21367" y="35.195072">6</text>
                    </g>
                    <path class="Fill Yellow" d="m145.79 80.067h6.0476v1.5119h-6.0476z" />
                    <VSpeedNeedle isAmber={this.isAmberSub} yOffset={this.yOffsetSub} isRA={this.raSub} />

                    <VSpeedText bus={this.props.bus} yOffset={this.yOffsetSub} isAmber={this.isAmberSub} />
                </g>
            </g>
        );
    }
}

class VSpeedNeedle extends DisplayComponent<{ yOffset: Subscribable<number>, isAmber: Subscribable<number>, isRA: Subscribable<boolean> }> {
    private outLineRef = FSComponent.createRef<SVGPathElement>();

    private indicatorRef = FSComponent.createRef<SVGPathElement>();

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const dxFull = 12;
        const dxBorder = 5;
        const centerX = 162.74;
        const centerY = 80.822;

        this.props.yOffset.sub((yOffset) => {
            const path = `m${centerX - dxBorder} ${centerY + dxBorder / dxFull * yOffset} l ${dxBorder - dxFull} ${(1 - dxBorder / dxFull) * yOffset}`;

            this.outLineRef.instance.setAttribute('d', path);
            this.indicatorRef.instance.setAttribute('d', path);
        });

        this.props.isAmber.sub((isAmberi) => {
            let className = '';
            if (isAmberi === 1) {
                className = 'HugeStroke Amber';
            } else if (isAmberi === 2) {
                className = 'HugeStroke Green';
            } else if (isAmberi === 3) {
                className = 'HugeStroke White';
            }
            this.indicatorRef.instance.setAttribute('class', className);
        });
    }

    render(): VNode | null {
        return (

            <>
                <path ref={this.outLineRef} class="HugeOutline" />
                <path ref={this.indicatorRef} id="VSpeedIndicator" />
            </>
        );
    }
}

class VSpeedText extends DisplayComponent<{ bus: EventBus, yOffset: Subscribable<number>, isAmber: Subscribable<number> }> {
    private vsTextRef = FSComponent.createRef<SVGTextElement>();

    private groupRef = FSComponent.createRef<SVGGElement>();

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        const sub = this.props.bus.getSubscriber<Arinc429Values>();

        sub.on('vs').handle((vs) => {
            const absVSpeed = Math.abs(vs.value);

            if (absVSpeed < 200) {
                this.groupRef.instance.setAttribute('visibility', 'hidden');
                return;
            }
            this.groupRef.instance.setAttribute('visibility', 'visible');

            const sign = Math.sign(vs.value);

            const textOffset = this.props.yOffset.get() - sign * 2.4;

            const text = (Math.round(absVSpeed / 100) < 10 ? '0' : '') + Math.round(absVSpeed / 100).toString();
            this.vsTextRef.instance.textContent = text;
            this.groupRef.instance.setAttribute('transform', `translate(0 ${textOffset})`);
        });

        this.props.isAmber.sub((isAmber) => {
            const className = `FontSmallest MiddleAlign ${isAmber === 1 ? 'Amber' : 'Green'}`;
            this.vsTextRef.instance.setAttribute('class', className);
        });
    }

    render(): VNode {
        return (
            <g ref={this.groupRef} id="VSpeedTextGroup">
                <path class="BackgroundFill" d="m158.4 83.011h-7.0514v-4.3989h7.0514z" />
                <text ref={this.vsTextRef} id="VSpeedText" x="155.14055" y="82.554756" />
            </g>
        );
    }
}

interface VSpeedTcasProps extends ComponentProps {
    bus: EventBus;
}
class VSpeedTcas extends DisplayComponent<VSpeedTcasProps> {
    private tcasGroup = FSComponent.createRef<SVGGElement>();

    private nonCorrective = FSComponent.createRef<SVGGElement>();

    private background = FSComponent.createRef<SVGRectElement>();

    private redZoneElement = FSComponent.createRef<VSpeedTcasZone>();

    private greenZoneElement = FSComponent.createRef<VSpeedTcasZone>();

    private redZone = Subject.create(-1);

    private redZoneHigh = Subject.create(-1);

    private greenZone = Subject.create(-1);

    private greenZoneHigh = Subject.create(-1);

    private extended = Subject.create(false);

    private isCorrective = Subject.create(false);

    public update(state: TcasState) {
        if (state.tcasState !== 2) {
            this.tcasGroup.instance.classList.add('HiddenElement');
            this.nonCorrective.instance.classList.add('HiddenElement');
        } else if (state.isTcasCorrective) {
            this.tcasGroup.instance.classList.remove('HiddenElement');
            this.background.instance.classList.remove('HiddenElement');
            this.redZone.set(state.tcasRedZoneL);
            this.redZoneHigh.set(state.tcasRedZoneH);
            this.greenZone.set(state.tcasGreenZoneL);
            this.greenZoneHigh.set(state.tcasGreenZoneH);
            this.nonCorrective.instance.classList.add('HiddenElement');
        } else {
            this.background.instance.classList.add('HiddenElement');
            this.nonCorrective.instance.classList.add('HiddenElement');

            this.isCorrective.set(false);
            this.extended.set(false);
            this.redZone.set(state.tcasRedZoneL);
            this.redZoneHigh.set(state.tcasRedZoneH);
        }
    }

    render(): VNode {
        return (
            <>
                <g id="VerticalSpeedTCASGroup" ref={this.tcasGroup}>
                    <rect ref={this.background} class="TapeBackground" height="101.8" width="5.5404" y="29.92" x="151.84" />
                    <VSpeedTcasZone
                        ref={this.redZoneElement}
                        zoneBoundLow={this.redZone}
                        zoneBoundHigh={this.redZoneHigh}
                        zoneClass="Fill Red"
                        isCorrective={this.isCorrective}
                        extended={Subject.create(false)}
                    />
                    <VSpeedTcasZone
                        ref={this.greenZoneElement}
                        zoneBoundLow={this.greenZone}
                        zoneBoundHigh={this.greenZoneHigh}
                        zoneClass="Fill Green"
                        extended={this.extended}
                        isCorrective={this.isCorrective}
                    />
                </g>
                <g id="VerticalSpeedTCASGroupNonCorrective" ref={this.nonCorrective}>
                    <VSpeedTcasZone
                        zoneBoundLow={this.redZone}
                        zoneBoundHigh={this.redZoneHigh}
                        zoneClass="Fill Red"
                        extended={Subject.create(false)}
                        isCorrective={Subject.create(false)}
                    />
                </g>
            </>
        );
    }
}

interface VSpeedTcasZoneProps extends ComponentProps {
    zoneBoundLow: Subscribable<number>;
    zoneBoundHigh: Subscribable<number>;
    zoneClass: string;
    isCorrective: Subscribable<boolean>;
    extended: Subscribable<boolean>;
}
class VSpeedTcasZone extends DisplayComponent<VSpeedTcasZoneProps> {
    private zoneUpper =0;

    private zoneLower = 0;

    private extended =false;

    private isCorrective = false;

    private path = FSComponent.createRef<SVGPathElement>();

    private getYoffset = (VSpeed: number) => {
        const absVSpeed = Math.abs(VSpeed);
        const sign = Math.sign(VSpeed);

        if (absVSpeed < 1000) {
            return VSpeed / 1000 * -27.22;
        }
        if (absVSpeed < 2000) {
            return (VSpeed - sign * 1000) / 1000 * -10.1 - sign * 27.22;
        }
        if (absVSpeed < 6000) {
            return (VSpeed - sign * 2000) / 4000 * -10.1 - sign * 37.32;
        }
        return sign * -47.37;
    };

    private drawTcasZone() {
        if (this.zoneLower !== -1 && this.zoneUpper !== -1) {
            let y1;
            let y2;
            let y3;
            let y4;

            if (this.zoneLower >= 6000) {
                y1 = 29.92;
            } else if (this.zoneLower <= -6000) {
                y1 = 131.72;
            } else {
                y1 = 80.822 + this.getYoffset(this.zoneLower);
            }

            if (this.zoneUpper >= 6000) {
                y2 = 29.92;
            } else if (this.zoneUpper <= -6000) {
                y2 = 131.72;
            } else {
                y2 = 80.822 + this.getYoffset(this.zoneUpper);
            }

            if ((Math.abs(this.zoneUpper) > 1750 && Math.abs(this.zoneUpper) > Math.abs(this.zoneLower))
                || (this.isCorrective && this.props.zoneClass === 'Fill Red')) {
                y3 = y2;
            } else {
                // y3 = 80.822 + getYoffset(zoneBounds[1] / 2);
                y3 = 80.822;
            }

            if (Math.abs(this.zoneLower) > 1750 && Math.abs(this.zoneLower) > Math.abs(this.zoneUpper)
                || (this.isCorrective && this.props.zoneClass === 'Fill Red')) {
                y4 = y1;
            } else {
                // y4 = 80.822 + getYoffset(zoneBounds[0] / 2);
                y4 = 80.822;
            }

            const x1 = 151.84;
            const x2 = this.extended ? 162.74 : 157.3804;

            this.path.instance.setAttribute('d', `m${x1},${y1} L${x1},${y2} L${x2},${y3} L${x2},${y4} L${x1},${y1}z`);
        }
    }

    onAfterRender(node: VNode): void {
        super.onAfterRender(node);

        this.props.zoneBoundLow.sub((z) => {
            this.zoneLower = z;
            this.drawTcasZone();
        });

        this.props.zoneBoundHigh.sub((z) => {
            this.zoneUpper = z;
            this.drawTcasZone();
        });

        this.props.extended.sub((z) => {
            this.extended = z;
            this.drawTcasZone();
        });

        this.props.isCorrective.sub((z) => {
            this.isCorrective = z;
            this.drawTcasZone();
        });
    }

    render(): VNode {
        return (
            <path ref={this.path} class={this.props.zoneClass} />
        );
    }
}
