import { CruisePathBuilder } from '@fmgc/guidance/vnav/cruise/CruisePathBuilder';
import { DescentPathBuilder } from '@fmgc/guidance/vnav/descent/DescentPathBuilder';
import { NavGeometryProfile, VerticalCheckpointReason } from '@fmgc/guidance/vnav/profile/NavGeometryProfile';
import { ClimbStrategy } from '@fmgc/guidance/vnav/climb/ClimbStrategy';
import { DescentStrategy } from '@fmgc/guidance/vnav/descent/DescentStrategy';
import { ApproachPathBuilder } from '@fmgc/guidance/vnav/descent/ApproachPathBuilder';
import { SpeedProfile } from '@fmgc/guidance/vnav/climb/SpeedProfile';

export class CruiseToDescentCoordinator {
    private lastEstimatedFuelAtDestination: Pounds = 2300;

    private lastEstimatedTimeAtDestination: Seconds = 0;

    constructor(private cruisePathBuilder: CruisePathBuilder, private descentPathBuilder: DescentPathBuilder, private approachPathBuilder: ApproachPathBuilder) {

    }

    resetEstimations() {
        this.lastEstimatedFuelAtDestination = 2300;
        this.lastEstimatedTimeAtDestination = 0;
    }

    buildCruiseAndDescentPath(profile: NavGeometryProfile, speedProfile: SpeedProfile, stepClimbStrategy: ClimbStrategy, stepDescentStrategy: DescentStrategy) {
        // - Start with initial guess for fuel on board at destination
        // - Compute descent profile to get distance to T/D and burnt fuel during descent
        // - Compute cruise profile to T/D -> guess new guess for fuel at start T/D, use fuel burn to get new estimate for fuel at destination
        // - Repeat
        const topOfClimbIndex = profile.checkpoints.findIndex((checkpoint) => checkpoint.reason === VerticalCheckpointReason.TopOfClimb);
        const presentPositionIndex = profile.checkpoints.findIndex((checkpoint) => checkpoint.reason === VerticalCheckpointReason.PresentPosition);

        const startOfCruiseIndex = topOfClimbIndex >= 0 ? topOfClimbIndex : presentPositionIndex;
        const startOfCruiseCheckpoint = profile.checkpoints[startOfCruiseIndex];

        if (startOfCruiseIndex < 0) {
            return;
        }

        let iterationCount = 0;
        let todFuelError = Infinity;
        let todTimeError = Infinity;

        if (Number.isNaN(this.lastEstimatedFuelAtDestination) || Number.isNaN(this.lastEstimatedTimeAtDestination)) {
            this.resetEstimations();
        }

        while (iterationCount++ < 4 && (Math.abs(todFuelError) > 100 || Math.abs(todTimeError) > 1)) {
            // Reset checkpoints
            profile.checkpoints.splice(startOfCruiseIndex + 1, profile.checkpoints.length - startOfCruiseIndex - 1);
            this.approachPathBuilder.computeApproachPath(profile, speedProfile, this.lastEstimatedFuelAtDestination, this.lastEstimatedTimeAtDestination);

            // Geometric and idle
            const todCheckpoint = this.descentPathBuilder.computeManagedDescentPath(profile, speedProfile, this.cruisePathBuilder.getFinalCruiseAltitude());
            if (todCheckpoint.distanceFromStart < startOfCruiseCheckpoint.distanceFromStart) {
                // T/D Reached
                return;
            }

            const cruisePath = this.cruisePathBuilder.computeCruisePath(profile, stepClimbStrategy, stepDescentStrategy, speedProfile);

            if (!cruisePath || !todCheckpoint) {
                throw new Error('[FMS/VNAV] Could not coordinate cruise and descent path');
            }

            todFuelError = cruisePath.remainingFuelOnBoardAtTopOfDescent - todCheckpoint.remainingFuelOnBoard;
            todTimeError = cruisePath.secondsFromPresentAtTopOfDescent - todCheckpoint.secondsFromPresent;

            this.lastEstimatedFuelAtDestination += todFuelError;
            this.lastEstimatedTimeAtDestination += todTimeError;
        }
    }

    canCompute(profile: NavGeometryProfile) {
        return this.approachPathBuilder?.canCompute(profile);
    }
}
