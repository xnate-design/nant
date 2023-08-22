import { __commonJS } from './chunk-UXIASGQL.js';

// ../../node_modules/.pnpm/parse-numeric-range@1.3.0/node_modules/parse-numeric-range/index.js
var require_parse_numeric_range = __commonJS({
  '../../node_modules/.pnpm/parse-numeric-range@1.3.0/node_modules/parse-numeric-range/index.js'(exports, module) {
    function parsePart(string) {
      let res = [];
      let m;
      for (let str of string.split(',').map((str2) => str2.trim())) {
        if (/^-?\d+$/.test(str)) {
          res.push(parseInt(str, 10));
        } else if ((m = str.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/))) {
          let [_, lhs, sep, rhs] = m;
          if (lhs && rhs) {
            lhs = parseInt(lhs);
            rhs = parseInt(rhs);
            const incr = lhs < rhs ? 1 : -1;
            if (sep === '-' || sep === '..' || sep === '‥') rhs += incr;
            for (let i = lhs; i !== rhs; i += incr) res.push(i);
          }
        }
      }
      return res;
    }
    exports.default = parsePart;
    module.exports = parsePart;
  },
});
export default require_parse_numeric_range();
//# sourceMappingURL=parse-numeric-range.js.map
