if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			throw new Error('what r u doing now')
		}
		var args = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function() {},
			fBound = function() {
				return fToBind.apply(this instanceof fNOP ? this : oThis,
					args.concat(Array.prototype.slice.call(arguments)));
			};
		//Function.prototype doesn't hava a prototype  property d
		if (this.prototype) {
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();
		return fBound
	}
}