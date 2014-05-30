var _ = require('underscore');

var	defaults = {
		cookie: {
			name: 'ab'
		}
	};

var ERRORS = {
	MISSING_NAME: ".test() requires first parameter 'name' (type string)"
};

function ab(opts) {
	defaults = _.defaults(opts || {}, defaults);
	return ab;
}

ab.test = function (testName, opts) {
	if (!_.isString(testName)) throw ERRORS.MISSING_NAME;

	var test = {},
		options = _.defaults(opts || {}, defaults);

	return function (variant) {
		variant = variant || Object.keys(test).length;
		test[variant] = 0;

		return function (req, res, next) {
			var	current = test[variant],
				skip;

			if (options.cookie) {
				var cookie = JSON.parse(req.cookies.get(options.cookie.name) || JSON.stringify({})),
					assigned = cookie[testName];

				if (!_.isUndefined(assigned)) return assigned === variant ? next() : next('route');

				cookie[testName] = variant;
				req.cookies.set(options.cookie.name, JSON.stringify(cookie));
			}

			skip = Object.keys(test).some(function (index) {
				return test[index] < current;
			});
			if (skip) return next('route');

			test[variant]++;
			next();
		};
	};
};

module.exports = ab;