// ../../node_modules/.pnpm/style-mod@4.0.3/node_modules/style-mod/src/style-mod.js
var C = 'ͼ';
var COUNT = typeof Symbol == 'undefined' ? '__' + C : Symbol.for(C);
var SET = typeof Symbol == 'undefined' ? '__styleSet' + Math.floor(Math.random() * 1e8) : Symbol('styleSet');
var top = typeof globalThis != 'undefined' ? globalThis : typeof window != 'undefined' ? window : {};
var StyleModule = class {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(spec, options) {
    this.rules = [];
    let { finish } = options || {};
    function splitSelector(selector) {
      return /^@/.test(selector) ? [selector] : selector.split(/,\s*/);
    }
    function render(selectors, spec2, target, isKeyframes) {
      let local = [],
        isAt = /^@(\w+)\b/.exec(selectors[0]),
        keyframes = isAt && isAt[1] == 'keyframes';
      if (isAt && spec2 == null) return target.push(selectors[0] + ';');
      for (let prop in spec2) {
        let value = spec2[prop];
        if (/&/.test(prop)) {
          render(
            prop
              .split(/,\s*/)
              .map((part) => selectors.map((sel) => part.replace(/&/, sel)))
              .reduce((a, b) => a.concat(b)),
            value,
            target,
          );
        } else if (value && typeof value == 'object') {
          if (!isAt) throw new RangeError('The value of a property (' + prop + ') should be a primitive value.');
          render(splitSelector(prop), value, local, keyframes);
        } else if (value != null) {
          local.push(prop.replace(/_.*/, '').replace(/[A-Z]/g, (l) => '-' + l.toLowerCase()) + ': ' + value + ';');
        }
      }
      if (local.length || keyframes) {
        target.push(
          (finish && !isAt && !isKeyframes ? selectors.map(finish) : selectors).join(', ') +
            ' {' +
            local.join(' ') +
            '}',
        );
      }
    }
    for (let prop in spec) render(splitSelector(prop), spec[prop], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join('\n');
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let id = top[COUNT] || 1;
    top[COUNT] = id + 1;
    return C + id.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>)
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  static mount(root, modules) {
    (root[SET] || new StyleSet(root)).mount(Array.isArray(modules) ? modules : [modules]);
  }
};
var adoptedSet = /* @__PURE__ */ new Map();
var StyleSet = class {
  constructor(root) {
    let doc = root.ownerDocument || root,
      win = doc.defaultView;
    if (!root.head && root.adoptedStyleSheets && win.CSSStyleSheet) {
      let adopted = adoptedSet.get(doc);
      if (adopted) {
        root.adoptedStyleSheets = [adopted.sheet, ...root.adoptedStyleSheets];
        return (root[SET] = adopted);
      }
      this.sheet = new win.CSSStyleSheet();
      root.adoptedStyleSheets = [this.sheet, ...root.adoptedStyleSheets];
      adoptedSet.set(doc, this);
    } else {
      this.styleTag = doc.createElement('style');
      let target = root.head || root;
      target.insertBefore(this.styleTag, target.firstChild);
    }
    this.modules = [];
    root[SET] = this;
  }
  mount(modules) {
    let sheet = this.sheet;
    let pos = 0,
      j = 0;
    for (let i = 0; i < modules.length; i++) {
      let mod = modules[i],
        index = this.modules.indexOf(mod);
      if (index < j && index > -1) {
        this.modules.splice(index, 1);
        j--;
        index = -1;
      }
      if (index == -1) {
        this.modules.splice(j++, 0, mod);
        if (sheet) for (let k = 0; k < mod.rules.length; k++) sheet.insertRule(mod.rules[k], pos++);
      } else {
        while (j < index) pos += this.modules[j++].rules.length;
        pos += mod.rules.length;
        j++;
      }
    }
    if (!sheet) {
      let text = '';
      for (let i = 0; i < this.modules.length; i++) text += this.modules[i].getRules() + '\n';
      this.styleTag.textContent = text;
    }
  }
};

// ../../node_modules/.pnpm/w3c-keyname@2.2.8/node_modules/w3c-keyname/index.js
var base = {
  8: 'Backspace',
  9: 'Tab',
  10: 'Enter',
  12: 'NumLock',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  44: 'PrintScreen',
  45: 'Insert',
  46: 'Delete',
  59: ';',
  61: '=',
  91: 'Meta',
  92: 'Meta',
  106: '*',
  107: '+',
  108: ',',
  109: '-',
  110: '.',
  111: '/',
  144: 'NumLock',
  145: 'ScrollLock',
  160: 'Shift',
  161: 'Shift',
  162: 'Control',
  163: 'Control',
  164: 'Alt',
  165: 'Alt',
  173: '-',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'",
};
var shift = {
  48: ')',
  49: '!',
  50: '@',
  51: '#',
  52: '$',
  53: '%',
  54: '^',
  55: '&',
  56: '*',
  57: '(',
  59: ':',
  61: '+',
  173: '_',
  186: ':',
  187: '+',
  188: '<',
  189: '_',
  190: '>',
  191: '?',
  192: '~',
  219: '{',
  220: '|',
  221: '}',
  222: '"',
};
var mac = typeof navigator != 'undefined' && /Mac/.test(navigator.platform);
var ie = typeof navigator != 'undefined' && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (i = 0; i < 10; i++) base[48 + i] = base[96 + i] = String(i);
var i;
for (i = 1; i <= 24; i++) base[i + 111] = 'F' + i;
var i;
for (i = 65; i <= 90; i++) {
  base[i] = String.fromCharCode(i + 32);
  shift[i] = String.fromCharCode(i);
}
var i;
for (code in base) if (!shift.hasOwnProperty(code)) shift[code] = base[code];
var code;
function keyName(event) {
  var ignoreKey =
    (mac && event.metaKey && event.shiftKey && !event.ctrlKey && !event.altKey) ||
    (ie && event.shiftKey && event.key && event.key.length == 1) ||
    event.key == 'Unidentified';
  var name = (!ignoreKey && event.key) || (event.shiftKey ? shift : base)[event.keyCode] || event.key || 'Unidentified';
  if (name == 'Esc') name = 'Escape';
  if (name == 'Del') name = 'Delete';
  if (name == 'Left') name = 'ArrowLeft';
  if (name == 'Up') name = 'ArrowUp';
  if (name == 'Right') name = 'ArrowRight';
  if (name == 'Down') name = 'ArrowDown';
  return name;
}

export { StyleModule, base, shift, keyName };
//# sourceMappingURL=chunk-MHTA6FMV.js.map
