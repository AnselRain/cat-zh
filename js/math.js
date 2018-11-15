/**
 * Math class. Introduced to put all math-heavy stuff in single place.
 */
dojo.declare("com.nuclearunicorn.game.Math", null, {
    constructor: function() {
    },

    uniformRandomInteger: function(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    },

    standardGaussianRandom: function() {
        // Box-Muller transform method
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();

        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    irwinHallRandom: function(count) {
        // Irwin-Hall distribution is sum of a number of independent random uniformly distributed variables with
        // mean = count / 2 and deviation = count / 12.
        // If count is high enough, it can be approximated with gaussian distribution.
        // Otherwise just use old good loop to give more stable results, which is also good more majority of players.

        const approximationBound = 1000;
        if (count > approximationBound) {
            const sum = this.standardGaussianRandom() * count / 12 + count / 2;

            // There is small chance that gaussian number will be outside the range, resample in such case.
            if (sum < 0 || sum > count) {
                return this.irwinHallRandom(count);
            }

            return sum;
        }

        let sum = 0;
        for (let i = 0; i < count; ++ i) {
            sum += Math.random();
        }

        return sum;
    },

    binominalRandomInteger: function(experiments, probability) {
        if (probability >= 1) {
            return experiments;
        }
        else if (probability <= 0) {
            return 0;
        }

        // Binominal distribution can be approximated by gaussian if condition below is met.
        // Otherwise just use old good loop.
        const failureProbability = 1 - probability;
        if ((experiments > 9 * failureProbability / probability) &&
            (experiments > 9 * probability / failureProbability))
        {
            const mean = experiments * probability;
            const deviation = experiments * probability * failureProbability;
            const successNumber = this.standardGaussianRandom() * deviation + mean;

            // There is small chance that gaussian number will be outside the range, resample in such case.
            if (successNumber < 0 || successNumber > experiments) {
                return this.binominalRandomInteger(experiments, probability);
            }

            return Math.floor(successNumber);
        }

        let successes = 0;
        for (let i = 0; i < experiments; ++i) {
            if (Math.random() < probability) {
                ++successes;
            }
        }

        return successes;
    }
})