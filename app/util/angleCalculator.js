export default class AngleCalculator {
    constructor(startingPosition, maxDelta) {
        this.startingPosition = startingPosition;
        this.maxDelta = maxDelta ? maxDelta : 360;
    }

    getZeroFromStartingPosition() {
        return 360 - ((this.startingPosition.alpha + this.startingPosition.gamma) % 360);
    }

    getDistanceFromStartingPoint(newAlpha, newGamma) {
        return (((newAlpha + newGamma) % 360) + this.getZeroFromStartingPosition()) % 360;
    }

    getAbsoluteDistanceFromStartingPoint(newAlpha, newGamma) {
        let distance = this.getDistanceFromStartingPoint(newAlpha, newGamma);
        let direction = -1;
        if (distance >= 180) {
            direction = 1;
            distance = 360 - distance;
        }
        return { distance, direction };
    }

    getValidAbsoluteDistanceFromStartingPoint(newAlpha, newGamma) {
        let absoluteDistance = this.getAbsoluteDistanceFromStartingPoint(newAlpha, newGamma);
        if (absoluteDistance.distance > this.maxDelta) {
            absoluteDistance.distance = this.maxDelta;
        }
        return absoluteDistance;
    }
};