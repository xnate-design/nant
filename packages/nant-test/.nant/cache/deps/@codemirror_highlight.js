import { StyleModule, base, keyName } from './chunk-MHTA6FMV.js';
import './chunk-UXIASGQL.js';

// ../../node_modules/.pnpm/@lezer+common@0.15.12/node_modules/@lezer/common/dist/index.js
var DefaultBufferLength = 1024;
var nextPropID = 0;
var Range = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
};
var NodeProp = class {
  /// Create a new node prop type.
  constructor(config = {}) {
    this.id = nextPropID++;
    this.perNode = !!config.perNode;
    this.deserialize =
      config.deserialize ||
      (() => {
        throw new Error("This node type doesn't define a deserialize function");
      });
  }
  /// This is meant to be used with
  /// [`NodeSet.extend`](#common.NodeSet.extend) or
  /// [`LRParser.configure`](#lr.ParserConfig.props) to compute
  /// prop values for each node type in the set. Takes a [match
  /// object](#common.NodeType^match) or function that returns undefined
  /// if the node type doesn't get this prop, and the prop's value if
  /// it does.
  add(match) {
    if (this.perNode) throw new RangeError("Can't add per-node props to node types");
    if (typeof match != 'function') match = NodeType.match(match);
    return (type) => {
      let result = match(type);
      return result === void 0 ? null : [this, result];
    };
  }
};
NodeProp.closedBy = new NodeProp({ deserialize: (str) => str.split(' ') });
NodeProp.openedBy = new NodeProp({ deserialize: (str) => str.split(' ') });
NodeProp.group = new NodeProp({ deserialize: (str) => str.split(' ') });
NodeProp.contextHash = new NodeProp({ perNode: true });
NodeProp.lookAhead = new NodeProp({ perNode: true });
NodeProp.mounted = new NodeProp({ perNode: true });
var noProps = /* @__PURE__ */ Object.create(null);
var NodeType = class _NodeType {
  /// @internal
  constructor(name2, props, id, flags = 0) {
    this.name = name2;
    this.props = props;
    this.id = id;
    this.flags = flags;
  }
  static define(spec) {
    let props = spec.props && spec.props.length ? /* @__PURE__ */ Object.create(null) : noProps;
    let flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (spec.name == null ? 8 : 0);
    let type = new _NodeType(spec.name || '', props, spec.id, flags);
    if (spec.props)
      for (let src of spec.props) {
        if (!Array.isArray(src)) src = src(type);
        if (src) {
          if (src[0].perNode) throw new RangeError("Can't store a per-node prop on a node type");
          props[src[0].id] = src[1];
        }
      }
    return type;
  }
  /// Retrieves a node prop for this type. Will return `undefined` if
  /// the prop isn't present on this node.
  prop(prop) {
    return this.props[prop.id];
  }
  /// True when this is the top node of a grammar.
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /// True when this node is produced by a skip rule.
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /// Indicates whether this is an error node.
  get isError() {
    return (this.flags & 4) > 0;
  }
  /// When true, this node type doesn't correspond to a user-declared
  /// named node, for example because it is used to cache repetition.
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /// Returns true when this node's name or one of its
  /// [groups](#common.NodeProp^group) matches the given string.
  is(name2) {
    if (typeof name2 == 'string') {
      if (this.name == name2) return true;
      let group = this.prop(NodeProp.group);
      return group ? group.indexOf(name2) > -1 : false;
    }
    return this.id == name2;
  }
  /// Create a function from node types to arbitrary values by
  /// specifying an object whose property names are node or
  /// [group](#common.NodeProp^group) names. Often useful with
  /// [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  /// names, separated by spaces, in a single property name to map
  /// multiple node names to a single value.
  static match(map) {
    let direct = /* @__PURE__ */ Object.create(null);
    for (let prop in map) for (let name2 of prop.split(' ')) direct[name2] = map[prop];
    return (node) => {
      for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
        let found = direct[i < 0 ? node.name : groups[i]];
        if (found) return found;
      }
    };
  }
};
NodeType.none = new NodeType(
  '',
  /* @__PURE__ */ Object.create(null),
  0,
  8,
  /* Anonymous */
);
var CachedNode = /* @__PURE__ */ new WeakMap();
var CachedInnerNode = /* @__PURE__ */ new WeakMap();
var Tree = class _Tree {
  /// Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  constructor(type, children, positions, length, props) {
    this.type = type;
    this.children = children;
    this.positions = positions;
    this.length = length;
    this.props = null;
    if (props && props.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [prop, value] of props) this.props[typeof prop == 'number' ? prop : prop.id] = value;
    }
  }
  /// @internal
  toString() {
    let mounted = this.prop(NodeProp.mounted);
    if (mounted && !mounted.overlay) return mounted.tree.toString();
    let children = '';
    for (let ch of this.children) {
      let str = ch.toString();
      if (str) {
        if (children) children += ',';
        children += str;
      }
    }
    return !this.type.name
      ? children
      : (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) +
          (children.length ? '(' + children + ')' : '');
  }
  /// Get a [tree cursor](#common.TreeCursor) rooted at this tree. When
  /// `pos` is given, the cursor is [moved](#common.TreeCursor.moveTo)
  /// to the given position and side.
  cursor(pos, side = 0) {
    let scope = (pos != null && CachedNode.get(this)) || this.topNode;
    let cursor = new TreeCursor(scope);
    if (pos != null) {
      cursor.moveTo(pos, side);
      CachedNode.set(this, cursor._tree);
    }
    return cursor;
  }
  /// Get a [tree cursor](#common.TreeCursor) that, unlike regular
  /// cursors, doesn't skip through
  /// [anonymous](#common.NodeType.isAnonymous) nodes and doesn't
  /// automatically enter mounted nodes.
  fullCursor() {
    return new TreeCursor(
      this.topNode,
      1,
      /* Full */
    );
  }
  /// Get a [syntax node](#common.SyntaxNode) object for the top of the
  /// tree.
  get topNode() {
    return new TreeNode(this, 0, 0, null);
  }
  /// Get the [syntax node](#common.SyntaxNode) at the given position.
  /// If `side` is -1, this will move into nodes that end at the
  /// position. If 1, it'll move into nodes that start at the
  /// position. With 0, it'll only enter nodes that cover the position
  /// from both sides.
  resolve(pos, side = 0) {
    let node = resolveNode(CachedNode.get(this) || this.topNode, pos, side, false);
    CachedNode.set(this, node);
    return node;
  }
  /// Like [`resolve`](#common.Tree.resolve), but will enter
  /// [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  /// pointing into the innermost overlaid tree at the given position
  /// (with parent links going through all parent structure, including
  /// the host trees).
  resolveInner(pos, side = 0) {
    let node = resolveNode(CachedInnerNode.get(this) || this.topNode, pos, side, true);
    CachedInnerNode.set(this, node);
    return node;
  }
  /// Iterate over the tree and its children, calling `enter` for any
  /// node that touches the `from`/`to` region (if given) before
  /// running over such a node's children, and `leave` (if given) when
  /// leaving the node. When `enter` returns `false`, that node will
  /// not have its children iterated over (or `leave` called).
  iterate(spec) {
    let { enter, leave, from = 0, to = this.length } = spec;
    for (let c = this.cursor(), get = () => c.node; ; ) {
      let mustLeave = false;
      if (c.from <= to && c.to >= from && (c.type.isAnonymous || enter(c.type, c.from, c.to, get) !== false)) {
        if (c.firstChild()) continue;
        if (!c.type.isAnonymous) mustLeave = true;
      }
      for (;;) {
        if (mustLeave && leave) leave(c.type, c.from, c.to, get);
        mustLeave = c.type.isAnonymous;
        if (c.nextSibling()) break;
        if (!c.parent()) return;
        mustLeave = true;
      }
    }
  }
  /// Get the value of the given [node prop](#common.NodeProp) for this
  /// node. Works with both per-node and per-type props.
  prop(prop) {
    return !prop.perNode ? this.type.prop(prop) : this.props ? this.props[prop.id] : void 0;
  }
  /// Returns the node's [per-node props](#common.NodeProp.perNode) in a
  /// format that can be passed to the [`Tree`](#common.Tree)
  /// constructor.
  get propValues() {
    let result = [];
    if (this.props) for (let id in this.props) result.push([+id, this.props[id]]);
    return result;
  }
  /// Balance the direct children of this tree, producing a copy of
  /// which may have children grouped into subtrees with type
  /// [`NodeType.none`](#common.NodeType^none).
  balance(config = {}) {
    return this.children.length <= 8
      ? this
      : balanceRange(
          NodeType.none,
          this.children,
          this.positions,
          0,
          this.children.length,
          0,
          this.length,
          (children, positions, length) => new _Tree(this.type, children, positions, length, this.propValues),
          config.makeTree || ((children, positions, length) => new _Tree(NodeType.none, children, positions, length)),
        );
  }
  /// Build a tree from a postfix-ordered buffer of node information,
  /// or a cursor over such a buffer.
  static build(data) {
    return buildTree(data);
  }
};
Tree.empty = new Tree(NodeType.none, [], [], 0);
var FlatBufferCursor = class _FlatBufferCursor {
  constructor(buffer, index) {
    this.buffer = buffer;
    this.index = index;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new _FlatBufferCursor(this.buffer, this.index);
  }
};
var TreeBuffer = class _TreeBuffer {
  /// Create a tree buffer.
  constructor(buffer, length, set) {
    this.buffer = buffer;
    this.length = length;
    this.set = set;
  }
  /// @internal
  get type() {
    return NodeType.none;
  }
  /// @internal
  toString() {
    let result = [];
    for (let index = 0; index < this.buffer.length; ) {
      result.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result.join(',');
  }
  /// @internal
  childString(index) {
    let id = this.buffer[index],
      endIndex = this.buffer[index + 3];
    let type = this.set.types[id],
      result = type.name;
    if (/\W/.test(result) && !type.isError) result = JSON.stringify(result);
    index += 4;
    if (endIndex == index) return result;
    let children = [];
    while (index < endIndex) {
      children.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result + '(' + children.join(',') + ')';
  }
  /// @internal
  findChild(startIndex, endIndex, dir, pos, side) {
    let { buffer } = this,
      pick = -1;
    for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
      if (checkSide(side, pos, buffer[i + 1], buffer[i + 2])) {
        pick = i;
        if (dir > 0) break;
      }
    }
    return pick;
  }
  /// @internal
  slice(startI, endI, from, to) {
    let b = this.buffer;
    let copy = new Uint16Array(endI - startI);
    for (let i = startI, j = 0; i < endI; ) {
      copy[j++] = b[i++];
      copy[j++] = b[i++] - from;
      copy[j++] = b[i++] - from;
      copy[j++] = b[i++] - startI;
    }
    return new _TreeBuffer(copy, to - from, this.set);
  }
};
function checkSide(side, pos, from, to) {
  switch (side) {
    case -2:
      return from < pos;
    case -1:
      return to >= pos && from < pos;
    case 0:
      return from < pos && to > pos;
    case 1:
      return from <= pos && to > pos;
    case 2:
      return to > pos;
    case 4:
      return true;
  }
}
function enterUnfinishedNodesBefore(node, pos) {
  let scan = node.childBefore(pos);
  while (scan) {
    let last = scan.lastChild;
    if (!last || last.to != scan.to) break;
    if (last.type.isError && last.from == last.to) {
      node = scan;
      scan = last.prevSibling;
    } else {
      scan = last;
    }
  }
  return node;
}
function resolveNode(node, pos, side, overlays) {
  var _a2;
  while (
    node.from == node.to ||
    (side < 1 ? node.from >= pos : node.from > pos) ||
    (side > -1 ? node.to <= pos : node.to < pos)
  ) {
    let parent = !overlays && node instanceof TreeNode && node.index < 0 ? null : node.parent;
    if (!parent) return node;
    node = parent;
  }
  if (overlays)
    for (let scan = node, parent = scan.parent; parent; scan = parent, parent = scan.parent) {
      if (
        scan instanceof TreeNode &&
        scan.index < 0 &&
        ((_a2 = parent.enter(pos, side, true)) === null || _a2 === void 0 ? void 0 : _a2.from) != scan.from
      )
        node = parent;
    }
  for (;;) {
    let inner = node.enter(pos, side, overlays);
    if (!inner) return node;
    node = inner;
  }
}
var TreeNode = class _TreeNode {
  constructor(node, _from, index, _parent) {
    this.node = node;
    this._from = _from;
    this.index = index;
    this._parent = _parent;
  }
  get type() {
    return this.node.type;
  }
  get name() {
    return this.node.type.name;
  }
  get from() {
    return this._from;
  }
  get to() {
    return this._from + this.node.length;
  }
  nextChild(i, dir, pos, side, mode = 0) {
    for (let parent = this; ; ) {
      for (let { children, positions } = parent.node, e = dir > 0 ? children.length : -1; i != e; i += dir) {
        let next = children[i],
          start = positions[i] + parent._from;
        if (!checkSide(side, pos, start, start + next.length)) continue;
        if (next instanceof TreeBuffer) {
          if (mode & 2) continue;
          let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
          if (index > -1) return new BufferNode(new BufferContext(parent, next, i, start), null, index);
        } else if (mode & 1 || !next.type.isAnonymous || hasChild(next)) {
          let mounted;
          if (!(mode & 1) && next.props && (mounted = next.prop(NodeProp.mounted)) && !mounted.overlay)
            return new _TreeNode(mounted.tree, start, i, parent);
          let inner = new _TreeNode(next, start, i, parent);
          return mode & 1 || !inner.type.isAnonymous
            ? inner
            : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side);
        }
      }
      if (mode & 1 || !parent.type.isAnonymous) return null;
      if (parent.index >= 0) i = parent.index + dir;
      else i = dir < 0 ? -1 : parent._parent.node.children.length;
      parent = parent._parent;
      if (!parent) return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4,
      /* DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this.node.children.length - 1,
      -1,
      0,
      4,
      /* DontCare */
    );
  }
  childAfter(pos) {
    return this.nextChild(
      0,
      1,
      pos,
      2,
      /* After */
    );
  }
  childBefore(pos) {
    return this.nextChild(
      this.node.children.length - 1,
      -1,
      pos,
      -2,
      /* Before */
    );
  }
  enter(pos, side, overlays = true, buffers = true) {
    let mounted;
    if (overlays && (mounted = this.node.prop(NodeProp.mounted)) && mounted.overlay) {
      let rPos = pos - this.from;
      for (let { from, to } of mounted.overlay) {
        if ((side > 0 ? from <= rPos : from < rPos) && (side < 0 ? to >= rPos : to > rPos))
          return new _TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
      }
    }
    return this.nextChild(
      0,
      1,
      pos,
      side,
      buffers ? 0 : 2,
      /* NoEnterBuffer */
    );
  }
  nextSignificantParent() {
    let val = this;
    while (val.type.isAnonymous && val._parent) val = val._parent;
    return val;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0
      ? this._parent.nextChild(
          this.index + 1,
          1,
          0,
          4,
          /* DontCare */
        )
      : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0
      ? this._parent.nextChild(
          this.index - 1,
          -1,
          0,
          4,
          /* DontCare */
        )
      : null;
  }
  get cursor() {
    return new TreeCursor(this);
  }
  get tree() {
    return this.node;
  }
  toTree() {
    return this.node;
  }
  resolve(pos, side = 0) {
    return resolveNode(this, pos, side, false);
  }
  resolveInner(pos, side = 0) {
    return resolveNode(this, pos, side, true);
  }
  enterUnfinishedNodesBefore(pos) {
    return enterUnfinishedNodesBefore(this, pos);
  }
  getChild(type, before = null, after = null) {
    let r = getChildren(this, type, before, after);
    return r.length ? r[0] : null;
  }
  getChildren(type, before = null, after = null) {
    return getChildren(this, type, before, after);
  }
  /// @internal
  toString() {
    return this.node.toString();
  }
};
function getChildren(node, type, before, after) {
  let cur = node.cursor,
    result = [];
  if (!cur.firstChild()) return result;
  if (before != null) {
    while (!cur.type.is(before)) if (!cur.nextSibling()) return result;
  }
  for (;;) {
    if (after != null && cur.type.is(after)) return result;
    if (cur.type.is(type)) result.push(cur.node);
    if (!cur.nextSibling()) return after == null ? result : [];
  }
}
var BufferContext = class {
  constructor(parent, buffer, index, start) {
    this.parent = parent;
    this.buffer = buffer;
    this.index = index;
    this.start = start;
  }
};
var BufferNode = class _BufferNode {
  constructor(context, _parent, index) {
    this.context = context;
    this._parent = _parent;
    this.index = index;
    this.type = context.buffer.set.types[context.buffer.buffer[index]];
  }
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  child(dir, pos, side) {
    let { buffer } = this.context;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
    return index < 0 ? null : new _BufferNode(this.context, this, index);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4,
      /* DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4,
      /* DontCare */
    );
  }
  childAfter(pos) {
    return this.child(
      1,
      pos,
      2,
      /* After */
    );
  }
  childBefore(pos) {
    return this.child(
      -1,
      pos,
      -2,
      /* Before */
    );
  }
  enter(pos, side, overlays, buffers = true) {
    if (!buffers) return null;
    let { buffer } = this.context;
    let index = buffer.findChild(
      this.index + 4,
      buffer.buffer[this.index + 3],
      side > 0 ? 1 : -1,
      pos - this.context.start,
      side,
    );
    return index < 0 ? null : new _BufferNode(this.context, this, index);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(dir) {
    return this._parent
      ? null
      : this.context.parent.nextChild(
          this.context.index + dir,
          dir,
          0,
          4,
          /* DontCare */
        );
  }
  get nextSibling() {
    let { buffer } = this.context;
    let after = buffer.buffer[this.index + 3];
    if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length))
      return new _BufferNode(this.context, this._parent, after);
    return this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer } = this.context;
    let parentStart = this._parent ? this._parent.index + 4 : 0;
    if (this.index == parentStart) return this.externalSibling(-1);
    return new _BufferNode(
      this.context,
      this._parent,
      buffer.findChild(
        parentStart,
        this.index,
        -1,
        0,
        4,
        /* DontCare */
      ),
    );
  }
  get cursor() {
    return new TreeCursor(this);
  }
  get tree() {
    return null;
  }
  toTree() {
    let children = [],
      positions = [];
    let { buffer } = this.context;
    let startI = this.index + 4,
      endI = buffer.buffer[this.index + 3];
    if (endI > startI) {
      let from = buffer.buffer[this.index + 1],
        to = buffer.buffer[this.index + 2];
      children.push(buffer.slice(startI, endI, from, to));
      positions.push(0);
    }
    return new Tree(this.type, children, positions, this.to - this.from);
  }
  resolve(pos, side = 0) {
    return resolveNode(this, pos, side, false);
  }
  resolveInner(pos, side = 0) {
    return resolveNode(this, pos, side, true);
  }
  enterUnfinishedNodesBefore(pos) {
    return enterUnfinishedNodesBefore(this, pos);
  }
  /// @internal
  toString() {
    return this.context.buffer.childString(this.index);
  }
  getChild(type, before = null, after = null) {
    let r = getChildren(this, type, before, after);
    return r.length ? r[0] : null;
  }
  getChildren(type, before = null, after = null) {
    return getChildren(this, type, before, after);
  }
};
var TreeCursor = class {
  /// @internal
  constructor(node, mode = 0) {
    this.mode = mode;
    this.buffer = null;
    this.stack = [];
    this.index = 0;
    this.bufferNode = null;
    if (node instanceof TreeNode) {
      this.yieldNode(node);
    } else {
      this._tree = node.context.parent;
      this.buffer = node.context;
      for (let n = node._parent; n; n = n._parent) this.stack.unshift(n.index);
      this.bufferNode = node;
      this.yieldBuf(node.index);
    }
  }
  /// Shorthand for `.type.name`.
  get name() {
    return this.type.name;
  }
  yieldNode(node) {
    if (!node) return false;
    this._tree = node;
    this.type = node.type;
    this.from = node.from;
    this.to = node.to;
    return true;
  }
  yieldBuf(index, type) {
    this.index = index;
    let { start, buffer } = this.buffer;
    this.type = type || buffer.set.types[buffer.buffer[index]];
    this.from = start + buffer.buffer[index + 1];
    this.to = start + buffer.buffer[index + 2];
    return true;
  }
  yield(node) {
    if (!node) return false;
    if (node instanceof TreeNode) {
      this.buffer = null;
      return this.yieldNode(node);
    }
    this.buffer = node.context;
    return this.yieldBuf(node.index, node.type);
  }
  /// @internal
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /// @internal
  enterChild(dir, pos, side) {
    if (!this.buffer)
      return this.yield(
        this._tree.nextChild(dir < 0 ? this._tree.node.children.length - 1 : 0, dir, pos, side, this.mode),
      );
    let { buffer } = this.buffer;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
    if (index < 0) return false;
    this.stack.push(this.index);
    return this.yieldBuf(index);
  }
  /// Move the cursor to this node's first child. When this returns
  /// false, the node has no child, and the cursor has not been moved.
  firstChild() {
    return this.enterChild(
      1,
      0,
      4,
      /* DontCare */
    );
  }
  /// Move the cursor to this node's last child.
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4,
      /* DontCare */
    );
  }
  /// Move the cursor to the first child that ends after `pos`.
  childAfter(pos) {
    return this.enterChild(
      1,
      pos,
      2,
      /* After */
    );
  }
  /// Move to the last child that starts before `pos`.
  childBefore(pos) {
    return this.enterChild(
      -1,
      pos,
      -2,
      /* Before */
    );
  }
  /// Move the cursor to the child around `pos`. If side is -1 the
  /// child may end at that position, when 1 it may start there. This
  /// will also enter [overlaid](#common.MountedTree.overlay)
  /// [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  /// set to false.
  enter(pos, side, overlays = true, buffers = true) {
    if (!this.buffer) return this.yield(this._tree.enter(pos, side, overlays && !(this.mode & 1), buffers));
    return buffers ? this.enterChild(1, pos, side) : false;
  }
  /// Move to the node's parent node, if this isn't the top node.
  parent() {
    if (!this.buffer) return this.yieldNode(this.mode & 1 ? this._tree._parent : this._tree.parent);
    if (this.stack.length) return this.yieldBuf(this.stack.pop());
    let parent = this.mode & 1 ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    this.buffer = null;
    return this.yieldNode(parent);
  }
  /// @internal
  sibling(dir) {
    if (!this.buffer)
      return !this._tree._parent
        ? false
        : this.yield(
            this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4, this.mode),
          );
    let { buffer } = this.buffer,
      d = this.stack.length - 1;
    if (dir < 0) {
      let parentStart = d < 0 ? 0 : this.stack[d] + 4;
      if (this.index != parentStart)
        return this.yieldBuf(
          buffer.findChild(
            parentStart,
            this.index,
            -1,
            0,
            4,
            /* DontCare */
          ),
        );
    } else {
      let after = buffer.buffer[this.index + 3];
      if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3])) return this.yieldBuf(after);
    }
    return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4, this.mode)) : false;
  }
  /// Move to this node's next sibling, if any.
  nextSibling() {
    return this.sibling(1);
  }
  /// Move to this node's previous sibling, if any.
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(dir) {
    let index,
      parent,
      { buffer } = this;
    if (buffer) {
      if (dir > 0) {
        if (this.index < buffer.buffer.buffer.length) return false;
      } else {
        for (let i = 0; i < this.index; i++) if (buffer.buffer.buffer[i + 3] < this.index) return false;
      }
      ({ index, parent } = buffer);
    } else {
      ({ index, _parent: parent } = this._tree);
    }
    for (; parent; { index, _parent: parent } = parent) {
      if (index > -1)
        for (let i = index + dir, e = dir < 0 ? -1 : parent.node.children.length; i != e; i += dir) {
          let child = parent.node.children[i];
          if (this.mode & 1 || child instanceof TreeBuffer || !child.type.isAnonymous || hasChild(child)) return false;
        }
    }
    return true;
  }
  move(dir, enter) {
    if (
      enter &&
      this.enterChild(
        dir,
        0,
        4,
        /* DontCare */
      )
    )
      return true;
    for (;;) {
      if (this.sibling(dir)) return true;
      if (this.atLastNode(dir) || !this.parent()) return false;
    }
  }
  /// Move to the next node in a
  /// [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR))
  /// traversal, going from a node to its first child or, if the
  /// current node is empty or `enter` is false, its next sibling or
  /// the next sibling of the first parent node that has one.
  next(enter = true) {
    return this.move(1, enter);
  }
  /// Move to the next node in a last-to-first pre-order traveral. A
  /// node is followed by its last child or, if it has none, its
  /// previous sibling or the previous sibling of the first parent
  /// node that has one.
  prev(enter = true) {
    return this.move(-1, enter);
  }
  /// Move the cursor to the innermost node that covers `pos`. If
  /// `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  /// it will enter nodes that start at `pos`.
  moveTo(pos, side = 0) {
    while (
      this.from == this.to ||
      (side < 1 ? this.from >= pos : this.from > pos) ||
      (side > -1 ? this.to <= pos : this.to < pos)
    )
      if (!this.parent()) break;
    while (this.enterChild(1, pos, side)) {}
    return this;
  }
  /// Get a [syntax node](#common.SyntaxNode) at the cursor's current
  /// position.
  get node() {
    if (!this.buffer) return this._tree;
    let cache = this.bufferNode,
      result = null,
      depth = 0;
    if (cache && cache.context == this.buffer) {
      scan: for (let index = this.index, d = this.stack.length; d >= 0; ) {
        for (let c = cache; c; c = c._parent)
          if (c.index == index) {
            if (index == this.index) return c;
            result = c;
            depth = d + 1;
            break scan;
          }
        index = this.stack[--d];
      }
    }
    for (let i = depth; i < this.stack.length; i++) result = new BufferNode(this.buffer, result, this.stack[i]);
    return (this.bufferNode = new BufferNode(this.buffer, result, this.index));
  }
  /// Get the [tree](#common.Tree) that represents the current node, if
  /// any. Will return null when the node is in a [tree
  /// buffer](#common.TreeBuffer).
  get tree() {
    return this.buffer ? null : this._tree.node;
  }
};
function hasChild(tree) {
  return tree.children.some((ch) => ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild(ch));
}
function buildTree(data) {
  var _a2;
  let {
    buffer,
    nodeSet,
    maxBufferLength = DefaultBufferLength,
    reused = [],
    minRepeatType = nodeSet.types.length,
  } = data;
  let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
  let types2 = nodeSet.types;
  let contextHash = 0,
    lookAhead = 0;
  function takeNode(parentStart, minPos, children2, positions2, inRepeat) {
    let { id, start, end, size } = cursor;
    let lookAheadAtStart = lookAhead;
    while (size < 0) {
      cursor.next();
      if (size == -1) {
        let node2 = reused[id];
        children2.push(node2);
        positions2.push(start - parentStart);
        return;
      } else if (size == -3) {
        contextHash = id;
        return;
      } else if (size == -4) {
        lookAhead = id;
        return;
      } else {
        throw new RangeError(`Unrecognized record size: ${size}`);
      }
    }
    let type = types2[id],
      node,
      buffer2;
    let startPos = start - parentStart;
    if (end - start <= maxBufferLength && (buffer2 = findBufferSize(cursor.pos - minPos, inRepeat))) {
      let data2 = new Uint16Array(buffer2.size - buffer2.skip);
      let endPos = cursor.pos - buffer2.size,
        index = data2.length;
      while (cursor.pos > endPos) index = copyToBuffer(buffer2.start, data2, index);
      node = new TreeBuffer(data2, end - buffer2.start, nodeSet);
      startPos = buffer2.start - parentStart;
    } else {
      let endPos = cursor.pos - size;
      cursor.next();
      let localChildren = [],
        localPositions = [];
      let localInRepeat = id >= minRepeatType ? id : -1;
      let lastGroup = 0,
        lastEnd = end;
      while (cursor.pos > endPos) {
        if (localInRepeat >= 0 && cursor.id == localInRepeat && cursor.size >= 0) {
          if (cursor.end <= lastEnd - maxBufferLength) {
            makeRepeatLeaf(
              localChildren,
              localPositions,
              start,
              lastGroup,
              cursor.end,
              lastEnd,
              localInRepeat,
              lookAheadAtStart,
            );
            lastGroup = localChildren.length;
            lastEnd = cursor.end;
          }
          cursor.next();
        } else {
          takeNode(start, endPos, localChildren, localPositions, localInRepeat);
        }
      }
      if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length)
        makeRepeatLeaf(
          localChildren,
          localPositions,
          start,
          lastGroup,
          start,
          lastEnd,
          localInRepeat,
          lookAheadAtStart,
        );
      localChildren.reverse();
      localPositions.reverse();
      if (localInRepeat > -1 && lastGroup > 0) {
        let make = makeBalanced(type);
        node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
      } else {
        node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end);
      }
    }
    children2.push(node);
    positions2.push(startPos);
  }
  function makeBalanced(type) {
    return (children2, positions2, length2) => {
      let lookAhead2 = 0,
        lastI = children2.length - 1,
        last,
        lookAheadProp;
      if (lastI >= 0 && (last = children2[lastI]) instanceof Tree) {
        if (!lastI && last.type == type && last.length == length2) return last;
        if ((lookAheadProp = last.prop(NodeProp.lookAhead)))
          lookAhead2 = positions2[lastI] + last.length + lookAheadProp;
      }
      return makeTree(type, children2, positions2, length2, lookAhead2);
    };
  }
  function makeRepeatLeaf(children2, positions2, base2, i, from, to, type, lookAhead2) {
    let localChildren = [],
      localPositions = [];
    while (children2.length > i) {
      localChildren.push(children2.pop());
      localPositions.push(positions2.pop() + base2 - from);
    }
    children2.push(makeTree(nodeSet.types[type], localChildren, localPositions, to - from, lookAhead2 - to));
    positions2.push(from - base2);
  }
  function makeTree(type, children2, positions2, length2, lookAhead2 = 0, props) {
    if (contextHash) {
      let pair = [NodeProp.contextHash, contextHash];
      props = props ? [pair].concat(props) : [pair];
    }
    if (lookAhead2 > 25) {
      let pair = [NodeProp.lookAhead, lookAhead2];
      props = props ? [pair].concat(props) : [pair];
    }
    return new Tree(type, children2, positions2, length2, props);
  }
  function findBufferSize(maxSize, inRepeat) {
    let fork = cursor.fork();
    let size = 0,
      start = 0,
      skip = 0,
      minStart = fork.end - maxBufferLength;
    let result = { size: 0, start: 0, skip: 0 };
    scan: for (let minPos = fork.pos - maxSize; fork.pos > minPos; ) {
      let nodeSize2 = fork.size;
      if (fork.id == inRepeat && nodeSize2 >= 0) {
        result.size = size;
        result.start = start;
        result.skip = skip;
        skip += 4;
        size += 4;
        fork.next();
        continue;
      }
      let startPos = fork.pos - nodeSize2;
      if (nodeSize2 < 0 || startPos < minPos || fork.start < minStart) break;
      let localSkipped = fork.id >= minRepeatType ? 4 : 0;
      let nodeStart = fork.start;
      fork.next();
      while (fork.pos > startPos) {
        if (fork.size < 0) {
          if (fork.size == -3) localSkipped += 4;
          else break scan;
        } else if (fork.id >= minRepeatType) {
          localSkipped += 4;
        }
        fork.next();
      }
      start = nodeStart;
      size += nodeSize2;
      skip += localSkipped;
    }
    if (inRepeat < 0 || size == maxSize) {
      result.size = size;
      result.start = start;
      result.skip = skip;
    }
    return result.size > 4 ? result : void 0;
  }
  function copyToBuffer(bufferStart, buffer2, index) {
    let { id, start, end, size } = cursor;
    cursor.next();
    if (size >= 0 && id < minRepeatType) {
      let startIndex = index;
      if (size > 4) {
        let endPos = cursor.pos - (size - 4);
        while (cursor.pos > endPos) index = copyToBuffer(bufferStart, buffer2, index);
      }
      buffer2[--index] = startIndex;
      buffer2[--index] = end - bufferStart;
      buffer2[--index] = start - bufferStart;
      buffer2[--index] = id;
    } else if (size == -3) {
      contextHash = id;
    } else if (size == -4) {
      lookAhead = id;
    }
    return index;
  }
  let children = [],
    positions = [];
  while (cursor.pos > 0) takeNode(data.start || 0, data.bufferStart || 0, children, positions, -1);
  let length =
    (_a2 = data.length) !== null && _a2 !== void 0 ? _a2 : children.length ? positions[0] + children[0].length : 0;
  return new Tree(types2[data.topID], children.reverse(), positions.reverse(), length);
}
var nodeSizeCache = /* @__PURE__ */ new WeakMap();
function nodeSize(balanceType, node) {
  if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType) return 1;
  let size = nodeSizeCache.get(node);
  if (size == null) {
    size = 1;
    for (let child of node.children) {
      if (child.type != balanceType || !(child instanceof Tree)) {
        size = 1;
        break;
      }
      size += nodeSize(balanceType, child);
    }
    nodeSizeCache.set(node, size);
  }
  return size;
}
function balanceRange(balanceType, children, positions, from, to, start, length, mkTop, mkTree) {
  let total = 0;
  for (let i = from; i < to; i++) total += nodeSize(balanceType, children[i]);
  let maxChild = Math.ceil(
    (total * 1.5) / 8,
    /* BranchFactor */
  );
  let localChildren = [],
    localPositions = [];
  function divide(children2, positions2, from2, to2, offset) {
    for (let i = from2; i < to2; ) {
      let groupFrom = i,
        groupStart = positions2[i],
        groupSize = nodeSize(balanceType, children2[i]);
      i++;
      for (; i < to2; i++) {
        let nextSize = nodeSize(balanceType, children2[i]);
        if (groupSize + nextSize >= maxChild) break;
        groupSize += nextSize;
      }
      if (i == groupFrom + 1) {
        if (groupSize > maxChild) {
          let only = children2[groupFrom];
          divide(only.children, only.positions, 0, only.children.length, positions2[groupFrom] + offset);
          continue;
        }
        localChildren.push(children2[groupFrom]);
      } else {
        let length2 = positions2[i - 1] + children2[i - 1].length - groupStart;
        localChildren.push(
          balanceRange(balanceType, children2, positions2, groupFrom, i, groupStart, length2, null, mkTree),
        );
      }
      localPositions.push(groupStart + offset - start);
    }
  }
  divide(children, positions, from, to, 0);
  return (mkTop || mkTree)(localChildren, localPositions, length);
}
var TreeFragment = class _TreeFragment {
  /// Construct a tree fragment.
  constructor(from, to, tree, offset, openStart = false, openEnd = false) {
    this.from = from;
    this.to = to;
    this.tree = tree;
    this.offset = offset;
    this.open = (openStart ? 1 : 0) | (openEnd ? 2 : 0);
  }
  /// Whether the start of the fragment represents the start of a
  /// parse, or the end of a change. (In the second case, it may not
  /// be safe to reuse some nodes at the start, depending on the
  /// parsing algorithm.)
  get openStart() {
    return (this.open & 1) > 0;
  }
  /// Whether the end of the fragment represents the end of a
  /// full-document parse, or the start of a change.
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /// Create a set of fragments from a freshly parsed tree, or update
  /// an existing set of fragments by replacing the ones that overlap
  /// with a tree with content from the new tree. When `partial` is
  /// true, the parse is treated as incomplete, and the resulting
  /// fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  /// true.
  static addTree(tree, fragments = [], partial = false) {
    let result = [new _TreeFragment(0, tree.length, tree, 0, false, partial)];
    for (let f of fragments) if (f.to > tree.length) result.push(f);
    return result;
  }
  /// Apply a set of edits to an array of fragments, removing or
  /// splitting fragments as necessary to remove edited ranges, and
  /// adjusting offsets for fragments that moved.
  static applyChanges(fragments, changes, minGap = 128) {
    if (!changes.length) return fragments;
    let result = [];
    let fI = 1,
      nextF = fragments.length ? fragments[0] : null;
    for (let cI = 0, pos = 0, off = 0; ; cI++) {
      let nextC = cI < changes.length ? changes[cI] : null;
      let nextPos = nextC ? nextC.fromA : 1e9;
      if (nextPos - pos >= minGap)
        while (nextF && nextF.from < nextPos) {
          let cut = nextF;
          if (pos >= cut.from || nextPos <= cut.to || off) {
            let fFrom = Math.max(cut.from, pos) - off,
              fTo = Math.min(cut.to, nextPos) - off;
            cut = fFrom >= fTo ? null : new _TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, cI > 0, !!nextC);
          }
          if (cut) result.push(cut);
          if (nextF.to > nextPos) break;
          nextF = fI < fragments.length ? fragments[fI++] : null;
        }
      if (!nextC) break;
      pos = nextC.toA;
      off = nextC.toA - nextC.toB;
    }
    return result;
  }
};
var Parser = class {
  /// Start a parse, returning a [partial parse](#common.PartialParse)
  /// object. [`fragments`](#common.TreeFragment) can be passed in to
  /// make the parse incremental.
  ///
  /// By default, the entire input is parsed. You can pass `ranges`,
  /// which should be a sorted array of non-empty, non-overlapping
  /// ranges, to parse only those ranges. The tree returned in that
  /// case will start at `ranges[0].from`.
  startParse(input, fragments, ranges) {
    if (typeof input == 'string') input = new StringInput(input);
    ranges = !ranges
      ? [new Range(0, input.length)]
      : ranges.length
      ? ranges.map((r) => new Range(r.from, r.to))
      : [new Range(0, 0)];
    return this.createParse(input, fragments || [], ranges);
  }
  /// Run a full parse, returning the resulting tree.
  parse(input, fragments, ranges) {
    let parse = this.startParse(input, fragments, ranges);
    for (;;) {
      let done = parse.advance();
      if (done) return done;
    }
  }
};
var StringInput = class {
  constructor(string2) {
    this.string = string2;
  }
  get length() {
    return this.string.length;
  }
  chunk(from) {
    return this.string.slice(from);
  }
  get lineChunks() {
    return false;
  }
  read(from, to) {
    return this.string.slice(from, to);
  }
};
var stoppedInner = new NodeProp({ perNode: true });

// ../../node_modules/.pnpm/@codemirror+text@0.19.6/node_modules/@codemirror/text/dist/index.js
var extend =
  'lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o'
    .split(',')
    .map((s) => (s ? parseInt(s, 36) : 1));
for (let i = 1; i < extend.length; i++) extend[i] += extend[i - 1];
function isExtendingChar(code) {
  for (let i = 1; i < extend.length; i += 2) if (extend[i] > code) return extend[i - 1] <= code;
  return false;
}
function isRegionalIndicator(code) {
  return code >= 127462 && code <= 127487;
}
var ZWJ = 8205;
function findClusterBreak(str, pos, forward = true, includeExtending = true) {
  return (forward ? nextClusterBreak : prevClusterBreak)(str, pos, includeExtending);
}
function nextClusterBreak(str, pos, includeExtending) {
  if (pos == str.length) return pos;
  if (pos && surrogateLow(str.charCodeAt(pos)) && surrogateHigh(str.charCodeAt(pos - 1))) pos--;
  let prev = codePointAt(str, pos);
  pos += codePointSize(prev);
  while (pos < str.length) {
    let next = codePointAt(str, pos);
    if (prev == ZWJ || next == ZWJ || (includeExtending && isExtendingChar(next))) {
      pos += codePointSize(next);
      prev = next;
    } else if (isRegionalIndicator(next)) {
      let countBefore = 0,
        i = pos - 2;
      while (i >= 0 && isRegionalIndicator(codePointAt(str, i))) {
        countBefore++;
        i -= 2;
      }
      if (countBefore % 2 == 0) break;
      else pos += 2;
    } else {
      break;
    }
  }
  return pos;
}
function prevClusterBreak(str, pos, includeExtending) {
  while (pos > 0) {
    let found = nextClusterBreak(str, pos - 2, includeExtending);
    if (found < pos) return found;
    pos--;
  }
  return 0;
}
function surrogateLow(ch) {
  return ch >= 56320 && ch < 57344;
}
function surrogateHigh(ch) {
  return ch >= 55296 && ch < 56320;
}
function codePointAt(str, pos) {
  let code0 = str.charCodeAt(pos);
  if (!surrogateHigh(code0) || pos + 1 == str.length) return code0;
  let code1 = str.charCodeAt(pos + 1);
  if (!surrogateLow(code1)) return code0;
  return ((code0 - 55296) << 10) + (code1 - 56320) + 65536;
}
function codePointSize(code) {
  return code < 65536 ? 1 : 2;
}
function findColumn(string2, col, tabSize, strict) {
  for (let i = 0, n = 0; ; ) {
    if (n >= col) return i;
    if (i == string2.length) break;
    n += string2.charCodeAt(i) == 9 ? tabSize - (n % tabSize) : 1;
    i = findClusterBreak(string2, i);
  }
  return strict === true ? -1 : string2.length;
}
var Text = class _Text {
  /**
  @internal
  */
  constructor() {}
  /**
  Get the line description around the given position.
  */
  lineAt(pos) {
    if (pos < 0 || pos > this.length)
      throw new RangeError(`Invalid position ${pos} in document of length ${this.length}`);
    return this.lineInner(pos, false, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(n) {
    if (n < 1 || n > this.lines) throw new RangeError(`Invalid line number ${n} in ${this.lines}-line document`);
    return this.lineInner(n, true, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(from, to, text) {
    let parts = [];
    this.decompose(
      0,
      from,
      parts,
      2,
      /* To */
    );
    if (text.length)
      text.decompose(
        0,
        text.length,
        parts,
        1 | 2,
        /* To */
      );
    this.decompose(
      to,
      this.length,
      parts,
      1,
      /* From */
    );
    return TextNode.from(parts, this.length - (to - from) + text.length);
  }
  /**
  Append another document to this one.
  */
  append(other) {
    return this.replace(this.length, this.length, other);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(from, to = this.length) {
    let parts = [];
    this.decompose(from, to, parts, 0);
    return TextNode.from(parts, to - from);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(other) {
    if (other == this) return true;
    if (other.length != this.length || other.lines != this.lines) return false;
    let start = this.scanIdentical(other, 1),
      end = this.length - this.scanIdentical(other, -1);
    let a = new RawTextCursor(this),
      b = new RawTextCursor(other);
    for (let skip = start, pos = start; ; ) {
      a.next(skip);
      b.next(skip);
      skip = 0;
      if (a.lineBreak != b.lineBreak || a.done != b.done || a.value != b.value) return false;
      pos += a.value.length;
      if (a.done || pos >= end) return true;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings, and for long lines, might split lines
  themselves into multiple chunks as well.
  */
  iter(dir = 1) {
    return new RawTextCursor(this, dir);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(from, to = this.length) {
    return new PartialTextCursor(this, from, to);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(from, to) {
    let inner;
    if (from == null) {
      inner = this.iter();
    } else {
      if (to == null) to = this.lines + 1;
      let start = this.line(from).from;
      inner = this.iterRange(
        start,
        Math.max(start, to == this.lines + 1 ? this.length : to <= 1 ? 0 : this.line(to - 1).to),
      );
    }
    return new LineCursor(inner);
  }
  /**
  @internal
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#text.Text^of)).
  */
  toJSON() {
    let lines = [];
    this.flatten(lines);
    return lines;
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(text) {
    if (text.length == 0) throw new RangeError('A document must have at least one line');
    if (text.length == 1 && !text[0]) return _Text.empty;
    return text.length <= 32 ? new TextLeaf(text) : TextNode.from(TextLeaf.split(text, []));
  }
};
var TextLeaf = class _TextLeaf extends Text {
  constructor(text, length = textLength(text)) {
    super();
    this.text = text;
    this.length = length;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(target, isLine, line, offset) {
    for (let i = 0; ; i++) {
      let string2 = this.text[i],
        end = offset + string2.length;
      if ((isLine ? line : end) >= target) return new Line(offset, end, line, string2);
      offset = end + 1;
      line++;
    }
  }
  decompose(from, to, target, open) {
    let text =
      from <= 0 && to >= this.length
        ? this
        : new _TextLeaf(sliceText(this.text, from, to), Math.min(to, this.length) - Math.max(0, from));
    if (open & 1) {
      let prev = target.pop();
      let joined = appendText(text.text, prev.text.slice(), 0, text.length);
      if (joined.length <= 32) {
        target.push(new _TextLeaf(joined, prev.length + text.length));
      } else {
        let mid = joined.length >> 1;
        target.push(new _TextLeaf(joined.slice(0, mid)), new _TextLeaf(joined.slice(mid)));
      }
    } else {
      target.push(text);
    }
  }
  replace(from, to, text) {
    if (!(text instanceof _TextLeaf)) return super.replace(from, to, text);
    let lines = appendText(this.text, appendText(text.text, sliceText(this.text, 0, from)), to);
    let newLen = this.length + text.length - (to - from);
    if (lines.length <= 32) return new _TextLeaf(lines, newLen);
    return TextNode.from(_TextLeaf.split(lines, []), newLen);
  }
  sliceString(from, to = this.length, lineSep = '\n') {
    let result = '';
    for (let pos = 0, i = 0; pos <= to && i < this.text.length; i++) {
      let line = this.text[i],
        end = pos + line.length;
      if (pos > from && i) result += lineSep;
      if (from < end && to > pos) result += line.slice(Math.max(0, from - pos), to - pos);
      pos = end + 1;
    }
    return result;
  }
  flatten(target) {
    for (let line of this.text) target.push(line);
  }
  scanIdentical() {
    return 0;
  }
  static split(text, target) {
    let part = [],
      len = -1;
    for (let line of text) {
      part.push(line);
      len += line.length + 1;
      if (part.length == 32) {
        target.push(new _TextLeaf(part, len));
        part = [];
        len = -1;
      }
    }
    if (len > -1) target.push(new _TextLeaf(part, len));
    return target;
  }
};
var TextNode = class _TextNode extends Text {
  constructor(children, length) {
    super();
    this.children = children;
    this.length = length;
    this.lines = 0;
    for (let child of children) this.lines += child.lines;
  }
  lineInner(target, isLine, line, offset) {
    for (let i = 0; ; i++) {
      let child = this.children[i],
        end = offset + child.length,
        endLine = line + child.lines - 1;
      if ((isLine ? endLine : end) >= target) return child.lineInner(target, isLine, line, offset);
      offset = end + 1;
      line = endLine + 1;
    }
  }
  decompose(from, to, target, open) {
    for (let i = 0, pos = 0; pos <= to && i < this.children.length; i++) {
      let child = this.children[i],
        end = pos + child.length;
      if (from <= end && to >= pos) {
        let childOpen = open & ((pos <= from ? 1 : 0) | (end >= to ? 2 : 0));
        if (pos >= from && end <= to && !childOpen) target.push(child);
        else child.decompose(from - pos, to - pos, target, childOpen);
      }
      pos = end + 1;
    }
  }
  replace(from, to, text) {
    if (text.lines < this.lines)
      for (let i = 0, pos = 0; i < this.children.length; i++) {
        let child = this.children[i],
          end = pos + child.length;
        if (from >= pos && to <= end) {
          let updated = child.replace(from - pos, to - pos, text);
          let totalLines = this.lines - child.lines + updated.lines;
          if (updated.lines < totalLines >> (5 - 1) && updated.lines > totalLines >> (5 + 1)) {
            let copy = this.children.slice();
            copy[i] = updated;
            return new _TextNode(copy, this.length - (to - from) + text.length);
          }
          return super.replace(pos, end, updated);
        }
        pos = end + 1;
      }
    return super.replace(from, to, text);
  }
  sliceString(from, to = this.length, lineSep = '\n') {
    let result = '';
    for (let i = 0, pos = 0; i < this.children.length && pos <= to; i++) {
      let child = this.children[i],
        end = pos + child.length;
      if (pos > from && i) result += lineSep;
      if (from < end && to > pos) result += child.sliceString(from - pos, to - pos, lineSep);
      pos = end + 1;
    }
    return result;
  }
  flatten(target) {
    for (let child of this.children) child.flatten(target);
  }
  scanIdentical(other, dir) {
    if (!(other instanceof _TextNode)) return 0;
    let length = 0;
    let [iA, iB, eA, eB] =
      dir > 0
        ? [0, 0, this.children.length, other.children.length]
        : [this.children.length - 1, other.children.length - 1, -1, -1];
    for (; ; iA += dir, iB += dir) {
      if (iA == eA || iB == eB) return length;
      let chA = this.children[iA],
        chB = other.children[iB];
      if (chA != chB) return length + chA.scanIdentical(chB, dir);
      length += chA.length + 1;
    }
  }
  static from(children, length = children.reduce((l, ch) => l + ch.length + 1, -1)) {
    let lines = 0;
    for (let ch of children) lines += ch.lines;
    if (lines < 32) {
      let flat = [];
      for (let ch of children) ch.flatten(flat);
      return new TextLeaf(flat, length);
    }
    let chunk = Math.max(
        32,
        lines >> 5,
        /* BranchShift */
      ),
      maxChunk = chunk << 1,
      minChunk = chunk >> 1;
    let chunked = [],
      currentLines = 0,
      currentLen = -1,
      currentChunk = [];
    function add(child) {
      let last;
      if (child.lines > maxChunk && child instanceof _TextNode) {
        for (let node of child.children) add(node);
      } else if (child.lines > minChunk && (currentLines > minChunk || !currentLines)) {
        flush();
        chunked.push(child);
      } else if (
        child instanceof TextLeaf &&
        currentLines &&
        (last = currentChunk[currentChunk.length - 1]) instanceof TextLeaf &&
        child.lines + last.lines <= 32
      ) {
        currentLines += child.lines;
        currentLen += child.length + 1;
        currentChunk[currentChunk.length - 1] = new TextLeaf(
          last.text.concat(child.text),
          last.length + 1 + child.length,
        );
      } else {
        if (currentLines + child.lines > chunk) flush();
        currentLines += child.lines;
        currentLen += child.length + 1;
        currentChunk.push(child);
      }
    }
    function flush() {
      if (currentLines == 0) return;
      chunked.push(currentChunk.length == 1 ? currentChunk[0] : _TextNode.from(currentChunk, currentLen));
      currentLen = -1;
      currentLines = currentChunk.length = 0;
    }
    for (let child of children) add(child);
    flush();
    return chunked.length == 1 ? chunked[0] : new _TextNode(chunked, length);
  }
};
Text.empty = new TextLeaf([''], 0);
function textLength(text) {
  let length = -1;
  for (let line of text) length += line.length + 1;
  return length;
}
function appendText(text, target, from = 0, to = 1e9) {
  for (let pos = 0, i = 0, first = true; i < text.length && pos <= to; i++) {
    let line = text[i],
      end = pos + line.length;
    if (end >= from) {
      if (end > to) line = line.slice(0, to - pos);
      if (pos < from) line = line.slice(from - pos);
      if (first) {
        target[target.length - 1] += line;
        first = false;
      } else target.push(line);
    }
    pos = end + 1;
  }
  return target;
}
function sliceText(text, from, to) {
  return appendText(text, [''], from, to);
}
var RawTextCursor = class {
  constructor(text, dir = 1) {
    this.dir = dir;
    this.done = false;
    this.lineBreak = false;
    this.value = '';
    this.nodes = [text];
    this.offsets = [dir > 0 ? 1 : (text instanceof TextLeaf ? text.text.length : text.children.length) << 1];
  }
  nextInner(skip, dir) {
    this.done = this.lineBreak = false;
    for (;;) {
      let last = this.nodes.length - 1;
      let top = this.nodes[last],
        offsetValue = this.offsets[last],
        offset = offsetValue >> 1;
      let size = top instanceof TextLeaf ? top.text.length : top.children.length;
      if (offset == (dir > 0 ? size : 0)) {
        if (last == 0) {
          this.done = true;
          this.value = '';
          return this;
        }
        if (dir > 0) this.offsets[last - 1]++;
        this.nodes.pop();
        this.offsets.pop();
      } else if ((offsetValue & 1) == (dir > 0 ? 0 : 1)) {
        this.offsets[last] += dir;
        if (skip == 0) {
          this.lineBreak = true;
          this.value = '\n';
          return this;
        }
        skip--;
      } else if (top instanceof TextLeaf) {
        let next = top.text[offset + (dir < 0 ? -1 : 0)];
        this.offsets[last] += dir;
        if (next.length > Math.max(0, skip)) {
          this.value = skip == 0 ? next : dir > 0 ? next.slice(skip) : next.slice(0, next.length - skip);
          return this;
        }
        skip -= next.length;
      } else {
        let next = top.children[offset + (dir < 0 ? -1 : 0)];
        if (skip > next.length) {
          skip -= next.length;
          this.offsets[last] += dir;
        } else {
          if (dir < 0) this.offsets[last]--;
          this.nodes.push(next);
          this.offsets.push(dir > 0 ? 1 : (next instanceof TextLeaf ? next.text.length : next.children.length) << 1);
        }
      }
    }
  }
  next(skip = 0) {
    if (skip < 0) {
      this.nextInner(-skip, -this.dir);
      skip = this.value.length;
    }
    return this.nextInner(skip, this.dir);
  }
};
var PartialTextCursor = class {
  constructor(text, start, end) {
    this.value = '';
    this.done = false;
    this.cursor = new RawTextCursor(text, start > end ? -1 : 1);
    this.pos = start > end ? text.length : 0;
    this.from = Math.min(start, end);
    this.to = Math.max(start, end);
  }
  nextInner(skip, dir) {
    if (dir < 0 ? this.pos <= this.from : this.pos >= this.to) {
      this.value = '';
      this.done = true;
      return this;
    }
    skip += Math.max(0, dir < 0 ? this.pos - this.to : this.from - this.pos);
    let limit = dir < 0 ? this.pos - this.from : this.to - this.pos;
    if (skip > limit) skip = limit;
    limit -= skip;
    let { value } = this.cursor.next(skip);
    this.pos += (value.length + skip) * dir;
    this.value = value.length <= limit ? value : dir < 0 ? value.slice(value.length - limit) : value.slice(0, limit);
    this.done = !this.value;
    return this;
  }
  next(skip = 0) {
    if (skip < 0) skip = Math.max(skip, this.from - this.pos);
    else if (skip > 0) skip = Math.min(skip, this.to - this.pos);
    return this.nextInner(skip, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != '';
  }
};
var LineCursor = class {
  constructor(inner) {
    this.inner = inner;
    this.afterBreak = true;
    this.value = '';
    this.done = false;
  }
  next(skip = 0) {
    let { done, lineBreak, value } = this.inner.next(skip);
    if (done) {
      this.done = true;
      this.value = '';
    } else if (lineBreak) {
      if (this.afterBreak) {
        this.value = '';
      } else {
        this.afterBreak = true;
        this.next();
      }
    } else {
      this.value = value;
      this.afterBreak = false;
    }
    return this;
  }
  get lineBreak() {
    return false;
  }
};
if (typeof Symbol != 'undefined') {
  Text.prototype[Symbol.iterator] = function () {
    return this.iter();
  };
  RawTextCursor.prototype[Symbol.iterator] =
    PartialTextCursor.prototype[Symbol.iterator] =
    LineCursor.prototype[Symbol.iterator] =
      function () {
        return this;
      };
}
var Line = class {
  /**
  @internal
  */
  constructor(from, to, number2, text) {
    this.from = from;
    this.to = to;
    this.number = number2;
    this.text = text;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
};

// ../../node_modules/.pnpm/@codemirror+state@0.19.9/node_modules/@codemirror/state/dist/index.js
var DefaultSplit = /\r\n?|\n/;
var MapMode = (function (MapMode2) {
  MapMode2[(MapMode2['Simple'] = 0)] = 'Simple';
  MapMode2[(MapMode2['TrackDel'] = 1)] = 'TrackDel';
  MapMode2[(MapMode2['TrackBefore'] = 2)] = 'TrackBefore';
  MapMode2[(MapMode2['TrackAfter'] = 3)] = 'TrackAfter';
  return MapMode2;
})(MapMode || (MapMode = {}));
var ChangeDesc = class _ChangeDesc {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(sections) {
    this.sections = sections;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let result = 0;
    for (let i = 0; i < this.sections.length; i += 2) result += this.sections[i];
    return result;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let result = 0;
    for (let i = 0; i < this.sections.length; i += 2) {
      let ins = this.sections[i + 1];
      result += ins < 0 ? this.sections[i] : ins;
    }
    return result;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || (this.sections.length == 2 && this.sections[1] < 0);
  }
  /**
  Iterate over the unchanged parts left by these changes.
  */
  iterGaps(f) {
    for (let i = 0, posA = 0, posB = 0; i < this.sections.length; ) {
      let len = this.sections[i++],
        ins = this.sections[i++];
      if (ins < 0) {
        f(posA, posB, len);
        posB += len;
      } else {
        posB += ins;
      }
      posA += len;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(f, individual = false) {
    iterChanges(this, f, individual);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let sections = [];
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++],
        ins = this.sections[i++];
      if (ins < 0) sections.push(len, ins);
      else sections.push(ins, len);
    }
    return new _ChangeDesc(sections);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(other) {
    return this.empty ? other : other.empty ? this : composeSets(this, other);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(other, before = false) {
    return other.empty ? this : mapSet(this, other, before);
  }
  mapPos(pos, assoc = -1, mode = MapMode.Simple) {
    let posA = 0,
      posB = 0;
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++],
        ins = this.sections[i++],
        endA = posA + len;
      if (ins < 0) {
        if (endA > pos) return posB + (pos - posA);
        posB += len;
      } else {
        if (
          mode != MapMode.Simple &&
          endA >= pos &&
          ((mode == MapMode.TrackDel && posA < pos && endA > pos) ||
            (mode == MapMode.TrackBefore && posA < pos) ||
            (mode == MapMode.TrackAfter && endA > pos))
        )
          return null;
        if (endA > pos || (endA == pos && assoc < 0 && !len)) return pos == posA || assoc < 0 ? posB : posB + ins;
        posB += ins;
      }
      posA = endA;
    }
    if (pos > posA) throw new RangeError(`Position ${pos} is out of range for changeset of length ${posA}`);
    return posB;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(from, to = from) {
    for (let i = 0, pos = 0; i < this.sections.length && pos <= to; ) {
      let len = this.sections[i++],
        ins = this.sections[i++],
        end = pos + len;
      if (ins >= 0 && pos <= to && end >= from) return pos < from && end > to ? 'cover' : true;
      pos = end;
    }
    return false;
  }
  /**
  @internal
  */
  toString() {
    let result = '';
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++],
        ins = this.sections[i++];
      result += (result ? ' ' : '') + len + (ins >= 0 ? ':' + ins : '');
    }
    return result;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(json) {
    if (!Array.isArray(json) || json.length % 2 || json.some((a) => typeof a != 'number'))
      throw new RangeError('Invalid JSON representation of ChangeDesc');
    return new _ChangeDesc(json);
  }
};
var ChangeSet = class _ChangeSet extends ChangeDesc {
  /**
  @internal
  */
  constructor(sections, inserted) {
    super(sections);
    this.inserted = inserted;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(doc2) {
    if (this.length != doc2.length) throw new RangeError('Applying change set to a document with the wrong length');
    iterChanges(
      this,
      (fromA, toA, fromB, _toB, text) => (doc2 = doc2.replace(fromB, fromB + (toA - fromA), text)),
      false,
    );
    return doc2;
  }
  mapDesc(other, before = false) {
    return mapSet(this, other, before, true);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(doc2) {
    let sections = this.sections.slice(),
      inserted = [];
    for (let i = 0, pos = 0; i < sections.length; i += 2) {
      let len = sections[i],
        ins = sections[i + 1];
      if (ins >= 0) {
        sections[i] = ins;
        sections[i + 1] = len;
        let index = i >> 1;
        while (inserted.length < index) inserted.push(Text.empty);
        inserted.push(len ? doc2.slice(pos, pos + len) : Text.empty);
      }
      pos += len;
    }
    return new _ChangeSet(sections, inserted);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(other) {
    return this.empty ? other : other.empty ? this : composeSets(this, other, true);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(other, before = false) {
    return other.empty ? this : mapSet(this, other, before, true);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(f, individual = false) {
    iterChanges(this, f, individual);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return new ChangeDesc(this.sections);
  }
  /**
  @internal
  */
  filter(ranges) {
    let resultSections = [],
      resultInserted = [],
      filteredSections = [];
    let iter = new SectionIter(this);
    done: for (let i = 0, pos = 0; ; ) {
      let next = i == ranges.length ? 1e9 : ranges[i++];
      while (pos < next || (pos == next && iter.len == 0)) {
        if (iter.done) break done;
        let len = Math.min(iter.len, next - pos);
        addSection(filteredSections, len, -1);
        let ins = iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0;
        addSection(resultSections, len, ins);
        if (ins > 0) addInsert(resultInserted, resultSections, iter.text);
        iter.forward(len);
        pos += len;
      }
      let end = ranges[i++];
      while (pos < end) {
        if (iter.done) break done;
        let len = Math.min(iter.len, end - pos);
        addSection(resultSections, len, -1);
        addSection(filteredSections, len, iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0);
        iter.forward(len);
        pos += len;
      }
    }
    return {
      changes: new _ChangeSet(resultSections, resultInserted),
      filtered: new ChangeDesc(filteredSections),
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let parts = [];
    for (let i = 0; i < this.sections.length; i += 2) {
      let len = this.sections[i],
        ins = this.sections[i + 1];
      if (ins < 0) parts.push(len);
      else if (ins == 0) parts.push([len]);
      else parts.push([len].concat(this.inserted[i >> 1].toJSON()));
    }
    return parts;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(changes, length, lineSep) {
    let sections = [],
      inserted = [],
      pos = 0;
    let total = null;
    function flush(force = false) {
      if (!force && !sections.length) return;
      if (pos < length) addSection(sections, length - pos, -1);
      let set = new _ChangeSet(sections, inserted);
      total = total ? total.compose(set.map(total)) : set;
      sections = [];
      inserted = [];
      pos = 0;
    }
    function process(spec) {
      if (Array.isArray(spec)) {
        for (let sub of spec) process(sub);
      } else if (spec instanceof _ChangeSet) {
        if (spec.length != length)
          throw new RangeError(`Mismatched change set length (got ${spec.length}, expected ${length})`);
        flush();
        total = total ? total.compose(spec.map(total)) : spec;
      } else {
        let { from, to = from, insert: insert2 } = spec;
        if (from > to || from < 0 || to > length)
          throw new RangeError(`Invalid change range ${from} to ${to} (in doc of length ${length})`);
        let insText = !insert2
          ? Text.empty
          : typeof insert2 == 'string'
          ? Text.of(insert2.split(lineSep || DefaultSplit))
          : insert2;
        let insLen = insText.length;
        if (from == to && insLen == 0) return;
        if (from < pos) flush();
        if (from > pos) addSection(sections, from - pos, -1);
        addSection(sections, to - from, insLen);
        addInsert(inserted, sections, insText);
        pos = to;
      }
    }
    process(changes);
    flush(!total);
    return total;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(length) {
    return new _ChangeSet(length ? [length, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(json) {
    if (!Array.isArray(json)) throw new RangeError('Invalid JSON representation of ChangeSet');
    let sections = [],
      inserted = [];
    for (let i = 0; i < json.length; i++) {
      let part = json[i];
      if (typeof part == 'number') {
        sections.push(part, -1);
      } else if (
        !Array.isArray(part) ||
        typeof part[0] != 'number' ||
        part.some((e, i2) => i2 && typeof e != 'string')
      ) {
        throw new RangeError('Invalid JSON representation of ChangeSet');
      } else if (part.length == 1) {
        sections.push(part[0], 0);
      } else {
        while (inserted.length < i) inserted.push(Text.empty);
        inserted[i] = Text.of(part.slice(1));
        sections.push(part[0], inserted[i].length);
      }
    }
    return new _ChangeSet(sections, inserted);
  }
};
function addSection(sections, len, ins, forceJoin = false) {
  if (len == 0 && ins <= 0) return;
  let last = sections.length - 2;
  if (last >= 0 && ins <= 0 && ins == sections[last + 1]) sections[last] += len;
  else if (len == 0 && sections[last] == 0) sections[last + 1] += ins;
  else if (forceJoin) {
    sections[last] += len;
    sections[last + 1] += ins;
  } else sections.push(len, ins);
}
function addInsert(values, sections, value) {
  if (value.length == 0) return;
  let index = (sections.length - 2) >> 1;
  if (index < values.length) {
    values[values.length - 1] = values[values.length - 1].append(value);
  } else {
    while (values.length < index) values.push(Text.empty);
    values.push(value);
  }
}
function iterChanges(desc, f, individual) {
  let inserted = desc.inserted;
  for (let posA = 0, posB = 0, i = 0; i < desc.sections.length; ) {
    let len = desc.sections[i++],
      ins = desc.sections[i++];
    if (ins < 0) {
      posA += len;
      posB += len;
    } else {
      let endA = posA,
        endB = posB,
        text = Text.empty;
      for (;;) {
        endA += len;
        endB += ins;
        if (ins && inserted) text = text.append(inserted[(i - 2) >> 1]);
        if (individual || i == desc.sections.length || desc.sections[i + 1] < 0) break;
        len = desc.sections[i++];
        ins = desc.sections[i++];
      }
      f(posA, endA, posB, endB, text);
      posA = endA;
      posB = endB;
    }
  }
}
function mapSet(setA, setB, before, mkSet = false) {
  let sections = [],
    insert2 = mkSet ? [] : null;
  let a = new SectionIter(setA),
    b = new SectionIter(setB);
  for (let posA = 0, posB = 0; ; ) {
    if (a.ins == -1) {
      posA += a.len;
      a.next();
    } else if (b.ins == -1 && posB < posA) {
      let skip = Math.min(b.len, posA - posB);
      b.forward(skip);
      addSection(sections, skip, -1);
      posB += skip;
    } else if (
      b.ins >= 0 &&
      (a.done || posB < posA || (posB == posA && (b.len < a.len || (b.len == a.len && !before))))
    ) {
      addSection(sections, b.ins, -1);
      while (posA > posB && !a.done && posA + a.len < posB + b.len) {
        posA += a.len;
        a.next();
      }
      posB += b.len;
      b.next();
    } else if (a.ins >= 0) {
      let len = 0,
        end = posA + a.len;
      for (;;) {
        if (b.ins >= 0 && posB > posA && posB + b.len < end) {
          len += b.ins;
          posB += b.len;
          b.next();
        } else if (b.ins == -1 && posB < end) {
          let skip = Math.min(b.len, end - posB);
          len += skip;
          b.forward(skip);
          posB += skip;
        } else {
          break;
        }
      }
      addSection(sections, len, a.ins);
      if (insert2) addInsert(insert2, sections, a.text);
      posA = end;
      a.next();
    } else if (a.done && b.done) {
      return insert2 ? new ChangeSet(sections, insert2) : new ChangeDesc(sections);
    } else {
      throw new Error('Mismatched change set lengths');
    }
  }
}
function composeSets(setA, setB, mkSet = false) {
  let sections = [];
  let insert2 = mkSet ? [] : null;
  let a = new SectionIter(setA),
    b = new SectionIter(setB);
  for (let open = false; ; ) {
    if (a.done && b.done) {
      return insert2 ? new ChangeSet(sections, insert2) : new ChangeDesc(sections);
    } else if (a.ins == 0) {
      addSection(sections, a.len, 0, open);
      a.next();
    } else if (b.len == 0 && !b.done) {
      addSection(sections, 0, b.ins, open);
      if (insert2) addInsert(insert2, sections, b.text);
      b.next();
    } else if (a.done || b.done) {
      throw new Error('Mismatched change set lengths');
    } else {
      let len = Math.min(a.len2, b.len),
        sectionLen = sections.length;
      if (a.ins == -1) {
        let insB = b.ins == -1 ? -1 : b.off ? 0 : b.ins;
        addSection(sections, len, insB, open);
        if (insert2 && insB) addInsert(insert2, sections, b.text);
      } else if (b.ins == -1) {
        addSection(sections, a.off ? 0 : a.len, len, open);
        if (insert2) addInsert(insert2, sections, a.textBit(len));
      } else {
        addSection(sections, a.off ? 0 : a.len, b.off ? 0 : b.ins, open);
        if (insert2 && !b.off) addInsert(insert2, sections, b.text);
      }
      open = (a.ins > len || (b.ins >= 0 && b.len > len)) && (open || sections.length > sectionLen);
      a.forward2(len);
      b.forward(len);
    }
  }
}
var SectionIter = class {
  constructor(set) {
    this.set = set;
    this.i = 0;
    this.next();
  }
  next() {
    let { sections } = this.set;
    if (this.i < sections.length) {
      this.len = sections[this.i++];
      this.ins = sections[this.i++];
    } else {
      this.len = 0;
      this.ins = -2;
    }
    this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted } = this.set,
      index = (this.i - 2) >> 1;
    return index >= inserted.length ? Text.empty : inserted[index];
  }
  textBit(len) {
    let { inserted } = this.set,
      index = (this.i - 2) >> 1;
    return index >= inserted.length && !len
      ? Text.empty
      : inserted[index].slice(this.off, len == null ? void 0 : this.off + len);
  }
  forward(len) {
    if (len == this.len) this.next();
    else {
      this.len -= len;
      this.off += len;
    }
  }
  forward2(len) {
    if (this.ins == -1) this.forward(len);
    else if (len == this.ins) this.next();
    else {
      this.ins -= len;
      this.off += len;
    }
  }
};
var SelectionRange = class _SelectionRange {
  /**
  @internal
  */
  constructor(from, to, flags) {
    this.from = from;
    this.to = to;
    this.flags = flags;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 16 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 16 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 4 ? -1 : this.flags & 8 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let level = this.flags & 3;
    return level == 3 ? null : level;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let value = this.flags >> 5;
    return value == 33554431 ? void 0 : value;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(change, assoc = -1) {
    let from, to;
    if (this.empty) {
      from = to = change.mapPos(this.from, assoc);
    } else {
      from = change.mapPos(this.from, 1);
      to = change.mapPos(this.to, -1);
    }
    return from == this.from && to == this.to ? this : new _SelectionRange(from, to, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(from, to = from) {
    if (from <= this.anchor && to >= this.anchor) return EditorSelection.range(from, to);
    let head = Math.abs(from - this.anchor) > Math.abs(to - this.anchor) ? from : to;
    return EditorSelection.range(this.anchor, head);
  }
  /**
  Compare this range to another range.
  */
  eq(other) {
    return this.anchor == other.anchor && this.head == other.head;
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(json) {
    if (!json || typeof json.anchor != 'number' || typeof json.head != 'number')
      throw new RangeError('Invalid JSON representation for SelectionRange');
    return EditorSelection.range(json.anchor, json.head);
  }
};
var EditorSelection = class _EditorSelection {
  /**
  @internal
  */
  constructor(ranges, mainIndex = 0) {
    this.ranges = ranges;
    this.mainIndex = mainIndex;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(change, assoc = -1) {
    if (change.empty) return this;
    return _EditorSelection.create(
      this.ranges.map((r) => r.map(change, assoc)),
      this.mainIndex,
    );
  }
  /**
  Compare this selection to another selection.
  */
  eq(other) {
    if (this.ranges.length != other.ranges.length || this.mainIndex != other.mainIndex) return false;
    for (let i = 0; i < this.ranges.length; i++) if (!this.ranges[i].eq(other.ranges[i])) return false;
    return true;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new _EditorSelection([this.main]);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(range, main = true) {
    return _EditorSelection.create([range].concat(this.ranges), main ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(range, which = this.mainIndex) {
    let ranges = this.ranges.slice();
    ranges[which] = range;
    return _EditorSelection.create(ranges, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((r) => r.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(json) {
    if (!json || !Array.isArray(json.ranges) || typeof json.main != 'number' || json.main >= json.ranges.length)
      throw new RangeError('Invalid JSON representation for EditorSelection');
    return new _EditorSelection(
      json.ranges.map((r) => SelectionRange.fromJSON(r)),
      json.main,
    );
  }
  /**
  Create a selection holding a single range.
  */
  static single(anchor, head = anchor) {
    return new _EditorSelection([_EditorSelection.range(anchor, head)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(ranges, mainIndex = 0) {
    if (ranges.length == 0) throw new RangeError('A selection needs at least one range');
    for (let pos = 0, i = 0; i < ranges.length; i++) {
      let range = ranges[i];
      if (range.empty ? range.from <= pos : range.from < pos) return normalized(ranges.slice(), mainIndex);
      pos = range.to;
    }
    return new _EditorSelection(ranges, mainIndex);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
    return new SelectionRange(
      pos,
      pos,
      (assoc == 0 ? 0 : assoc < 0 ? 4 : 8) |
        (bidiLevel == null ? 3 : Math.min(2, bidiLevel)) |
        ((goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5),
    );
  }
  /**
  Create a selection range.
  */
  static range(anchor, head, goalColumn) {
    let goal = (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5;
    return head < anchor
      ? new SelectionRange(
          head,
          anchor,
          16 | goal | 8,
          /* AssocAfter */
        )
      : new SelectionRange(anchor, head, goal | (head > anchor ? 4 : 0));
  }
};
function normalized(ranges, mainIndex = 0) {
  let main = ranges[mainIndex];
  ranges.sort((a, b) => a.from - b.from);
  mainIndex = ranges.indexOf(main);
  for (let i = 1; i < ranges.length; i++) {
    let range = ranges[i],
      prev = ranges[i - 1];
    if (range.empty ? range.from <= prev.to : range.from < prev.to) {
      let from = prev.from,
        to = Math.max(range.to, prev.to);
      if (i <= mainIndex) mainIndex--;
      ranges.splice(
        --i,
        2,
        range.anchor > range.head ? EditorSelection.range(to, from) : EditorSelection.range(from, to),
      );
    }
  }
  return new EditorSelection(ranges, mainIndex);
}
function checkSelection(selection, docLength) {
  for (let range of selection.ranges)
    if (range.to > docLength) throw new RangeError('Selection points outside of document');
}
var nextID = 0;
var Facet = class _Facet {
  constructor(combine, compareInput, compare2, isStatic, extensions) {
    this.combine = combine;
    this.compareInput = compareInput;
    this.compare = compare2;
    this.isStatic = isStatic;
    this.extensions = extensions;
    this.id = nextID++;
    this.default = combine([]);
  }
  /**
  Define a new facet.
  */
  static define(config = {}) {
    return new _Facet(
      config.combine || ((a) => a),
      config.compareInput || ((a, b) => a === b),
      config.compare || (!config.combine ? sameArray : (a, b) => a === b),
      !!config.static,
      config.enables,
    );
  }
  /**
  Returns an extension that adds the given value for this facet.
  */
  of(value) {
    return new FacetProvider([], this, 0, value);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In most cases, you'll want to use the
  [`provide`](https://codemirror.net/6/docs/ref/#state.StateField^define^config.provide) option when
  defining a field instead.
  */
  compute(deps, get) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new FacetProvider(deps, this, 1, get);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(deps, get) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new FacetProvider(deps, this, 2, get);
  }
  from(field, get) {
    if (!get) get = (x) => x;
    return this.compute([field], (state) => get(state.field(field)));
  }
};
function sameArray(a, b) {
  return a == b || (a.length == b.length && a.every((e, i) => e === b[i]));
}
var FacetProvider = class {
  constructor(dependencies, facet, type, value) {
    this.dependencies = dependencies;
    this.facet = facet;
    this.type = type;
    this.value = value;
    this.id = nextID++;
  }
  dynamicSlot(addresses) {
    var _a2;
    let getter = this.value;
    let compare2 = this.facet.compareInput;
    let id = this.id,
      idx = addresses[id] >> 1,
      multi = this.type == 2;
    let depDoc = false,
      depSel = false,
      depAddrs = [];
    for (let dep of this.dependencies) {
      if (dep == 'doc') depDoc = true;
      else if (dep == 'selection') depSel = true;
      else if ((((_a2 = addresses[dep.id]) !== null && _a2 !== void 0 ? _a2 : 1) & 1) == 0)
        depAddrs.push(addresses[dep.id]);
    }
    return {
      create(state) {
        state.values[idx] = getter(state);
        return 1;
      },
      update(state, tr) {
        if (
          (depDoc && tr.docChanged) ||
          (depSel && (tr.docChanged || tr.selection)) ||
          depAddrs.some((addr) => (ensureAddr(state, addr) & 1) > 0)
        ) {
          let newVal = getter(state);
          if (multi ? !compareArray(newVal, state.values[idx], compare2) : !compare2(newVal, state.values[idx])) {
            state.values[idx] = newVal;
            return 1;
          }
        }
        return 0;
      },
      reconfigure(state, oldState) {
        let newVal = getter(state);
        let oldAddr = oldState.config.address[id];
        if (oldAddr != null) {
          let oldVal = getAddr(oldState, oldAddr);
          if (multi ? compareArray(newVal, oldVal, compare2) : compare2(newVal, oldVal)) {
            state.values[idx] = oldVal;
            return 0;
          }
        }
        state.values[idx] = newVal;
        return 1;
      },
    };
  }
};
function compareArray(a, b, compare2) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) if (!compare2(a[i], b[i])) return false;
  return true;
}
function dynamicFacetSlot(addresses, facet, providers) {
  let providerAddrs = providers.map((p) => addresses[p.id]);
  let providerTypes = providers.map((p) => p.type);
  let dynamic = providerAddrs.filter((p) => !(p & 1));
  let idx = addresses[facet.id] >> 1;
  function get(state) {
    let values = [];
    for (let i = 0; i < providerAddrs.length; i++) {
      let value = getAddr(state, providerAddrs[i]);
      if (providerTypes[i] == 2) for (let val of value) values.push(val);
      else values.push(value);
    }
    return facet.combine(values);
  }
  return {
    create(state) {
      for (let addr of providerAddrs) ensureAddr(state, addr);
      state.values[idx] = get(state);
      return 1;
    },
    update(state, tr) {
      if (
        !dynamic.some(
          (dynAddr) => ensureAddr(state, dynAddr) & 1,
          /* Changed */
        )
      )
        return 0;
      let value = get(state);
      if (facet.compare(value, state.values[idx])) return 0;
      state.values[idx] = value;
      return 1;
    },
    reconfigure(state, oldState) {
      let depChanged = providerAddrs.some(
        (addr) => ensureAddr(state, addr) & 1,
        /* Changed */
      );
      let oldProviders = oldState.config.facets[facet.id],
        oldValue = oldState.facet(facet);
      if (oldProviders && !depChanged && sameArray(providers, oldProviders)) {
        state.values[idx] = oldValue;
        return 0;
      }
      let value = get(state);
      if (facet.compare(value, oldValue)) {
        state.values[idx] = oldValue;
        return 0;
      }
      state.values[idx] = value;
      return 1;
    },
  };
}
var initField = Facet.define({ static: true });
var StateField = class _StateField {
  constructor(id, createF, updateF, compareF, spec) {
    this.id = id;
    this.createF = createF;
    this.updateF = updateF;
    this.compareF = compareF;
    this.spec = spec;
    this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(config) {
    let field = new _StateField(nextID++, config.create, config.update, config.compare || ((a, b) => a === b), config);
    if (config.provide) field.provides = config.provide(field);
    return field;
  }
  create(state) {
    let init = state.facet(initField).find((i) => i.field == this);
    return ((init === null || init === void 0 ? void 0 : init.create) || this.createF)(state);
  }
  /**
  @internal
  */
  slot(addresses) {
    let idx = addresses[this.id] >> 1;
    return {
      create: (state) => {
        state.values[idx] = this.create(state);
        return 1;
      },
      update: (state, tr) => {
        let oldVal = state.values[idx];
        let value = this.updateF(oldVal, tr);
        if (this.compareF(oldVal, value)) return 0;
        state.values[idx] = value;
        return 1;
      },
      reconfigure: (state, oldState) => {
        if (oldState.config.address[this.id] != null) {
          state.values[idx] = oldState.field(this);
          return 0;
        }
        state.values[idx] = this.create(state);
        return 1;
      },
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(create) {
    return [this, initField.of({ field: this, create })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
};
var Prec_ = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function prec(value) {
  return (ext) => new PrecExtension(ext, value);
}
var Prec = {
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: prec(Prec_.lowest),
  /**
  A lower-than-default precedence, for extensions.
  */
  low: prec(Prec_.low),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: prec(Prec_.default),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: prec(Prec_.high),
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: prec(Prec_.highest),
  // FIXME Drop these in some future breaking version
  /**
  Backwards-compatible synonym for `Prec.lowest`.
  */
  fallback: prec(Prec_.lowest),
  /**
  Backwards-compatible synonym for `Prec.high`.
  */
  extend: prec(Prec_.high),
  /**
  Backwards-compatible synonym for `Prec.highest`.
  */
  override: prec(Prec_.highest),
};
var PrecExtension = class {
  constructor(inner, prec2) {
    this.inner = inner;
    this.prec = prec2;
  }
};
var Compartment = class _Compartment {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(ext) {
    return new CompartmentInstance(this, ext);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(content2) {
    return _Compartment.reconfigure.of({ compartment: this, extension: content2 });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(state) {
    return state.config.compartments.get(this);
  }
};
var CompartmentInstance = class {
  constructor(compartment, inner) {
    this.compartment = compartment;
    this.inner = inner;
  }
};
var Configuration = class _Configuration {
  constructor(base2, compartments, dynamicSlots, address, staticValues, facets) {
    this.base = base2;
    this.compartments = compartments;
    this.dynamicSlots = dynamicSlots;
    this.address = address;
    this.staticValues = staticValues;
    this.facets = facets;
    this.statusTemplate = [];
    while (this.statusTemplate.length < dynamicSlots.length)
      this.statusTemplate.push(
        0,
        /* Unresolved */
      );
  }
  staticFacet(facet) {
    let addr = this.address[facet.id];
    return addr == null ? facet.default : this.staticValues[addr >> 1];
  }
  static resolve(base2, compartments, oldState) {
    let fields = [];
    let facets = /* @__PURE__ */ Object.create(null);
    let newCompartments = /* @__PURE__ */ new Map();
    for (let ext of flatten(base2, compartments, newCompartments)) {
      if (ext instanceof StateField) fields.push(ext);
      else (facets[ext.facet.id] || (facets[ext.facet.id] = [])).push(ext);
    }
    let address = /* @__PURE__ */ Object.create(null);
    let staticValues = [];
    let dynamicSlots = [];
    for (let field of fields) {
      address[field.id] = dynamicSlots.length << 1;
      dynamicSlots.push((a) => field.slot(a));
    }
    let oldFacets = oldState === null || oldState === void 0 ? void 0 : oldState.config.facets;
    for (let id in facets) {
      let providers = facets[id],
        facet = providers[0].facet;
      let oldProviders = (oldFacets && oldFacets[id]) || [];
      if (
        providers.every(
          (p) => p.type == 0,
          /* Static */
        )
      ) {
        address[facet.id] = (staticValues.length << 1) | 1;
        if (sameArray(oldProviders, providers)) {
          staticValues.push(oldState.facet(facet));
        } else {
          let value = facet.combine(providers.map((p) => p.value));
          staticValues.push(oldState && facet.compare(value, oldState.facet(facet)) ? oldState.facet(facet) : value);
        }
      } else {
        for (let p of providers) {
          if (p.type == 0) {
            address[p.id] = (staticValues.length << 1) | 1;
            staticValues.push(p.value);
          } else {
            address[p.id] = dynamicSlots.length << 1;
            dynamicSlots.push((a) => p.dynamicSlot(a));
          }
        }
        address[facet.id] = dynamicSlots.length << 1;
        dynamicSlots.push((a) => dynamicFacetSlot(a, facet, providers));
      }
    }
    let dynamic = dynamicSlots.map((f) => f(address));
    return new _Configuration(base2, newCompartments, dynamic, address, staticValues, facets);
  }
};
function flatten(extension, compartments, newCompartments) {
  let result = [[], [], [], [], []];
  let seen = /* @__PURE__ */ new Map();
  function inner(ext, prec2) {
    let known = seen.get(ext);
    if (known != null) {
      if (known >= prec2) return;
      let found = result[known].indexOf(ext);
      if (found > -1) result[known].splice(found, 1);
      if (ext instanceof CompartmentInstance) newCompartments.delete(ext.compartment);
    }
    seen.set(ext, prec2);
    if (Array.isArray(ext)) {
      for (let e of ext) inner(e, prec2);
    } else if (ext instanceof CompartmentInstance) {
      if (newCompartments.has(ext.compartment)) throw new RangeError(`Duplicate use of compartment in extensions`);
      let content2 = compartments.get(ext.compartment) || ext.inner;
      newCompartments.set(ext.compartment, content2);
      inner(content2, prec2);
    } else if (ext instanceof PrecExtension) {
      inner(ext.inner, ext.prec);
    } else if (ext instanceof StateField) {
      result[prec2].push(ext);
      if (ext.provides) inner(ext.provides, prec2);
    } else if (ext instanceof FacetProvider) {
      result[prec2].push(ext);
      if (ext.facet.extensions) inner(ext.facet.extensions, prec2);
    } else {
      let content2 = ext.extension;
      if (!content2)
        throw new Error(
          `Unrecognized extension value in extension set (${ext}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`,
        );
      inner(content2, prec2);
    }
  }
  inner(extension, Prec_.default);
  return result.reduce((a, b) => a.concat(b));
}
function ensureAddr(state, addr) {
  if (addr & 1) return 2;
  let idx = addr >> 1;
  let status = state.status[idx];
  if (status == 4) throw new Error('Cyclic dependency between fields and/or facets');
  if (status & 2) return status;
  state.status[idx] = 4;
  let changed = state.computeSlot(state, state.config.dynamicSlots[idx]);
  return (state.status[idx] = 2 | changed);
}
function getAddr(state, addr) {
  return addr & 1 ? state.config.staticValues[addr >> 1] : state.values[addr >> 1];
}
var languageData = Facet.define();
var allowMultipleSelections = Facet.define({
  combine: (values) => values.some((v) => v),
  static: true,
});
var lineSeparator = Facet.define({
  combine: (values) => (values.length ? values[0] : void 0),
  static: true,
});
var changeFilter = Facet.define();
var transactionFilter = Facet.define();
var transactionExtender = Facet.define();
var readOnly = Facet.define({
  combine: (values) => (values.length ? values[0] : false),
});
var Annotation = class {
  /**
  @internal
  */
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new AnnotationType();
  }
};
var AnnotationType = class {
  /**
  Create an instance of this annotation.
  */
  of(value) {
    return new Annotation(this, value);
  }
};
var StateEffectType = class {
  /**
  @internal
  */
  constructor(map) {
    this.map = map;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(value) {
    return new StateEffect(this, value);
  }
};
var StateEffect = class _StateEffect {
  /**
  @internal
  */
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(mapping) {
    let mapped = this.type.map(this.value, mapping);
    return mapped === void 0 ? void 0 : mapped == this.value ? this : new _StateEffect(this.type, mapped);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(type) {
    return this.type == type;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds.
  */
  static define(spec = {}) {
    return new StateEffectType(spec.map || ((v) => v));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(effects, mapping) {
    if (!effects.length) return effects;
    let result = [];
    for (let effect of effects) {
      let mapped = effect.map(mapping);
      if (mapped) result.push(mapped);
    }
    return result;
  }
};
StateEffect.reconfigure = StateEffect.define();
StateEffect.appendConfig = StateEffect.define();
var Transaction = class _Transaction {
  /**
  @internal
  */
  constructor(startState, changes, selection, effects, annotations, scrollIntoView2) {
    this.startState = startState;
    this.changes = changes;
    this.selection = selection;
    this.effects = effects;
    this.annotations = annotations;
    this.scrollIntoView = scrollIntoView2;
    this._doc = null;
    this._state = null;
    if (selection) checkSelection(selection, changes.newLength);
    if (!annotations.some((a) => a.type == _Transaction.time))
      this.annotations = annotations.concat(_Transaction.time.of(Date.now()));
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so itis recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    if (!this._state) this.startState.applyTransaction(this);
    return this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(type) {
    for (let ann of this.annotations) if (ann.type == type) return ann.value;
    return void 0;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(event) {
    let e = this.annotation(_Transaction.userEvent);
    return !!(
      e &&
      (e == event || (e.length > event.length && e.slice(0, event.length) == event && e[event.length] == '.'))
    );
  }
};
Transaction.time = Annotation.define();
Transaction.userEvent = Annotation.define();
Transaction.addToHistory = Annotation.define();
Transaction.remote = Annotation.define();
function joinRanges(a, b) {
  let result = [];
  for (let iA = 0, iB = 0; ; ) {
    let from, to;
    if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) {
      from = a[iA++];
      to = a[iA++];
    } else if (iB < b.length) {
      from = b[iB++];
      to = b[iB++];
    } else return result;
    if (!result.length || result[result.length - 1] < from) result.push(from, to);
    else if (result[result.length - 1] < to) result[result.length - 1] = to;
  }
}
function mergeTransaction(a, b, sequential) {
  var _a2;
  let mapForA, mapForB, changes;
  if (sequential) {
    mapForA = b.changes;
    mapForB = ChangeSet.empty(b.changes.length);
    changes = a.changes.compose(b.changes);
  } else {
    mapForA = b.changes.map(a.changes);
    mapForB = a.changes.mapDesc(b.changes, true);
    changes = a.changes.compose(mapForA);
  }
  return {
    changes,
    selection: b.selection
      ? b.selection.map(mapForB)
      : (_a2 = a.selection) === null || _a2 === void 0
      ? void 0
      : _a2.map(mapForA),
    effects: StateEffect.mapEffects(a.effects, mapForA).concat(StateEffect.mapEffects(b.effects, mapForB)),
    annotations: a.annotations.length ? a.annotations.concat(b.annotations) : b.annotations,
    scrollIntoView: a.scrollIntoView || b.scrollIntoView,
  };
}
function resolveTransactionInner(state, spec, docSize) {
  let sel = spec.selection,
    annotations = asArray(spec.annotations);
  if (spec.userEvent) annotations = annotations.concat(Transaction.userEvent.of(spec.userEvent));
  return {
    changes:
      spec.changes instanceof ChangeSet
        ? spec.changes
        : ChangeSet.of(spec.changes || [], docSize, state.facet(lineSeparator)),
    selection: sel && (sel instanceof EditorSelection ? sel : EditorSelection.single(sel.anchor, sel.head)),
    effects: asArray(spec.effects),
    annotations,
    scrollIntoView: !!spec.scrollIntoView,
  };
}
function resolveTransaction(state, specs, filter) {
  let s = resolveTransactionInner(state, specs.length ? specs[0] : {}, state.doc.length);
  if (specs.length && specs[0].filter === false) filter = false;
  for (let i = 1; i < specs.length; i++) {
    if (specs[i].filter === false) filter = false;
    let seq = !!specs[i].sequential;
    s = mergeTransaction(
      s,
      resolveTransactionInner(state, specs[i], seq ? s.changes.newLength : state.doc.length),
      seq,
    );
  }
  let tr = new Transaction(state, s.changes, s.selection, s.effects, s.annotations, s.scrollIntoView);
  return extendTransaction(filter ? filterTransaction(tr) : tr);
}
function filterTransaction(tr) {
  let state = tr.startState;
  let result = true;
  for (let filter of state.facet(changeFilter)) {
    let value = filter(tr);
    if (value === false) {
      result = false;
      break;
    }
    if (Array.isArray(value)) result = result === true ? value : joinRanges(result, value);
  }
  if (result !== true) {
    let changes, back;
    if (result === false) {
      back = tr.changes.invertedDesc;
      changes = ChangeSet.empty(state.doc.length);
    } else {
      let filtered = tr.changes.filter(result);
      changes = filtered.changes;
      back = filtered.filtered.invertedDesc;
    }
    tr = new Transaction(
      state,
      changes,
      tr.selection && tr.selection.map(back),
      StateEffect.mapEffects(tr.effects, back),
      tr.annotations,
      tr.scrollIntoView,
    );
  }
  let filters = state.facet(transactionFilter);
  for (let i = filters.length - 1; i >= 0; i--) {
    let filtered = filters[i](tr);
    if (filtered instanceof Transaction) tr = filtered;
    else if (Array.isArray(filtered) && filtered.length == 1 && filtered[0] instanceof Transaction) tr = filtered[0];
    else tr = resolveTransaction(state, asArray(filtered), false);
  }
  return tr;
}
function extendTransaction(tr) {
  let state = tr.startState,
    extenders = state.facet(transactionExtender),
    spec = tr;
  for (let i = extenders.length - 1; i >= 0; i--) {
    let extension = extenders[i](tr);
    if (extension && Object.keys(extension).length)
      spec = mergeTransaction(tr, resolveTransactionInner(state, extension, tr.changes.newLength), true);
  }
  return spec == tr
    ? tr
    : new Transaction(state, tr.changes, tr.selection, spec.effects, spec.annotations, spec.scrollIntoView);
}
var none = [];
function asArray(value) {
  return value == null ? none : Array.isArray(value) ? value : [value];
}
var CharCategory = (function (CharCategory2) {
  CharCategory2[(CharCategory2['Word'] = 0)] = 'Word';
  CharCategory2[(CharCategory2['Space'] = 1)] = 'Space';
  CharCategory2[(CharCategory2['Other'] = 2)] = 'Other';
  return CharCategory2;
})(CharCategory || (CharCategory = {}));
var nonASCIISingleCaseWordChar =
  /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
var wordChar;
try {
  wordChar = new RegExp('[\\p{Alphabetic}\\p{Number}_]', 'u');
} catch (_) {}
function hasWordChar(str) {
  if (wordChar) return wordChar.test(str);
  for (let i = 0; i < str.length; i++) {
    let ch = str[i];
    if (/\w/.test(ch) || (ch > '' && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))))
      return true;
  }
  return false;
}
function makeCategorizer(wordChars) {
  return (char) => {
    if (!/\S/.test(char)) return CharCategory.Space;
    if (hasWordChar(char)) return CharCategory.Word;
    for (let i = 0; i < wordChars.length; i++) if (char.indexOf(wordChars[i]) > -1) return CharCategory.Word;
    return CharCategory.Other;
  };
}
var EditorState = class _EditorState {
  /**
  @internal
  */
  constructor(config, doc2, selection, values, computeSlot, tr) {
    this.config = config;
    this.doc = doc2;
    this.selection = selection;
    this.values = values;
    this.status = config.statusTemplate.slice();
    this.computeSlot = computeSlot;
    if (tr) tr._state = this;
    for (let i = 0; i < this.config.dynamicSlots.length; i++) ensureAddr(this, i << 1);
    this.computeSlot = null;
  }
  field(field, require2 = true) {
    let addr = this.config.address[field.id];
    if (addr == null) {
      if (require2) throw new RangeError('Field is not present in this state');
      return void 0;
    }
    ensureAddr(this, addr);
    return getAddr(this, addr);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...specs) {
    return resolveTransaction(this, specs, true);
  }
  /**
  @internal
  */
  applyTransaction(tr) {
    let conf = this.config,
      { base: base2, compartments } = conf;
    for (let effect of tr.effects) {
      if (effect.is(Compartment.reconfigure)) {
        if (conf) {
          compartments = /* @__PURE__ */ new Map();
          conf.compartments.forEach((val, key) => compartments.set(key, val));
          conf = null;
        }
        compartments.set(effect.value.compartment, effect.value.extension);
      } else if (effect.is(StateEffect.reconfigure)) {
        conf = null;
        base2 = effect.value;
      } else if (effect.is(StateEffect.appendConfig)) {
        conf = null;
        base2 = asArray(base2).concat(effect.value);
      }
    }
    let startValues;
    if (!conf) {
      conf = Configuration.resolve(base2, compartments, this);
      let intermediateState = new _EditorState(
        conf,
        this.doc,
        this.selection,
        conf.dynamicSlots.map(() => null),
        (state, slot) => slot.reconfigure(state, this),
        null,
      );
      startValues = intermediateState.values;
    } else {
      startValues = tr.startState.values.slice();
    }
    new _EditorState(conf, tr.newDoc, tr.newSelection, startValues, (state, slot) => slot.update(state, tr), tr);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(text) {
    if (typeof text == 'string') text = this.toText(text);
    return this.changeByRange((range) => ({
      changes: { from: range.from, to: range.to, insert: text },
      range: EditorSelection.cursor(range.from + text.length),
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(f) {
    let sel = this.selection;
    let result1 = f(sel.ranges[0]);
    let changes = this.changes(result1.changes),
      ranges = [result1.range];
    let effects = asArray(result1.effects);
    for (let i = 1; i < sel.ranges.length; i++) {
      let result = f(sel.ranges[i]);
      let newChanges = this.changes(result.changes),
        newMapped = newChanges.map(changes);
      for (let j = 0; j < i; j++) ranges[j] = ranges[j].map(newMapped);
      let mapBy = changes.mapDesc(newChanges, true);
      ranges.push(result.range.map(mapBy));
      changes = changes.compose(newMapped);
      effects = StateEffect.mapEffects(effects, newMapped).concat(
        StateEffect.mapEffects(asArray(result.effects), mapBy),
      );
    }
    return {
      changes,
      selection: EditorSelection.create(ranges, sel.mainIndex),
      effects,
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(spec = []) {
    if (spec instanceof ChangeSet) return spec;
    return ChangeSet.of(spec, this.doc.length, this.facet(_EditorState.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#text.Text) instance from the given string.
  */
  toText(string2) {
    return Text.of(string2.split(this.facet(_EditorState.lineSeparator) || DefaultSplit));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(from = 0, to = this.doc.length) {
    return this.doc.sliceString(from, to, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(facet) {
    let addr = this.config.address[facet.id];
    if (addr == null) return facet.default;
    ensureAddr(this, addr);
    return getAddr(this, addr);
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(fields) {
    let result = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON(),
    };
    if (fields)
      for (let prop in fields) {
        let value = fields[prop];
        if (value instanceof StateField) result[prop] = value.spec.toJSON(this.field(fields[prop]), this);
      }
    return result;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(json, config = {}, fields) {
    if (!json || typeof json.doc != 'string') throw new RangeError('Invalid JSON representation for EditorState');
    let fieldInit = [];
    if (fields)
      for (let prop in fields) {
        let field = fields[prop],
          value = json[prop];
        fieldInit.push(field.init((state) => field.spec.fromJSON(value, state)));
      }
    return _EditorState.create({
      doc: json.doc,
      selection: EditorSelection.fromJSON(json.selection),
      extensions: config.extensions ? fieldInit.concat([config.extensions]) : fieldInit,
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(config = {}) {
    let configuration = Configuration.resolve(config.extensions || [], /* @__PURE__ */ new Map());
    let doc2 =
      config.doc instanceof Text
        ? config.doc
        : Text.of((config.doc || '').split(configuration.staticFacet(_EditorState.lineSeparator) || DefaultSplit));
    let selection = !config.selection
      ? EditorSelection.single(0)
      : config.selection instanceof EditorSelection
      ? config.selection
      : EditorSelection.single(config.selection.anchor, config.selection.head);
    checkSelection(selection, doc2.length);
    if (!configuration.staticFacet(allowMultipleSelections)) selection = selection.asSingle();
    return new _EditorState(
      configuration,
      doc2,
      selection,
      configuration.dynamicSlots.map(() => null),
      (state, slot) => slot.create(state),
      null,
    );
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(_EditorState.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(_EditorState.lineSeparator) || '\n';
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(readOnly);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  */
  phrase(phrase) {
    for (let map of this.facet(_EditorState.phrases))
      if (Object.prototype.hasOwnProperty.call(map, phrase)) return map[phrase];
    return phrase;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  */
  languageDataAt(name2, pos, side = -1) {
    let values = [];
    for (let provider of this.facet(languageData)) {
      for (let result of provider(this, pos, side)) {
        if (Object.prototype.hasOwnProperty.call(result, name2)) values.push(result[name2]);
      }
    }
    return values;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#text.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(at) {
    return makeCategorizer(this.languageDataAt('wordChars', at).join(''));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(pos) {
    let { text, from, length } = this.doc.lineAt(pos);
    let cat = this.charCategorizer(pos);
    let start = pos - from,
      end = pos - from;
    while (start > 0) {
      let prev = findClusterBreak(text, start, false);
      if (cat(text.slice(prev, start)) != CharCategory.Word) break;
      start = prev;
    }
    while (end < length) {
      let next = findClusterBreak(text, end);
      if (cat(text.slice(end, next)) != CharCategory.Word) break;
      end = next;
    }
    return start == end ? null : EditorSelection.range(start + from, end + from);
  }
};
EditorState.allowMultipleSelections = allowMultipleSelections;
EditorState.tabSize = Facet.define({
  combine: (values) => (values.length ? values[0] : 4),
});
EditorState.lineSeparator = lineSeparator;
EditorState.readOnly = readOnly;
EditorState.phrases = Facet.define();
EditorState.languageData = languageData;
EditorState.changeFilter = changeFilter;
EditorState.transactionFilter = transactionFilter;
EditorState.transactionExtender = transactionExtender;
Compartment.reconfigure = StateEffect.define();
function combineConfig(configs, defaults, combine = {}) {
  let result = {};
  for (let config of configs)
    for (let key of Object.keys(config)) {
      let value = config[key],
        current = result[key];
      if (current === void 0) result[key] = value;
      else if (current === value || value === void 0);
      else if (Object.hasOwnProperty.call(combine, key)) result[key] = combine[key](current, value);
      else throw new Error('Config merge conflict for field ' + key);
    }
  for (let key in defaults) if (result[key] === void 0) result[key] = defaults[key];
  return result;
}

// ../../node_modules/.pnpm/@codemirror+rangeset@0.19.9/node_modules/@codemirror/rangeset/dist/index.js
var RangeValue = class {
  /**
  Compare this value with another value. The default
  implementation compares by identity.
  */
  eq(other) {
    return this == other;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#rangeset.Range) with this value.
  */
  range(from, to = from) {
    return new Range2(from, to, this);
  }
};
RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
RangeValue.prototype.point = false;
RangeValue.prototype.mapMode = MapMode.TrackDel;
var Range2 = class {
  /**
  @internal
  */
  constructor(from, to, value) {
    this.from = from;
    this.to = to;
    this.value = value;
  }
};
function cmpRange(a, b) {
  return a.from - b.from || a.value.startSide - b.value.startSide;
}
var Chunk = class _Chunk {
  constructor(from, to, value, maxPoint) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.maxPoint = maxPoint;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(pos, side, end, startAt = 0) {
    let arr = end ? this.to : this.from;
    for (let lo = startAt, hi = arr.length; ; ) {
      if (lo == hi) return lo;
      let mid = (lo + hi) >> 1;
      let diff = arr[mid] - pos || (end ? this.value[mid].endSide : this.value[mid].startSide) - side;
      if (mid == lo) return diff >= 0 ? lo : hi;
      if (diff >= 0) hi = mid;
      else lo = mid + 1;
    }
  }
  between(offset, from, to, f) {
    for (let i = this.findIndex(from, -1e9, true), e = this.findIndex(to, 1e9, false, i); i < e; i++)
      if (f(this.from[i] + offset, this.to[i] + offset, this.value[i]) === false) return false;
  }
  map(offset, changes) {
    let value = [],
      from = [],
      to = [],
      newPos = -1,
      maxPoint = -1;
    for (let i = 0; i < this.value.length; i++) {
      let val = this.value[i],
        curFrom = this.from[i] + offset,
        curTo = this.to[i] + offset,
        newFrom,
        newTo;
      if (curFrom == curTo) {
        let mapped = changes.mapPos(curFrom, val.startSide, val.mapMode);
        if (mapped == null) continue;
        newFrom = newTo = mapped;
        if (val.startSide != val.endSide) {
          newTo = changes.mapPos(curFrom, val.endSide);
          if (newTo < newFrom) continue;
        }
      } else {
        newFrom = changes.mapPos(curFrom, val.startSide);
        newTo = changes.mapPos(curTo, val.endSide);
        if (newFrom > newTo || (newFrom == newTo && val.startSide > 0 && val.endSide <= 0)) continue;
      }
      if ((newTo - newFrom || val.endSide - val.startSide) < 0) continue;
      if (newPos < 0) newPos = newFrom;
      if (val.point) maxPoint = Math.max(maxPoint, newTo - newFrom);
      value.push(val);
      from.push(newFrom - newPos);
      to.push(newTo - newPos);
    }
    return { mapped: value.length ? new _Chunk(from, to, value, maxPoint) : null, pos: newPos };
  }
};
var RangeSet = class _RangeSet {
  /**
  @internal
  */
  constructor(chunkPos, chunk, nextLayer = _RangeSet.empty, maxPoint) {
    this.chunkPos = chunkPos;
    this.chunk = chunk;
    this.nextLayer = nextLayer;
    this.maxPoint = maxPoint;
  }
  /**
  @internal
  */
  get length() {
    let last = this.chunk.length - 1;
    return last < 0 ? 0 : Math.max(this.chunkEnd(last), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty) return 0;
    let size = this.nextLayer.size;
    for (let chunk of this.chunk) size += chunk.value.length;
    return size;
  }
  /**
  @internal
  */
  chunkEnd(index) {
    return this.chunkPos[index] + this.chunk[index].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (The extra type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(updateSpec) {
    let { add = [], sort = false, filterFrom = 0, filterTo = this.length } = updateSpec;
    let filter = updateSpec.filter;
    if (add.length == 0 && !filter) return this;
    if (sort) add = add.slice().sort(cmpRange);
    if (this.isEmpty) return add.length ? _RangeSet.of(add) : this;
    let cur = new LayerCursor(this, null, -1).goto(0),
      i = 0,
      spill = [];
    let builder = new RangeSetBuilder();
    while (cur.value || i < add.length) {
      if (i < add.length && (cur.from - add[i].from || cur.startSide - add[i].value.startSide) >= 0) {
        let range = add[i++];
        if (!builder.addInner(range.from, range.to, range.value)) spill.push(range);
      } else if (
        cur.rangeIndex == 1 &&
        cur.chunkIndex < this.chunk.length &&
        (i == add.length || this.chunkEnd(cur.chunkIndex) < add[i].from) &&
        (!filter || filterFrom > this.chunkEnd(cur.chunkIndex) || filterTo < this.chunkPos[cur.chunkIndex]) &&
        builder.addChunk(this.chunkPos[cur.chunkIndex], this.chunk[cur.chunkIndex])
      ) {
        cur.nextChunk();
      } else {
        if (!filter || filterFrom > cur.to || filterTo < cur.from || filter(cur.from, cur.to, cur.value)) {
          if (!builder.addInner(cur.from, cur.to, cur.value)) spill.push(new Range2(cur.from, cur.to, cur.value));
        }
        cur.next();
      }
    }
    return builder.finishInner(
      this.nextLayer.isEmpty && !spill.length
        ? _RangeSet.empty
        : this.nextLayer.update({ add: spill, filter, filterFrom, filterTo }),
    );
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(changes) {
    if (changes.empty || this.isEmpty) return this;
    let chunks = [],
      chunkPos = [],
      maxPoint = -1;
    for (let i = 0; i < this.chunk.length; i++) {
      let start = this.chunkPos[i],
        chunk = this.chunk[i];
      let touch = changes.touchesRange(start, start + chunk.length);
      if (touch === false) {
        maxPoint = Math.max(maxPoint, chunk.maxPoint);
        chunks.push(chunk);
        chunkPos.push(changes.mapPos(start));
      } else if (touch === true) {
        let { mapped, pos } = chunk.map(start, changes);
        if (mapped) {
          maxPoint = Math.max(maxPoint, mapped.maxPoint);
          chunks.push(mapped);
          chunkPos.push(pos);
        }
      }
    }
    let next = this.nextLayer.map(changes);
    return chunks.length == 0 ? next : new _RangeSet(chunkPos, chunks, next, maxPoint);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(from, to, f) {
    if (this.isEmpty) return;
    for (let i = 0; i < this.chunk.length; i++) {
      let start = this.chunkPos[i],
        chunk = this.chunk[i];
      if (to >= start && from <= start + chunk.length && chunk.between(start, from - start, to - start, f) === false)
        return;
    }
    this.nextLayer.between(from, to, f);
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(from = 0) {
    return HeapCursor.from([this]).goto(from);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(sets, from = 0) {
    return HeapCursor.from(sets).goto(from);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(oldSets, newSets, textDiff, comparator, minPointSize = -1) {
    let a = oldSets.filter((set) => set.maxPoint > 0 || (!set.isEmpty && set.maxPoint >= minPointSize));
    let b = newSets.filter((set) => set.maxPoint > 0 || (!set.isEmpty && set.maxPoint >= minPointSize));
    let sharedChunks = findSharedChunks(a, b, textDiff);
    let sideA = new SpanCursor(a, sharedChunks, minPointSize);
    let sideB = new SpanCursor(b, sharedChunks, minPointSize);
    textDiff.iterGaps((fromA, fromB, length) => compare(sideA, fromA, sideB, fromB, length, comparator));
    if (textDiff.empty && textDiff.length == 0) compare(sideA, 0, sideB, 0, 0, comparator);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(oldSets, newSets, from = 0, to) {
    if (to == null) to = 1e9;
    let a = oldSets.filter((set) => !set.isEmpty && newSets.indexOf(set) < 0);
    let b = newSets.filter((set) => !set.isEmpty && oldSets.indexOf(set) < 0);
    if (a.length != b.length) return false;
    if (!a.length) return true;
    let sharedChunks = findSharedChunks(a, b);
    let sideA = new SpanCursor(a, sharedChunks, 0).goto(from),
      sideB = new SpanCursor(b, sharedChunks, 0).goto(from);
    for (;;) {
      if (
        sideA.to != sideB.to ||
        !sameValues(sideA.active, sideB.active) ||
        (sideA.point && (!sideB.point || !sideA.point.eq(sideB.point)))
      )
        return false;
      if (sideA.to > to) return true;
      sideA.next();
      sideB.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#rangeset.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(sets, from, to, iterator, minPointSize = -1) {
    var _a2;
    let cursor = new SpanCursor(
        sets,
        null,
        minPointSize,
        (_a2 = iterator.filterPoint) === null || _a2 === void 0 ? void 0 : _a2.bind(iterator),
      ).goto(from),
      pos = from;
    let open = cursor.openStart;
    for (;;) {
      let curTo = Math.min(cursor.to, to);
      if (cursor.point) {
        iterator.point(pos, curTo, cursor.point, cursor.activeForPoint(cursor.to), open);
        open = cursor.openEnd(curTo) + (cursor.to > curTo ? 1 : 0);
      } else if (curTo > pos) {
        iterator.span(pos, curTo, cursor.active, open);
        open = cursor.openEnd(curTo);
      }
      if (cursor.to > to) break;
      pos = cursor.to;
      cursor.next();
    }
    return open;
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(ranges, sort = false) {
    let build = new RangeSetBuilder();
    for (let range of ranges instanceof Range2 ? [ranges] : sort ? lazySort(ranges) : ranges)
      build.add(range.from, range.to, range.value);
    return build.finish();
  }
};
RangeSet.empty = new RangeSet([], [], null, -1);
function lazySort(ranges) {
  if (ranges.length > 1)
    for (let prev = ranges[0], i = 1; i < ranges.length; i++) {
      let cur = ranges[i];
      if (cmpRange(prev, cur) > 0) return ranges.slice().sort(cmpRange);
      prev = cur;
    }
  return ranges;
}
RangeSet.empty.nextLayer = RangeSet.empty;
var RangeSetBuilder = class _RangeSetBuilder {
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [];
    this.chunkPos = [];
    this.chunkStart = -1;
    this.last = null;
    this.lastFrom = -1e9;
    this.lastTo = -1e9;
    this.from = [];
    this.to = [];
    this.value = [];
    this.maxPoint = -1;
    this.setMaxPoint = -1;
    this.nextLayer = null;
  }
  finishChunk(newArrays) {
    this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint));
    this.chunkPos.push(this.chunkStart);
    this.chunkStart = -1;
    this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint);
    this.maxPoint = -1;
    if (newArrays) {
      this.from = [];
      this.to = [];
      this.value = [];
    }
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(from, to, value) {
    if (!this.addInner(from, to, value))
      (this.nextLayer || (this.nextLayer = new _RangeSetBuilder())).add(from, to, value);
  }
  /**
  @internal
  */
  addInner(from, to, value) {
    let diff = from - this.lastTo || value.startSide - this.last.endSide;
    if (diff <= 0 && (from - this.lastFrom || value.startSide - this.last.startSide) < 0)
      throw new Error('Ranges must be added sorted by `from` position and `startSide`');
    if (diff < 0) return false;
    if (this.from.length == 250) this.finishChunk(true);
    if (this.chunkStart < 0) this.chunkStart = from;
    this.from.push(from - this.chunkStart);
    this.to.push(to - this.chunkStart);
    this.last = value;
    this.lastFrom = from;
    this.lastTo = to;
    this.value.push(value);
    if (value.point) this.maxPoint = Math.max(this.maxPoint, to - from);
    return true;
  }
  /**
  @internal
  */
  addChunk(from, chunk) {
    if ((from - this.lastTo || chunk.value[0].startSide - this.last.endSide) < 0) return false;
    if (this.from.length) this.finishChunk(true);
    this.setMaxPoint = Math.max(this.setMaxPoint, chunk.maxPoint);
    this.chunks.push(chunk);
    this.chunkPos.push(from);
    let last = chunk.value.length - 1;
    this.last = chunk.value[last];
    this.lastFrom = chunk.from[last] + from;
    this.lastTo = chunk.to[last] + from;
    return true;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(RangeSet.empty);
  }
  /**
  @internal
  */
  finishInner(next) {
    if (this.from.length) this.finishChunk(false);
    if (this.chunks.length == 0) return next;
    let result = new RangeSet(
      this.chunkPos,
      this.chunks,
      this.nextLayer ? this.nextLayer.finishInner(next) : next,
      this.setMaxPoint,
    );
    this.from = null;
    return result;
  }
};
function findSharedChunks(a, b, textDiff) {
  let inA = /* @__PURE__ */ new Map();
  for (let set of a)
    for (let i = 0; i < set.chunk.length; i++) if (set.chunk[i].maxPoint <= 0) inA.set(set.chunk[i], set.chunkPos[i]);
  let shared = /* @__PURE__ */ new Set();
  for (let set of b)
    for (let i = 0; i < set.chunk.length; i++) {
      let known = inA.get(set.chunk[i]);
      if (
        known != null &&
        (textDiff ? textDiff.mapPos(known) : known) == set.chunkPos[i] &&
        !(textDiff === null || textDiff === void 0 ? void 0 : textDiff.touchesRange(known, known + set.chunk[i].length))
      )
        shared.add(set.chunk[i]);
    }
  return shared;
}
var LayerCursor = class {
  constructor(layer, skip, minPoint, rank = 0) {
    this.layer = layer;
    this.skip = skip;
    this.minPoint = minPoint;
    this.rank = rank;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(pos, side = -1e9) {
    this.chunkIndex = this.rangeIndex = 0;
    this.gotoInner(pos, side, false);
    return this;
  }
  gotoInner(pos, side, forward) {
    while (this.chunkIndex < this.layer.chunk.length) {
      let next = this.layer.chunk[this.chunkIndex];
      if (
        !(
          (this.skip && this.skip.has(next)) ||
          this.layer.chunkEnd(this.chunkIndex) < pos ||
          next.maxPoint < this.minPoint
        )
      )
        break;
      this.chunkIndex++;
      forward = false;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let rangeIndex = this.layer.chunk[this.chunkIndex].findIndex(
        pos - this.layer.chunkPos[this.chunkIndex],
        side,
        true,
      );
      if (!forward || this.rangeIndex < rangeIndex) this.setRangeIndex(rangeIndex);
    }
    this.next();
  }
  forward(pos, side) {
    if ((this.to - pos || this.endSide - side) < 0) this.gotoInner(pos, side, true);
  }
  next() {
    for (;;) {
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9;
        this.value = null;
        break;
      } else {
        let chunkPos = this.layer.chunkPos[this.chunkIndex],
          chunk = this.layer.chunk[this.chunkIndex];
        let from = chunkPos + chunk.from[this.rangeIndex];
        this.from = from;
        this.to = chunkPos + chunk.to[this.rangeIndex];
        this.value = chunk.value[this.rangeIndex];
        this.setRangeIndex(this.rangeIndex + 1);
        if (this.minPoint < 0 || (this.value.point && this.to - this.from >= this.minPoint)) break;
      }
    }
  }
  setRangeIndex(index) {
    if (index == this.layer.chunk[this.chunkIndex].value.length) {
      this.chunkIndex++;
      if (this.skip) {
        while (this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]))
          this.chunkIndex++;
      }
      this.rangeIndex = 0;
    } else {
      this.rangeIndex = index;
    }
  }
  nextChunk() {
    this.chunkIndex++;
    this.rangeIndex = 0;
    this.next();
  }
  compare(other) {
    return (
      this.from - other.from ||
      this.startSide - other.startSide ||
      this.rank - other.rank ||
      this.to - other.to ||
      this.endSide - other.endSide
    );
  }
};
var HeapCursor = class _HeapCursor {
  constructor(heap) {
    this.heap = heap;
  }
  static from(sets, skip = null, minPoint = -1) {
    let heap = [];
    for (let i = 0; i < sets.length; i++) {
      for (let cur = sets[i]; !cur.isEmpty; cur = cur.nextLayer) {
        if (cur.maxPoint >= minPoint) heap.push(new LayerCursor(cur, skip, minPoint, i));
      }
    }
    return heap.length == 1 ? heap[0] : new _HeapCursor(heap);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(pos, side = -1e9) {
    for (let cur of this.heap) cur.goto(pos, side);
    for (let i = this.heap.length >> 1; i >= 0; i--) heapBubble(this.heap, i);
    this.next();
    return this;
  }
  forward(pos, side) {
    for (let cur of this.heap) cur.forward(pos, side);
    for (let i = this.heap.length >> 1; i >= 0; i--) heapBubble(this.heap, i);
    if ((this.to - pos || this.value.endSide - side) < 0) this.next();
  }
  next() {
    if (this.heap.length == 0) {
      this.from = this.to = 1e9;
      this.value = null;
      this.rank = -1;
    } else {
      let top = this.heap[0];
      this.from = top.from;
      this.to = top.to;
      this.value = top.value;
      this.rank = top.rank;
      if (top.value) top.next();
      heapBubble(this.heap, 0);
    }
  }
};
function heapBubble(heap, index) {
  for (let cur = heap[index]; ; ) {
    let childIndex = (index << 1) + 1;
    if (childIndex >= heap.length) break;
    let child = heap[childIndex];
    if (childIndex + 1 < heap.length && child.compare(heap[childIndex + 1]) >= 0) {
      child = heap[childIndex + 1];
      childIndex++;
    }
    if (cur.compare(child) < 0) break;
    heap[childIndex] = cur;
    heap[index] = child;
    index = childIndex;
  }
}
var SpanCursor = class {
  constructor(sets, skip, minPoint, filterPoint = () => true) {
    this.minPoint = minPoint;
    this.filterPoint = filterPoint;
    this.active = [];
    this.activeTo = [];
    this.activeRank = [];
    this.minActive = -1;
    this.point = null;
    this.pointFrom = 0;
    this.pointRank = 0;
    this.to = -1e9;
    this.endSide = 0;
    this.openStart = -1;
    this.cursor = HeapCursor.from(sets, skip, minPoint);
  }
  goto(pos, side = -1e9) {
    this.cursor.goto(pos, side);
    this.active.length = this.activeTo.length = this.activeRank.length = 0;
    this.minActive = -1;
    this.to = pos;
    this.endSide = side;
    this.openStart = -1;
    this.next();
    return this;
  }
  forward(pos, side) {
    while (
      this.minActive > -1 &&
      (this.activeTo[this.minActive] - pos || this.active[this.minActive].endSide - side) < 0
    )
      this.removeActive(this.minActive);
    this.cursor.forward(pos, side);
  }
  removeActive(index) {
    remove(this.active, index);
    remove(this.activeTo, index);
    remove(this.activeRank, index);
    this.minActive = findMinIndex(this.active, this.activeTo);
  }
  addActive(trackOpen) {
    let i = 0,
      { value, to, rank } = this.cursor;
    while (i < this.activeRank.length && this.activeRank[i] <= rank) i++;
    insert(this.active, i, value);
    insert(this.activeTo, i, to);
    insert(this.activeRank, i, rank);
    if (trackOpen) insert(trackOpen, i, this.cursor.from);
    this.minActive = findMinIndex(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let from = this.to,
      wasPoint = this.point;
    this.point = null;
    let trackOpen = this.openStart < 0 ? [] : null,
      trackExtra = 0;
    for (;;) {
      let a = this.minActive;
      if (a > -1 && (this.activeTo[a] - this.cursor.from || this.active[a].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[a] > from) {
          this.to = this.activeTo[a];
          this.endSide = this.active[a].endSide;
          break;
        }
        this.removeActive(a);
        if (trackOpen) remove(trackOpen, a);
      } else if (!this.cursor.value) {
        this.to = this.endSide = 1e9;
        break;
      } else if (this.cursor.from > from) {
        this.to = this.cursor.from;
        this.endSide = this.cursor.startSide;
        break;
      } else {
        let nextVal = this.cursor.value;
        if (!nextVal.point) {
          this.addActive(trackOpen);
          this.cursor.next();
        } else if (wasPoint && this.cursor.to == this.to && this.cursor.from < this.cursor.to) {
          this.cursor.next();
        } else if (!this.filterPoint(this.cursor.from, this.cursor.to, this.cursor.value, this.cursor.rank)) {
          this.cursor.next();
        } else {
          this.point = nextVal;
          this.pointFrom = this.cursor.from;
          this.pointRank = this.cursor.rank;
          this.to = this.cursor.to;
          this.endSide = nextVal.endSide;
          if (this.cursor.from < from) trackExtra = 1;
          this.cursor.next();
          this.forward(this.to, this.endSide);
          break;
        }
      }
    }
    if (trackOpen) {
      let openStart = 0;
      while (openStart < trackOpen.length && trackOpen[openStart] < from) openStart++;
      this.openStart = openStart + trackExtra;
    }
  }
  activeForPoint(to) {
    if (!this.active.length) return this.active;
    let active = [];
    for (let i = this.active.length - 1; i >= 0; i--) {
      if (this.activeRank[i] < this.pointRank) break;
      if (this.activeTo[i] > to || (this.activeTo[i] == to && this.active[i].endSide >= this.point.endSide))
        active.push(this.active[i]);
    }
    return active.reverse();
  }
  openEnd(to) {
    let open = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > to; i--) open++;
    return open;
  }
};
function compare(a, startA, b, startB, length, comparator) {
  a.goto(startA);
  b.goto(startB);
  let endB = startB + length;
  let pos = startB,
    dPos = startB - startA;
  for (;;) {
    let diff = a.to + dPos - b.to || a.endSide - b.endSide;
    let end = diff < 0 ? a.to + dPos : b.to,
      clipEnd = Math.min(end, endB);
    if (a.point || b.point) {
      if (
        !(
          a.point &&
          b.point &&
          (a.point == b.point || a.point.eq(b.point)) &&
          sameValues(a.activeForPoint(a.to + dPos), b.activeForPoint(b.to))
        )
      )
        comparator.comparePoint(pos, clipEnd, a.point, b.point);
    } else {
      if (clipEnd > pos && !sameValues(a.active, b.active)) comparator.compareRange(pos, clipEnd, a.active, b.active);
    }
    if (end > endB) break;
    pos = end;
    if (diff <= 0) a.next();
    if (diff >= 0) b.next();
  }
}
function sameValues(a, b) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] != b[i] && !a[i].eq(b[i])) return false;
  return true;
}
function remove(array, index) {
  for (let i = index, e = array.length - 1; i < e; i++) array[i] = array[i + 1];
  array.pop();
}
function insert(array, index, value) {
  for (let i = array.length - 1; i >= index; i--) array[i + 1] = array[i];
  array[index] = value;
}
function findMinIndex(value, array) {
  let found = -1,
    foundPos = 1e9;
  for (let i = 0; i < array.length; i++)
    if ((array[i] - foundPos || value[i].endSide - value[found].endSide) < 0) {
      found = i;
      foundPos = array[i];
    }
  return found;
}

// ../../node_modules/.pnpm/@codemirror+view@0.19.48/node_modules/@codemirror/view/dist/index.js
function getSelection(root) {
  let target;
  if (root.nodeType == 11) {
    target = root.getSelection ? root : root.ownerDocument;
  } else {
    target = root;
  }
  return target.getSelection();
}
function contains(dom, node) {
  return node ? dom == node || dom.contains(node.nodeType != 1 ? node.parentNode : node) : false;
}
function deepActiveElement() {
  let elt = document.activeElement;
  while (elt && elt.shadowRoot) elt = elt.shadowRoot.activeElement;
  return elt;
}
function hasSelection(dom, selection) {
  if (!selection.anchorNode) return false;
  try {
    return contains(dom, selection.anchorNode);
  } catch (_) {
    return false;
  }
}
function clientRectsFor(dom) {
  if (dom.nodeType == 3) return textRange(dom, 0, dom.nodeValue.length).getClientRects();
  else if (dom.nodeType == 1) return dom.getClientRects();
  else return [];
}
function isEquivalentPosition(node, off, targetNode, targetOff) {
  return targetNode
    ? scanFor(node, off, targetNode, targetOff, -1) || scanFor(node, off, targetNode, targetOff, 1)
    : false;
}
function domIndex(node) {
  for (var index = 0; ; index++) {
    node = node.previousSibling;
    if (!node) return index;
  }
}
function scanFor(node, off, targetNode, targetOff, dir) {
  for (;;) {
    if (node == targetNode && off == targetOff) return true;
    if (off == (dir < 0 ? 0 : maxOffset(node))) {
      if (node.nodeName == 'DIV') return false;
      let parent = node.parentNode;
      if (!parent || parent.nodeType != 1) return false;
      off = domIndex(node) + (dir < 0 ? 0 : 1);
      node = parent;
    } else if (node.nodeType == 1) {
      node = node.childNodes[off + (dir < 0 ? -1 : 0)];
      if (node.nodeType == 1 && node.contentEditable == 'false') return false;
      off = dir < 0 ? maxOffset(node) : 0;
    } else {
      return false;
    }
  }
}
function maxOffset(node) {
  return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
var Rect0 = { left: 0, right: 0, top: 0, bottom: 0 };
function flattenRect(rect, left) {
  let x = left ? rect.left : rect.right;
  return { left: x, right: x, top: rect.top, bottom: rect.bottom };
}
function windowRect(win) {
  return {
    left: 0,
    right: win.innerWidth,
    top: 0,
    bottom: win.innerHeight,
  };
}
function scrollRectIntoView(dom, rect, side, x, y, xMargin, yMargin, ltr) {
  let doc2 = dom.ownerDocument,
    win = doc2.defaultView;
  for (let cur = dom; cur; ) {
    if (cur.nodeType == 1) {
      let bounding,
        top = cur == doc2.body;
      if (top) {
        bounding = windowRect(win);
      } else {
        if (cur.scrollHeight <= cur.clientHeight && cur.scrollWidth <= cur.clientWidth) {
          cur = cur.parentNode;
          continue;
        }
        let rect2 = cur.getBoundingClientRect();
        bounding = {
          left: rect2.left,
          right: rect2.left + cur.clientWidth,
          top: rect2.top,
          bottom: rect2.top + cur.clientHeight,
        };
      }
      let moveX = 0,
        moveY = 0;
      if (y == 'nearest') {
        if (rect.top < bounding.top) {
          moveY = -(bounding.top - rect.top + yMargin);
          if (side > 0 && rect.bottom > bounding.bottom + moveY)
            moveY = rect.bottom - bounding.bottom + moveY + yMargin;
        } else if (rect.bottom > bounding.bottom) {
          moveY = rect.bottom - bounding.bottom + yMargin;
          if (side < 0 && rect.top - moveY < bounding.top) moveY = -(bounding.top + moveY - rect.top + yMargin);
        }
      } else {
        let rectHeight = rect.bottom - rect.top,
          boundingHeight = bounding.bottom - bounding.top;
        let targetTop =
          y == 'center' && rectHeight <= boundingHeight
            ? rect.top + rectHeight / 2 - boundingHeight / 2
            : y == 'start' || (y == 'center' && side < 0)
            ? rect.top - yMargin
            : rect.bottom - boundingHeight + yMargin;
        moveY = targetTop - bounding.top;
      }
      if (x == 'nearest') {
        if (rect.left < bounding.left) {
          moveX = -(bounding.left - rect.left + xMargin);
          if (side > 0 && rect.right > bounding.right + moveX) moveX = rect.right - bounding.right + moveX + xMargin;
        } else if (rect.right > bounding.right) {
          moveX = rect.right - bounding.right + xMargin;
          if (side < 0 && rect.left < bounding.left + moveX) moveX = -(bounding.left + moveX - rect.left + xMargin);
        }
      } else {
        let targetLeft =
          x == 'center'
            ? rect.left + (rect.right - rect.left) / 2 - (bounding.right - bounding.left) / 2
            : (x == 'start') == ltr
            ? rect.left - xMargin
            : rect.right - (bounding.right - bounding.left) + xMargin;
        moveX = targetLeft - bounding.left;
      }
      if (moveX || moveY) {
        if (top) {
          win.scrollBy(moveX, moveY);
        } else {
          if (moveY) {
            let start = cur.scrollTop;
            cur.scrollTop += moveY;
            moveY = cur.scrollTop - start;
          }
          if (moveX) {
            let start = cur.scrollLeft;
            cur.scrollLeft += moveX;
            moveX = cur.scrollLeft - start;
          }
          rect = {
            left: rect.left - moveX,
            top: rect.top - moveY,
            right: rect.right - moveX,
            bottom: rect.bottom - moveY,
          };
        }
      }
      if (top) break;
      cur = cur.assignedSlot || cur.parentNode;
      x = y = 'nearest';
    } else if (cur.nodeType == 11) {
      cur = cur.host;
    } else {
      break;
    }
  }
}
var DOMSelectionState = class {
  constructor() {
    this.anchorNode = null;
    this.anchorOffset = 0;
    this.focusNode = null;
    this.focusOffset = 0;
  }
  eq(domSel) {
    return (
      this.anchorNode == domSel.anchorNode &&
      this.anchorOffset == domSel.anchorOffset &&
      this.focusNode == domSel.focusNode &&
      this.focusOffset == domSel.focusOffset
    );
  }
  setRange(range) {
    this.set(range.anchorNode, range.anchorOffset, range.focusNode, range.focusOffset);
  }
  set(anchorNode, anchorOffset, focusNode, focusOffset) {
    this.anchorNode = anchorNode;
    this.anchorOffset = anchorOffset;
    this.focusNode = focusNode;
    this.focusOffset = focusOffset;
  }
};
var preventScrollSupported = null;
function focusPreventScroll(dom) {
  if (dom.setActive) return dom.setActive();
  if (preventScrollSupported) return dom.focus(preventScrollSupported);
  let stack = [];
  for (let cur = dom; cur; cur = cur.parentNode) {
    stack.push(cur, cur.scrollTop, cur.scrollLeft);
    if (cur == cur.ownerDocument) break;
  }
  dom.focus(
    preventScrollSupported == null
      ? {
          get preventScroll() {
            preventScrollSupported = { preventScroll: true };
            return true;
          },
        }
      : void 0,
  );
  if (!preventScrollSupported) {
    preventScrollSupported = false;
    for (let i = 0; i < stack.length; ) {
      let elt = stack[i++],
        top = stack[i++],
        left = stack[i++];
      if (elt.scrollTop != top) elt.scrollTop = top;
      if (elt.scrollLeft != left) elt.scrollLeft = left;
    }
  }
}
var scratchRange;
function textRange(node, from, to = from) {
  let range = scratchRange || (scratchRange = document.createRange());
  range.setEnd(node, to);
  range.setStart(node, from);
  return range;
}
function dispatchKey(elt, name2, code) {
  let options = { key: name2, code: name2, keyCode: code, which: code, cancelable: true };
  let down = new KeyboardEvent('keydown', options);
  down.synthetic = true;
  elt.dispatchEvent(down);
  let up = new KeyboardEvent('keyup', options);
  up.synthetic = true;
  elt.dispatchEvent(up);
  return down.defaultPrevented || up.defaultPrevented;
}
function getRoot(node) {
  while (node) {
    if (node && (node.nodeType == 9 || (node.nodeType == 11 && node.host))) return node;
    node = node.assignedSlot || node.parentNode;
  }
  return null;
}
function clearAttributes(node) {
  while (node.attributes.length) node.removeAttributeNode(node.attributes[0]);
}
var DOMPos = class _DOMPos {
  constructor(node, offset, precise = true) {
    this.node = node;
    this.offset = offset;
    this.precise = precise;
  }
  static before(dom, precise) {
    return new _DOMPos(dom.parentNode, domIndex(dom), precise);
  }
  static after(dom, precise) {
    return new _DOMPos(dom.parentNode, domIndex(dom) + 1, precise);
  }
};
var noChildren = [];
var ContentView = class _ContentView {
  constructor() {
    this.parent = null;
    this.dom = null;
    this.dirty = 2;
  }
  get editorView() {
    if (!this.parent) throw new Error('Accessing view in orphan content view');
    return this.parent.editorView;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(view) {
    let pos = this.posAtStart;
    for (let child of this.children) {
      if (child == view) return pos;
      pos += child.length + child.breakAfter;
    }
    throw new RangeError('Invalid child in posBefore');
  }
  posAfter(view) {
    return this.posBefore(view) + view.length;
  }
  // Will return a rectangle directly before (when side < 0), after
  // (side > 0) or directly on (when the browser supports it) the
  // given position.
  coordsAt(_pos, _side) {
    return null;
  }
  sync(track) {
    if (this.dirty & 2) {
      let parent = this.dom;
      let prev = null,
        next;
      for (let child of this.children) {
        if (child.dirty) {
          if (!child.dom && (next = prev ? prev.nextSibling : parent.firstChild)) {
            let contentView = _ContentView.get(next);
            if (!contentView || (!contentView.parent && contentView.constructor == child.constructor))
              child.reuseDOM(next);
          }
          child.sync(track);
          child.dirty = 0;
        }
        next = prev ? prev.nextSibling : parent.firstChild;
        if (track && !track.written && track.node == parent && next != child.dom) track.written = true;
        if (child.dom.parentNode == parent) {
          while (next && next != child.dom) next = rm(next);
        } else {
          parent.insertBefore(child.dom, next);
        }
        prev = child.dom;
      }
      next = prev ? prev.nextSibling : parent.firstChild;
      if (next && track && track.node == parent) track.written = true;
      while (next) next = rm(next);
    } else if (this.dirty & 1) {
      for (let child of this.children)
        if (child.dirty) {
          child.sync(track);
          child.dirty = 0;
        }
    }
  }
  reuseDOM(_dom) {}
  localPosFromDOM(node, offset) {
    let after;
    if (node == this.dom) {
      after = this.dom.childNodes[offset];
    } else {
      let bias = maxOffset(node) == 0 ? 0 : offset == 0 ? -1 : 1;
      for (;;) {
        let parent = node.parentNode;
        if (parent == this.dom) break;
        if (bias == 0 && parent.firstChild != parent.lastChild) {
          if (node == parent.firstChild) bias = -1;
          else bias = 1;
        }
        node = parent;
      }
      if (bias < 0) after = node;
      else after = node.nextSibling;
    }
    if (after == this.dom.firstChild) return 0;
    while (after && !_ContentView.get(after)) after = after.nextSibling;
    if (!after) return this.length;
    for (let i = 0, pos = 0; ; i++) {
      let child = this.children[i];
      if (child.dom == after) return pos;
      pos += child.length + child.breakAfter;
    }
  }
  domBoundsAround(from, to, offset = 0) {
    let fromI = -1,
      fromStart = -1,
      toI = -1,
      toEnd = -1;
    for (let i = 0, pos = offset, prevEnd = offset; i < this.children.length; i++) {
      let child = this.children[i],
        end = pos + child.length;
      if (pos < from && end > to) return child.domBoundsAround(from, to, pos);
      if (end >= from && fromI == -1) {
        fromI = i;
        fromStart = pos;
      }
      if (pos > to && child.dom.parentNode == this.dom) {
        toI = i;
        toEnd = prevEnd;
        break;
      }
      prevEnd = end;
      pos = end + child.breakAfter;
    }
    return {
      from: fromStart,
      to: toEnd < 0 ? offset + this.length : toEnd,
      startDOM: (fromI ? this.children[fromI - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: toI < this.children.length && toI >= 0 ? this.children[toI].dom : null,
    };
  }
  markDirty(andParent = false) {
    this.dirty |= 2;
    this.markParentsDirty(andParent);
  }
  markParentsDirty(childList) {
    for (let parent = this.parent; parent; parent = parent.parent) {
      if (childList) parent.dirty |= 2;
      if (parent.dirty & 1) return;
      parent.dirty |= 1;
      childList = false;
    }
  }
  setParent(parent) {
    if (this.parent != parent) {
      this.parent = parent;
      if (this.dirty) this.markParentsDirty(true);
    }
  }
  setDOM(dom) {
    if (this.dom) this.dom.cmView = null;
    this.dom = dom;
    dom.cmView = this;
  }
  get rootView() {
    for (let v = this; ; ) {
      let parent = v.parent;
      if (!parent) return v;
      v = parent;
    }
  }
  replaceChildren(from, to, children = noChildren) {
    this.markDirty();
    for (let i = from; i < to; i++) {
      let child = this.children[i];
      if (child.parent == this) child.destroy();
    }
    this.children.splice(from, to - from, ...children);
    for (let i = 0; i < children.length; i++) children[i].setParent(this);
  }
  ignoreMutation(_rec) {
    return false;
  }
  ignoreEvent(_event) {
    return false;
  }
  childCursor(pos = this.length) {
    return new ChildCursor(this.children, pos, this.children.length);
  }
  childPos(pos, bias = 1) {
    return this.childCursor().findPos(pos, bias);
  }
  toString() {
    let name2 = this.constructor.name.replace('View', '');
    return (
      name2 +
      (this.children.length
        ? '(' + this.children.join() + ')'
        : this.length
        ? '[' + (name2 == 'Text' ? this.text : this.length) + ']'
        : '') +
      (this.breakAfter ? '#' : '')
    );
  }
  static get(node) {
    return node.cmView;
  }
  get isEditable() {
    return true;
  }
  merge(from, to, source, hasStart, openStart, openEnd) {
    return false;
  }
  become(other) {
    return false;
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    this.parent = null;
  }
};
ContentView.prototype.breakAfter = 0;
function rm(dom) {
  let next = dom.nextSibling;
  dom.parentNode.removeChild(dom);
  return next;
}
var ChildCursor = class {
  constructor(children, pos, i) {
    this.children = children;
    this.pos = pos;
    this.i = i;
    this.off = 0;
  }
  findPos(pos, bias = 1) {
    for (;;) {
      if (pos > this.pos || (pos == this.pos && (bias > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))) {
        this.off = pos - this.pos;
        return this;
      }
      let next = this.children[--this.i];
      this.pos -= next.length + next.breakAfter;
    }
  }
};
function replaceRange(parent, fromI, fromOff, toI, toOff, insert2, breakAtStart, openStart, openEnd) {
  let { children } = parent;
  let before = children.length ? children[fromI] : null;
  let last = insert2.length ? insert2[insert2.length - 1] : null;
  let breakAtEnd = last ? last.breakAfter : breakAtStart;
  if (
    fromI == toI &&
    before &&
    !breakAtStart &&
    !breakAtEnd &&
    insert2.length < 2 &&
    before.merge(fromOff, toOff, insert2.length ? last : null, fromOff == 0, openStart, openEnd)
  )
    return;
  if (toI < children.length) {
    let after = children[toI];
    if (after && toOff < after.length) {
      if (fromI == toI) {
        after = after.split(toOff);
        toOff = 0;
      }
      if (!breakAtEnd && last && after.merge(0, toOff, last, true, 0, openEnd)) {
        insert2[insert2.length - 1] = after;
      } else {
        if (toOff) after.merge(0, toOff, null, false, 0, openEnd);
        insert2.push(after);
      }
    } else if (after === null || after === void 0 ? void 0 : after.breakAfter) {
      if (last) last.breakAfter = 1;
      else breakAtStart = 1;
    }
    toI++;
  }
  if (before) {
    before.breakAfter = breakAtStart;
    if (fromOff > 0) {
      if (!breakAtStart && insert2.length && before.merge(fromOff, before.length, insert2[0], false, openStart, 0)) {
        before.breakAfter = insert2.shift().breakAfter;
      } else if (
        fromOff < before.length ||
        (before.children.length && before.children[before.children.length - 1].length == 0)
      ) {
        before.merge(fromOff, before.length, null, false, openStart, 0);
      }
      fromI++;
    }
  }
  while (fromI < toI && insert2.length) {
    if (children[toI - 1].become(insert2[insert2.length - 1])) {
      toI--;
      insert2.pop();
      openEnd = insert2.length ? 0 : openStart;
    } else if (children[fromI].become(insert2[0])) {
      fromI++;
      insert2.shift();
      openStart = insert2.length ? 0 : openEnd;
    } else {
      break;
    }
  }
  if (
    !insert2.length &&
    fromI &&
    toI < children.length &&
    !children[fromI - 1].breakAfter &&
    children[toI].merge(0, 0, children[fromI - 1], false, openStart, openEnd)
  )
    fromI--;
  if (fromI < toI || insert2.length) parent.replaceChildren(fromI, toI, insert2);
}
function mergeChildrenInto(parent, from, to, insert2, openStart, openEnd) {
  let cur = parent.childCursor();
  let { i: toI, off: toOff } = cur.findPos(to, 1);
  let { i: fromI, off: fromOff } = cur.findPos(from, -1);
  let dLen = from - to;
  for (let view of insert2) dLen += view.length;
  parent.length += dLen;
  replaceRange(parent, fromI, fromOff, toI, toOff, insert2, 0, openStart, openEnd);
}
var nav = typeof navigator != 'undefined' ? navigator : { userAgent: '', vendor: '', platform: '' };
var doc = typeof document != 'undefined' ? document : { documentElement: { style: {} } };
var ie_edge = /Edge\/(\d+)/.exec(nav.userAgent);
var ie_upto10 = /MSIE \d/.test(nav.userAgent);
var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent);
var ie = !!(ie_upto10 || ie_11up || ie_edge);
var gecko = !ie && /gecko\/(\d+)/i.test(nav.userAgent);
var chrome = !ie && /Chrome\/(\d+)/.exec(nav.userAgent);
var webkit = 'webkitFontSmoothing' in doc.documentElement.style;
var safari = !ie && /Apple Computer/.test(nav.vendor);
var ios = safari && (/Mobile\/\w+/.test(nav.userAgent) || nav.maxTouchPoints > 2);
var browser = {
  mac: ios || /Mac/.test(nav.platform),
  windows: /Win/.test(nav.platform),
  linux: /Linux|X11/.test(nav.platform),
  ie,
  ie_version: ie_upto10 ? doc.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
  gecko,
  gecko_version: gecko ? +(/Firefox\/(\d+)/.exec(nav.userAgent) || [0, 0])[1] : 0,
  chrome: !!chrome,
  chrome_version: chrome ? +chrome[1] : 0,
  ios,
  android: /Android\b/.test(nav.userAgent),
  webkit,
  safari,
  webkit_version: webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: doc.documentElement.style.tabSize != null ? 'tab-size' : '-moz-tab-size',
};
var MaxJoinLen = 256;
var TextView = class _TextView extends ContentView {
  constructor(text) {
    super();
    this.text = text;
  }
  get length() {
    return this.text.length;
  }
  createDOM(textDOM) {
    this.setDOM(textDOM || document.createTextNode(this.text));
  }
  sync(track) {
    if (!this.dom) this.createDOM();
    if (this.dom.nodeValue != this.text) {
      if (track && track.node == this.dom) track.written = true;
      this.dom.nodeValue = this.text;
    }
  }
  reuseDOM(dom) {
    if (dom.nodeType == 3) this.createDOM(dom);
  }
  merge(from, to, source) {
    if (source && (!(source instanceof _TextView) || this.length - (to - from) + source.length > MaxJoinLen))
      return false;
    this.text = this.text.slice(0, from) + (source ? source.text : '') + this.text.slice(to);
    this.markDirty();
    return true;
  }
  split(from) {
    let result = new _TextView(this.text.slice(from));
    this.text = this.text.slice(0, from);
    this.markDirty();
    return result;
  }
  localPosFromDOM(node, offset) {
    return node == this.dom ? offset : offset ? this.text.length : 0;
  }
  domAtPos(pos) {
    return new DOMPos(this.dom, pos);
  }
  domBoundsAround(_from, _to, offset) {
    return { from: offset, to: offset + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(pos, side) {
    return textCoords(this.dom, pos, side);
  }
};
var MarkView = class _MarkView extends ContentView {
  constructor(mark, children = [], length = 0) {
    super();
    this.mark = mark;
    this.children = children;
    this.length = length;
    for (let ch of children) ch.setParent(this);
  }
  setAttrs(dom) {
    clearAttributes(dom);
    if (this.mark.class) dom.className = this.mark.class;
    if (this.mark.attrs) for (let name2 in this.mark.attrs) dom.setAttribute(name2, this.mark.attrs[name2]);
    return dom;
  }
  reuseDOM(node) {
    if (node.nodeName == this.mark.tagName.toUpperCase()) {
      this.setDOM(node);
      this.dirty |= 4 | 2;
    }
  }
  sync(track) {
    if (!this.dom) this.setDOM(this.setAttrs(document.createElement(this.mark.tagName)));
    else if (this.dirty & 4) this.setAttrs(this.dom);
    super.sync(track);
  }
  merge(from, to, source, _hasStart, openStart, openEnd) {
    if (
      source &&
      (!(source instanceof _MarkView && source.mark.eq(this.mark)) ||
        (from && openStart <= 0) ||
        (to < this.length && openEnd <= 0))
    )
      return false;
    mergeChildrenInto(this, from, to, source ? source.children : [], openStart - 1, openEnd - 1);
    this.markDirty();
    return true;
  }
  split(from) {
    let result = [],
      off = 0,
      detachFrom = -1,
      i = 0;
    for (let elt of this.children) {
      let end = off + elt.length;
      if (end > from) result.push(off < from ? elt.split(from - off) : elt);
      if (detachFrom < 0 && off >= from) detachFrom = i;
      off = end;
      i++;
    }
    let length = this.length - from;
    this.length = from;
    if (detachFrom > -1) {
      this.children.length = detachFrom;
      this.markDirty();
    }
    return new _MarkView(this.mark, result, length);
  }
  domAtPos(pos) {
    return inlineDOMAtPos(this.dom, this.children, pos);
  }
  coordsAt(pos, side) {
    return coordsInChildren(this, pos, side);
  }
};
function textCoords(text, pos, side) {
  let length = text.nodeValue.length;
  if (pos > length) pos = length;
  let from = pos,
    to = pos,
    flatten2 = 0;
  if ((pos == 0 && side < 0) || (pos == length && side >= 0)) {
    if (!(browser.chrome || browser.gecko)) {
      if (pos) {
        from--;
        flatten2 = 1;
      } else {
        to++;
        flatten2 = -1;
      }
    }
  } else {
    if (side < 0) from--;
    else to++;
  }
  let rects = textRange(text, from, to).getClientRects();
  if (!rects.length) return Rect0;
  let rect = rects[(flatten2 ? flatten2 < 0 : side >= 0) ? 0 : rects.length - 1];
  if (browser.safari && !flatten2 && rect.width == 0) rect = Array.prototype.find.call(rects, (r) => r.width) || rect;
  return flatten2 ? flattenRect(rect, flatten2 < 0) : rect || null;
}
var WidgetView = class _WidgetView extends ContentView {
  constructor(widget, length, side) {
    super();
    this.widget = widget;
    this.length = length;
    this.side = side;
    this.prevWidget = null;
  }
  static create(widget, length, side) {
    return new (widget.customView || _WidgetView)(widget, length, side);
  }
  split(from) {
    let result = _WidgetView.create(this.widget, this.length - from, this.side);
    this.length -= from;
    return result;
  }
  sync() {
    if (!this.dom || !this.widget.updateDOM(this.dom)) {
      if (this.dom && this.prevWidget) this.prevWidget.destroy(this.dom);
      this.prevWidget = null;
      this.setDOM(this.widget.toDOM(this.editorView));
      this.dom.contentEditable = 'false';
    }
  }
  getSide() {
    return this.side;
  }
  merge(from, to, source, hasStart, openStart, openEnd) {
    if (
      source &&
      (!(source instanceof _WidgetView) ||
        !this.widget.compare(source.widget) ||
        (from > 0 && openStart <= 0) ||
        (to < this.length && openEnd <= 0))
    )
      return false;
    this.length = from + (source ? source.length : 0) + (this.length - to);
    return true;
  }
  become(other) {
    if (other.length == this.length && other instanceof _WidgetView && other.side == this.side) {
      if (this.widget.constructor == other.widget.constructor) {
        if (!this.widget.eq(other.widget)) this.markDirty(true);
        if (this.dom && !this.prevWidget) this.prevWidget = this.widget;
        this.widget = other.widget;
        return true;
      }
    }
    return false;
  }
  ignoreMutation() {
    return true;
  }
  ignoreEvent(event) {
    return this.widget.ignoreEvent(event);
  }
  get overrideDOMText() {
    if (this.length == 0) return Text.empty;
    let top = this;
    while (top.parent) top = top.parent;
    let view = top.editorView,
      text = view && view.state.doc,
      start = this.posAtStart;
    return text ? text.slice(start, start + this.length) : Text.empty;
  }
  domAtPos(pos) {
    return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(pos, side) {
    let rects = this.dom.getClientRects(),
      rect = null;
    if (!rects.length) return Rect0;
    for (let i = pos > 0 ? rects.length - 1 : 0; ; i += pos > 0 ? -1 : 1) {
      rect = rects[i];
      if (pos > 0 ? i == 0 : i == rects.length - 1 || rect.top < rect.bottom) break;
    }
    return (pos == 0 && side > 0) || (pos == this.length && side <= 0) ? rect : flattenRect(rect, pos == 0);
  }
  get isEditable() {
    return false;
  }
  destroy() {
    super.destroy();
    if (this.dom) this.widget.destroy(this.dom);
  }
};
var CompositionView = class extends WidgetView {
  domAtPos(pos) {
    let { topView, text } = this.widget;
    if (!topView) return new DOMPos(text, Math.min(pos, text.nodeValue.length));
    return scanCompositionTree(
      pos,
      0,
      topView,
      text,
      (v, p) => v.domAtPos(p),
      (p) => new DOMPos(text, Math.min(p, text.nodeValue.length)),
    );
  }
  sync() {
    this.setDOM(this.widget.toDOM());
  }
  localPosFromDOM(node, offset) {
    let { topView, text } = this.widget;
    if (!topView) return Math.min(offset, this.length);
    return posFromDOMInCompositionTree(node, offset, topView, text);
  }
  ignoreMutation() {
    return false;
  }
  get overrideDOMText() {
    return null;
  }
  coordsAt(pos, side) {
    let { topView, text } = this.widget;
    if (!topView) return textCoords(text, pos, side);
    return scanCompositionTree(
      pos,
      side,
      topView,
      text,
      (v, pos2, side2) => v.coordsAt(pos2, side2),
      (pos2, side2) => textCoords(text, pos2, side2),
    );
  }
  destroy() {
    var _a2;
    super.destroy();
    (_a2 = this.widget.topView) === null || _a2 === void 0 ? void 0 : _a2.destroy();
  }
  get isEditable() {
    return true;
  }
};
function scanCompositionTree(pos, side, view, text, enterView, fromText) {
  if (view instanceof MarkView) {
    for (let child of view.children) {
      let hasComp = contains(child.dom, text);
      let len = hasComp ? text.nodeValue.length : child.length;
      if (pos < len || (pos == len && child.getSide() <= 0))
        return hasComp ? scanCompositionTree(pos, side, child, text, enterView, fromText) : enterView(child, pos, side);
      pos -= len;
    }
    return enterView(view, view.length, -1);
  } else if (view.dom == text) {
    return fromText(pos, side);
  } else {
    return enterView(view, pos, side);
  }
}
function posFromDOMInCompositionTree(node, offset, view, text) {
  if (view instanceof MarkView) {
    for (let child of view.children) {
      let pos = 0,
        hasComp = contains(child.dom, text);
      if (contains(child.dom, node))
        return (
          pos + (hasComp ? posFromDOMInCompositionTree(node, offset, child, text) : child.localPosFromDOM(node, offset))
        );
      pos += hasComp ? text.nodeValue.length : child.length;
    }
  } else if (view.dom == text) {
    return Math.min(offset, text.nodeValue.length);
  }
  return view.localPosFromDOM(node, offset);
}
var WidgetBufferView = class _WidgetBufferView extends ContentView {
  constructor(side) {
    super();
    this.side = side;
  }
  get length() {
    return 0;
  }
  merge() {
    return false;
  }
  become(other) {
    return other instanceof _WidgetBufferView && other.side == this.side;
  }
  split() {
    return new _WidgetBufferView(this.side);
  }
  sync() {
    if (!this.dom) {
      let dom = document.createElement('img');
      dom.className = 'cm-widgetBuffer';
      dom.setAttribute('aria-hidden', 'true');
      this.setDOM(dom);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(pos) {
    return DOMPos.before(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(pos) {
    let imgRect = this.dom.getBoundingClientRect();
    let siblingRect = inlineSiblingRect(this, this.side > 0 ? -1 : 1);
    return siblingRect && siblingRect.top < imgRect.bottom && siblingRect.bottom > imgRect.top
      ? { left: imgRect.left, right: imgRect.right, top: siblingRect.top, bottom: siblingRect.bottom }
      : imgRect;
  }
  get overrideDOMText() {
    return Text.empty;
  }
};
TextView.prototype.children = WidgetView.prototype.children = WidgetBufferView.prototype.children = noChildren;
function inlineSiblingRect(view, side) {
  let parent = view.parent,
    index = parent ? parent.children.indexOf(view) : -1;
  while (parent && index >= 0) {
    if (side < 0 ? index > 0 : index < parent.children.length) {
      let next = parent.children[index + side];
      if (next instanceof TextView) {
        let nextRect = next.coordsAt(side < 0 ? next.length : 0, side);
        if (nextRect) return nextRect;
      }
      index += side;
    } else if (parent instanceof MarkView && parent.parent) {
      index = parent.parent.children.indexOf(parent) + (side < 0 ? 0 : 1);
      parent = parent.parent;
    } else {
      let last = parent.dom.lastChild;
      if (last && last.nodeName == 'BR') return last.getClientRects()[0];
      break;
    }
  }
  return void 0;
}
function inlineDOMAtPos(dom, children, pos) {
  let i = 0;
  for (let off = 0; i < children.length; i++) {
    let child = children[i],
      end = off + child.length;
    if (end == off && child.getSide() <= 0) continue;
    if (pos > off && pos < end && child.dom.parentNode == dom) return child.domAtPos(pos - off);
    if (pos <= off) break;
    off = end;
  }
  for (; i > 0; i--) {
    let before = children[i - 1].dom;
    if (before.parentNode == dom) return DOMPos.after(before);
  }
  return new DOMPos(dom, 0);
}
function joinInlineInto(parent, view, open) {
  let last,
    { children } = parent;
  if (
    open > 0 &&
    view instanceof MarkView &&
    children.length &&
    (last = children[children.length - 1]) instanceof MarkView &&
    last.mark.eq(view.mark)
  ) {
    joinInlineInto(last, view.children[0], open - 1);
  } else {
    children.push(view);
    view.setParent(parent);
  }
  parent.length += view.length;
}
function coordsInChildren(view, pos, side) {
  for (let off = 0, i = 0; i < view.children.length; i++) {
    let child = view.children[i],
      end = off + child.length,
      next;
    if (
      (side <= 0 || end == view.length || child.getSide() > 0 ? end >= pos : end > pos) &&
      (pos < end || i + 1 == view.children.length || (next = view.children[i + 1]).length || next.getSide() > 0)
    ) {
      let flatten2 = 0;
      if (end == off) {
        if (child.getSide() <= 0) continue;
        flatten2 = side = -child.getSide();
      }
      let rect = child.coordsAt(Math.max(0, pos - off), side);
      return flatten2 && rect ? flattenRect(rect, side < 0) : rect;
    }
    off = end;
  }
  let last = view.dom.lastChild;
  if (!last) return view.dom.getBoundingClientRect();
  let rects = clientRectsFor(last);
  return rects[rects.length - 1] || null;
}
function combineAttrs(source, target) {
  for (let name2 in source) {
    if (name2 == 'class' && target.class) target.class += ' ' + source.class;
    else if (name2 == 'style' && target.style) target.style += ';' + source.style;
    else target[name2] = source[name2];
  }
  return target;
}
function attrsEq(a, b) {
  if (a == b) return true;
  if (!a || !b) return false;
  let keysA = Object.keys(a),
    keysB = Object.keys(b);
  if (keysA.length != keysB.length) return false;
  for (let key of keysA) {
    if (keysB.indexOf(key) == -1 || a[key] !== b[key]) return false;
  }
  return true;
}
function updateAttrs(dom, prev, attrs) {
  if (prev) {
    for (let name2 in prev) if (!(attrs && name2 in attrs)) dom.removeAttribute(name2);
  }
  if (attrs) {
    for (let name2 in attrs) if (!(prev && prev[name2] == attrs[name2])) dom.setAttribute(name2, attrs[name2]);
  }
}
var WidgetType = class {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(_widget) {
    return false;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(_dom) {
    return false;
  }
  /**
  @internal
  */
  compare(other) {
    return this == other || (this.constructor == other.constructor && this.eq(other));
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(_event) {
    return true;
  }
  /**
  @internal
  */
  get customView() {
    return null;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(_dom) {}
};
var BlockType = (function (BlockType2) {
  BlockType2[(BlockType2['Text'] = 0)] = 'Text';
  BlockType2[(BlockType2['WidgetBefore'] = 1)] = 'WidgetBefore';
  BlockType2[(BlockType2['WidgetAfter'] = 2)] = 'WidgetAfter';
  BlockType2[(BlockType2['WidgetRange'] = 3)] = 'WidgetRange';
  return BlockType2;
})(BlockType || (BlockType = {}));
var Decoration = class extends RangeValue {
  /**
  @internal
  */
  constructor(startSide, endSide, widget, spec) {
    super();
    this.startSide = startSide;
    this.endSide = endSide;
    this.widget = widget;
    this.spec = spec;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return false;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations) or
  (below the facet-provided decorations) [view
  plugin](https://codemirror.net/6/docs/ref/#view.PluginSpec.decorations). Such elements are split
  on line boundaries and on the boundaries of higher-precedence
  decorations.
  */
  static mark(spec) {
    return new MarkDecoration(spec);
  }
  /**
  Create a widget decoration, which adds an element at the given
  position.
  */
  static widget(spec) {
    let side = spec.side || 0,
      block = !!spec.block;
    side += block ? (side > 0 ? 3e8 : -4e8) : side > 0 ? 1e8 : -1e8;
    return new PointDecoration(spec, side, side, block, spec.widget || null, false);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(spec) {
    let block = !!spec.block,
      startSide,
      endSide;
    if (spec.isBlockGap) {
      startSide = -5e8;
      endSide = 4e8;
    } else {
      let { start, end } = getInclusive(spec, block);
      startSide = (start ? (block ? -3e8 : -1) : 5e8) - 1;
      endSide = (end ? (block ? 2e8 : 1) : -6e8) + 1;
    }
    return new PointDecoration(spec, startSide, endSide, block, spec.widget || null, true);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(spec) {
    return new LineDecoration(spec);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(of, sort = false) {
    return RangeSet.of(of, sort);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : false;
  }
};
Decoration.none = RangeSet.empty;
var MarkDecoration = class _MarkDecoration extends Decoration {
  constructor(spec) {
    let { start, end } = getInclusive(spec);
    super(start ? -1 : 5e8, end ? 1 : -6e8, null, spec);
    this.tagName = spec.tagName || 'span';
    this.class = spec.class || '';
    this.attrs = spec.attributes || null;
  }
  eq(other) {
    return (
      this == other ||
      (other instanceof _MarkDecoration &&
        this.tagName == other.tagName &&
        this.class == other.class &&
        attrsEq(this.attrs, other.attrs))
    );
  }
  range(from, to = from) {
    if (from >= to) throw new RangeError('Mark decorations may not be empty');
    return super.range(from, to);
  }
};
MarkDecoration.prototype.point = false;
var LineDecoration = class _LineDecoration extends Decoration {
  constructor(spec) {
    super(-2e8, -2e8, null, spec);
  }
  eq(other) {
    return other instanceof _LineDecoration && attrsEq(this.spec.attributes, other.spec.attributes);
  }
  range(from, to = from) {
    if (to != from) throw new RangeError('Line decoration ranges must be zero-length');
    return super.range(from, to);
  }
};
LineDecoration.prototype.mapMode = MapMode.TrackBefore;
LineDecoration.prototype.point = true;
var PointDecoration = class _PointDecoration extends Decoration {
  constructor(spec, startSide, endSide, block, widget, isReplace) {
    super(startSide, endSide, widget, spec);
    this.block = block;
    this.isReplace = isReplace;
    this.mapMode = !block ? MapMode.TrackDel : startSide <= 0 ? MapMode.TrackBefore : MapMode.TrackAfter;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide < this.endSide
      ? BlockType.WidgetRange
      : this.startSide <= 0
      ? BlockType.WidgetBefore
      : BlockType.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || (!!this.widget && this.widget.estimatedHeight >= 5);
  }
  eq(other) {
    return (
      other instanceof _PointDecoration &&
      widgetsEq(this.widget, other.widget) &&
      this.block == other.block &&
      this.startSide == other.startSide &&
      this.endSide == other.endSide
    );
  }
  range(from, to = from) {
    if (this.isReplace && (from > to || (from == to && this.startSide > 0 && this.endSide <= 0)))
      throw new RangeError('Invalid range for replacement decoration');
    if (!this.isReplace && to != from) throw new RangeError('Widget decorations can only have zero-length ranges');
    return super.range(from, to);
  }
};
PointDecoration.prototype.point = true;
function getInclusive(spec, block = false) {
  let { inclusiveStart: start, inclusiveEnd: end } = spec;
  if (start == null) start = spec.inclusive;
  if (end == null) end = spec.inclusive;
  return {
    start: start !== null && start !== void 0 ? start : block,
    end: end !== null && end !== void 0 ? end : block,
  };
}
function widgetsEq(a, b) {
  return a == b || !!(a && b && a.compare(b));
}
function addRange(from, to, ranges, margin = 0) {
  let last = ranges.length - 1;
  if (last >= 0 && ranges[last] + margin >= from) ranges[last] = Math.max(ranges[last], to);
  else ranges.push(from, to);
}
var LineView = class _LineView extends ContentView {
  constructor() {
    super(...arguments);
    this.children = [];
    this.length = 0;
    this.prevAttrs = void 0;
    this.attrs = null;
    this.breakAfter = 0;
  }
  // Consumes source
  merge(from, to, source, hasStart, openStart, openEnd) {
    if (source) {
      if (!(source instanceof _LineView)) return false;
      if (!this.dom) source.transferDOM(this);
    }
    if (hasStart) this.setDeco(source ? source.attrs : null);
    mergeChildrenInto(this, from, to, source ? source.children : [], openStart, openEnd);
    return true;
  }
  split(at) {
    let end = new _LineView();
    end.breakAfter = this.breakAfter;
    if (this.length == 0) return end;
    let { i, off } = this.childPos(at);
    if (off) {
      end.append(this.children[i].split(off), 0);
      this.children[i].merge(off, this.children[i].length, null, false, 0, 0);
      i++;
    }
    for (let j = i; j < this.children.length; j++) end.append(this.children[j], 0);
    while (i > 0 && this.children[i - 1].length == 0) this.children[--i].destroy();
    this.children.length = i;
    this.markDirty();
    this.length = at;
    return end;
  }
  transferDOM(other) {
    if (!this.dom) return;
    other.setDOM(this.dom);
    other.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs;
    this.prevAttrs = void 0;
    this.dom = null;
  }
  setDeco(attrs) {
    if (!attrsEq(this.attrs, attrs)) {
      if (this.dom) {
        this.prevAttrs = this.attrs;
        this.markDirty();
      }
      this.attrs = attrs;
    }
  }
  append(child, openStart) {
    joinInlineInto(this, child, openStart);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(deco) {
    let attrs = deco.spec.attributes,
      cls = deco.spec.class;
    if (attrs) this.attrs = combineAttrs(attrs, this.attrs || {});
    if (cls) this.attrs = combineAttrs({ class: cls }, this.attrs || {});
  }
  domAtPos(pos) {
    return inlineDOMAtPos(this.dom, this.children, pos);
  }
  reuseDOM(node) {
    if (node.nodeName == 'DIV') {
      this.setDOM(node);
      this.dirty |= 4 | 2;
    }
  }
  sync(track) {
    var _a2;
    if (!this.dom) {
      this.setDOM(document.createElement('div'));
      this.dom.className = 'cm-line';
      this.prevAttrs = this.attrs ? null : void 0;
    } else if (this.dirty & 4) {
      clearAttributes(this.dom);
      this.dom.className = 'cm-line';
      this.prevAttrs = this.attrs ? null : void 0;
    }
    if (this.prevAttrs !== void 0) {
      updateAttrs(this.dom, this.prevAttrs, this.attrs);
      this.dom.classList.add('cm-line');
      this.prevAttrs = void 0;
    }
    super.sync(track);
    let last = this.dom.lastChild;
    while (last && ContentView.get(last) instanceof MarkView) last = last.lastChild;
    if (
      !last ||
      !this.length ||
      (last.nodeName != 'BR' &&
        ((_a2 = ContentView.get(last)) === null || _a2 === void 0 ? void 0 : _a2.isEditable) == false &&
        (!browser.ios || !this.children.some((ch) => ch instanceof TextView)))
    ) {
      let hack = document.createElement('BR');
      hack.cmIgnore = true;
      this.dom.appendChild(hack);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20) return null;
    let totalWidth = 0;
    for (let child of this.children) {
      if (!(child instanceof TextView)) return null;
      let rects = clientRectsFor(child.dom);
      if (rects.length != 1) return null;
      totalWidth += rects[0].width;
    }
    return {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: totalWidth / this.length,
    };
  }
  coordsAt(pos, side) {
    return coordsInChildren(this, pos, side);
  }
  become(_other) {
    return false;
  }
  get type() {
    return BlockType.Text;
  }
  static find(docView, pos) {
    for (let i = 0, off = 0; i < docView.children.length; i++) {
      let block = docView.children[i],
        end = off + block.length;
      if (end >= pos) {
        if (block instanceof _LineView) return block;
        if (end > pos) break;
      }
      off = end + block.breakAfter;
    }
    return null;
  }
};
var BlockWidgetView = class _BlockWidgetView extends ContentView {
  constructor(widget, length, type) {
    super();
    this.widget = widget;
    this.length = length;
    this.type = type;
    this.breakAfter = 0;
    this.prevWidget = null;
  }
  merge(from, to, source, _takeDeco, openStart, openEnd) {
    if (
      source &&
      (!(source instanceof _BlockWidgetView) ||
        !this.widget.compare(source.widget) ||
        (from > 0 && openStart <= 0) ||
        (to < this.length && openEnd <= 0))
    )
      return false;
    this.length = from + (source ? source.length : 0) + (this.length - to);
    return true;
  }
  domAtPos(pos) {
    return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
  }
  split(at) {
    let len = this.length - at;
    this.length = at;
    let end = new _BlockWidgetView(this.widget, len, this.type);
    end.breakAfter = this.breakAfter;
    return end;
  }
  get children() {
    return noChildren;
  }
  sync() {
    if (!this.dom || !this.widget.updateDOM(this.dom)) {
      if (this.dom && this.prevWidget) this.prevWidget.destroy(this.dom);
      this.prevWidget = null;
      this.setDOM(this.widget.toDOM(this.editorView));
      this.dom.contentEditable = 'false';
    }
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Text.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(other) {
    if (
      other instanceof _BlockWidgetView &&
      other.type == this.type &&
      other.widget.constructor == this.widget.constructor
    ) {
      if (!other.widget.eq(this.widget)) this.markDirty(true);
      if (this.dom && !this.prevWidget) this.prevWidget = this.widget;
      this.widget = other.widget;
      this.length = other.length;
      this.breakAfter = other.breakAfter;
      return true;
    }
    return false;
  }
  ignoreMutation() {
    return true;
  }
  ignoreEvent(event) {
    return this.widget.ignoreEvent(event);
  }
  destroy() {
    super.destroy();
    if (this.dom) this.widget.destroy(this.dom);
  }
};
var ContentBuilder = class _ContentBuilder {
  constructor(doc2, pos, end, disallowBlockEffectsBelow) {
    this.doc = doc2;
    this.pos = pos;
    this.end = end;
    this.disallowBlockEffectsBelow = disallowBlockEffectsBelow;
    this.content = [];
    this.curLine = null;
    this.breakAtStart = 0;
    this.pendingBuffer = 0;
    this.atCursorPos = true;
    this.openStart = -1;
    this.openEnd = -1;
    this.text = '';
    this.textOff = 0;
    this.cursor = doc2.iter();
    this.skip = pos;
  }
  posCovered() {
    if (this.content.length == 0) return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let last = this.content[this.content.length - 1];
    return !last.breakAfter && !(last instanceof BlockWidgetView && last.type == BlockType.WidgetBefore);
  }
  getLine() {
    if (!this.curLine) {
      this.content.push((this.curLine = new LineView()));
      this.atCursorPos = true;
    }
    return this.curLine;
  }
  flushBuffer(active) {
    if (this.pendingBuffer) {
      this.curLine.append(wrapMarks(new WidgetBufferView(-1), active), active.length);
      this.pendingBuffer = 0;
    }
  }
  addBlockWidget(view) {
    this.flushBuffer([]);
    this.curLine = null;
    this.content.push(view);
  }
  finish(openEnd) {
    if (!openEnd) this.flushBuffer([]);
    else this.pendingBuffer = 0;
    if (!this.posCovered()) this.getLine();
  }
  buildText(length, active, openStart) {
    while (length > 0) {
      if (this.textOff == this.text.length) {
        let { value, lineBreak, done } = this.cursor.next(this.skip);
        this.skip = 0;
        if (done) throw new Error('Ran out of text content when drawing inline views');
        if (lineBreak) {
          if (!this.posCovered()) this.getLine();
          if (this.content.length) this.content[this.content.length - 1].breakAfter = 1;
          else this.breakAtStart = 1;
          this.flushBuffer([]);
          this.curLine = null;
          length--;
          continue;
        } else {
          this.text = value;
          this.textOff = 0;
        }
      }
      let take = Math.min(
        this.text.length - this.textOff,
        length,
        512,
        /* Chunk */
      );
      this.flushBuffer(active.slice(0, openStart));
      this.getLine().append(
        wrapMarks(new TextView(this.text.slice(this.textOff, this.textOff + take)), active),
        openStart,
      );
      this.atCursorPos = true;
      this.textOff += take;
      length -= take;
      openStart = 0;
    }
  }
  span(from, to, active, openStart) {
    this.buildText(to - from, active, openStart);
    this.pos = to;
    if (this.openStart < 0) this.openStart = openStart;
  }
  point(from, to, deco, active, openStart) {
    let len = to - from;
    if (deco instanceof PointDecoration) {
      if (deco.block) {
        let { type } = deco;
        if (type == BlockType.WidgetAfter && !this.posCovered()) this.getLine();
        this.addBlockWidget(new BlockWidgetView(deco.widget || new NullWidget('div'), len, type));
      } else {
        let view = WidgetView.create(deco.widget || new NullWidget('span'), len, deco.startSide);
        let cursorBefore =
          this.atCursorPos && !view.isEditable && openStart <= active.length && (from < to || deco.startSide > 0);
        let cursorAfter = !view.isEditable && (from < to || deco.startSide <= 0);
        let line = this.getLine();
        if (this.pendingBuffer == 2 && !cursorBefore) this.pendingBuffer = 0;
        this.flushBuffer(active);
        if (cursorBefore) {
          line.append(wrapMarks(new WidgetBufferView(1), active), openStart);
          openStart = active.length + Math.max(0, openStart - active.length);
        }
        line.append(wrapMarks(view, active), openStart);
        this.atCursorPos = cursorAfter;
        this.pendingBuffer = !cursorAfter ? 0 : from < to ? 1 : 2;
      }
    } else if (this.doc.lineAt(this.pos).from == this.pos) {
      this.getLine().addLineDeco(deco);
    }
    if (len) {
      if (this.textOff + len <= this.text.length) {
        this.textOff += len;
      } else {
        this.skip += len - (this.text.length - this.textOff);
        this.text = '';
        this.textOff = 0;
      }
      this.pos = to;
    }
    if (this.openStart < 0) this.openStart = openStart;
  }
  filterPoint(from, to, value, index) {
    if (index < this.disallowBlockEffectsBelow && value instanceof PointDecoration) {
      if (value.block) throw new RangeError('Block decorations may not be specified via plugins');
      if (to > this.doc.lineAt(this.pos).to)
        throw new RangeError('Decorations that replace line breaks may not be specified via plugins');
    }
    return true;
  }
  static build(text, from, to, decorations2, pluginDecorationLength) {
    let builder = new _ContentBuilder(text, from, to, pluginDecorationLength);
    builder.openEnd = RangeSet.spans(decorations2, from, to, builder);
    if (builder.openStart < 0) builder.openStart = builder.openEnd;
    builder.finish(builder.openEnd);
    return builder;
  }
};
function wrapMarks(view, active) {
  for (let mark of active) view = new MarkView(mark, [view], view.length);
  return view;
}
var NullWidget = class extends WidgetType {
  constructor(tag) {
    super();
    this.tag = tag;
  }
  eq(other) {
    return other.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(elt) {
    return elt.nodeName.toLowerCase() == this.tag;
  }
};
var none2 = [];
var clickAddsSelectionRange = Facet.define();
var dragMovesSelection$1 = Facet.define();
var mouseSelectionStyle = Facet.define();
var exceptionSink = Facet.define();
var updateListener = Facet.define();
var inputHandler = Facet.define();
var scrollTo = StateEffect.define({
  map: (range, changes) => range.map(changes),
});
var centerOn = StateEffect.define({
  map: (range, changes) => range.map(changes),
});
var ScrollTarget = class _ScrollTarget {
  constructor(range, y = 'nearest', x = 'nearest', yMargin = 5, xMargin = 5) {
    this.range = range;
    this.y = y;
    this.x = x;
    this.yMargin = yMargin;
    this.xMargin = xMargin;
  }
  map(changes) {
    return changes.empty
      ? this
      : new _ScrollTarget(this.range.map(changes), this.y, this.x, this.yMargin, this.xMargin);
  }
};
var scrollIntoView = StateEffect.define({ map: (t2, ch) => t2.map(ch) });
function logException(state, exception, context) {
  let handler = state.facet(exceptionSink);
  if (handler.length) handler[0](exception);
  else if (window.onerror) window.onerror(String(exception), context, void 0, void 0, exception);
  else if (context) console.error(context + ':', exception);
  else console.error(exception);
}
var editable = Facet.define({ combine: (values) => (values.length ? values[0] : true) });
var PluginFieldProvider = class {
  /**
  @internal
  */
  constructor(field, get) {
    this.field = field;
    this.get = get;
  }
};
var PluginField = class _PluginField {
  /**
  Create a [provider](https://codemirror.net/6/docs/ref/#view.PluginFieldProvider) for this field,
  to use with a plugin's [provide](https://codemirror.net/6/docs/ref/#view.PluginSpec.provide)
  option.
  */
  from(get) {
    return new PluginFieldProvider(this, get);
  }
  /**
  Define a new plugin field.
  */
  static define() {
    return new _PluginField();
  }
};
PluginField.decorations = PluginField.define();
PluginField.atomicRanges = PluginField.define();
PluginField.scrollMargins = PluginField.define();
var nextPluginID = 0;
var viewPlugin = Facet.define();
var ViewPlugin = class _ViewPlugin {
  constructor(id, create, fields) {
    this.id = id;
    this.create = create;
    this.fields = fields;
    this.extension = viewPlugin.of(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(create, spec) {
    let { eventHandlers, provide, decorations: decorations2 } = spec || {};
    let fields = [];
    if (provide) for (let provider of Array.isArray(provide) ? provide : [provide]) fields.push(provider);
    if (eventHandlers) fields.push(domEventHandlers.from((value) => ({ plugin: value, handlers: eventHandlers })));
    if (decorations2) fields.push(PluginField.decorations.from(decorations2));
    return new _ViewPlugin(nextPluginID++, create, fields);
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(cls, spec) {
    return _ViewPlugin.define((view) => new cls(view), spec);
  }
};
var domEventHandlers = PluginField.define();
var PluginInstance = class {
  constructor(spec) {
    this.spec = spec;
    this.mustUpdate = null;
    this.value = null;
  }
  takeField(type, target) {
    if (this.spec) {
      for (let { field, get } of this.spec.fields) if (field == type) target.push(get(this.value));
    }
  }
  update(view) {
    if (!this.value) {
      if (this.spec) {
        try {
          this.value = this.spec.create(view);
        } catch (e) {
          logException(view.state, e, 'CodeMirror plugin crashed');
          this.deactivate();
        }
      }
    } else if (this.mustUpdate) {
      let update = this.mustUpdate;
      this.mustUpdate = null;
      if (this.value.update) {
        try {
          this.value.update(update);
        } catch (e) {
          logException(update.state, e, 'CodeMirror plugin crashed');
          if (this.value.destroy)
            try {
              this.value.destroy();
            } catch (_) {}
          this.deactivate();
        }
      }
    }
    return this;
  }
  destroy(view) {
    var _a2;
    if ((_a2 = this.value) === null || _a2 === void 0 ? void 0 : _a2.destroy) {
      try {
        this.value.destroy();
      } catch (e) {
        logException(view.state, e, 'CodeMirror plugin crashed');
      }
    }
  }
  deactivate() {
    this.spec = this.value = null;
  }
};
var editorAttributes = Facet.define();
var contentAttributes = Facet.define();
var decorations = Facet.define();
var styleModule = Facet.define();
var ChangedRange = class _ChangedRange {
  constructor(fromA, toA, fromB, toB) {
    this.fromA = fromA;
    this.toA = toA;
    this.fromB = fromB;
    this.toB = toB;
  }
  join(other) {
    return new _ChangedRange(
      Math.min(this.fromA, other.fromA),
      Math.max(this.toA, other.toA),
      Math.min(this.fromB, other.fromB),
      Math.max(this.toB, other.toB),
    );
  }
  addToSet(set) {
    let i = set.length,
      me = this;
    for (; i > 0; i--) {
      let range = set[i - 1];
      if (range.fromA > me.toA) continue;
      if (range.toA < me.fromA) break;
      me = me.join(range);
      set.splice(i - 1, 1);
    }
    set.splice(i, 0, me);
    return set;
  }
  static extendWithRanges(diff, ranges) {
    if (ranges.length == 0) return diff;
    let result = [];
    for (let dI = 0, rI = 0, posA = 0, posB = 0; ; dI++) {
      let next = dI == diff.length ? null : diff[dI],
        off = posA - posB;
      let end = next ? next.fromB : 1e9;
      while (rI < ranges.length && ranges[rI] < end) {
        let from = ranges[rI],
          to = ranges[rI + 1];
        let fromB = Math.max(posB, from),
          toB = Math.min(end, to);
        if (fromB <= toB) new _ChangedRange(fromB + off, toB + off, fromB, toB).addToSet(result);
        if (to > end) break;
        else rI += 2;
      }
      if (!next) return result;
      new _ChangedRange(next.fromA, next.toA, next.fromB, next.toB).addToSet(result);
      posA = next.toA;
      posB = next.toB;
    }
  }
};
var ViewUpdate = class {
  /**
  @internal
  */
  constructor(view, state, transactions = none2) {
    this.view = view;
    this.state = state;
    this.transactions = transactions;
    this.flags = 0;
    this.startState = view.state;
    this.changes = ChangeSet.empty(this.startState.doc.length);
    for (let tr of transactions) this.changes = this.changes.compose(tr.changes);
    let changedRanges = [];
    this.changes.iterChangedRanges((fromA, toA, fromB, toB) =>
      changedRanges.push(new ChangedRange(fromA, toA, fromB, toB)),
    );
    this.changedRanges = changedRanges;
    let focus = view.hasFocus;
    if (focus != view.inputState.notifiedFocused) {
      view.inputState.notifiedFocused = focus;
      this.flags |= 1;
    }
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Indicates whether the height of an element in the editor changed
  in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & (8 | 2)) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((tr) => tr.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
};
var Direction = (function (Direction2) {
  Direction2[(Direction2['LTR'] = 0)] = 'LTR';
  Direction2[(Direction2['RTL'] = 1)] = 'RTL';
  return Direction2;
})(Direction || (Direction = {}));
var LTR = Direction.LTR;
var RTL = Direction.RTL;
function dec(str) {
  let result = [];
  for (let i = 0; i < str.length; i++) result.push(1 << +str[i]);
  return result;
}
var LowTypes = dec(
  '88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008',
);
var ArabicTypes = dec(
  '4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333',
);
var Brackets = /* @__PURE__ */ Object.create(null);
var BracketStack = [];
for (let p of ['()', '[]', '{}']) {
  let l = p.charCodeAt(0),
    r = p.charCodeAt(1);
  Brackets[l] = r;
  Brackets[r] = -l;
}
function charType(ch) {
  return ch <= 247
    ? LowTypes[ch]
    : 1424 <= ch && ch <= 1524
    ? 2
    : 1536 <= ch && ch <= 1785
    ? ArabicTypes[ch - 1536]
    : 1774 <= ch && ch <= 2220
    ? 4
    : 8192 <= ch && ch <= 8203
    ? 256
    : ch == 8204
    ? 256
    : 1;
}
var BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
var BidiSpan = class {
  /**
  @internal
  */
  constructor(from, to, level) {
    this.from = from;
    this.to = to;
    this.level = level;
  }
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? RTL : LTR;
  }
  /**
  @internal
  */
  side(end, dir) {
    return (this.dir == dir) == end ? this.to : this.from;
  }
  /**
  @internal
  */
  static find(order, index, level, assoc) {
    let maybe = -1;
    for (let i = 0; i < order.length; i++) {
      let span = order[i];
      if (span.from <= index && span.to >= index) {
        if (span.level == level) return i;
        if (
          maybe < 0 ||
          (assoc != 0 ? (assoc < 0 ? span.from < index : span.to > index) : order[maybe].level > span.level)
        )
          maybe = i;
      }
    }
    if (maybe < 0) throw new RangeError('Index out of range');
    return maybe;
  }
};
var types = [];
function computeOrder(line, direction) {
  let len = line.length,
    outerType = direction == LTR ? 1 : 2,
    oppositeType = direction == LTR ? 2 : 1;
  if (!line || (outerType == 1 && !BidiRE.test(line))) return trivialOrder(len);
  for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
    let type = charType(line.charCodeAt(i));
    if (type == 512) type = prev;
    else if (type == 8 && prevStrong == 4) type = 16;
    types[i] = type == 4 ? 2 : type;
    if (type & 7) prevStrong = type;
    prev = type;
  }
  for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
    let type = types[i];
    if (type == 128) {
      if (i < len - 1 && prev == types[i + 1] && prev & 24) type = types[i] = prev;
      else types[i] = 256;
    } else if (type == 64) {
      let end = i + 1;
      while (end < len && types[end] == 64) end++;
      let replace = (i && prev == 8) || (end < len && types[end] == 8) ? (prevStrong == 1 ? 1 : 8) : 256;
      for (let j = i; j < end; j++) types[j] = replace;
      i = end - 1;
    } else if (type == 8 && prevStrong == 1) {
      types[i] = 1;
    }
    prev = type;
    if (type & 7) prevStrong = type;
  }
  for (let i = 0, sI = 0, context = 0, ch, br, type; i < len; i++) {
    if ((br = Brackets[(ch = line.charCodeAt(i))])) {
      if (br < 0) {
        for (let sJ = sI - 3; sJ >= 0; sJ -= 3) {
          if (BracketStack[sJ + 1] == -br) {
            let flags = BracketStack[sJ + 2];
            let type2 = flags & 2 ? outerType : !(flags & 4) ? 0 : flags & 1 ? oppositeType : outerType;
            if (type2) types[i] = types[BracketStack[sJ]] = type2;
            sI = sJ;
            break;
          }
        }
      } else if (BracketStack.length == 189) {
        break;
      } else {
        BracketStack[sI++] = i;
        BracketStack[sI++] = ch;
        BracketStack[sI++] = context;
      }
    } else if ((type = types[i]) == 2 || type == 1) {
      let embed = type == outerType;
      context = embed ? 0 : 1;
      for (let sJ = sI - 3; sJ >= 0; sJ -= 3) {
        let cur = BracketStack[sJ + 2];
        if (cur & 2) break;
        if (embed) {
          BracketStack[sJ + 2] |= 2;
        } else {
          if (cur & 4) break;
          BracketStack[sJ + 2] |= 4;
        }
      }
    }
  }
  for (let i = 0; i < len; i++) {
    if (types[i] == 256) {
      let end = i + 1;
      while (end < len && types[end] == 256) end++;
      let beforeL = (i ? types[i - 1] : outerType) == 1;
      let afterL = (end < len ? types[end] : outerType) == 1;
      let replace = beforeL == afterL ? (beforeL ? 1 : 2) : outerType;
      for (let j = i; j < end; j++) types[j] = replace;
      i = end - 1;
    }
  }
  let order = [];
  if (outerType == 1) {
    for (let i = 0; i < len; ) {
      let start = i,
        rtl = types[i++] != 1;
      while (i < len && rtl == (types[i] != 1)) i++;
      if (rtl) {
        for (let j = i; j > start; ) {
          let end = j,
            l = types[--j] != 2;
          while (j > start && l == (types[j - 1] != 2)) j--;
          order.push(new BidiSpan(j, end, l ? 2 : 1));
        }
      } else {
        order.push(new BidiSpan(start, i, 0));
      }
    }
  } else {
    for (let i = 0; i < len; ) {
      let start = i,
        rtl = types[i++] == 2;
      while (i < len && rtl == (types[i] == 2)) i++;
      order.push(new BidiSpan(start, i, rtl ? 1 : 2));
    }
  }
  return order;
}
function trivialOrder(length) {
  return [new BidiSpan(0, length, 0)];
}
var movedOver = '';
function moveVisually(line, order, dir, start, forward) {
  var _a2;
  let startIndex = start.head - line.from,
    spanI = -1;
  if (startIndex == 0) {
    if (!forward || !line.length) return null;
    if (order[0].level != dir) {
      startIndex = order[0].side(false, dir);
      spanI = 0;
    }
  } else if (startIndex == line.length) {
    if (forward) return null;
    let last = order[order.length - 1];
    if (last.level != dir) {
      startIndex = last.side(true, dir);
      spanI = order.length - 1;
    }
  }
  if (spanI < 0)
    spanI = BidiSpan.find(
      order,
      startIndex,
      (_a2 = start.bidiLevel) !== null && _a2 !== void 0 ? _a2 : -1,
      start.assoc,
    );
  let span = order[spanI];
  if (startIndex == span.side(forward, dir)) {
    span = order[(spanI += forward ? 1 : -1)];
    startIndex = span.side(!forward, dir);
  }
  let indexForward = forward == (span.dir == dir);
  let nextIndex = findClusterBreak(line.text, startIndex, indexForward);
  movedOver = line.text.slice(Math.min(startIndex, nextIndex), Math.max(startIndex, nextIndex));
  if (nextIndex != span.side(forward, dir))
    return EditorSelection.cursor(nextIndex + line.from, indexForward ? -1 : 1, span.level);
  let nextSpan = spanI == (forward ? order.length - 1 : 0) ? null : order[spanI + (forward ? 1 : -1)];
  if (!nextSpan && span.level != dir)
    return EditorSelection.cursor(forward ? line.to : line.from, forward ? -1 : 1, dir);
  if (nextSpan && nextSpan.level < span.level)
    return EditorSelection.cursor(nextSpan.side(!forward, dir) + line.from, forward ? 1 : -1, nextSpan.level);
  return EditorSelection.cursor(nextIndex + line.from, forward ? -1 : 1, span.level);
}
var LineBreakPlaceholder = '￿';
var DOMReader = class {
  constructor(points, state) {
    this.points = points;
    this.text = '';
    this.lineSeparator = state.facet(EditorState.lineSeparator);
  }
  append(text) {
    this.text += text;
  }
  lineBreak() {
    this.text += LineBreakPlaceholder;
  }
  readRange(start, end) {
    if (!start) return this;
    let parent = start.parentNode;
    for (let cur = start; ; ) {
      this.findPointBefore(parent, cur);
      this.readNode(cur);
      let next = cur.nextSibling;
      if (next == end) break;
      let view = ContentView.get(cur),
        nextView = ContentView.get(next);
      if (
        view && nextView
          ? view.breakAfter
          : (view ? view.breakAfter : isBlockElement(cur)) ||
            (isBlockElement(next) && (cur.nodeName != 'BR' || cur.cmIgnore))
      )
        this.lineBreak();
      cur = next;
    }
    this.findPointBefore(parent, end);
    return this;
  }
  readTextNode(node) {
    let text = node.nodeValue;
    for (let point of this.points)
      if (point.node == node) point.pos = this.text.length + Math.min(point.offset, text.length);
    for (let off = 0, re = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let nextBreak = -1,
        breakSize = 1,
        m;
      if (this.lineSeparator) {
        nextBreak = text.indexOf(this.lineSeparator, off);
        breakSize = this.lineSeparator.length;
      } else if ((m = re.exec(text))) {
        nextBreak = m.index;
        breakSize = m[0].length;
      }
      this.append(text.slice(off, nextBreak < 0 ? text.length : nextBreak));
      if (nextBreak < 0) break;
      this.lineBreak();
      if (breakSize > 1) {
        for (let point of this.points)
          if (point.node == node && point.pos > this.text.length) point.pos -= breakSize - 1;
      }
      off = nextBreak + breakSize;
    }
  }
  readNode(node) {
    if (node.cmIgnore) return;
    let view = ContentView.get(node);
    let fromView = view && view.overrideDOMText;
    if (fromView != null) {
      this.findPointInside(node, fromView.length);
      for (let i = fromView.iter(); !i.next().done; ) {
        if (i.lineBreak) this.lineBreak();
        else this.append(i.value);
      }
    } else if (node.nodeType == 3) {
      this.readTextNode(node);
    } else if (node.nodeName == 'BR') {
      if (node.nextSibling) this.lineBreak();
    } else if (node.nodeType == 1) {
      this.readRange(node.firstChild, null);
    }
  }
  findPointBefore(node, next) {
    for (let point of this.points)
      if (point.node == node && node.childNodes[point.offset] == next) point.pos = this.text.length;
  }
  findPointInside(node, maxLen) {
    for (let point of this.points)
      if (node.nodeType == 3 ? point.node == node : node.contains(point.node))
        point.pos = this.text.length + Math.min(maxLen, point.offset);
  }
};
function isBlockElement(node) {
  return node.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(node.nodeName);
}
var DOMPoint = class {
  constructor(node, offset) {
    this.node = node;
    this.offset = offset;
    this.pos = -1;
  }
};
var DocView = class extends ContentView {
  constructor(view) {
    super();
    this.view = view;
    this.compositionDeco = Decoration.none;
    this.decorations = [];
    this.pluginDecorationLength = 0;
    this.minWidth = 0;
    this.minWidthFrom = 0;
    this.minWidthTo = 0;
    this.impreciseAnchor = null;
    this.impreciseHead = null;
    this.forceSelection = false;
    this.lastUpdate = Date.now();
    this.setDOM(view.contentDOM);
    this.children = [new LineView()];
    this.children[0].setParent(this);
    this.updateDeco();
    this.updateInner([new ChangedRange(0, 0, 0, view.state.doc.length)], 0);
  }
  get root() {
    return this.view.root;
  }
  get editorView() {
    return this.view;
  }
  get length() {
    return this.view.state.doc.length;
  }
  // Update the document view to a given state. scrollIntoView can be
  // used as a hint to compute a new viewport that includes that
  // position, if we know the editor is going to scroll that position
  // into view.
  update(update) {
    let changedRanges = update.changedRanges;
    if (this.minWidth > 0 && changedRanges.length) {
      if (!changedRanges.every(({ fromA, toA }) => toA < this.minWidthFrom || fromA > this.minWidthTo)) {
        this.minWidth = this.minWidthFrom = this.minWidthTo = 0;
      } else {
        this.minWidthFrom = update.changes.mapPos(this.minWidthFrom, 1);
        this.minWidthTo = update.changes.mapPos(this.minWidthTo, 1);
      }
    }
    if (this.view.inputState.composing < 0) this.compositionDeco = Decoration.none;
    else if (update.transactions.length || this.dirty)
      this.compositionDeco = computeCompositionDeco(this.view, update.changes);
    if (
      (browser.ie || browser.chrome) &&
      !this.compositionDeco.size &&
      update &&
      update.state.doc.lines != update.startState.doc.lines
    )
      this.forceSelection = true;
    let prevDeco = this.decorations,
      deco = this.updateDeco();
    let decoDiff = findChangedDeco(prevDeco, deco, update.changes);
    changedRanges = ChangedRange.extendWithRanges(changedRanges, decoDiff);
    if (this.dirty == 0 && changedRanges.length == 0) {
      return false;
    } else {
      this.updateInner(changedRanges, update.startState.doc.length);
      if (update.transactions.length) this.lastUpdate = Date.now();
      return true;
    }
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(changes, oldLength) {
    this.view.viewState.mustMeasureContent = true;
    this.updateChildren(changes, oldLength);
    let { observer } = this.view;
    observer.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight + 'px';
      this.dom.style.minWidth = this.minWidth ? this.minWidth + 'px' : '';
      let track = browser.chrome || browser.ios ? { node: observer.selectionRange.focusNode, written: false } : void 0;
      this.sync(track);
      this.dirty = 0;
      if (track && (track.written || observer.selectionRange.focusNode != track.node)) this.forceSelection = true;
      this.dom.style.height = '';
    });
    let gaps = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length) {
      for (let child of this.children)
        if (child instanceof BlockWidgetView && child.widget instanceof BlockGapWidget) gaps.push(child.dom);
    }
    observer.updateGaps(gaps);
  }
  updateChildren(changes, oldLength) {
    let cursor = this.childCursor(oldLength);
    for (let i = changes.length - 1; ; i--) {
      let next = i >= 0 ? changes[i] : null;
      if (!next) break;
      let { fromA, toA, fromB, toB } = next;
      let {
        content: content2,
        breakAtStart,
        openStart,
        openEnd,
      } = ContentBuilder.build(this.view.state.doc, fromB, toB, this.decorations, this.pluginDecorationLength);
      let { i: toI, off: toOff } = cursor.findPos(toA, 1);
      let { i: fromI, off: fromOff } = cursor.findPos(fromA, -1);
      replaceRange(this, fromI, fromOff, toI, toOff, content2, breakAtStart, openStart, openEnd);
    }
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(mustRead = false, fromPointer = false) {
    if (mustRead) this.view.observer.readSelectionRange();
    if (!(fromPointer || this.mayControlSelection()) || (browser.ios && this.view.inputState.rapidCompositionStart))
      return;
    let force = this.forceSelection;
    this.forceSelection = false;
    let main = this.view.state.selection.main;
    let anchor = this.domAtPos(main.anchor);
    let head = main.empty ? anchor : this.domAtPos(main.head);
    if (browser.gecko && main.empty && betweenUneditable(anchor)) {
      let dummy = document.createTextNode('');
      this.view.observer.ignore(() => anchor.node.insertBefore(dummy, anchor.node.childNodes[anchor.offset] || null));
      anchor = head = new DOMPos(dummy, 0);
      force = true;
    }
    let domSel = this.view.observer.selectionRange;
    if (
      force ||
      !domSel.focusNode ||
      !isEquivalentPosition(anchor.node, anchor.offset, domSel.anchorNode, domSel.anchorOffset) ||
      !isEquivalentPosition(head.node, head.offset, domSel.focusNode, domSel.focusOffset)
    ) {
      this.view.observer.ignore(() => {
        if (
          browser.android &&
          browser.chrome &&
          this.dom.contains(domSel.focusNode) &&
          inUneditable(domSel.focusNode, this.dom)
        ) {
          this.dom.blur();
          this.dom.focus({ preventScroll: true });
        }
        let rawSel = getSelection(this.root);
        if (main.empty) {
          if (browser.gecko) {
            let nextTo = nextToUneditable(anchor.node, anchor.offset);
            if (nextTo && nextTo != (1 | 2)) {
              let text = nearbyTextNode(anchor.node, anchor.offset, nextTo == 1 ? 1 : -1);
              if (text) anchor = new DOMPos(text, nextTo == 1 ? 0 : text.nodeValue.length);
            }
          }
          rawSel.collapse(anchor.node, anchor.offset);
          if (main.bidiLevel != null && domSel.cursorBidiLevel != null) domSel.cursorBidiLevel = main.bidiLevel;
        } else if (rawSel.extend) {
          rawSel.collapse(anchor.node, anchor.offset);
          rawSel.extend(head.node, head.offset);
        } else {
          let range = document.createRange();
          if (main.anchor > main.head) [anchor, head] = [head, anchor];
          range.setEnd(head.node, head.offset);
          range.setStart(anchor.node, anchor.offset);
          rawSel.removeAllRanges();
          rawSel.addRange(range);
        }
      });
      this.view.observer.setSelectionRange(anchor, head);
    }
    this.impreciseAnchor = anchor.precise ? null : new DOMPos(domSel.anchorNode, domSel.anchorOffset);
    this.impreciseHead = head.precise ? null : new DOMPos(domSel.focusNode, domSel.focusOffset);
  }
  enforceCursorAssoc() {
    if (this.compositionDeco.size) return;
    let cursor = this.view.state.selection.main;
    let sel = getSelection(this.root);
    if (!cursor.empty || !cursor.assoc || !sel.modify) return;
    let line = LineView.find(this, cursor.head);
    if (!line) return;
    let lineStart = line.posAtStart;
    if (cursor.head == lineStart || cursor.head == lineStart + line.length) return;
    let before = this.coordsAt(cursor.head, -1),
      after = this.coordsAt(cursor.head, 1);
    if (!before || !after || before.bottom > after.top) return;
    let dom = this.domAtPos(cursor.head + cursor.assoc);
    sel.collapse(dom.node, dom.offset);
    sel.modify('move', cursor.assoc < 0 ? 'forward' : 'backward', 'lineboundary');
  }
  mayControlSelection() {
    return this.view.state.facet(editable)
      ? this.root.activeElement == this.dom
      : hasSelection(this.dom, this.view.observer.selectionRange);
  }
  nearest(dom) {
    for (let cur = dom; cur; ) {
      let domView = ContentView.get(cur);
      if (domView && domView.rootView == this) return domView;
      cur = cur.parentNode;
    }
    return null;
  }
  posFromDOM(node, offset) {
    let view = this.nearest(node);
    if (!view) throw new RangeError('Trying to find position for a DOM position outside of the document');
    return view.localPosFromDOM(node, offset) + view.posAtStart;
  }
  domAtPos(pos) {
    let { i, off } = this.childCursor().findPos(pos, -1);
    for (; i < this.children.length - 1; ) {
      let child = this.children[i];
      if (off < child.length || child instanceof LineView) break;
      i++;
      off = 0;
    }
    return this.children[i].domAtPos(off);
  }
  coordsAt(pos, side) {
    for (let off = this.length, i = this.children.length - 1; ; i--) {
      let child = this.children[i],
        start = off - child.breakAfter - child.length;
      if (
        pos > start ||
        (pos == start &&
          child.type != BlockType.WidgetBefore &&
          child.type != BlockType.WidgetAfter &&
          (!i ||
            side == 2 ||
            this.children[i - 1].breakAfter ||
            (this.children[i - 1].type == BlockType.WidgetBefore && side > -2)))
      )
        return child.coordsAt(pos - start, side);
      off = start;
    }
  }
  measureVisibleLineHeights() {
    let result = [],
      { from, to } = this.view.viewState.viewport;
    let contentWidth = this.view.contentDOM.clientWidth;
    let isWider = contentWidth > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1;
    let widest = -1;
    for (let pos = 0, i = 0; i < this.children.length; i++) {
      let child = this.children[i],
        end = pos + child.length;
      if (end > to) break;
      if (pos >= from) {
        let childRect = child.dom.getBoundingClientRect();
        result.push(childRect.height);
        if (isWider) {
          let last = child.dom.lastChild;
          let rects = last ? clientRectsFor(last) : [];
          if (rects.length) {
            let rect = rects[rects.length - 1];
            let width =
              this.view.textDirection == Direction.LTR ? rect.right - childRect.left : childRect.right - rect.left;
            if (width > widest) {
              widest = width;
              this.minWidth = contentWidth;
              this.minWidthFrom = pos;
              this.minWidthTo = end;
            }
          }
        }
      }
      pos = end + child.breakAfter;
    }
    return result;
  }
  measureTextSize() {
    for (let child of this.children) {
      if (child instanceof LineView) {
        let measure = child.measureTextSize();
        if (measure) return measure;
      }
    }
    let dummy = document.createElement('div'),
      lineHeight,
      charWidth;
    dummy.className = 'cm-line';
    dummy.textContent = 'abc def ghi jkl mno pqr stu';
    this.view.observer.ignore(() => {
      this.dom.appendChild(dummy);
      let rect = clientRectsFor(dummy.firstChild)[0];
      lineHeight = dummy.getBoundingClientRect().height;
      charWidth = rect ? rect.width / 27 : 7;
      dummy.remove();
    });
    return { lineHeight, charWidth };
  }
  childCursor(pos = this.length) {
    let i = this.children.length;
    if (i) pos -= this.children[--i].length;
    return new ChildCursor(this.children, pos, i);
  }
  computeBlockGapDeco() {
    let deco = [],
      vs = this.view.viewState;
    for (let pos = 0, i = 0; ; i++) {
      let next = i == vs.viewports.length ? null : vs.viewports[i];
      let end = next ? next.from - 1 : this.length;
      if (end > pos) {
        let height = vs.lineBlockAt(end).bottom - vs.lineBlockAt(pos).top;
        deco.push(
          Decoration.replace({
            widget: new BlockGapWidget(height),
            block: true,
            inclusive: true,
            isBlockGap: true,
          }).range(pos, end),
        );
      }
      if (!next) break;
      pos = next.to + 1;
    }
    return Decoration.set(deco);
  }
  updateDeco() {
    let pluginDecorations = this.view.pluginField(PluginField.decorations);
    this.pluginDecorationLength = pluginDecorations.length;
    return (this.decorations = [
      ...pluginDecorations,
      ...this.view.state.facet(decorations),
      this.compositionDeco,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco,
    ]);
  }
  scrollIntoView(target) {
    let { range } = target;
    let rect = this.coordsAt(range.head, range.empty ? range.assoc : range.head > range.anchor ? -1 : 1),
      other;
    if (!rect) return;
    if (!range.empty && (other = this.coordsAt(range.anchor, range.anchor > range.head ? -1 : 1)))
      rect = {
        left: Math.min(rect.left, other.left),
        top: Math.min(rect.top, other.top),
        right: Math.max(rect.right, other.right),
        bottom: Math.max(rect.bottom, other.bottom),
      };
    let mLeft = 0,
      mRight = 0,
      mTop = 0,
      mBottom = 0;
    for (let margins of this.view.pluginField(PluginField.scrollMargins))
      if (margins) {
        let { left, right, top, bottom } = margins;
        if (left != null) mLeft = Math.max(mLeft, left);
        if (right != null) mRight = Math.max(mRight, right);
        if (top != null) mTop = Math.max(mTop, top);
        if (bottom != null) mBottom = Math.max(mBottom, bottom);
      }
    let targetRect = {
      left: rect.left - mLeft,
      top: rect.top - mTop,
      right: rect.right + mRight,
      bottom: rect.bottom + mBottom,
    };
    scrollRectIntoView(
      this.view.scrollDOM,
      targetRect,
      range.head < range.anchor ? -1 : 1,
      target.x,
      target.y,
      target.xMargin,
      target.yMargin,
      this.view.textDirection == Direction.LTR,
    );
  }
};
function betweenUneditable(pos) {
  return (
    pos.node.nodeType == 1 &&
    pos.node.firstChild &&
    (pos.offset == 0 || pos.node.childNodes[pos.offset - 1].contentEditable == 'false') &&
    (pos.offset == pos.node.childNodes.length || pos.node.childNodes[pos.offset].contentEditable == 'false')
  );
}
var BlockGapWidget = class extends WidgetType {
  constructor(height) {
    super();
    this.height = height;
  }
  toDOM() {
    let elt = document.createElement('div');
    this.updateDOM(elt);
    return elt;
  }
  eq(other) {
    return other.height == this.height;
  }
  updateDOM(elt) {
    elt.style.height = this.height + 'px';
    return true;
  }
  get estimatedHeight() {
    return this.height;
  }
};
function compositionSurroundingNode(view) {
  let sel = view.observer.selectionRange;
  let textNode = sel.focusNode && nearbyTextNode(sel.focusNode, sel.focusOffset, 0);
  if (!textNode) return null;
  let cView = view.docView.nearest(textNode);
  if (!cView) return null;
  if (cView instanceof LineView) {
    let topNode = textNode;
    while (topNode.parentNode != cView.dom) topNode = topNode.parentNode;
    let prev = topNode.previousSibling;
    while (prev && !ContentView.get(prev)) prev = prev.previousSibling;
    let pos = prev ? ContentView.get(prev).posAtEnd : cView.posAtStart;
    return { from: pos, to: pos, node: topNode, text: textNode };
  } else {
    for (;;) {
      let { parent } = cView;
      if (!parent) return null;
      if (parent instanceof LineView) break;
      cView = parent;
    }
    let from = cView.posAtStart;
    return { from, to: from + cView.length, node: cView.dom, text: textNode };
  }
}
function computeCompositionDeco(view, changes) {
  let surrounding = compositionSurroundingNode(view);
  if (!surrounding) return Decoration.none;
  let { from, to, node, text: textNode } = surrounding;
  let newFrom = changes.mapPos(from, 1),
    newTo = Math.max(newFrom, changes.mapPos(to, -1));
  let { state } = view,
    text = node.nodeType == 3 ? node.nodeValue : new DOMReader([], state).readRange(node.firstChild, null).text;
  if (newTo - newFrom < text.length) {
    if (state.doc.sliceString(newFrom, Math.min(state.doc.length, newFrom + text.length), LineBreakPlaceholder) == text)
      newTo = newFrom + text.length;
    else if (state.doc.sliceString(Math.max(0, newTo - text.length), newTo, LineBreakPlaceholder) == text)
      newFrom = newTo - text.length;
    else return Decoration.none;
  } else if (state.doc.sliceString(newFrom, newTo, LineBreakPlaceholder) != text) {
    return Decoration.none;
  }
  let topView = ContentView.get(node);
  if (topView instanceof CompositionView) topView = topView.widget.topView;
  else if (topView) topView.parent = null;
  return Decoration.set(
    Decoration.replace({ widget: new CompositionWidget(node, textNode, topView) }).range(newFrom, newTo),
  );
}
var CompositionWidget = class extends WidgetType {
  constructor(top, text, topView) {
    super();
    this.top = top;
    this.text = text;
    this.topView = topView;
  }
  eq(other) {
    return this.top == other.top && this.text == other.text;
  }
  toDOM() {
    return this.top;
  }
  ignoreEvent() {
    return false;
  }
  get customView() {
    return CompositionView;
  }
};
function nearbyTextNode(node, offset, side) {
  for (;;) {
    if (node.nodeType == 3) return node;
    if (node.nodeType == 1 && offset > 0 && side <= 0) {
      node = node.childNodes[offset - 1];
      offset = maxOffset(node);
    } else if (node.nodeType == 1 && offset < node.childNodes.length && side >= 0) {
      node = node.childNodes[offset];
      offset = 0;
    } else {
      return null;
    }
  }
}
function nextToUneditable(node, offset) {
  if (node.nodeType != 1) return 0;
  return (
    (offset && node.childNodes[offset - 1].contentEditable == 'false' ? 1 : 0) |
    (offset < node.childNodes.length && node.childNodes[offset].contentEditable == 'false' ? 2 : 0)
  );
}
var DecorationComparator$1 = class {
  constructor() {
    this.changes = [];
  }
  compareRange(from, to) {
    addRange(from, to, this.changes);
  }
  comparePoint(from, to) {
    addRange(from, to, this.changes);
  }
};
function findChangedDeco(a, b, diff) {
  let comp = new DecorationComparator$1();
  RangeSet.compare(a, b, diff, comp);
  return comp.changes;
}
function inUneditable(node, inside2) {
  for (let cur = node; cur && cur != inside2; cur = cur.assignedSlot || cur.parentNode) {
    if (cur.nodeType == 1 && cur.contentEditable == 'false') {
      return true;
    }
  }
  return false;
}
function groupAt(state, pos, bias = 1) {
  let categorize = state.charCategorizer(pos);
  let line = state.doc.lineAt(pos),
    linePos = pos - line.from;
  if (line.length == 0) return EditorSelection.cursor(pos);
  if (linePos == 0) bias = 1;
  else if (linePos == line.length) bias = -1;
  let from = linePos,
    to = linePos;
  if (bias < 0) from = findClusterBreak(line.text, linePos, false);
  else to = findClusterBreak(line.text, linePos);
  let cat = categorize(line.text.slice(from, to));
  while (from > 0) {
    let prev = findClusterBreak(line.text, from, false);
    if (categorize(line.text.slice(prev, from)) != cat) break;
    from = prev;
  }
  while (to < line.length) {
    let next = findClusterBreak(line.text, to);
    if (categorize(line.text.slice(to, next)) != cat) break;
    to = next;
  }
  return EditorSelection.range(from + line.from, to + line.from);
}
function getdx(x, rect) {
  return rect.left > x ? rect.left - x : Math.max(0, x - rect.right);
}
function getdy(y, rect) {
  return rect.top > y ? rect.top - y : Math.max(0, y - rect.bottom);
}
function yOverlap(a, b) {
  return a.top < b.bottom - 1 && a.bottom > b.top + 1;
}
function upTop(rect, top) {
  return top < rect.top ? { top, left: rect.left, right: rect.right, bottom: rect.bottom } : rect;
}
function upBot(rect, bottom) {
  return bottom > rect.bottom ? { top: rect.top, left: rect.left, right: rect.right, bottom } : rect;
}
function domPosAtCoords(parent, x, y) {
  let closest, closestRect, closestX, closestY;
  let above, below, aboveRect, belowRect;
  for (let child = parent.firstChild; child; child = child.nextSibling) {
    let rects = clientRectsFor(child);
    for (let i = 0; i < rects.length; i++) {
      let rect = rects[i];
      if (closestRect && yOverlap(closestRect, rect)) rect = upTop(upBot(rect, closestRect.bottom), closestRect.top);
      let dx = getdx(x, rect),
        dy = getdy(y, rect);
      if (dx == 0 && dy == 0) return child.nodeType == 3 ? domPosInText(child, x, y) : domPosAtCoords(child, x, y);
      if (!closest || closestY > dy || (closestY == dy && closestX > dx)) {
        closest = child;
        closestRect = rect;
        closestX = dx;
        closestY = dy;
      }
      if (dx == 0) {
        if (y > rect.bottom && (!aboveRect || aboveRect.bottom < rect.bottom)) {
          above = child;
          aboveRect = rect;
        } else if (y < rect.top && (!belowRect || belowRect.top > rect.top)) {
          below = child;
          belowRect = rect;
        }
      } else if (aboveRect && yOverlap(aboveRect, rect)) {
        aboveRect = upBot(aboveRect, rect.bottom);
      } else if (belowRect && yOverlap(belowRect, rect)) {
        belowRect = upTop(belowRect, rect.top);
      }
    }
  }
  if (aboveRect && aboveRect.bottom >= y) {
    closest = above;
    closestRect = aboveRect;
  } else if (belowRect && belowRect.top <= y) {
    closest = below;
    closestRect = belowRect;
  }
  if (!closest) return { node: parent, offset: 0 };
  let clipX = Math.max(closestRect.left, Math.min(closestRect.right, x));
  if (closest.nodeType == 3) return domPosInText(closest, clipX, y);
  if (!closestX && closest.contentEditable == 'true') return domPosAtCoords(closest, clipX, y);
  let offset =
    Array.prototype.indexOf.call(parent.childNodes, closest) +
    (x >= (closestRect.left + closestRect.right) / 2 ? 1 : 0);
  return { node: parent, offset };
}
function domPosInText(node, x, y) {
  let len = node.nodeValue.length;
  let closestOffset = -1,
    closestDY = 1e9,
    generalSide = 0;
  for (let i = 0; i < len; i++) {
    let rects = textRange(node, i, i + 1).getClientRects();
    for (let j = 0; j < rects.length; j++) {
      let rect = rects[j];
      if (rect.top == rect.bottom) continue;
      if (!generalSide) generalSide = x - rect.left;
      let dy = (rect.top > y ? rect.top - y : y - rect.bottom) - 1;
      if (rect.left - 1 <= x && rect.right + 1 >= x && dy < closestDY) {
        let right = x >= (rect.left + rect.right) / 2,
          after = right;
        if (browser.chrome || browser.gecko) {
          let rectBefore = textRange(node, i).getBoundingClientRect();
          if (rectBefore.left == rect.right) after = !right;
        }
        if (dy <= 0) return { node, offset: i + (after ? 1 : 0) };
        closestOffset = i + (after ? 1 : 0);
        closestDY = dy;
      }
    }
  }
  return { node, offset: closestOffset > -1 ? closestOffset : generalSide > 0 ? node.nodeValue.length : 0 };
}
function posAtCoords(view, { x, y }, precise, bias = -1) {
  var _a2;
  let content2 = view.contentDOM.getBoundingClientRect(),
    docTop = content2.top + view.viewState.paddingTop;
  let block,
    { docHeight } = view.viewState;
  let yOffset = y - docTop;
  if (yOffset < 0) return 0;
  if (yOffset > docHeight) return view.state.doc.length;
  for (let halfLine = view.defaultLineHeight / 2, bounced = false; ; ) {
    block = view.elementAtHeight(yOffset);
    if (block.type == BlockType.Text) break;
    for (;;) {
      yOffset = bias > 0 ? block.bottom + halfLine : block.top - halfLine;
      if (yOffset >= 0 && yOffset <= docHeight) break;
      if (bounced) return precise ? null : 0;
      bounced = true;
      bias = -bias;
    }
  }
  y = docTop + yOffset;
  let lineStart = block.from;
  if (lineStart < view.viewport.from)
    return view.viewport.from == 0 ? 0 : precise ? null : posAtCoordsImprecise(view, content2, block, x, y);
  if (lineStart > view.viewport.to)
    return view.viewport.to == view.state.doc.length
      ? view.state.doc.length
      : precise
      ? null
      : posAtCoordsImprecise(view, content2, block, x, y);
  let doc2 = view.dom.ownerDocument;
  let root = view.root.elementFromPoint ? view.root : doc2;
  let element = root.elementFromPoint(x, y);
  if (element && !view.contentDOM.contains(element)) element = null;
  if (!element) {
    x = Math.max(content2.left + 1, Math.min(content2.right - 1, x));
    element = root.elementFromPoint(x, y);
    if (element && !view.contentDOM.contains(element)) element = null;
  }
  let node,
    offset = -1;
  if (
    element &&
    ((_a2 = view.docView.nearest(element)) === null || _a2 === void 0 ? void 0 : _a2.isEditable) != false
  ) {
    if (doc2.caretPositionFromPoint) {
      let pos = doc2.caretPositionFromPoint(x, y);
      if (pos) ({ offsetNode: node, offset } = pos);
    } else if (doc2.caretRangeFromPoint) {
      let range = doc2.caretRangeFromPoint(x, y);
      if (range) {
        ({ startContainer: node, startOffset: offset } = range);
        if (browser.safari && isSuspiciousCaretResult(node, offset, x)) node = void 0;
      }
    }
  }
  if (!node || !view.docView.dom.contains(node)) {
    let line = LineView.find(view.docView, lineStart);
    if (!line) return yOffset > block.top + block.height / 2 ? block.to : block.from;
    ({ node, offset } = domPosAtCoords(line.dom, x, y));
  }
  return view.docView.posFromDOM(node, offset);
}
function posAtCoordsImprecise(view, contentRect, block, x, y) {
  let into = Math.round((x - contentRect.left) * view.defaultCharacterWidth);
  if (view.lineWrapping && block.height > view.defaultLineHeight * 1.5) {
    let line = Math.floor((y - block.top) / view.defaultLineHeight);
    into += line * view.viewState.heightOracle.lineLength;
  }
  let content2 = view.state.sliceDoc(block.from, block.to);
  return block.from + findColumn(content2, into, view.state.tabSize);
}
function isSuspiciousCaretResult(node, offset, x) {
  let len;
  if (node.nodeType != 3 || offset != (len = node.nodeValue.length)) return false;
  for (let next = node.nextSibling; next; next = next.nextSibling)
    if (next.nodeType != 1 || next.nodeName != 'BR') return false;
  return textRange(node, len - 1, len).getBoundingClientRect().left > x;
}
function moveToLineBoundary(view, start, forward, includeWrap) {
  let line = view.state.doc.lineAt(start.head);
  let coords =
    !includeWrap || !view.lineWrapping
      ? null
      : view.coordsAtPos(start.assoc < 0 && start.head > line.from ? start.head - 1 : start.head);
  if (coords) {
    let editorRect = view.dom.getBoundingClientRect();
    let pos = view.posAtCoords({
      x: forward == (view.textDirection == Direction.LTR) ? editorRect.right - 1 : editorRect.left + 1,
      y: (coords.top + coords.bottom) / 2,
    });
    if (pos != null) return EditorSelection.cursor(pos, forward ? -1 : 1);
  }
  let lineView = LineView.find(view.docView, start.head);
  let end = lineView ? (forward ? lineView.posAtEnd : lineView.posAtStart) : forward ? line.to : line.from;
  return EditorSelection.cursor(end, forward ? -1 : 1);
}
function moveByChar(view, start, forward, by) {
  let line = view.state.doc.lineAt(start.head),
    spans = view.bidiSpans(line);
  for (let cur = start, check = null; ; ) {
    let next = moveVisually(line, spans, view.textDirection, cur, forward),
      char = movedOver;
    if (!next) {
      if (line.number == (forward ? view.state.doc.lines : 1)) return cur;
      char = '\n';
      line = view.state.doc.line(line.number + (forward ? 1 : -1));
      spans = view.bidiSpans(line);
      next = EditorSelection.cursor(forward ? line.from : line.to);
    }
    if (!check) {
      if (!by) return next;
      check = by(char);
    } else if (!check(char)) {
      return cur;
    }
    cur = next;
  }
}
function byGroup(view, pos, start) {
  let categorize = view.state.charCategorizer(pos);
  let cat = categorize(start);
  return (next) => {
    let nextCat = categorize(next);
    if (cat == CharCategory.Space) cat = nextCat;
    return cat == nextCat;
  };
}
function moveVertically(view, start, forward, distance) {
  let startPos = start.head,
    dir = forward ? 1 : -1;
  if (startPos == (forward ? view.state.doc.length : 0)) return EditorSelection.cursor(startPos, start.assoc);
  let goal = start.goalColumn,
    startY;
  let rect = view.contentDOM.getBoundingClientRect();
  let startCoords = view.coordsAtPos(startPos),
    docTop = view.documentTop;
  if (startCoords) {
    if (goal == null) goal = startCoords.left - rect.left;
    startY = dir < 0 ? startCoords.top : startCoords.bottom;
  } else {
    let line = view.viewState.lineBlockAt(startPos - docTop);
    if (goal == null) goal = Math.min(rect.right - rect.left, view.defaultCharacterWidth * (startPos - line.from));
    startY = (dir < 0 ? line.top : line.bottom) + docTop;
  }
  let resolvedGoal = rect.left + goal;
  let dist = distance !== null && distance !== void 0 ? distance : view.defaultLineHeight >> 1;
  for (let extra = 0; ; extra += 10) {
    let curY = startY + (dist + extra) * dir;
    let pos = posAtCoords(view, { x: resolvedGoal, y: curY }, false, dir);
    if (curY < rect.top || curY > rect.bottom || (dir < 0 ? pos < startPos : pos > startPos))
      return EditorSelection.cursor(pos, start.assoc, void 0, goal);
  }
}
function skipAtoms(view, oldPos, pos) {
  let atoms = view.pluginField(PluginField.atomicRanges);
  for (;;) {
    let moved = false;
    for (let set of atoms) {
      set.between(pos.from - 1, pos.from + 1, (from, to, value) => {
        if (pos.from > from && pos.from < to) {
          pos = oldPos.from > pos.from ? EditorSelection.cursor(from, 1) : EditorSelection.cursor(to, -1);
          moved = true;
        }
      });
    }
    if (!moved) return pos;
  }
}
var InputState = class {
  constructor(view) {
    this.lastKeyCode = 0;
    this.lastKeyTime = 0;
    this.pendingIOSKey = void 0;
    this.lastSelectionOrigin = null;
    this.lastSelectionTime = 0;
    this.lastEscPress = 0;
    this.lastContextMenu = 0;
    this.scrollHandlers = [];
    this.registeredEvents = [];
    this.customHandlers = [];
    this.composing = -1;
    this.compositionFirstChange = null;
    this.compositionEndedAt = 0;
    this.rapidCompositionStart = false;
    this.mouseSelection = null;
    for (let type in handlers) {
      let handler = handlers[type];
      view.contentDOM.addEventListener(type, (event) => {
        if (!eventBelongsToEditor(view, event) || this.ignoreDuringComposition(event)) return;
        if (type == 'keydown' && this.keydown(view, event)) return;
        if (this.mustFlushObserver(event)) view.observer.forceFlush();
        if (this.runCustomHandlers(type, view, event)) event.preventDefault();
        else handler(view, event);
      });
      this.registeredEvents.push(type);
    }
    this.notifiedFocused = view.hasFocus;
    this.ensureHandlers(view);
    if (browser.safari) view.contentDOM.addEventListener('input', () => null);
  }
  setSelectionOrigin(origin) {
    this.lastSelectionOrigin = origin;
    this.lastSelectionTime = Date.now();
  }
  ensureHandlers(view) {
    let handlers2 = (this.customHandlers = view.pluginField(domEventHandlers));
    for (let set of handlers2) {
      for (let type in set.handlers)
        if (this.registeredEvents.indexOf(type) < 0 && type != 'scroll') {
          this.registeredEvents.push(type);
          view.contentDOM.addEventListener(type, (event) => {
            if (!eventBelongsToEditor(view, event)) return;
            if (this.runCustomHandlers(type, view, event)) event.preventDefault();
          });
        }
    }
  }
  runCustomHandlers(type, view, event) {
    for (let set of this.customHandlers) {
      let handler = set.handlers[type];
      if (handler) {
        try {
          if (handler.call(set.plugin, event, view) || event.defaultPrevented) return true;
        } catch (e) {
          logException(view.state, e);
        }
      }
    }
    return false;
  }
  runScrollHandlers(view, event) {
    for (let set of this.customHandlers) {
      let handler = set.handlers.scroll;
      if (handler) {
        try {
          handler.call(set.plugin, event, view);
        } catch (e) {
          logException(view.state, e);
        }
      }
    }
  }
  keydown(view, event) {
    this.lastKeyCode = event.keyCode;
    this.lastKeyTime = Date.now();
    if (event.keyCode == 9 && Date.now() < this.lastEscPress + 2e3) return true;
    if (browser.android && browser.chrome && !event.synthetic && (event.keyCode == 13 || event.keyCode == 8)) {
      view.observer.delayAndroidKey(event.key, event.keyCode);
      return true;
    }
    let pending;
    if (
      browser.ios &&
      (pending = PendingKeys.find((key) => key.keyCode == event.keyCode)) &&
      !(event.ctrlKey || event.altKey || event.metaKey) &&
      !event.synthetic
    ) {
      this.pendingIOSKey = pending;
      setTimeout(() => this.flushIOSKey(view), 250);
      return true;
    }
    return false;
  }
  flushIOSKey(view) {
    let key = this.pendingIOSKey;
    if (!key) return false;
    this.pendingIOSKey = void 0;
    return dispatchKey(view.contentDOM, key.key, key.keyCode);
  }
  ignoreDuringComposition(event) {
    if (!/^key/.test(event.type)) return false;
    if (this.composing > 0) return true;
    if (browser.safari && Date.now() - this.compositionEndedAt < 500) {
      this.compositionEndedAt = 0;
      return true;
    }
    return false;
  }
  mustFlushObserver(event) {
    return (event.type == 'keydown' && event.keyCode != 229) || (event.type == 'compositionend' && !browser.ios);
  }
  startMouseSelection(mouseSelection) {
    if (this.mouseSelection) this.mouseSelection.destroy();
    this.mouseSelection = mouseSelection;
  }
  update(update) {
    if (this.mouseSelection) this.mouseSelection.update(update);
    if (update.transactions.length) this.lastKeyCode = this.lastSelectionTime = 0;
  }
  destroy() {
    if (this.mouseSelection) this.mouseSelection.destroy();
  }
};
var PendingKeys = [
  { key: 'Backspace', keyCode: 8, inputType: 'deleteContentBackward' },
  { key: 'Enter', keyCode: 13, inputType: 'insertParagraph' },
  { key: 'Delete', keyCode: 46, inputType: 'deleteContentForward' },
];
var modifierCodes = [16, 17, 18, 20, 91, 92, 224, 225];
var MouseSelection = class {
  constructor(view, startEvent, style, mustSelect) {
    this.view = view;
    this.style = style;
    this.mustSelect = mustSelect;
    this.lastEvent = startEvent;
    let doc2 = view.contentDOM.ownerDocument;
    doc2.addEventListener('mousemove', (this.move = this.move.bind(this)));
    doc2.addEventListener('mouseup', (this.up = this.up.bind(this)));
    this.extend = startEvent.shiftKey;
    this.multiple = view.state.facet(EditorState.allowMultipleSelections) && addsSelectionRange(view, startEvent);
    this.dragMove = dragMovesSelection(view, startEvent);
    this.dragging = isInPrimarySelection(view, startEvent) && getClickType(startEvent) == 1 ? null : false;
    if (this.dragging === false) {
      startEvent.preventDefault();
      this.select(startEvent);
    }
  }
  move(event) {
    if (event.buttons == 0) return this.destroy();
    if (this.dragging !== false) return;
    this.select((this.lastEvent = event));
  }
  up(event) {
    if (this.dragging == null) this.select(this.lastEvent);
    if (!this.dragging) event.preventDefault();
    this.destroy();
  }
  destroy() {
    let doc2 = this.view.contentDOM.ownerDocument;
    doc2.removeEventListener('mousemove', this.move);
    doc2.removeEventListener('mouseup', this.up);
    this.view.inputState.mouseSelection = null;
  }
  select(event) {
    let selection = this.style.get(event, this.extend, this.multiple);
    if (
      this.mustSelect ||
      !selection.eq(this.view.state.selection) ||
      selection.main.assoc != this.view.state.selection.main.assoc
    )
      this.view.dispatch({
        selection,
        userEvent: 'select.pointer',
        scrollIntoView: true,
      });
    this.mustSelect = false;
  }
  update(update) {
    if (update.docChanged && this.dragging) this.dragging = this.dragging.map(update.changes);
    if (this.style.update(update)) setTimeout(() => this.select(this.lastEvent), 20);
  }
};
function addsSelectionRange(view, event) {
  let facet = view.state.facet(clickAddsSelectionRange);
  return facet.length ? facet[0](event) : browser.mac ? event.metaKey : event.ctrlKey;
}
function dragMovesSelection(view, event) {
  let facet = view.state.facet(dragMovesSelection$1);
  return facet.length ? facet[0](event) : browser.mac ? !event.altKey : !event.ctrlKey;
}
function isInPrimarySelection(view, event) {
  let { main } = view.state.selection;
  if (main.empty) return false;
  let sel = getSelection(view.root);
  if (sel.rangeCount == 0) return true;
  let rects = sel.getRangeAt(0).getClientRects();
  for (let i = 0; i < rects.length; i++) {
    let rect = rects[i];
    if (
      rect.left <= event.clientX &&
      rect.right >= event.clientX &&
      rect.top <= event.clientY &&
      rect.bottom >= event.clientY
    )
      return true;
  }
  return false;
}
function eventBelongsToEditor(view, event) {
  if (!event.bubbles) return true;
  if (event.defaultPrevented) return false;
  for (let node = event.target, cView; node != view.contentDOM; node = node.parentNode)
    if (!node || node.nodeType == 11 || ((cView = ContentView.get(node)) && cView.ignoreEvent(event))) return false;
  return true;
}
var handlers = /* @__PURE__ */ Object.create(null);
var brokenClipboardAPI = (browser.ie && browser.ie_version < 15) || (browser.ios && browser.webkit_version < 604);
function capturePaste(view) {
  let parent = view.dom.parentNode;
  if (!parent) return;
  let target = parent.appendChild(document.createElement('textarea'));
  target.style.cssText = 'position: fixed; left: -10000px; top: 10px';
  target.focus();
  setTimeout(() => {
    view.focus();
    target.remove();
    doPaste(view, target.value);
  }, 50);
}
function doPaste(view, input) {
  let { state } = view,
    changes,
    i = 1,
    text = state.toText(input);
  let byLine = text.lines == state.selection.ranges.length;
  let linewise =
    lastLinewiseCopy != null && state.selection.ranges.every((r) => r.empty) && lastLinewiseCopy == text.toString();
  if (linewise) {
    let lastLine = -1;
    changes = state.changeByRange((range) => {
      let line = state.doc.lineAt(range.from);
      if (line.from == lastLine) return { range };
      lastLine = line.from;
      let insert2 = state.toText((byLine ? text.line(i++).text : input) + state.lineBreak);
      return {
        changes: { from: line.from, insert: insert2 },
        range: EditorSelection.cursor(range.from + insert2.length),
      };
    });
  } else if (byLine) {
    changes = state.changeByRange((range) => {
      let line = text.line(i++);
      return {
        changes: { from: range.from, to: range.to, insert: line.text },
        range: EditorSelection.cursor(range.from + line.length),
      };
    });
  } else {
    changes = state.replaceSelection(text);
  }
  view.dispatch(changes, {
    userEvent: 'input.paste',
    scrollIntoView: true,
  });
}
handlers.keydown = (view, event) => {
  view.inputState.setSelectionOrigin('select');
  if (event.keyCode == 27) view.inputState.lastEscPress = Date.now();
  else if (modifierCodes.indexOf(event.keyCode) < 0) view.inputState.lastEscPress = 0;
};
var lastTouch = 0;
handlers.touchstart = (view, e) => {
  lastTouch = Date.now();
  view.inputState.setSelectionOrigin('select.pointer');
};
handlers.touchmove = (view) => {
  view.inputState.setSelectionOrigin('select.pointer');
};
handlers.mousedown = (view, event) => {
  view.observer.flush();
  if (lastTouch > Date.now() - 2e3 && getClickType(event) == 1) return;
  let style = null;
  for (let makeStyle of view.state.facet(mouseSelectionStyle)) {
    style = makeStyle(view, event);
    if (style) break;
  }
  if (!style && event.button == 0) style = basicMouseSelection(view, event);
  if (style) {
    let mustFocus = view.root.activeElement != view.contentDOM;
    if (mustFocus) view.observer.ignore(() => focusPreventScroll(view.contentDOM));
    view.inputState.startMouseSelection(new MouseSelection(view, event, style, mustFocus));
  }
};
function rangeForClick(view, pos, bias, type) {
  if (type == 1) {
    return EditorSelection.cursor(pos, bias);
  } else if (type == 2) {
    return groupAt(view.state, pos, bias);
  } else {
    let visual = LineView.find(view.docView, pos),
      line = view.state.doc.lineAt(visual ? visual.posAtEnd : pos);
    let from = visual ? visual.posAtStart : line.from,
      to = visual ? visual.posAtEnd : line.to;
    if (to < view.state.doc.length && to == line.to) to++;
    return EditorSelection.range(from, to);
  }
}
var insideY = (y, rect) => y >= rect.top && y <= rect.bottom;
var inside = (x, y, rect) => insideY(y, rect) && x >= rect.left && x <= rect.right;
function findPositionSide(view, pos, x, y) {
  let line = LineView.find(view.docView, pos);
  if (!line) return 1;
  let off = pos - line.posAtStart;
  if (off == 0) return 1;
  if (off == line.length) return -1;
  let before = line.coordsAt(off, -1);
  if (before && inside(x, y, before)) return -1;
  let after = line.coordsAt(off, 1);
  if (after && inside(x, y, after)) return 1;
  return before && insideY(y, before) ? -1 : 1;
}
function queryPos(view, event) {
  let pos = view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
  return { pos, bias: findPositionSide(view, pos, event.clientX, event.clientY) };
}
var BadMouseDetail = browser.ie && browser.ie_version <= 11;
var lastMouseDown = null;
var lastMouseDownCount = 0;
var lastMouseDownTime = 0;
function getClickType(event) {
  if (!BadMouseDetail) return event.detail;
  let last = lastMouseDown,
    lastTime = lastMouseDownTime;
  lastMouseDown = event;
  lastMouseDownTime = Date.now();
  return (lastMouseDownCount =
    !last ||
    (lastTime > Date.now() - 400 &&
      Math.abs(last.clientX - event.clientX) < 2 &&
      Math.abs(last.clientY - event.clientY) < 2)
      ? (lastMouseDownCount + 1) % 3
      : 1);
}
function basicMouseSelection(view, event) {
  let start = queryPos(view, event),
    type = getClickType(event);
  let startSel = view.state.selection;
  let last = start,
    lastEvent = event;
  return {
    update(update) {
      if (update.docChanged) {
        if (start) start.pos = update.changes.mapPos(start.pos);
        startSel = startSel.map(update.changes);
        lastEvent = null;
      }
    },
    get(event2, extend2, multiple) {
      let cur;
      if (lastEvent && event2.clientX == lastEvent.clientX && event2.clientY == lastEvent.clientY) cur = last;
      else {
        cur = last = queryPos(view, event2);
        lastEvent = event2;
      }
      if (!cur || !start) return startSel;
      let range = rangeForClick(view, cur.pos, cur.bias, type);
      if (start.pos != cur.pos && !extend2) {
        let startRange = rangeForClick(view, start.pos, start.bias, type);
        let from = Math.min(startRange.from, range.from),
          to = Math.max(startRange.to, range.to);
        range = from < range.from ? EditorSelection.range(from, to) : EditorSelection.range(to, from);
      }
      if (extend2) return startSel.replaceRange(startSel.main.extend(range.from, range.to));
      else if (multiple) return startSel.addRange(range);
      else return EditorSelection.create([range]);
    },
  };
}
handlers.dragstart = (view, event) => {
  let {
    selection: { main },
  } = view.state;
  let { mouseSelection } = view.inputState;
  if (mouseSelection) mouseSelection.dragging = main;
  if (event.dataTransfer) {
    event.dataTransfer.setData('Text', view.state.sliceDoc(main.from, main.to));
    event.dataTransfer.effectAllowed = 'copyMove';
  }
};
function dropText(view, event, text, direct) {
  if (!text) return;
  let dropPos = view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
  event.preventDefault();
  let { mouseSelection } = view.inputState;
  let del =
    direct && mouseSelection && mouseSelection.dragging && mouseSelection.dragMove
      ? { from: mouseSelection.dragging.from, to: mouseSelection.dragging.to }
      : null;
  let ins = { from: dropPos, insert: text };
  let changes = view.state.changes(del ? [del, ins] : ins);
  view.focus();
  view.dispatch({
    changes,
    selection: { anchor: changes.mapPos(dropPos, -1), head: changes.mapPos(dropPos, 1) },
    userEvent: del ? 'move.drop' : 'input.drop',
  });
}
handlers.drop = (view, event) => {
  if (!event.dataTransfer) return;
  if (view.state.readOnly) return event.preventDefault();
  let files = event.dataTransfer.files;
  if (files && files.length) {
    event.preventDefault();
    let text = Array(files.length),
      read = 0;
    let finishFile = () => {
      if (++read == files.length)
        dropText(view, event, text.filter((s) => s != null).join(view.state.lineBreak), false);
    };
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onerror = finishFile;
      reader.onload = () => {
        if (!/[\x00-\x08\x0e-\x1f]{2}/.test(reader.result)) text[i] = reader.result;
        finishFile();
      };
      reader.readAsText(files[i]);
    }
  } else {
    dropText(view, event, event.dataTransfer.getData('Text'), true);
  }
};
handlers.paste = (view, event) => {
  if (view.state.readOnly) return event.preventDefault();
  view.observer.flush();
  let data = brokenClipboardAPI ? null : event.clipboardData;
  if (data) {
    doPaste(view, data.getData('text/plain'));
    event.preventDefault();
  } else {
    capturePaste(view);
  }
};
function captureCopy(view, text) {
  let parent = view.dom.parentNode;
  if (!parent) return;
  let target = parent.appendChild(document.createElement('textarea'));
  target.style.cssText = 'position: fixed; left: -10000px; top: 10px';
  target.value = text;
  target.focus();
  target.selectionEnd = text.length;
  target.selectionStart = 0;
  setTimeout(() => {
    target.remove();
    view.focus();
  }, 50);
}
function copiedRange(state) {
  let content2 = [],
    ranges = [],
    linewise = false;
  for (let range of state.selection.ranges)
    if (!range.empty) {
      content2.push(state.sliceDoc(range.from, range.to));
      ranges.push(range);
    }
  if (!content2.length) {
    let upto = -1;
    for (let { from } of state.selection.ranges) {
      let line = state.doc.lineAt(from);
      if (line.number > upto) {
        content2.push(line.text);
        ranges.push({ from: line.from, to: Math.min(state.doc.length, line.to + 1) });
      }
      upto = line.number;
    }
    linewise = true;
  }
  return { text: content2.join(state.lineBreak), ranges, linewise };
}
var lastLinewiseCopy = null;
handlers.copy = handlers.cut = (view, event) => {
  let { text, ranges, linewise } = copiedRange(view.state);
  if (!text && !linewise) return;
  lastLinewiseCopy = linewise ? text : null;
  let data = brokenClipboardAPI ? null : event.clipboardData;
  if (data) {
    event.preventDefault();
    data.clearData();
    data.setData('text/plain', text);
  } else {
    captureCopy(view, text);
  }
  if (event.type == 'cut' && !view.state.readOnly)
    view.dispatch({
      changes: ranges,
      scrollIntoView: true,
      userEvent: 'delete.cut',
    });
};
handlers.focus = handlers.blur = (view) => {
  setTimeout(() => {
    if (view.hasFocus != view.inputState.notifiedFocused) view.update([]);
  }, 10);
};
function forceClearComposition(view, rapid) {
  if (view.docView.compositionDeco.size) {
    view.inputState.rapidCompositionStart = rapid;
    try {
      view.update([]);
    } finally {
      view.inputState.rapidCompositionStart = false;
    }
  }
}
handlers.compositionstart = handlers.compositionupdate = (view) => {
  if (view.inputState.compositionFirstChange == null) view.inputState.compositionFirstChange = true;
  if (view.inputState.composing < 0) {
    view.inputState.composing = 0;
    if (view.docView.compositionDeco.size) {
      view.observer.flush();
      forceClearComposition(view, true);
    }
  }
};
handlers.compositionend = (view) => {
  view.inputState.composing = -1;
  view.inputState.compositionEndedAt = Date.now();
  view.inputState.compositionFirstChange = null;
  setTimeout(() => {
    if (view.inputState.composing < 0) forceClearComposition(view, false);
  }, 50);
};
handlers.contextmenu = (view) => {
  view.inputState.lastContextMenu = Date.now();
};
handlers.beforeinput = (view, event) => {
  var _a2;
  let pending;
  if (browser.chrome && browser.android && (pending = PendingKeys.find((key) => key.inputType == event.inputType))) {
    view.observer.delayAndroidKey(pending.key, pending.keyCode);
    if (pending.key == 'Backspace' || pending.key == 'Delete') {
      let startViewHeight = ((_a2 = window.visualViewport) === null || _a2 === void 0 ? void 0 : _a2.height) || 0;
      setTimeout(() => {
        var _a3;
        if (
          (((_a3 = window.visualViewport) === null || _a3 === void 0 ? void 0 : _a3.height) || 0) >
            startViewHeight + 10 &&
          view.hasFocus
        ) {
          view.contentDOM.blur();
          view.focus();
        }
      }, 100);
    }
  }
};
var wrappingWhiteSpace = ['pre-wrap', 'normal', 'pre-line', 'break-spaces'];
var HeightOracle = class {
  constructor() {
    this.doc = Text.empty;
    this.lineWrapping = false;
    this.direction = Direction.LTR;
    this.heightSamples = {};
    this.lineHeight = 14;
    this.charWidth = 7;
    this.lineLength = 30;
    this.heightChanged = false;
  }
  heightForGap(from, to) {
    let lines = this.doc.lineAt(to).number - this.doc.lineAt(from).number + 1;
    if (this.lineWrapping) lines += Math.ceil((to - from - lines * this.lineLength * 0.5) / this.lineLength);
    return this.lineHeight * lines;
  }
  heightForLine(length) {
    if (!this.lineWrapping) return this.lineHeight;
    let lines = 1 + Math.max(0, Math.ceil((length - this.lineLength) / (this.lineLength - 5)));
    return lines * this.lineHeight;
  }
  setDoc(doc2) {
    this.doc = doc2;
    return this;
  }
  mustRefreshForStyle(whiteSpace, direction) {
    return wrappingWhiteSpace.indexOf(whiteSpace) > -1 != this.lineWrapping || this.direction != direction;
  }
  mustRefreshForHeights(lineHeights) {
    let newHeight = false;
    for (let i = 0; i < lineHeights.length; i++) {
      let h = lineHeights[i];
      if (h < 0) {
        i++;
      } else if (!this.heightSamples[Math.floor(h * 10)]) {
        newHeight = true;
        this.heightSamples[Math.floor(h * 10)] = true;
      }
    }
    return newHeight;
  }
  refresh(whiteSpace, direction, lineHeight, charWidth, lineLength, knownHeights) {
    let lineWrapping = wrappingWhiteSpace.indexOf(whiteSpace) > -1;
    let changed =
      Math.round(lineHeight) != Math.round(this.lineHeight) ||
      this.lineWrapping != lineWrapping ||
      this.direction != direction;
    this.lineWrapping = lineWrapping;
    this.direction = direction;
    this.lineHeight = lineHeight;
    this.charWidth = charWidth;
    this.lineLength = lineLength;
    if (changed) {
      this.heightSamples = {};
      for (let i = 0; i < knownHeights.length; i++) {
        let h = knownHeights[i];
        if (h < 0) i++;
        else this.heightSamples[Math.floor(h * 10)] = true;
      }
    }
    return changed;
  }
};
var MeasuredHeights = class {
  constructor(from, heights) {
    this.from = from;
    this.heights = heights;
    this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
};
var BlockInfo = class _BlockInfo {
  /**
  @internal
  */
  constructor(from, length, top, height, type) {
    this.from = from;
    this.length = length;
    this.top = top;
    this.height = height;
    this.type = type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  @internal
  */
  join(other) {
    let detail = (Array.isArray(this.type) ? this.type : [this]).concat(
      Array.isArray(other.type) ? other.type : [other],
    );
    return new _BlockInfo(this.from, this.length + other.length, this.top, this.height + other.height, detail);
  }
  /**
  FIXME remove on next breaking release @internal
  */
  moveY(offset) {
    return !offset
      ? this
      : new _BlockInfo(
          this.from,
          this.length,
          this.top + offset,
          this.height,
          Array.isArray(this.type) ? this.type.map((b) => b.moveY(offset)) : this.type,
        );
  }
};
var QueryType = (function (QueryType2) {
  QueryType2[(QueryType2['ByPos'] = 0)] = 'ByPos';
  QueryType2[(QueryType2['ByHeight'] = 1)] = 'ByHeight';
  QueryType2[(QueryType2['ByPosNoHeight'] = 2)] = 'ByPosNoHeight';
  return QueryType2;
})(QueryType || (QueryType = {}));
var Epsilon = 1e-3;
var HeightMap = class _HeightMap {
  constructor(length, height, flags = 2) {
    this.length = length;
    this.height = height;
    this.flags = flags;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(value) {
    this.flags = (value ? 2 : 0) | (this.flags & ~2);
  }
  setHeight(oracle, height) {
    if (this.height != height) {
      if (Math.abs(this.height - height) > Epsilon) oracle.heightChanged = true;
      this.height = height;
    }
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(_from, _to, nodes) {
    return _HeightMap.of(nodes);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(_to, result) {
    result.push(this);
  }
  decomposeRight(_from, result) {
    result.push(this);
  }
  applyChanges(decorations2, oldDoc, oracle, changes) {
    let me = this;
    for (let i = changes.length - 1; i >= 0; i--) {
      let { fromA, toA, fromB, toB } = changes[i];
      let start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      let end = start.to >= toA ? start : me.lineAt(toA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      toB += end.to - toA;
      toA = end.to;
      while (i > 0 && start.from <= changes[i - 1].toA) {
        fromA = changes[i - 1].fromA;
        fromB = changes[i - 1].fromB;
        i--;
        if (fromA < start.from) start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      }
      fromB += start.from - fromA;
      fromA = start.from;
      let nodes = NodeBuilder.build(oracle, decorations2, fromB, toB);
      me = me.replace(fromA, toA, nodes);
    }
    return me.updateHeight(oracle, 0);
  }
  static empty() {
    return new HeightMapText(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(nodes) {
    if (nodes.length == 1) return nodes[0];
    let i = 0,
      j = nodes.length,
      before = 0,
      after = 0;
    for (;;) {
      if (i == j) {
        if (before > after * 2) {
          let split = nodes[i - 1];
          if (split.break) nodes.splice(--i, 1, split.left, null, split.right);
          else nodes.splice(--i, 1, split.left, split.right);
          j += 1 + split.break;
          before -= split.size;
        } else if (after > before * 2) {
          let split = nodes[j];
          if (split.break) nodes.splice(j, 1, split.left, null, split.right);
          else nodes.splice(j, 1, split.left, split.right);
          j += 2 + split.break;
          after -= split.size;
        } else {
          break;
        }
      } else if (before < after) {
        let next = nodes[i++];
        if (next) before += next.size;
      } else {
        let next = nodes[--j];
        if (next) after += next.size;
      }
    }
    let brk = 0;
    if (nodes[i - 1] == null) {
      brk = 1;
      i--;
    } else if (nodes[i] == null) {
      brk = 1;
      j++;
    }
    return new HeightMapBranch(_HeightMap.of(nodes.slice(0, i)), brk, _HeightMap.of(nodes.slice(j)));
  }
};
HeightMap.prototype.size = 1;
var HeightMapBlock = class extends HeightMap {
  constructor(length, height, type) {
    super(length, height);
    this.type = type;
  }
  blockAt(_height, _doc, top, offset) {
    return new BlockInfo(offset, this.length, top, this.height, this.type);
  }
  lineAt(_value, _type, doc2, top, offset) {
    return this.blockAt(0, doc2, top, offset);
  }
  forEachLine(_from, _to, doc2, top, offset, f) {
    f(this.blockAt(0, doc2, top, offset));
  }
  updateHeight(oracle, offset = 0, _force = false, measured) {
    if (measured && measured.from <= offset && measured.more)
      this.setHeight(oracle, measured.heights[measured.index++]);
    this.outdated = false;
    return this;
  }
  toString() {
    return `block(${this.length})`;
  }
};
var HeightMapText = class _HeightMapText extends HeightMapBlock {
  constructor(length, height) {
    super(length, height, BlockType.Text);
    this.collapsed = 0;
    this.widgetHeight = 0;
  }
  replace(_from, _to, nodes) {
    let node = nodes[0];
    if (
      nodes.length == 1 &&
      (node instanceof _HeightMapText || (node instanceof HeightMapGap && node.flags & 4)) &&
      Math.abs(this.length - node.length) < 10
    ) {
      if (node instanceof HeightMapGap) node = new _HeightMapText(node.length, this.height);
      else node.height = this.height;
      if (!this.outdated) node.outdated = false;
      return node;
    } else {
      return HeightMap.of(nodes);
    }
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    if (measured && measured.from <= offset && measured.more)
      this.setHeight(oracle, measured.heights[measured.index++]);
    else if (force || this.outdated)
      this.setHeight(oracle, Math.max(this.widgetHeight, oracle.heightForLine(this.length - this.collapsed)));
    this.outdated = false;
    return this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ''}${
      this.widgetHeight ? ':' + this.widgetHeight : ''
    })`;
  }
};
var HeightMapGap = class _HeightMapGap extends HeightMap {
  constructor(length) {
    super(length, 0);
  }
  lines(doc2, offset) {
    let firstLine = doc2.lineAt(offset).number,
      lastLine = doc2.lineAt(offset + this.length).number;
    return { firstLine, lastLine, lineHeight: this.height / (lastLine - firstLine + 1) };
  }
  blockAt(height, doc2, top, offset) {
    let { firstLine, lastLine, lineHeight } = this.lines(doc2, offset);
    let line = Math.max(0, Math.min(lastLine - firstLine, Math.floor((height - top) / lineHeight)));
    let { from, length } = doc2.line(firstLine + line);
    return new BlockInfo(from, length, top + lineHeight * line, lineHeight, BlockType.Text);
  }
  lineAt(value, type, doc2, top, offset) {
    if (type == QueryType.ByHeight) return this.blockAt(value, doc2, top, offset);
    if (type == QueryType.ByPosNoHeight) {
      let { from: from2, to } = doc2.lineAt(value);
      return new BlockInfo(from2, to - from2, 0, 0, BlockType.Text);
    }
    let { firstLine, lineHeight } = this.lines(doc2, offset);
    let { from, length, number: number2 } = doc2.lineAt(value);
    return new BlockInfo(from, length, top + lineHeight * (number2 - firstLine), lineHeight, BlockType.Text);
  }
  forEachLine(from, to, doc2, top, offset, f) {
    let { firstLine, lineHeight } = this.lines(doc2, offset);
    for (let pos = Math.max(from, offset), end = Math.min(offset + this.length, to); pos <= end; ) {
      let line = doc2.lineAt(pos);
      if (pos == from) top += lineHeight * (line.number - firstLine);
      f(new BlockInfo(line.from, line.length, top, lineHeight, BlockType.Text));
      top += lineHeight;
      pos = line.to + 1;
    }
  }
  replace(from, to, nodes) {
    let after = this.length - to;
    if (after > 0) {
      let last = nodes[nodes.length - 1];
      if (last instanceof _HeightMapGap) nodes[nodes.length - 1] = new _HeightMapGap(last.length + after);
      else nodes.push(null, new _HeightMapGap(after - 1));
    }
    if (from > 0) {
      let first = nodes[0];
      if (first instanceof _HeightMapGap) nodes[0] = new _HeightMapGap(from + first.length);
      else nodes.unshift(new _HeightMapGap(from - 1), null);
    }
    return HeightMap.of(nodes);
  }
  decomposeLeft(to, result) {
    result.push(new _HeightMapGap(to - 1), null);
  }
  decomposeRight(from, result) {
    result.push(null, new _HeightMapGap(this.length - from - 1));
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    let end = offset + this.length;
    if (measured && measured.from <= offset + this.length && measured.more) {
      let nodes = [],
        pos = Math.max(offset, measured.from),
        singleHeight = -1;
      let wasChanged = oracle.heightChanged;
      if (measured.from > offset)
        nodes.push(new _HeightMapGap(measured.from - offset - 1).updateHeight(oracle, offset));
      while (pos <= end && measured.more) {
        let len = oracle.doc.lineAt(pos).length;
        if (nodes.length) nodes.push(null);
        let height = measured.heights[measured.index++];
        if (singleHeight == -1) singleHeight = height;
        else if (Math.abs(height - singleHeight) >= Epsilon) singleHeight = -2;
        let line = new HeightMapText(len, height);
        line.outdated = false;
        nodes.push(line);
        pos += len + 1;
      }
      if (pos <= end) nodes.push(null, new _HeightMapGap(end - pos).updateHeight(oracle, pos));
      let result = HeightMap.of(nodes);
      oracle.heightChanged =
        wasChanged ||
        singleHeight < 0 ||
        Math.abs(result.height - this.height) >= Epsilon ||
        Math.abs(singleHeight - this.lines(oracle.doc, offset).lineHeight) >= Epsilon;
      return result;
    } else if (force || this.outdated) {
      this.setHeight(oracle, oracle.heightForGap(offset, offset + this.length));
      this.outdated = false;
    }
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
};
var HeightMapBranch = class extends HeightMap {
  constructor(left, brk, right) {
    super(
      left.length + brk + right.length,
      left.height + right.height,
      brk | (left.outdated || right.outdated ? 2 : 0),
    );
    this.left = left;
    this.right = right;
    this.size = left.size + right.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(height, doc2, top, offset) {
    let mid = top + this.left.height;
    return height < mid
      ? this.left.blockAt(height, doc2, top, offset)
      : this.right.blockAt(height, doc2, mid, offset + this.left.length + this.break);
  }
  lineAt(value, type, doc2, top, offset) {
    let rightTop = top + this.left.height,
      rightOffset = offset + this.left.length + this.break;
    let left = type == QueryType.ByHeight ? value < rightTop : value < rightOffset;
    let base2 = left
      ? this.left.lineAt(value, type, doc2, top, offset)
      : this.right.lineAt(value, type, doc2, rightTop, rightOffset);
    if (this.break || (left ? base2.to < rightOffset : base2.from > rightOffset)) return base2;
    let subQuery = type == QueryType.ByPosNoHeight ? QueryType.ByPosNoHeight : QueryType.ByPos;
    if (left) return base2.join(this.right.lineAt(rightOffset, subQuery, doc2, rightTop, rightOffset));
    else return this.left.lineAt(rightOffset, subQuery, doc2, top, offset).join(base2);
  }
  forEachLine(from, to, doc2, top, offset, f) {
    let rightTop = top + this.left.height,
      rightOffset = offset + this.left.length + this.break;
    if (this.break) {
      if (from < rightOffset) this.left.forEachLine(from, to, doc2, top, offset, f);
      if (to >= rightOffset) this.right.forEachLine(from, to, doc2, rightTop, rightOffset, f);
    } else {
      let mid = this.lineAt(rightOffset, QueryType.ByPos, doc2, top, offset);
      if (from < mid.from) this.left.forEachLine(from, mid.from - 1, doc2, top, offset, f);
      if (mid.to >= from && mid.from <= to) f(mid);
      if (to > mid.to) this.right.forEachLine(mid.to + 1, to, doc2, rightTop, rightOffset, f);
    }
  }
  replace(from, to, nodes) {
    let rightStart = this.left.length + this.break;
    if (to < rightStart) return this.balanced(this.left.replace(from, to, nodes), this.right);
    if (from > this.left.length)
      return this.balanced(this.left, this.right.replace(from - rightStart, to - rightStart, nodes));
    let result = [];
    if (from > 0) this.decomposeLeft(from, result);
    let left = result.length;
    for (let node of nodes) result.push(node);
    if (from > 0) mergeGaps(result, left - 1);
    if (to < this.length) {
      let right = result.length;
      this.decomposeRight(to, result);
      mergeGaps(result, right);
    }
    return HeightMap.of(result);
  }
  decomposeLeft(to, result) {
    let left = this.left.length;
    if (to <= left) return this.left.decomposeLeft(to, result);
    result.push(this.left);
    if (this.break) {
      left++;
      if (to >= left) result.push(null);
    }
    if (to > left) this.right.decomposeLeft(to - left, result);
  }
  decomposeRight(from, result) {
    let left = this.left.length,
      right = left + this.break;
    if (from >= right) return this.right.decomposeRight(from - right, result);
    if (from < left) this.left.decomposeRight(from, result);
    if (this.break && from < right) result.push(null);
    result.push(this.right);
  }
  balanced(left, right) {
    if (left.size > 2 * right.size || right.size > 2 * left.size)
      return HeightMap.of(this.break ? [left, null, right] : [left, right]);
    this.left = left;
    this.right = right;
    this.height = left.height + right.height;
    this.outdated = left.outdated || right.outdated;
    this.size = left.size + right.size;
    this.length = left.length + this.break + right.length;
    return this;
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    let { left, right } = this,
      rightStart = offset + left.length + this.break,
      rebalance = null;
    if (measured && measured.from <= offset + left.length && measured.more)
      rebalance = left = left.updateHeight(oracle, offset, force, measured);
    else left.updateHeight(oracle, offset, force);
    if (measured && measured.from <= rightStart + right.length && measured.more)
      rebalance = right = right.updateHeight(oracle, rightStart, force, measured);
    else right.updateHeight(oracle, rightStart, force);
    if (rebalance) return this.balanced(left, right);
    this.height = this.left.height + this.right.height;
    this.outdated = false;
    return this;
  }
  toString() {
    return this.left + (this.break ? ' ' : '-') + this.right;
  }
};
function mergeGaps(nodes, around) {
  let before, after;
  if (
    nodes[around] == null &&
    (before = nodes[around - 1]) instanceof HeightMapGap &&
    (after = nodes[around + 1]) instanceof HeightMapGap
  )
    nodes.splice(around - 1, 3, new HeightMapGap(before.length + 1 + after.length));
}
var relevantWidgetHeight = 5;
var NodeBuilder = class _NodeBuilder {
  constructor(pos, oracle) {
    this.pos = pos;
    this.oracle = oracle;
    this.nodes = [];
    this.lineStart = -1;
    this.lineEnd = -1;
    this.covering = null;
    this.writtenTo = pos;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(_from, to) {
    if (this.lineStart > -1) {
      let end = Math.min(to, this.lineEnd),
        last = this.nodes[this.nodes.length - 1];
      if (last instanceof HeightMapText) last.length += end - this.pos;
      else if (end > this.pos || !this.isCovered) this.nodes.push(new HeightMapText(end - this.pos, -1));
      this.writtenTo = end;
      if (to > end) {
        this.nodes.push(null);
        this.writtenTo++;
        this.lineStart = -1;
      }
    }
    this.pos = to;
  }
  point(from, to, deco) {
    if (from < to || deco.heightRelevant) {
      let height = deco.widget ? deco.widget.estimatedHeight : 0;
      if (height < 0) height = this.oracle.lineHeight;
      let len = to - from;
      if (deco.block) {
        this.addBlock(new HeightMapBlock(len, height, deco.type));
      } else if (len || height >= relevantWidgetHeight) {
        this.addLineDeco(height, len);
      }
    } else if (to > from) {
      this.span(from, to);
    }
    if (this.lineEnd > -1 && this.lineEnd < this.pos) this.lineEnd = this.oracle.doc.lineAt(this.pos).to;
  }
  enterLine() {
    if (this.lineStart > -1) return;
    let { from, to } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = from;
    this.lineEnd = to;
    if (this.writtenTo < from) {
      if (this.writtenTo < from - 1 || this.nodes[this.nodes.length - 1] == null)
        this.nodes.push(this.blankContent(this.writtenTo, from - 1));
      this.nodes.push(null);
    }
    if (this.pos > from) this.nodes.push(new HeightMapText(this.pos - from, -1));
    this.writtenTo = this.pos;
  }
  blankContent(from, to) {
    let gap = new HeightMapGap(to - from);
    if (this.oracle.doc.lineAt(from).to == to) gap.flags |= 4;
    return gap;
  }
  ensureLine() {
    this.enterLine();
    let last = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (last instanceof HeightMapText) return last;
    let line = new HeightMapText(0, -1);
    this.nodes.push(line);
    return line;
  }
  addBlock(block) {
    this.enterLine();
    if (block.type == BlockType.WidgetAfter && !this.isCovered) this.ensureLine();
    this.nodes.push(block);
    this.writtenTo = this.pos = this.pos + block.length;
    if (block.type != BlockType.WidgetBefore) this.covering = block;
  }
  addLineDeco(height, length) {
    let line = this.ensureLine();
    line.length += length;
    line.collapsed += length;
    line.widgetHeight = Math.max(line.widgetHeight, height);
    this.writtenTo = this.pos = this.pos + length;
  }
  finish(from) {
    let last = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    if (this.lineStart > -1 && !(last instanceof HeightMapText) && !this.isCovered)
      this.nodes.push(new HeightMapText(0, -1));
    else if (this.writtenTo < this.pos || last == null) this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let pos = from;
    for (let node of this.nodes) {
      if (node instanceof HeightMapText) node.updateHeight(this.oracle, pos);
      pos += node ? node.length : 1;
    }
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(oracle, decorations2, from, to) {
    let builder = new _NodeBuilder(from, oracle);
    RangeSet.spans(decorations2, from, to, builder, 0);
    return builder.finish(from);
  }
};
function heightRelevantDecoChanges(a, b, diff) {
  let comp = new DecorationComparator();
  RangeSet.compare(a, b, diff, comp, 0);
  return comp.changes;
}
var DecorationComparator = class {
  constructor() {
    this.changes = [];
  }
  compareRange() {}
  comparePoint(from, to, a, b) {
    if (from < to || (a && a.heightRelevant) || (b && b.heightRelevant)) addRange(from, to, this.changes, 5);
  }
};
function visiblePixelRange(dom, paddingTop) {
  let rect = dom.getBoundingClientRect();
  let left = Math.max(0, rect.left),
    right = Math.min(innerWidth, rect.right);
  let top = Math.max(0, rect.top),
    bottom = Math.min(innerHeight, rect.bottom);
  let body = dom.ownerDocument.body;
  for (let parent = dom.parentNode; parent && parent != body; ) {
    if (parent.nodeType == 1) {
      let elt = parent;
      let style = window.getComputedStyle(elt);
      if ((elt.scrollHeight > elt.clientHeight || elt.scrollWidth > elt.clientWidth) && style.overflow != 'visible') {
        let parentRect = elt.getBoundingClientRect();
        left = Math.max(left, parentRect.left);
        right = Math.min(right, parentRect.right);
        top = Math.max(top, parentRect.top);
        bottom = Math.min(bottom, parentRect.bottom);
      }
      parent = style.position == 'absolute' || style.position == 'fixed' ? elt.offsetParent : elt.parentNode;
    } else if (parent.nodeType == 11) {
      parent = parent.host;
    } else {
      break;
    }
  }
  return {
    left: left - rect.left,
    right: Math.max(left, right) - rect.left,
    top: top - (rect.top + paddingTop),
    bottom: Math.max(top, bottom) - (rect.top + paddingTop),
  };
}
function fullPixelRange(dom, paddingTop) {
  let rect = dom.getBoundingClientRect();
  return {
    left: 0,
    right: rect.right - rect.left,
    top: paddingTop,
    bottom: rect.bottom - (rect.top + paddingTop),
  };
}
var LineGap = class {
  constructor(from, to, size) {
    this.from = from;
    this.to = to;
    this.size = size;
  }
  static same(a, b) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
      let gA = a[i],
        gB = b[i];
      if (gA.from != gB.from || gA.to != gB.to || gA.size != gB.size) return false;
    }
    return true;
  }
  draw(wrapping) {
    return Decoration.replace({ widget: new LineGapWidget(this.size, wrapping) }).range(this.from, this.to);
  }
};
var LineGapWidget = class extends WidgetType {
  constructor(size, vertical) {
    super();
    this.size = size;
    this.vertical = vertical;
  }
  eq(other) {
    return other.size == this.size && other.vertical == this.vertical;
  }
  toDOM() {
    let elt = document.createElement('div');
    if (this.vertical) {
      elt.style.height = this.size + 'px';
    } else {
      elt.style.width = this.size + 'px';
      elt.style.height = '2px';
      elt.style.display = 'inline-block';
    }
    return elt;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
};
var ViewState = class {
  constructor(state) {
    this.state = state;
    this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 };
    this.inView = true;
    this.paddingTop = 0;
    this.paddingBottom = 0;
    this.contentDOMWidth = 0;
    this.contentDOMHeight = 0;
    this.editorHeight = 0;
    this.editorWidth = 0;
    this.heightOracle = new HeightOracle();
    this.scaler = IdScaler;
    this.scrollTarget = null;
    this.printing = false;
    this.mustMeasureContent = true;
    this.visibleRanges = [];
    this.mustEnforceCursorAssoc = false;
    this.heightMap = HeightMap.empty().applyChanges(
      state.facet(decorations),
      Text.empty,
      this.heightOracle.setDoc(state.doc),
      [new ChangedRange(0, 0, 0, state.doc.length)],
    );
    this.viewport = this.getViewport(0, null);
    this.updateViewportLines();
    this.updateForViewport();
    this.lineGaps = this.ensureLineGaps([]);
    this.lineGapDeco = Decoration.set(this.lineGaps.map((gap) => gap.draw(false)));
    this.computeVisibleRanges();
  }
  updateForViewport() {
    let viewports = [this.viewport],
      { main } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let pos = i ? main.head : main.anchor;
      if (!viewports.some(({ from, to }) => pos >= from && pos <= to)) {
        let { from, to } = this.lineBlockAt(pos);
        viewports.push(new Viewport(from, to));
      }
    }
    this.viewports = viewports.sort((a, b) => a.from - b.from);
    this.scaler =
      this.heightMap.height <= 7e6 ? IdScaler : new BigScaler(this.heightOracle.doc, this.heightMap, this.viewports);
  }
  updateViewportLines() {
    this.viewportLines = [];
    this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, (block) => {
      this.viewportLines.push(this.scaler.scale == 1 ? block : scaleBlock(block, this.scaler));
    });
  }
  update(update, scrollTarget = null) {
    let prev = this.state;
    this.state = update.state;
    let newDeco = this.state.facet(decorations);
    let contentChanges = update.changedRanges;
    let heightChanges = ChangedRange.extendWithRanges(
      contentChanges,
      heightRelevantDecoChanges(
        update.startState.facet(decorations),
        newDeco,
        update ? update.changes : ChangeSet.empty(this.state.doc.length),
      ),
    );
    let prevHeight = this.heightMap.height;
    this.heightMap = this.heightMap.applyChanges(
      newDeco,
      prev.doc,
      this.heightOracle.setDoc(this.state.doc),
      heightChanges,
    );
    if (this.heightMap.height != prevHeight) update.flags |= 2;
    let viewport = heightChanges.length ? this.mapViewport(this.viewport, update.changes) : this.viewport;
    if (
      (scrollTarget && (scrollTarget.range.head < viewport.from || scrollTarget.range.head > viewport.to)) ||
      !this.viewportIsAppropriate(viewport)
    )
      viewport = this.getViewport(0, scrollTarget);
    let updateLines =
      !update.changes.empty ||
      update.flags & 2 ||
      viewport.from != this.viewport.from ||
      viewport.to != this.viewport.to;
    this.viewport = viewport;
    this.updateForViewport();
    if (updateLines) this.updateViewportLines();
    if (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3)
      this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, update.changes)));
    update.flags |= this.computeVisibleRanges();
    if (scrollTarget) this.scrollTarget = scrollTarget;
    if (
      !this.mustEnforceCursorAssoc &&
      update.selectionSet &&
      update.view.lineWrapping &&
      update.state.selection.main.empty &&
      update.state.selection.main.assoc
    )
      this.mustEnforceCursorAssoc = true;
  }
  measure(view) {
    let dom = view.contentDOM,
      style = window.getComputedStyle(dom);
    let oracle = this.heightOracle;
    let whiteSpace = style.whiteSpace,
      direction = style.direction == 'rtl' ? Direction.RTL : Direction.LTR;
    let refresh = this.heightOracle.mustRefreshForStyle(whiteSpace, direction);
    let measureContent = refresh || this.mustMeasureContent || this.contentDOMHeight != dom.clientHeight;
    let result = 0,
      bias = 0;
    if (this.editorWidth != view.scrollDOM.clientWidth) {
      if (oracle.lineWrapping) measureContent = true;
      this.editorWidth = view.scrollDOM.clientWidth;
      result |= 8;
    }
    if (measureContent) {
      this.mustMeasureContent = false;
      this.contentDOMHeight = dom.clientHeight;
      let paddingTop = parseInt(style.paddingTop) || 0,
        paddingBottom = parseInt(style.paddingBottom) || 0;
      if (this.paddingTop != paddingTop || this.paddingBottom != paddingBottom) {
        result |= 8;
        this.paddingTop = paddingTop;
        this.paddingBottom = paddingBottom;
      }
    }
    let pixelViewport = (this.printing ? fullPixelRange : visiblePixelRange)(dom, this.paddingTop);
    let dTop = pixelViewport.top - this.pixelViewport.top,
      dBottom = pixelViewport.bottom - this.pixelViewport.bottom;
    this.pixelViewport = pixelViewport;
    let inView =
      this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (inView != this.inView) {
      this.inView = inView;
      if (inView) measureContent = true;
    }
    if (!this.inView) return 0;
    let contentWidth = dom.clientWidth;
    if (this.contentDOMWidth != contentWidth || this.editorHeight != view.scrollDOM.clientHeight) {
      this.contentDOMWidth = contentWidth;
      this.editorHeight = view.scrollDOM.clientHeight;
      result |= 8;
    }
    if (measureContent) {
      let lineHeights = view.docView.measureVisibleLineHeights();
      if (oracle.mustRefreshForHeights(lineHeights)) refresh = true;
      if (refresh || (oracle.lineWrapping && Math.abs(contentWidth - this.contentDOMWidth) > oracle.charWidth)) {
        let { lineHeight, charWidth } = view.docView.measureTextSize();
        refresh = oracle.refresh(whiteSpace, direction, lineHeight, charWidth, contentWidth / charWidth, lineHeights);
        if (refresh) {
          view.docView.minWidth = 0;
          result |= 8;
        }
      }
      if (dTop > 0 && dBottom > 0) bias = Math.max(dTop, dBottom);
      else if (dTop < 0 && dBottom < 0) bias = Math.min(dTop, dBottom);
      oracle.heightChanged = false;
      this.heightMap = this.heightMap.updateHeight(
        oracle,
        0,
        refresh,
        new MeasuredHeights(this.viewport.from, lineHeights),
      );
      if (oracle.heightChanged) result |= 2;
    }
    let viewportChange =
      !this.viewportIsAppropriate(this.viewport, bias) ||
      (this.scrollTarget &&
        (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to));
    if (viewportChange) this.viewport = this.getViewport(bias, this.scrollTarget);
    this.updateForViewport();
    if (result & 2 || viewportChange) this.updateViewportLines();
    if (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3)
      this.updateLineGaps(this.ensureLineGaps(refresh ? [] : this.lineGaps));
    result |= this.computeVisibleRanges();
    if (this.mustEnforceCursorAssoc) {
      this.mustEnforceCursorAssoc = false;
      view.docView.enforceCursorAssoc();
    }
    return result;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(bias, scrollTarget) {
    let marginTop = 0.5 - Math.max(-0.5, Math.min(0.5, bias / 1e3 / 2));
    let map = this.heightMap,
      doc2 = this.state.doc,
      { visibleTop, visibleBottom } = this;
    let viewport = new Viewport(
      map.lineAt(visibleTop - marginTop * 1e3, QueryType.ByHeight, doc2, 0, 0).from,
      map.lineAt(visibleBottom + (1 - marginTop) * 1e3, QueryType.ByHeight, doc2, 0, 0).to,
    );
    if (scrollTarget) {
      let { head } = scrollTarget.range;
      if (head < viewport.from || head > viewport.to) {
        let viewHeight = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top);
        let block = map.lineAt(head, QueryType.ByPos, doc2, 0, 0),
          topPos;
        if (scrollTarget.y == 'center') topPos = (block.top + block.bottom) / 2 - viewHeight / 2;
        else if (scrollTarget.y == 'start' || (scrollTarget.y == 'nearest' && head < viewport.from)) topPos = block.top;
        else topPos = block.bottom - viewHeight;
        viewport = new Viewport(
          map.lineAt(topPos - 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).from,
          map.lineAt(topPos + viewHeight + 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).to,
        );
      }
    }
    return viewport;
  }
  mapViewport(viewport, changes) {
    let from = changes.mapPos(viewport.from, -1),
      to = changes.mapPos(viewport.to, 1);
    return new Viewport(
      this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0).from,
      this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0).to,
    );
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from, to }, bias = 0) {
    if (!this.inView) return true;
    let { top } = this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0);
    let { bottom } = this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0);
    let { visibleTop, visibleBottom } = this;
    return (
      (from == 0 ||
        top <=
          visibleTop -
            Math.max(
              10,
              Math.min(
                -bias,
                250,
                /* MaxCoverMargin */
              ),
            )) &&
      (to == this.state.doc.length ||
        bottom >=
          visibleBottom +
            Math.max(
              10,
              Math.min(
                bias,
                250,
                /* MaxCoverMargin */
              ),
            )) &&
      top > visibleTop - 2 * 1e3 &&
      bottom < visibleBottom + 2 * 1e3
    );
  }
  mapLineGaps(gaps, changes) {
    if (!gaps.length || changes.empty) return gaps;
    let mapped = [];
    for (let gap of gaps)
      if (!changes.touchesRange(gap.from, gap.to))
        mapped.push(new LineGap(changes.mapPos(gap.from), changes.mapPos(gap.to), gap.size));
    return mapped;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(current) {
    let gaps = [];
    if (this.heightOracle.direction != Direction.LTR) return gaps;
    for (let line of this.viewportLines) {
      if (line.length < 4e3) continue;
      let structure = lineStructure(line.from, line.to, this.state);
      if (structure.total < 4e3) continue;
      let viewFrom, viewTo;
      if (this.heightOracle.lineWrapping) {
        let marginHeight = (2e3 / this.heightOracle.lineLength) * this.heightOracle.lineHeight;
        viewFrom = findPosition(structure, (this.visibleTop - line.top - marginHeight) / line.height);
        viewTo = findPosition(structure, (this.visibleBottom - line.top + marginHeight) / line.height);
      } else {
        let totalWidth = structure.total * this.heightOracle.charWidth;
        let marginWidth = 2e3 * this.heightOracle.charWidth;
        viewFrom = findPosition(structure, (this.pixelViewport.left - marginWidth) / totalWidth);
        viewTo = findPosition(structure, (this.pixelViewport.right + marginWidth) / totalWidth);
      }
      let outside = [];
      if (viewFrom > line.from) outside.push({ from: line.from, to: viewFrom });
      if (viewTo < line.to) outside.push({ from: viewTo, to: line.to });
      let sel = this.state.selection.main;
      if (sel.from >= line.from && sel.from <= line.to)
        cutRange(
          outside,
          sel.from - 10,
          sel.from + 10,
          /* SelectionMargin */
        );
      if (!sel.empty && sel.to >= line.from && sel.to <= line.to)
        cutRange(
          outside,
          sel.to - 10,
          sel.to + 10,
          /* SelectionMargin */
        );
      for (let { from, to } of outside)
        if (to - from > 1e3) {
          gaps.push(
            find(
              current,
              (gap) =>
                gap.from >= line.from &&
                gap.to <= line.to &&
                Math.abs(gap.from - from) < 1e3 &&
                Math.abs(gap.to - to) < 1e3,
              /* HalfMargin */
            ) || new LineGap(from, to, this.gapSize(line, from, to, structure)),
          );
        }
    }
    return gaps;
  }
  gapSize(line, from, to, structure) {
    let fraction = findFraction(structure, to) - findFraction(structure, from);
    if (this.heightOracle.lineWrapping) {
      return line.height * fraction;
    } else {
      return structure.total * this.heightOracle.charWidth * fraction;
    }
  }
  updateLineGaps(gaps) {
    if (!LineGap.same(gaps, this.lineGaps)) {
      this.lineGaps = gaps;
      this.lineGapDeco = Decoration.set(gaps.map((gap) => gap.draw(this.heightOracle.lineWrapping)));
    }
  }
  computeVisibleRanges() {
    let deco = this.state.facet(decorations);
    if (this.lineGaps.length) deco = deco.concat(this.lineGapDeco);
    let ranges = [];
    RangeSet.spans(
      deco,
      this.viewport.from,
      this.viewport.to,
      {
        span(from, to) {
          ranges.push({ from, to });
        },
        point() {},
      },
      20,
    );
    let changed =
      ranges.length != this.visibleRanges.length ||
      this.visibleRanges.some((r, i) => r.from != ranges[i].from || r.to != ranges[i].to);
    this.visibleRanges = ranges;
    return changed ? 4 : 0;
  }
  lineBlockAt(pos) {
    return (
      (pos >= this.viewport.from &&
        pos <= this.viewport.to &&
        this.viewportLines.find((b) => b.from <= pos && b.to >= pos)) ||
      scaleBlock(this.heightMap.lineAt(pos, QueryType.ByPos, this.state.doc, 0, 0), this.scaler)
    );
  }
  lineBlockAtHeight(height) {
    return scaleBlock(
      this.heightMap.lineAt(this.scaler.fromDOM(height), QueryType.ByHeight, this.state.doc, 0, 0),
      this.scaler,
    );
  }
  elementAtHeight(height) {
    return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(height), this.state.doc, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
};
var Viewport = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
};
function lineStructure(from, to, state) {
  let ranges = [],
    pos = from,
    total = 0;
  RangeSet.spans(
    state.facet(decorations),
    from,
    to,
    {
      span() {},
      point(from2, to2) {
        if (from2 > pos) {
          ranges.push({ from: pos, to: from2 });
          total += from2 - pos;
        }
        pos = to2;
      },
    },
    20,
  );
  if (pos < to) {
    ranges.push({ from: pos, to });
    total += to - pos;
  }
  return { total, ranges };
}
function findPosition({ total, ranges }, ratio) {
  if (ratio <= 0) return ranges[0].from;
  if (ratio >= 1) return ranges[ranges.length - 1].to;
  let dist = Math.floor(total * ratio);
  for (let i = 0; ; i++) {
    let { from, to } = ranges[i],
      size = to - from;
    if (dist <= size) return from + dist;
    dist -= size;
  }
}
function findFraction(structure, pos) {
  let counted = 0;
  for (let { from, to } of structure.ranges) {
    if (pos <= to) {
      counted += pos - from;
      break;
    }
    counted += to - from;
  }
  return counted / structure.total;
}
function cutRange(ranges, from, to) {
  for (let i = 0; i < ranges.length; i++) {
    let r = ranges[i];
    if (r.from < to && r.to > from) {
      let pieces = [];
      if (r.from < from) pieces.push({ from: r.from, to: from });
      if (r.to > to) pieces.push({ from: to, to: r.to });
      ranges.splice(i, 1, ...pieces);
      i += pieces.length - 1;
    }
  }
}
function find(array, f) {
  for (let val of array) if (f(val)) return val;
  return void 0;
}
var IdScaler = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
};
var BigScaler = class {
  constructor(doc2, heightMap, viewports) {
    let vpHeight = 0,
      base2 = 0,
      domBase = 0;
    this.viewports = viewports.map(({ from, to }) => {
      let top = heightMap.lineAt(from, QueryType.ByPos, doc2, 0, 0).top;
      let bottom = heightMap.lineAt(to, QueryType.ByPos, doc2, 0, 0).bottom;
      vpHeight += bottom - top;
      return { from, to, top, bottom, domTop: 0, domBottom: 0 };
    });
    this.scale = (7e6 - vpHeight) / (heightMap.height - vpHeight);
    for (let obj of this.viewports) {
      obj.domTop = domBase + (obj.top - base2) * this.scale;
      domBase = obj.domBottom = obj.domTop + (obj.bottom - obj.top);
      base2 = obj.bottom;
    }
  }
  toDOM(n) {
    for (let i = 0, base2 = 0, domBase = 0; ; i++) {
      let vp = i < this.viewports.length ? this.viewports[i] : null;
      if (!vp || n < vp.top) return domBase + (n - base2) * this.scale;
      if (n <= vp.bottom) return vp.domTop + (n - vp.top);
      base2 = vp.bottom;
      domBase = vp.domBottom;
    }
  }
  fromDOM(n) {
    for (let i = 0, base2 = 0, domBase = 0; ; i++) {
      let vp = i < this.viewports.length ? this.viewports[i] : null;
      if (!vp || n < vp.domTop) return base2 + (n - domBase) / this.scale;
      if (n <= vp.domBottom) return vp.top + (n - vp.domTop);
      base2 = vp.bottom;
      domBase = vp.domBottom;
    }
  }
};
function scaleBlock(block, scaler) {
  if (scaler.scale == 1) return block;
  let bTop = scaler.toDOM(block.top),
    bBottom = scaler.toDOM(block.bottom);
  return new BlockInfo(
    block.from,
    block.length,
    bTop,
    bBottom - bTop,
    Array.isArray(block.type) ? block.type.map((b) => scaleBlock(b, scaler)) : block.type,
  );
}
var theme = Facet.define({ combine: (strs) => strs.join(' ') });
var darkTheme = Facet.define({ combine: (values) => values.indexOf(true) > -1 });
var baseThemeID = StyleModule.newName();
var baseLightID = StyleModule.newName();
var baseDarkID = StyleModule.newName();
var lightDarkIDs = { '&light': '.' + baseLightID, '&dark': '.' + baseDarkID };
function buildTheme(main, spec, scopes) {
  return new StyleModule(spec, {
    finish(sel) {
      return /&/.test(sel)
        ? sel.replace(/&\w*/, (m) => {
            if (m == '&') return main;
            if (!scopes || !scopes[m]) throw new RangeError(`Unsupported selector: ${m}`);
            return scopes[m];
          })
        : main + ' ' + sel;
    },
  });
}
var baseTheme = buildTheme(
  '.' + baseThemeID,
  {
    '&.cm-editor': {
      position: 'relative !important',
      boxSizing: 'border-box',
      '&.cm-focused': {
        // Provide a simple default outline to make sure a focused
        // editor is visually distinct. Can't leave the default behavior
        // because that will apply to the content element, which is
        // inside the scrollable container and doesn't include the
        // gutters. We also can't use an 'auto' outline, since those
        // are, for some reason, drawn behind the element content, which
        // will cause things like the active line background to cover
        // the outline (#297).
        outline: '1px dotted #212121',
      },
      display: 'flex !important',
      flexDirection: 'column',
    },
    '.cm-scroller': {
      display: 'flex !important',
      alignItems: 'flex-start !important',
      fontFamily: 'monospace',
      lineHeight: 1.4,
      height: '100%',
      overflowX: 'auto',
      position: 'relative',
      zIndex: 0,
    },
    '.cm-content': {
      margin: 0,
      flexGrow: 2,
      minHeight: '100%',
      display: 'block',
      whiteSpace: 'pre',
      wordWrap: 'normal',
      boxSizing: 'border-box',
      padding: '4px 0',
      outline: 'none',
      '&[contenteditable=true]': {
        WebkitUserModify: 'read-write-plaintext-only',
      },
    },
    '.cm-lineWrapping': {
      whiteSpace_fallback: 'pre-wrap',
      whiteSpace: 'break-spaces',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
    },
    '&light .cm-content': { caretColor: 'black' },
    '&dark .cm-content': { caretColor: 'white' },
    '.cm-line': {
      display: 'block',
      padding: '0 2px 0 4px',
    },
    '.cm-selectionLayer': {
      zIndex: -1,
      contain: 'size style',
    },
    '.cm-selectionBackground': {
      position: 'absolute',
    },
    '&light .cm-selectionBackground': {
      background: '#d9d9d9',
    },
    '&dark .cm-selectionBackground': {
      background: '#222',
    },
    '&light.cm-focused .cm-selectionBackground': {
      background: '#d7d4f0',
    },
    '&dark.cm-focused .cm-selectionBackground': {
      background: '#233',
    },
    '.cm-cursorLayer': {
      zIndex: 100,
      contain: 'size style',
      pointerEvents: 'none',
    },
    '&.cm-focused .cm-cursorLayer': {
      animation: 'steps(1) cm-blink 1.2s infinite',
    },
    // Two animations defined so that we can switch between them to
    // restart the animation without forcing another style
    // recomputation.
    '@keyframes cm-blink': { '0%': {}, '50%': { visibility: 'hidden' }, '100%': {} },
    '@keyframes cm-blink2': { '0%': {}, '50%': { visibility: 'hidden' }, '100%': {} },
    '.cm-cursor, .cm-dropCursor': {
      position: 'absolute',
      borderLeft: '1.2px solid black',
      marginLeft: '-0.6px',
      pointerEvents: 'none',
    },
    '.cm-cursor': {
      display: 'none',
    },
    '&dark .cm-cursor': {
      borderLeftColor: '#444',
    },
    '&.cm-focused .cm-cursor': {
      display: 'block',
    },
    '&light .cm-activeLine': { backgroundColor: '#f3f9ff' },
    '&dark .cm-activeLine': { backgroundColor: '#223039' },
    '&light .cm-specialChar': { color: 'red' },
    '&dark .cm-specialChar': { color: '#f78' },
    '.cm-tab': {
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
    },
    '.cm-widgetBuffer': {
      verticalAlign: 'text-top',
      height: '1em',
      display: 'inline',
    },
    '.cm-placeholder': {
      color: '#888',
      display: 'inline-block',
      verticalAlign: 'top',
    },
    '.cm-button': {
      verticalAlign: 'middle',
      color: 'inherit',
      fontSize: '70%',
      padding: '.2em 1em',
      borderRadius: '1px',
    },
    '&light .cm-button': {
      backgroundImage: 'linear-gradient(#eff1f5, #d9d9df)',
      border: '1px solid #888',
      '&:active': {
        backgroundImage: 'linear-gradient(#b4b4b4, #d0d3d6)',
      },
    },
    '&dark .cm-button': {
      backgroundImage: 'linear-gradient(#393939, #111)',
      border: '1px solid #888',
      '&:active': {
        backgroundImage: 'linear-gradient(#111, #333)',
      },
    },
    '.cm-textfield': {
      verticalAlign: 'middle',
      color: 'inherit',
      fontSize: '70%',
      border: '1px solid silver',
      padding: '.2em .5em',
    },
    '&light .cm-textfield': {
      backgroundColor: 'white',
    },
    '&dark .cm-textfield': {
      border: '1px solid #555',
      backgroundColor: 'inherit',
    },
  },
  lightDarkIDs,
);
var observeOptions = {
  childList: true,
  characterData: true,
  subtree: true,
  attributes: true,
  characterDataOldValue: true,
};
var useCharData = browser.ie && browser.ie_version <= 11;
var DOMObserver = class {
  constructor(view, onChange, onScrollChanged) {
    this.view = view;
    this.onChange = onChange;
    this.onScrollChanged = onScrollChanged;
    this.active = false;
    this.selectionRange = new DOMSelectionState();
    this.selectionChanged = false;
    this.delayedFlush = -1;
    this.resizeTimeout = -1;
    this.queue = [];
    this.delayedAndroidKey = null;
    this.scrollTargets = [];
    this.intersection = null;
    this.resize = null;
    this.intersecting = false;
    this.gapIntersection = null;
    this.gaps = [];
    this.parentCheck = -1;
    this.dom = view.contentDOM;
    this.observer = new MutationObserver((mutations) => {
      for (let mut of mutations) this.queue.push(mut);
      if (
        ((browser.ie && browser.ie_version <= 11) || (browser.ios && view.composing)) &&
        mutations.some(
          (m) =>
            (m.type == 'childList' && m.removedNodes.length) ||
            (m.type == 'characterData' && m.oldValue.length > m.target.nodeValue.length),
        )
      )
        this.flushSoon();
      else this.flush();
    });
    if (useCharData)
      this.onCharData = (event) => {
        this.queue.push({
          target: event.target,
          type: 'characterData',
          oldValue: event.prevValue,
        });
        this.flushSoon();
      };
    this.onSelectionChange = this.onSelectionChange.bind(this);
    window.addEventListener('resize', (this.onResize = this.onResize.bind(this)));
    if (typeof ResizeObserver == 'function') {
      this.resize = new ResizeObserver(() => {
        if (this.view.docView.lastUpdate < Date.now() - 75) this.onResize();
      });
      this.resize.observe(view.scrollDOM);
    }
    window.addEventListener('beforeprint', (this.onPrint = this.onPrint.bind(this)));
    this.start();
    window.addEventListener('scroll', (this.onScroll = this.onScroll.bind(this)));
    if (typeof IntersectionObserver == 'function') {
      this.intersection = new IntersectionObserver((entries) => {
        if (this.parentCheck < 0) this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3);
        if (entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0 != this.intersecting) {
          this.intersecting = !this.intersecting;
          if (this.intersecting != this.view.inView) this.onScrollChanged(document.createEvent('Event'));
        }
      }, {});
      this.intersection.observe(this.dom);
      this.gapIntersection = new IntersectionObserver((entries) => {
        if (entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0)
          this.onScrollChanged(document.createEvent('Event'));
      }, {});
    }
    this.listenForScroll();
    this.readSelectionRange();
    this.dom.ownerDocument.addEventListener('selectionchange', this.onSelectionChange);
  }
  onScroll(e) {
    if (this.intersecting) this.flush(false);
    this.onScrollChanged(e);
  }
  onResize() {
    if (this.resizeTimeout < 0)
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = -1;
        this.view.requestMeasure();
      }, 50);
  }
  onPrint() {
    this.view.viewState.printing = true;
    this.view.measure();
    setTimeout(() => {
      this.view.viewState.printing = false;
      this.view.requestMeasure();
    }, 500);
  }
  updateGaps(gaps) {
    if (this.gapIntersection && (gaps.length != this.gaps.length || this.gaps.some((g, i) => g != gaps[i]))) {
      this.gapIntersection.disconnect();
      for (let gap of gaps) this.gapIntersection.observe(gap);
      this.gaps = gaps;
    }
  }
  onSelectionChange(event) {
    if (!this.readSelectionRange() || this.delayedAndroidKey) return;
    let { view } = this,
      sel = this.selectionRange;
    if (view.state.facet(editable) ? view.root.activeElement != this.dom : !hasSelection(view.dom, sel)) return;
    let context = sel.anchorNode && view.docView.nearest(sel.anchorNode);
    if (context && context.ignoreEvent(event)) return;
    if (
      ((browser.ie && browser.ie_version <= 11) || (browser.android && browser.chrome)) &&
      !view.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
      sel.focusNode &&
      isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)
    )
      this.flushSoon();
    else this.flush(false);
  }
  readSelectionRange() {
    let { root } = this.view,
      domSel = getSelection(root);
    let range =
      (browser.safari &&
        root.nodeType == 11 &&
        deepActiveElement() == this.view.contentDOM &&
        safariSelectionRangeHack(this.view)) ||
      domSel;
    if (this.selectionRange.eq(range)) return false;
    this.selectionRange.setRange(range);
    return (this.selectionChanged = true);
  }
  setSelectionRange(anchor, head) {
    this.selectionRange.set(anchor.node, anchor.offset, head.node, head.offset);
    this.selectionChanged = false;
  }
  listenForScroll() {
    this.parentCheck = -1;
    let i = 0,
      changed = null;
    for (let dom = this.dom; dom; ) {
      if (dom.nodeType == 1) {
        if (!changed && i < this.scrollTargets.length && this.scrollTargets[i] == dom) i++;
        else if (!changed) changed = this.scrollTargets.slice(0, i);
        if (changed) changed.push(dom);
        dom = dom.assignedSlot || dom.parentNode;
      } else if (dom.nodeType == 11) {
        dom = dom.host;
      } else {
        break;
      }
    }
    if (i < this.scrollTargets.length && !changed) changed = this.scrollTargets.slice(0, i);
    if (changed) {
      for (let dom of this.scrollTargets) dom.removeEventListener('scroll', this.onScroll);
      for (let dom of (this.scrollTargets = changed)) dom.addEventListener('scroll', this.onScroll);
    }
  }
  ignore(f) {
    if (!this.active) return f();
    try {
      this.stop();
      return f();
    } finally {
      this.start();
      this.clear();
    }
  }
  start() {
    if (this.active) return;
    this.observer.observe(this.dom, observeOptions);
    if (useCharData) this.dom.addEventListener('DOMCharacterDataModified', this.onCharData);
    this.active = true;
  }
  stop() {
    if (!this.active) return;
    this.active = false;
    this.observer.disconnect();
    if (useCharData) this.dom.removeEventListener('DOMCharacterDataModified', this.onCharData);
  }
  // Throw away any pending changes
  clear() {
    this.processRecords();
    this.queue.length = 0;
    this.selectionChanged = false;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then dispatches the
  // key event, throwing away the DOM changes if it gets handled.
  delayAndroidKey(key, keyCode) {
    if (!this.delayedAndroidKey)
      requestAnimationFrame(() => {
        let key2 = this.delayedAndroidKey;
        this.delayedAndroidKey = null;
        let startState = this.view.state;
        if (dispatchKey(this.view.contentDOM, key2.key, key2.keyCode)) this.processRecords();
        else this.flush();
        if (this.view.state == startState) this.view.update([]);
      });
    if (!this.delayedAndroidKey || key == 'Enter') this.delayedAndroidKey = { key, keyCode };
  }
  flushSoon() {
    if (this.delayedFlush < 0)
      this.delayedFlush = window.setTimeout(() => {
        this.delayedFlush = -1;
        this.flush();
      }, 20);
  }
  forceFlush() {
    if (this.delayedFlush >= 0) {
      window.clearTimeout(this.delayedFlush);
      this.delayedFlush = -1;
      this.flush();
    }
  }
  processRecords() {
    let records = this.queue;
    for (let mut of this.observer.takeRecords()) records.push(mut);
    if (records.length) this.queue = [];
    let from = -1,
      to = -1,
      typeOver = false;
    for (let record of records) {
      let range = this.readMutation(record);
      if (!range) continue;
      if (range.typeOver) typeOver = true;
      if (from == -1) {
        ({ from, to } = range);
      } else {
        from = Math.min(range.from, from);
        to = Math.max(range.to, to);
      }
    }
    return { from, to, typeOver };
  }
  // Apply pending changes, if any
  flush(readSelection = true) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey) return;
    if (readSelection) this.readSelectionRange();
    let { from, to, typeOver } = this.processRecords();
    let newSel = this.selectionChanged && hasSelection(this.dom, this.selectionRange);
    if (from < 0 && !newSel) return;
    this.selectionChanged = false;
    let startState = this.view.state;
    this.onChange(from, to, typeOver);
    if (this.view.state == startState) this.view.update([]);
  }
  readMutation(rec) {
    let cView = this.view.docView.nearest(rec.target);
    if (!cView || cView.ignoreMutation(rec)) return null;
    cView.markDirty(rec.type == 'attributes');
    if (rec.type == 'attributes') cView.dirty |= 4;
    if (rec.type == 'childList') {
      let childBefore = findChild(cView, rec.previousSibling || rec.target.previousSibling, -1);
      let childAfter = findChild(cView, rec.nextSibling || rec.target.nextSibling, 1);
      return {
        from: childBefore ? cView.posAfter(childBefore) : cView.posAtStart,
        to: childAfter ? cView.posBefore(childAfter) : cView.posAtEnd,
        typeOver: false,
      };
    } else if (rec.type == 'characterData') {
      return { from: cView.posAtStart, to: cView.posAtEnd, typeOver: rec.target.nodeValue == rec.oldValue };
    } else {
      return null;
    }
  }
  destroy() {
    var _a2, _b, _c;
    this.stop();
    (_a2 = this.intersection) === null || _a2 === void 0 ? void 0 : _a2.disconnect();
    (_b = this.gapIntersection) === null || _b === void 0 ? void 0 : _b.disconnect();
    (_c = this.resize) === null || _c === void 0 ? void 0 : _c.disconnect();
    for (let dom of this.scrollTargets) dom.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('beforeprint', this.onPrint);
    this.dom.ownerDocument.removeEventListener('selectionchange', this.onSelectionChange);
    clearTimeout(this.parentCheck);
    clearTimeout(this.resizeTimeout);
  }
};
function findChild(cView, dom, dir) {
  while (dom) {
    let curView = ContentView.get(dom);
    if (curView && curView.parent == cView) return curView;
    let parent = dom.parentNode;
    dom = parent != cView.dom ? parent : dir > 0 ? dom.nextSibling : dom.previousSibling;
  }
  return null;
}
function safariSelectionRangeHack(view) {
  let found = null;
  function read(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    found = event.getTargetRanges()[0];
  }
  view.contentDOM.addEventListener('beforeinput', read, true);
  document.execCommand('indent');
  view.contentDOM.removeEventListener('beforeinput', read, true);
  if (!found) return null;
  let anchorNode = found.startContainer,
    anchorOffset = found.startOffset;
  let focusNode = found.endContainer,
    focusOffset = found.endOffset;
  let curAnchor = view.docView.domAtPos(view.state.selection.main.anchor);
  if (isEquivalentPosition(curAnchor.node, curAnchor.offset, focusNode, focusOffset))
    [anchorNode, anchorOffset, focusNode, focusOffset] = [focusNode, focusOffset, anchorNode, anchorOffset];
  return { anchorNode, anchorOffset, focusNode, focusOffset };
}
function applyDOMChange(view, start, end, typeOver) {
  let change, newSel;
  let sel = view.state.selection.main;
  if (start > -1) {
    let bounds = view.docView.domBoundsAround(start, end, 0);
    if (!bounds || view.state.readOnly) return;
    let { from, to } = bounds;
    let selPoints = view.docView.impreciseHead || view.docView.impreciseAnchor ? [] : selectionPoints(view);
    let reader = new DOMReader(selPoints, view.state);
    reader.readRange(bounds.startDOM, bounds.endDOM);
    let preferredPos = sel.from,
      preferredSide = null;
    if (
      (view.inputState.lastKeyCode === 8 && view.inputState.lastKeyTime > Date.now() - 100) ||
      (browser.android && reader.text.length < to - from)
    ) {
      preferredPos = sel.to;
      preferredSide = 'end';
    }
    let diff = findDiff(
      view.state.doc.sliceString(from, to, LineBreakPlaceholder),
      reader.text,
      preferredPos - from,
      preferredSide,
    );
    if (diff) {
      if (
        browser.chrome &&
        view.inputState.lastKeyCode == 13 &&
        diff.toB == diff.from + 2 &&
        reader.text.slice(diff.from, diff.toB) == LineBreakPlaceholder + LineBreakPlaceholder
      )
        diff.toB--;
      change = {
        from: from + diff.from,
        to: from + diff.toA,
        insert: Text.of(reader.text.slice(diff.from, diff.toB).split(LineBreakPlaceholder)),
      };
    }
    newSel = selectionFromPoints(selPoints, from);
  } else if (view.hasFocus || !view.state.facet(editable)) {
    let domSel = view.observer.selectionRange;
    let { impreciseHead: iHead, impreciseAnchor: iAnchor } = view.docView;
    let head =
      (iHead && iHead.node == domSel.focusNode && iHead.offset == domSel.focusOffset) ||
      !contains(view.contentDOM, domSel.focusNode)
        ? view.state.selection.main.head
        : view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
    let anchor =
      (iAnchor && iAnchor.node == domSel.anchorNode && iAnchor.offset == domSel.anchorOffset) ||
      !contains(view.contentDOM, domSel.anchorNode)
        ? view.state.selection.main.anchor
        : view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
    if (head != sel.head || anchor != sel.anchor) newSel = EditorSelection.single(anchor, head);
  }
  if (!change && !newSel) return;
  if (!change && typeOver && !sel.empty && newSel && newSel.main.empty)
    change = { from: sel.from, to: sel.to, insert: view.state.doc.slice(sel.from, sel.to) };
  else if (
    change &&
    change.from >= sel.from &&
    change.to <= sel.to &&
    (change.from != sel.from || change.to != sel.to) &&
    sel.to - sel.from - (change.to - change.from) <= 4
  )
    change = {
      from: sel.from,
      to: sel.to,
      insert: view.state.doc
        .slice(sel.from, change.from)
        .append(change.insert)
        .append(view.state.doc.slice(change.to, sel.to)),
    };
  if (change) {
    let startState = view.state;
    if (browser.ios && view.inputState.flushIOSKey(view)) return;
    if (
      browser.android &&
      ((change.from == sel.from &&
        change.to == sel.to &&
        change.insert.length == 1 &&
        change.insert.lines == 2 &&
        dispatchKey(view.contentDOM, 'Enter', 13)) ||
        (change.from == sel.from - 1 &&
          change.to == sel.to &&
          change.insert.length == 0 &&
          dispatchKey(view.contentDOM, 'Backspace', 8)) ||
        (change.from == sel.from &&
          change.to == sel.to + 1 &&
          change.insert.length == 0 &&
          dispatchKey(view.contentDOM, 'Delete', 46)))
    )
      return;
    let text = change.insert.toString();
    if (view.state.facet(inputHandler).some((h) => h(view, change.from, change.to, text))) return;
    if (view.inputState.composing >= 0) view.inputState.composing++;
    let tr;
    if (
      change.from >= sel.from &&
      change.to <= sel.to &&
      change.to - change.from >= (sel.to - sel.from) / 3 &&
      (!newSel || (newSel.main.empty && newSel.main.from == change.from + change.insert.length)) &&
      view.inputState.composing < 0
    ) {
      let before = sel.from < change.from ? startState.sliceDoc(sel.from, change.from) : '';
      let after = sel.to > change.to ? startState.sliceDoc(change.to, sel.to) : '';
      tr = startState.replaceSelection(
        view.state.toText(before + change.insert.sliceString(0, void 0, view.state.lineBreak) + after),
      );
    } else {
      let changes = startState.changes(change);
      let mainSel =
        newSel && !startState.selection.main.eq(newSel.main) && newSel.main.to <= changes.newLength
          ? newSel.main
          : void 0;
      if (
        startState.selection.ranges.length > 1 &&
        view.inputState.composing >= 0 &&
        change.to <= sel.to &&
        change.to >= sel.to - 10
      ) {
        let replaced = view.state.sliceDoc(change.from, change.to);
        let compositionRange = compositionSurroundingNode(view) || view.state.doc.lineAt(sel.head);
        let offset = sel.to - change.to,
          size = sel.to - sel.from;
        tr = startState.changeByRange((range) => {
          if (range.from == sel.from && range.to == sel.to) return { changes, range: mainSel || range.map(changes) };
          let to = range.to - offset,
            from = to - replaced.length;
          if (
            range.to - range.from != size ||
            view.state.sliceDoc(from, to) != replaced || // Unfortunately, there's no way to make multiple
            // changes in the same node work without aborting
            // composition, so cursors in the composition range are
            // ignored.
            (compositionRange && range.to >= compositionRange.from && range.from <= compositionRange.to)
          )
            return { range };
          let rangeChanges = startState.changes({ from, to, insert: change.insert }),
            selOff = range.to - sel.to;
          return {
            changes: rangeChanges,
            range: !mainSel
              ? range.map(rangeChanges)
              : EditorSelection.range(Math.max(0, mainSel.anchor + selOff), Math.max(0, mainSel.head + selOff)),
          };
        });
      } else {
        tr = {
          changes,
          selection: mainSel && startState.selection.replaceRange(mainSel),
        };
      }
    }
    let userEvent = 'input.type';
    if (view.composing) {
      userEvent += '.compose';
      if (view.inputState.compositionFirstChange) {
        userEvent += '.start';
        view.inputState.compositionFirstChange = false;
      }
    }
    view.dispatch(tr, { scrollIntoView: true, userEvent });
  } else if (newSel && !newSel.main.eq(sel)) {
    let scrollIntoView2 = false,
      userEvent = 'select';
    if (view.inputState.lastSelectionTime > Date.now() - 50) {
      if (view.inputState.lastSelectionOrigin == 'select') scrollIntoView2 = true;
      userEvent = view.inputState.lastSelectionOrigin;
    }
    view.dispatch({ selection: newSel, scrollIntoView: scrollIntoView2, userEvent });
  }
}
function findDiff(a, b, preferredPos, preferredSide) {
  let minLen = Math.min(a.length, b.length);
  let from = 0;
  while (from < minLen && a.charCodeAt(from) == b.charCodeAt(from)) from++;
  if (from == minLen && a.length == b.length) return null;
  let toA = a.length,
    toB = b.length;
  while (toA > 0 && toB > 0 && a.charCodeAt(toA - 1) == b.charCodeAt(toB - 1)) {
    toA--;
    toB--;
  }
  if (preferredSide == 'end') {
    let adjust = Math.max(0, from - Math.min(toA, toB));
    preferredPos -= toA + adjust - from;
  }
  if (toA < from && a.length < b.length) {
    let move = preferredPos <= from && preferredPos >= toA ? from - preferredPos : 0;
    from -= move;
    toB = from + (toB - toA);
    toA = from;
  } else if (toB < from) {
    let move = preferredPos <= from && preferredPos >= toB ? from - preferredPos : 0;
    from -= move;
    toA = from + (toA - toB);
    toB = from;
  }
  return { from, toA, toB };
}
function selectionPoints(view) {
  let result = [];
  if (view.root.activeElement != view.contentDOM) return result;
  let { anchorNode, anchorOffset, focusNode, focusOffset } = view.observer.selectionRange;
  if (anchorNode) {
    result.push(new DOMPoint(anchorNode, anchorOffset));
    if (focusNode != anchorNode || focusOffset != anchorOffset) result.push(new DOMPoint(focusNode, focusOffset));
  }
  return result;
}
function selectionFromPoints(points, base2) {
  if (points.length == 0) return null;
  let anchor = points[0].pos,
    head = points.length == 2 ? points[1].pos : anchor;
  return anchor > -1 && head > -1 ? EditorSelection.single(anchor + base2, head + base2) : null;
}
var EditorView = class _EditorView {
  /**
  Construct a new view. You'll usually want to put `view.dom` into
  your document after creating a view, so that the user can see
  it.
  */
  constructor(config = {}) {
    this.plugins = [];
    this.pluginMap = /* @__PURE__ */ new Map();
    this.editorAttrs = {};
    this.contentAttrs = {};
    this.bidiCache = [];
    this.destroyed = false;
    this.updateState = 2;
    this.measureScheduled = -1;
    this.measureRequests = [];
    this.contentDOM = document.createElement('div');
    this.scrollDOM = document.createElement('div');
    this.scrollDOM.tabIndex = -1;
    this.scrollDOM.className = 'cm-scroller';
    this.scrollDOM.appendChild(this.contentDOM);
    this.announceDOM = document.createElement('div');
    this.announceDOM.style.cssText = 'position: absolute; top: -10000px';
    this.announceDOM.setAttribute('aria-live', 'polite');
    this.dom = document.createElement('div');
    this.dom.appendChild(this.announceDOM);
    this.dom.appendChild(this.scrollDOM);
    this._dispatch = config.dispatch || ((tr) => this.update([tr]));
    this.dispatch = this.dispatch.bind(this);
    this.root = config.root || getRoot(config.parent) || document;
    this.viewState = new ViewState(config.state || EditorState.create());
    this.plugins = this.state.facet(viewPlugin).map((spec) => new PluginInstance(spec));
    for (let plugin2 of this.plugins) plugin2.update(this);
    this.observer = new DOMObserver(
      this,
      (from, to, typeOver) => {
        applyDOMChange(this, from, to, typeOver);
      },
      (event) => {
        this.inputState.runScrollHandlers(this, event);
        if (this.observer.intersecting) this.measure();
      },
    );
    this.inputState = new InputState(this);
    this.docView = new DocView(this);
    this.mountStyles();
    this.updateAttrs();
    this.updateState = 0;
    this.requestMeasure();
    if (config.parent) config.parent.appendChild(this.dom);
  }
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  dispatch(...input) {
    this._dispatch(input.length == 1 && input[0] instanceof Transaction ? input[0] : this.state.update(...input));
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(transactions) {
    if (this.updateState != 0)
      throw new Error('Calls to EditorView.update are not allowed while an update is in progress');
    let redrawn = false,
      update;
    let state = this.state;
    for (let tr of transactions) {
      if (tr.startState != state)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      state = tr.state;
    }
    if (this.destroyed) {
      this.viewState.state = state;
      return;
    }
    if (state.facet(EditorState.phrases) != this.state.facet(EditorState.phrases)) return this.setState(state);
    update = new ViewUpdate(this, state, transactions);
    let scrollTarget = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let tr of transactions) {
        if (scrollTarget) scrollTarget = scrollTarget.map(tr.changes);
        if (tr.scrollIntoView) {
          let { main } = tr.state.selection;
          scrollTarget = new ScrollTarget(
            main.empty ? main : EditorSelection.cursor(main.head, main.head > main.anchor ? -1 : 1),
          );
        }
        for (let e of tr.effects) {
          if (e.is(scrollTo)) scrollTarget = new ScrollTarget(e.value);
          else if (e.is(centerOn)) scrollTarget = new ScrollTarget(e.value, 'center');
          else if (e.is(scrollIntoView)) scrollTarget = e.value;
        }
      }
      this.viewState.update(update, scrollTarget);
      this.bidiCache = CachedOrder.update(this.bidiCache, update.changes);
      if (!update.empty) {
        this.updatePlugins(update);
        this.inputState.update(update);
      }
      redrawn = this.docView.update(update);
      if (this.state.facet(styleModule) != this.styleModules) this.mountStyles();
      this.updateAttrs();
      this.showAnnouncements(transactions);
      this.docView.updateSelection(
        redrawn,
        transactions.some((tr) => tr.isUserEvent('select.pointer')),
      );
    } finally {
      this.updateState = 0;
    }
    if (update.startState.facet(theme) != update.state.facet(theme)) this.viewState.mustMeasureContent = true;
    if (redrawn || scrollTarget || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent)
      this.requestMeasure();
    if (!update.empty) for (let listener of this.state.facet(updateListener)) listener(update);
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(newState) {
    if (this.updateState != 0)
      throw new Error('Calls to EditorView.setState are not allowed while an update is in progress');
    if (this.destroyed) {
      this.viewState.state = newState;
      return;
    }
    this.updateState = 2;
    let hadFocus = this.hasFocus;
    try {
      for (let plugin2 of this.plugins) plugin2.destroy(this);
      this.viewState = new ViewState(newState);
      this.plugins = newState.facet(viewPlugin).map((spec) => new PluginInstance(spec));
      this.pluginMap.clear();
      for (let plugin2 of this.plugins) plugin2.update(this);
      this.docView = new DocView(this);
      this.inputState.ensureHandlers(this);
      this.mountStyles();
      this.updateAttrs();
      this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    if (hadFocus) this.focus();
    this.requestMeasure();
  }
  updatePlugins(update) {
    let prevSpecs = update.startState.facet(viewPlugin),
      specs = update.state.facet(viewPlugin);
    if (prevSpecs != specs) {
      let newPlugins = [];
      for (let spec of specs) {
        let found = prevSpecs.indexOf(spec);
        if (found < 0) {
          newPlugins.push(new PluginInstance(spec));
        } else {
          let plugin2 = this.plugins[found];
          plugin2.mustUpdate = update;
          newPlugins.push(plugin2);
        }
      }
      for (let plugin2 of this.plugins) if (plugin2.mustUpdate != update) plugin2.destroy(this);
      this.plugins = newPlugins;
      this.pluginMap.clear();
      this.inputState.ensureHandlers(this);
    } else {
      for (let p of this.plugins) p.mustUpdate = update;
    }
    for (let i = 0; i < this.plugins.length; i++) this.plugins[i].update(this);
  }
  /**
  @internal
  */
  measure(flush = true) {
    if (this.destroyed) return;
    if (this.measureScheduled > -1) cancelAnimationFrame(this.measureScheduled);
    this.measureScheduled = 0;
    if (flush) this.observer.flush();
    let updated = null;
    try {
      for (let i = 0; ; i++) {
        this.updateState = 1;
        let oldViewport = this.viewport;
        let changed = this.viewState.measure(this);
        if (!changed && !this.measureRequests.length && this.viewState.scrollTarget == null) break;
        if (i > 5) {
          console.warn(
            this.measureRequests.length ? 'Measure loop restarted more than 5 times' : 'Viewport failed to stabilize',
          );
          break;
        }
        let measuring = [];
        if (!(changed & 4)) [this.measureRequests, measuring] = [measuring, this.measureRequests];
        let measured = measuring.map((m) => {
          try {
            return m.read(this);
          } catch (e) {
            logException(this.state, e);
            return BadMeasure;
          }
        });
        let update = new ViewUpdate(this, this.state),
          redrawn = false,
          scrolled = false;
        update.flags |= changed;
        if (!updated) updated = update;
        else updated.flags |= changed;
        this.updateState = 2;
        if (!update.empty) {
          this.updatePlugins(update);
          this.inputState.update(update);
          this.updateAttrs();
          redrawn = this.docView.update(update);
        }
        for (let i2 = 0; i2 < measuring.length; i2++)
          if (measured[i2] != BadMeasure) {
            try {
              let m = measuring[i2];
              if (m.write) m.write(measured[i2], this);
            } catch (e) {
              logException(this.state, e);
            }
          }
        if (this.viewState.scrollTarget) {
          this.docView.scrollIntoView(this.viewState.scrollTarget);
          this.viewState.scrollTarget = null;
          scrolled = true;
        }
        if (redrawn) this.docView.updateSelection(true);
        if (
          this.viewport.from == oldViewport.from &&
          this.viewport.to == oldViewport.to &&
          !scrolled &&
          this.measureRequests.length == 0
        )
          break;
      }
    } finally {
      this.updateState = 0;
      this.measureScheduled = -1;
    }
    if (updated && !updated.empty) for (let listener of this.state.facet(updateListener)) listener(updated);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return baseThemeID + ' ' + (this.state.facet(darkTheme) ? baseDarkID : baseLightID) + ' ' + this.state.facet(theme);
  }
  updateAttrs() {
    let editorAttrs = attrsFromFacet(this, editorAttributes, {
      class: 'cm-editor' + (this.hasFocus ? ' cm-focused ' : ' ') + this.themeClasses,
    });
    let contentAttrs = {
      spellcheck: 'false',
      autocorrect: 'off',
      autocapitalize: 'off',
      translate: 'no',
      contenteditable: !this.state.facet(editable) ? 'false' : 'true',
      class: 'cm-content',
      style: `${browser.tabSize}: ${this.state.tabSize}`,
      role: 'textbox',
      'aria-multiline': 'true',
    };
    if (this.state.readOnly) contentAttrs['aria-readonly'] = 'true';
    attrsFromFacet(this, contentAttributes, contentAttrs);
    this.observer.ignore(() => {
      updateAttrs(this.contentDOM, this.contentAttrs, contentAttrs);
      updateAttrs(this.dom, this.editorAttrs, editorAttrs);
    });
    this.editorAttrs = editorAttrs;
    this.contentAttrs = contentAttrs;
  }
  showAnnouncements(trs) {
    let first = true;
    for (let tr of trs)
      for (let effect of tr.effects)
        if (effect.is(_EditorView.announce)) {
          if (first) this.announceDOM.textContent = '';
          first = false;
          let div = this.announceDOM.appendChild(document.createElement('div'));
          div.textContent = effect.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(styleModule);
    StyleModule.mount(this.root, this.styleModules.concat(baseTheme).reverse());
  }
  readMeasured() {
    if (this.updateState == 2) throw new Error("Reading the editor layout isn't allowed during an update");
    if (this.updateState == 0 && this.measureScheduled > -1) this.measure(false);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(request) {
    if (this.measureScheduled < 0) this.measureScheduled = requestAnimationFrame(() => this.measure());
    if (request) {
      if (request.key != null)
        for (let i = 0; i < this.measureRequests.length; i++) {
          if (this.measureRequests[i].key === request.key) {
            this.measureRequests[i] = request;
            return;
          }
        }
      this.measureRequests.push(request);
    }
  }
  /**
  Collect all values provided by the active plugins for a given
  field.
  */
  pluginField(field) {
    let result = [];
    for (let plugin2 of this.plugins) plugin2.update(this).takeField(field, result);
    return result;
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(plugin2) {
    let known = this.pluginMap.get(plugin2);
    if (known === void 0 || (known && known.spec != plugin2))
      this.pluginMap.set(plugin2, (known = this.plugins.find((p) => p.spec == plugin2) || null));
    return known && known.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  Find the line or block widget at the given vertical position.
  
  By default, this position is interpreted as a screen position,
  meaning `docTop` is set to the DOM top position of the editor
  content (forcing a layout). You can pass a different `docTop`
  value—for example 0 to interpret `height` as a document-relative
  position, or a precomputed document top
  (`view.contentDOM.getBoundingClientRect().top`) to limit layout
  queries.
  
  *Deprecated: use `elementAtHeight` instead.*
  */
  blockAtHeight(height, docTop) {
    let top = ensureTop(docTop, this);
    return this.elementAtHeight(height - top).moveY(top);
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)
  */
  elementAtHeight(height) {
    this.readMeasured();
    return this.viewState.elementAtHeight(height);
  }
  /**
  Find information for the visual line (see
  [`visualLineAt`](https://codemirror.net/6/docs/ref/#view.EditorView.visualLineAt)) at the given
  vertical position. The resulting block info might hold another
  array of block info structs in its `type` field if this line
  consists of more than one block.
  
  Defaults to treating `height` as a screen position. See
  [`blockAtHeight`](https://codemirror.net/6/docs/ref/#view.EditorView.blockAtHeight) for the
  interpretation of the `docTop` parameter.
  
  *Deprecated: use `lineBlockAtHeight` instead.*
  */
  visualLineAtHeight(height, docTop) {
    let top = ensureTop(docTop, this);
    return this.lineBlockAtHeight(height - top).moveY(top);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height.
  */
  lineBlockAtHeight(height) {
    this.readMeasured();
    return this.viewState.lineBlockAtHeight(height);
  }
  /**
  Iterate over the height information of the visual lines in the
  viewport. The heights of lines are reported relative to the
  given document top, which defaults to the screen position of the
  document (forcing a layout).
  
  *Deprecated: use `viewportLineBlocks` instead.*
  */
  viewportLines(f, docTop) {
    let top = ensureTop(docTop, this);
    for (let line of this.viewportLineBlocks) f(line.moveY(top));
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the extent and height of the visual line (a range delimited
  on both sides by either non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^range)
  line breaks, or the start/end of the document) at the given position.
  
  Vertical positions are computed relative to the `docTop`
  argument, which defaults to 0 for this method. You can pass
  `view.contentDOM.getBoundingClientRect().top` here to get screen
  coordinates.
  
  *Deprecated: use `lineBlockAt` instead.*
  */
  visualLineAt(pos, docTop = 0) {
    return this.lineBlockAt(pos).moveY(docTop + this.viewState.paddingTop);
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^range) line breaks, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(pos) {
    return this.viewState.lineBlockAt(pos);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#text.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. Motion in
  bidirectional text is in visual order, in the editor's [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). When the start
  position was the last one on the line, the returned position
  will be across the line break. If there is no further line, the
  original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(start, forward, by) {
    return skipAtoms(this, start, moveByChar(this, start, forward, by));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(start, forward) {
    return skipAtoms(
      this,
      start,
      moveByChar(this, start, forward, (initial) => byGroup(this, start.head, initial)),
    );
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(start, forward, includeWrap = true) {
    return moveToLineBoundary(this, start, forward, includeWrap);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(start, forward, distance) {
    return skipAtoms(this, start, moveVertically(this, start, forward, distance));
  }
  // FIXME remove on next major version
  scrollPosIntoView(pos) {
    this.dispatch({ effects: scrollTo.of(EditorSelection.cursor(pos)) });
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(pos) {
    return this.docView.domAtPos(pos);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(node, offset = 0) {
    return this.docView.posFromDOM(node, offset);
  }
  posAtCoords(coords, precise = true) {
    this.readMeasured();
    return posAtCoords(this, coords, precise);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(pos, side = 1) {
    this.readMeasured();
    let rect = this.docView.coordsAt(pos, side);
    if (!rect || rect.left == rect.right) return rect;
    let line = this.state.doc.lineAt(pos),
      order = this.bidiSpans(line);
    let span = order[BidiSpan.find(order, pos - line.from, -1, side)];
    return flattenRect(rect, (span.dir == Direction.LTR) == side > 0);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor.
  */
  get textDirection() {
    return this.viewState.heightOracle.direction;
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(line) {
    if (line.length > MaxBidiLine) return trivialOrder(line.length);
    let dir = this.textDirection;
    for (let entry of this.bidiCache) if (entry.from == line.from && entry.dir == dir) return entry.order;
    let order = computeOrder(line.text, this.textDirection);
    this.bidiCache.push(new CachedOrder(line.from, line.to, dir, order));
    return order;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var _a2;
    return (
      (document.hasFocus() ||
        (browser.safari &&
          ((_a2 = this.inputState) === null || _a2 === void 0 ? void 0 : _a2.lastContextMenu) > Date.now() - 3e4)) &&
      this.root.activeElement == this.contentDOM
    );
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      focusPreventScroll(this.contentDOM);
      this.docView.updateSelection();
    });
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    for (let plugin2 of this.plugins) plugin2.destroy(this);
    this.plugins = [];
    this.inputState.destroy();
    this.dom.remove();
    this.observer.destroy();
    if (this.measureScheduled > -1) cancelAnimationFrame(this.measureScheduled);
    this.destroyed = true;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(pos, options = {}) {
    return scrollIntoView.of(
      new ScrollTarget(
        typeof pos == 'number' ? EditorSelection.cursor(pos) : pos,
        options.y,
        options.x,
        options.yMargin,
        options.xMargin,
      ),
    );
  }
  /**
  Facet that can be used to add DOM event handlers. The value
  should be an object mapping event names to handler functions. The
  first such function to return true will be assumed to have handled
  that event, and no other handlers or built-in behavior will be
  activated for it.
  These are registered on the [content
  element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except for `scroll`
  handlers, which will be called any time the editor's [scroll
  element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of its parent nodes
  is scrolled.
  */
  static domEventHandlers(handlers2) {
    return ViewPlugin.define(() => ({}), { eventHandlers: handlers2 });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(spec, options) {
    let prefix = StyleModule.newName();
    let result = [theme.of(prefix), styleModule.of(buildTheme(`.${prefix}`, spec))];
    if (options && options.dark) result.push(darkTheme.of(true));
    return result;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(spec) {
    return Prec.lowest(styleModule.of(buildTheme('.' + baseThemeID, spec, lightDarkIDs)));
  }
};
EditorView.scrollTo = scrollTo;
EditorView.centerOn = centerOn;
EditorView.styleModule = styleModule;
EditorView.inputHandler = inputHandler;
EditorView.exceptionSink = exceptionSink;
EditorView.updateListener = updateListener;
EditorView.editable = editable;
EditorView.mouseSelectionStyle = mouseSelectionStyle;
EditorView.dragMovesSelection = dragMovesSelection$1;
EditorView.clickAddsSelectionRange = clickAddsSelectionRange;
EditorView.decorations = decorations;
EditorView.darkTheme = darkTheme;
EditorView.contentAttributes = contentAttributes;
EditorView.editorAttributes = editorAttributes;
EditorView.lineWrapping = EditorView.contentAttributes.of({ class: 'cm-lineWrapping' });
EditorView.announce = StateEffect.define();
var MaxBidiLine = 4096;
function ensureTop(given, view) {
  return (given == null ? view.contentDOM.getBoundingClientRect().top : given) + view.viewState.paddingTop;
}
var BadMeasure = {};
var CachedOrder = class _CachedOrder {
  constructor(from, to, dir, order) {
    this.from = from;
    this.to = to;
    this.dir = dir;
    this.order = order;
  }
  static update(cache, changes) {
    if (changes.empty) return cache;
    let result = [],
      lastDir = cache.length ? cache[cache.length - 1].dir : Direction.LTR;
    for (let i = Math.max(0, cache.length - 10); i < cache.length; i++) {
      let entry = cache[i];
      if (entry.dir == lastDir && !changes.touchesRange(entry.from, entry.to))
        result.push(
          new _CachedOrder(changes.mapPos(entry.from, 1), changes.mapPos(entry.to, -1), entry.dir, entry.order),
        );
    }
    return result;
  }
};
function attrsFromFacet(view, facet, base2) {
  for (let sources = view.state.facet(facet), i = sources.length - 1; i >= 0; i--) {
    let source = sources[i],
      value = typeof source == 'function' ? source(view) : source;
    if (value) combineAttrs(value, base2);
  }
  return base2;
}
var currentPlatform = browser.mac ? 'mac' : browser.windows ? 'win' : browser.linux ? 'linux' : 'key';
function normalizeKeyName(name2, platform) {
  const parts = name2.split(/-(?!$)/);
  let result = parts[parts.length - 1];
  if (result == 'Space') result = ' ';
  let alt, ctrl, shift, meta2;
  for (let i = 0; i < parts.length - 1; ++i) {
    const mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod)) meta2 = true;
    else if (/^a(lt)?$/i.test(mod)) alt = true;
    else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
    else if (/^s(hift)?$/i.test(mod)) shift = true;
    else if (/^mod$/i.test(mod)) {
      if (platform == 'mac') meta2 = true;
      else ctrl = true;
    } else throw new Error('Unrecognized modifier name: ' + mod);
  }
  if (alt) result = 'Alt-' + result;
  if (ctrl) result = 'Ctrl-' + result;
  if (meta2) result = 'Meta-' + result;
  if (shift) result = 'Shift-' + result;
  return result;
}
function modifiers(name2, event, shift) {
  if (event.altKey) name2 = 'Alt-' + name2;
  if (event.ctrlKey) name2 = 'Ctrl-' + name2;
  if (event.metaKey) name2 = 'Meta-' + name2;
  if (shift !== false && event.shiftKey) name2 = 'Shift-' + name2;
  return name2;
}
var handleKeyEvents = EditorView.domEventHandlers({
  keydown(event, view) {
    return runHandlers(getKeymap(view.state), event, view, 'editor');
  },
});
var keymap = Facet.define({ enables: handleKeyEvents });
var Keymaps = /* @__PURE__ */ new WeakMap();
function getKeymap(state) {
  let bindings = state.facet(keymap);
  let map = Keymaps.get(bindings);
  if (!map) Keymaps.set(bindings, (map = buildKeymap(bindings.reduce((a, b) => a.concat(b), []))));
  return map;
}
var storedPrefix = null;
var PrefixTimeout = 4e3;
function buildKeymap(bindings, platform = currentPlatform) {
  let bound = /* @__PURE__ */ Object.create(null);
  let isPrefix = /* @__PURE__ */ Object.create(null);
  let checkPrefix = (name2, is) => {
    let current = isPrefix[name2];
    if (current == null) isPrefix[name2] = is;
    else if (current != is)
      throw new Error('Key binding ' + name2 + ' is used both as a regular binding and as a multi-stroke prefix');
  };
  let add = (scope, key, command, preventDefault) => {
    let scopeObj = bound[scope] || (bound[scope] = /* @__PURE__ */ Object.create(null));
    let parts = key.split(/ (?!$)/).map((k) => normalizeKeyName(k, platform));
    for (let i = 1; i < parts.length; i++) {
      let prefix = parts.slice(0, i).join(' ');
      checkPrefix(prefix, true);
      if (!scopeObj[prefix])
        scopeObj[prefix] = {
          preventDefault: true,
          commands: [
            (view) => {
              let ourObj = (storedPrefix = { view, prefix, scope });
              setTimeout(() => {
                if (storedPrefix == ourObj) storedPrefix = null;
              }, PrefixTimeout);
              return true;
            },
          ],
        };
    }
    let full = parts.join(' ');
    checkPrefix(full, false);
    let binding = scopeObj[full] || (scopeObj[full] = { preventDefault: false, commands: [] });
    binding.commands.push(command);
    if (preventDefault) binding.preventDefault = true;
  };
  for (let b of bindings) {
    let name2 = b[platform] || b.key;
    if (!name2) continue;
    for (let scope of b.scope ? b.scope.split(' ') : ['editor']) {
      add(scope, name2, b.run, b.preventDefault);
      if (b.shift) add(scope, 'Shift-' + name2, b.shift, b.preventDefault);
    }
  }
  return bound;
}
function runHandlers(map, event, view, scope) {
  let name2 = keyName(event),
    isChar = name2.length == 1 && name2 != ' ';
  let prefix = '',
    fallthrough = false;
  if (storedPrefix && storedPrefix.view == view && storedPrefix.scope == scope) {
    prefix = storedPrefix.prefix + ' ';
    if ((fallthrough = modifierCodes.indexOf(event.keyCode) < 0)) storedPrefix = null;
  }
  let runFor = (binding) => {
    if (binding) {
      for (let cmd of binding.commands) if (cmd(view)) return true;
      if (binding.preventDefault) fallthrough = true;
    }
    return false;
  };
  let scopeObj = map[scope],
    baseName;
  if (scopeObj) {
    if (runFor(scopeObj[prefix + modifiers(name2, event, !isChar)])) return true;
    if (
      isChar &&
      (event.shiftKey || event.altKey || event.metaKey) &&
      (baseName = base[event.keyCode]) &&
      baseName != name2
    ) {
      if (runFor(scopeObj[prefix + modifiers(baseName, event, true)])) return true;
    } else if (isChar && event.shiftKey) {
      if (runFor(scopeObj[prefix + modifiers(name2, event, true)])) return true;
    }
  }
  return fallthrough;
}
var CanHidePrimary = !browser.ios;
var selectionConfig = Facet.define({
  combine(configs) {
    return combineConfig(
      configs,
      {
        cursorBlinkRate: 1200,
        drawRangeCursor: true,
      },
      {
        cursorBlinkRate: (a, b) => Math.min(a, b),
        drawRangeCursor: (a, b) => a || b,
      },
    );
  },
});
var Piece = class {
  constructor(left, top, width, height, className) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.className = className;
  }
  draw() {
    let elt = document.createElement('div');
    elt.className = this.className;
    this.adjust(elt);
    return elt;
  }
  adjust(elt) {
    elt.style.left = this.left + 'px';
    elt.style.top = this.top + 'px';
    if (this.width >= 0) elt.style.width = this.width + 'px';
    elt.style.height = this.height + 'px';
  }
  eq(p) {
    return (
      this.left == p.left &&
      this.top == p.top &&
      this.width == p.width &&
      this.height == p.height &&
      this.className == p.className
    );
  }
};
var drawSelectionPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.view = view;
      this.rangePieces = [];
      this.cursors = [];
      this.measureReq = { read: this.readPos.bind(this), write: this.drawSel.bind(this) };
      this.selectionLayer = view.scrollDOM.appendChild(document.createElement('div'));
      this.selectionLayer.className = 'cm-selectionLayer';
      this.selectionLayer.setAttribute('aria-hidden', 'true');
      this.cursorLayer = view.scrollDOM.appendChild(document.createElement('div'));
      this.cursorLayer.className = 'cm-cursorLayer';
      this.cursorLayer.setAttribute('aria-hidden', 'true');
      view.requestMeasure(this.measureReq);
      this.setBlinkRate();
    }
    setBlinkRate() {
      this.cursorLayer.style.animationDuration = this.view.state.facet(selectionConfig).cursorBlinkRate + 'ms';
    }
    update(update) {
      let confChanged = update.startState.facet(selectionConfig) != update.state.facet(selectionConfig);
      if (confChanged || update.selectionSet || update.geometryChanged || update.viewportChanged)
        this.view.requestMeasure(this.measureReq);
      if (update.transactions.some((tr) => tr.scrollIntoView))
        this.cursorLayer.style.animationName =
          this.cursorLayer.style.animationName == 'cm-blink' ? 'cm-blink2' : 'cm-blink';
      if (confChanged) this.setBlinkRate();
    }
    readPos() {
      let { state } = this.view,
        conf = state.facet(selectionConfig);
      let rangePieces = state.selection.ranges
        .map((r) => (r.empty ? [] : measureRange(this.view, r)))
        .reduce((a, b) => a.concat(b));
      let cursors = [];
      for (let r of state.selection.ranges) {
        let prim = r == state.selection.main;
        if (r.empty ? !prim || CanHidePrimary : conf.drawRangeCursor) {
          let piece = measureCursor(this.view, r, prim);
          if (piece) cursors.push(piece);
        }
      }
      return { rangePieces, cursors };
    }
    drawSel({ rangePieces, cursors }) {
      if (rangePieces.length != this.rangePieces.length || rangePieces.some((p, i) => !p.eq(this.rangePieces[i]))) {
        this.selectionLayer.textContent = '';
        for (let p of rangePieces) this.selectionLayer.appendChild(p.draw());
        this.rangePieces = rangePieces;
      }
      if (cursors.length != this.cursors.length || cursors.some((c, i) => !c.eq(this.cursors[i]))) {
        let oldCursors = this.cursorLayer.children;
        if (oldCursors.length !== cursors.length) {
          this.cursorLayer.textContent = '';
          for (const c of cursors) this.cursorLayer.appendChild(c.draw());
        } else {
          cursors.forEach((c, idx) => c.adjust(oldCursors[idx]));
        }
        this.cursors = cursors;
      }
    }
    destroy() {
      this.selectionLayer.remove();
      this.cursorLayer.remove();
    }
  },
);
var themeSpec = {
  '.cm-line': {
    '& ::selection': { backgroundColor: 'transparent !important' },
    '&::selection': { backgroundColor: 'transparent !important' },
  },
};
if (CanHidePrimary) themeSpec['.cm-line'].caretColor = 'transparent !important';
var hideNativeSelection = Prec.highest(EditorView.theme(themeSpec));
function getBase(view) {
  let rect = view.scrollDOM.getBoundingClientRect();
  let left = view.textDirection == Direction.LTR ? rect.left : rect.right - view.scrollDOM.clientWidth;
  return { left: left - view.scrollDOM.scrollLeft, top: rect.top - view.scrollDOM.scrollTop };
}
function wrappedLine(view, pos, inside2) {
  let range = EditorSelection.cursor(pos);
  return {
    from: Math.max(inside2.from, view.moveToLineBoundary(range, false, true).from),
    to: Math.min(inside2.to, view.moveToLineBoundary(range, true, true).from),
    type: BlockType.Text,
  };
}
function blockAt(view, pos) {
  let line = view.lineBlockAt(pos);
  if (Array.isArray(line.type))
    for (let l of line.type) {
      if (l.to > pos || (l.to == pos && (l.to == line.to || l.type == BlockType.Text))) return l;
    }
  return line;
}
function measureRange(view, range) {
  if (range.to <= view.viewport.from || range.from >= view.viewport.to) return [];
  let from = Math.max(range.from, view.viewport.from),
    to = Math.min(range.to, view.viewport.to);
  let ltr = view.textDirection == Direction.LTR;
  let content2 = view.contentDOM,
    contentRect = content2.getBoundingClientRect(),
    base2 = getBase(view);
  let lineStyle = window.getComputedStyle(content2.firstChild);
  let leftSide = contentRect.left + parseInt(lineStyle.paddingLeft) + Math.min(0, parseInt(lineStyle.textIndent));
  let rightSide = contentRect.right - parseInt(lineStyle.paddingRight);
  let startBlock = blockAt(view, from),
    endBlock = blockAt(view, to);
  let visualStart = startBlock.type == BlockType.Text ? startBlock : null;
  let visualEnd = endBlock.type == BlockType.Text ? endBlock : null;
  if (view.lineWrapping) {
    if (visualStart) visualStart = wrappedLine(view, from, visualStart);
    if (visualEnd) visualEnd = wrappedLine(view, to, visualEnd);
  }
  if (visualStart && visualEnd && visualStart.from == visualEnd.from) {
    return pieces(drawForLine(range.from, range.to, visualStart));
  } else {
    let top = visualStart ? drawForLine(range.from, null, visualStart) : drawForWidget(startBlock, false);
    let bottom = visualEnd ? drawForLine(null, range.to, visualEnd) : drawForWidget(endBlock, true);
    let between = [];
    if ((visualStart || startBlock).to < (visualEnd || endBlock).from - 1)
      between.push(piece(leftSide, top.bottom, rightSide, bottom.top));
    else if (top.bottom < bottom.top && view.elementAtHeight((top.bottom + bottom.top) / 2).type == BlockType.Text)
      top.bottom = bottom.top = (top.bottom + bottom.top) / 2;
    return pieces(top).concat(between).concat(pieces(bottom));
  }
  function piece(left, top, right, bottom) {
    return new Piece(
      left - base2.left,
      top - base2.top - 0.01,
      right - left,
      bottom - top + 0.01,
      'cm-selectionBackground',
    );
  }
  function pieces({ top, bottom, horizontal }) {
    let pieces2 = [];
    for (let i = 0; i < horizontal.length; i += 2) pieces2.push(piece(horizontal[i], top, horizontal[i + 1], bottom));
    return pieces2;
  }
  function drawForLine(from2, to2, line) {
    let top = 1e9,
      bottom = -1e9,
      horizontal = [];
    function addSpan(from3, fromOpen, to3, toOpen, dir) {
      let fromCoords = view.coordsAtPos(from3, from3 == line.to ? -2 : 2);
      let toCoords = view.coordsAtPos(to3, to3 == line.from ? 2 : -2);
      top = Math.min(fromCoords.top, toCoords.top, top);
      bottom = Math.max(fromCoords.bottom, toCoords.bottom, bottom);
      if (dir == Direction.LTR)
        horizontal.push(ltr && fromOpen ? leftSide : fromCoords.left, ltr && toOpen ? rightSide : toCoords.right);
      else horizontal.push(!ltr && toOpen ? leftSide : toCoords.left, !ltr && fromOpen ? rightSide : fromCoords.right);
    }
    let start = from2 !== null && from2 !== void 0 ? from2 : line.from,
      end = to2 !== null && to2 !== void 0 ? to2 : line.to;
    for (let r of view.visibleRanges)
      if (r.to > start && r.from < end) {
        for (let pos = Math.max(r.from, start), endPos = Math.min(r.to, end); ; ) {
          let docLine = view.state.doc.lineAt(pos);
          for (let span of view.bidiSpans(docLine)) {
            let spanFrom = span.from + docLine.from,
              spanTo = span.to + docLine.from;
            if (spanFrom >= endPos) break;
            if (spanTo > pos)
              addSpan(
                Math.max(spanFrom, pos),
                from2 == null && spanFrom <= start,
                Math.min(spanTo, endPos),
                to2 == null && spanTo >= end,
                span.dir,
              );
          }
          pos = docLine.to + 1;
          if (pos >= endPos) break;
        }
      }
    if (horizontal.length == 0) addSpan(start, from2 == null, end, to2 == null, view.textDirection);
    return { top, bottom, horizontal };
  }
  function drawForWidget(block, top) {
    let y = contentRect.top + (top ? block.top : block.bottom);
    return { top: y, bottom: y, horizontal: [] };
  }
}
function measureCursor(view, cursor, primary) {
  let pos = view.coordsAtPos(cursor.head, cursor.assoc || 1);
  if (!pos) return null;
  let base2 = getBase(view);
  return new Piece(
    pos.left - base2.left,
    pos.top - base2.top,
    -1,
    pos.bottom - pos.top,
    primary ? 'cm-cursor cm-cursor-primary' : 'cm-cursor cm-cursor-secondary',
  );
}
var setDropCursorPos = StateEffect.define({
  map(pos, mapping) {
    return pos == null ? null : mapping.mapPos(pos);
  },
});
var dropCursorPos = StateField.define({
  create() {
    return null;
  },
  update(pos, tr) {
    if (pos != null) pos = tr.changes.mapPos(pos);
    return tr.effects.reduce((pos2, e) => (e.is(setDropCursorPos) ? e.value : pos2), pos);
  },
});
var drawDropCursor = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.view = view;
      this.cursor = null;
      this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
    }
    update(update) {
      var _a2;
      let cursorPos = update.state.field(dropCursorPos);
      if (cursorPos == null) {
        if (this.cursor != null) {
          (_a2 = this.cursor) === null || _a2 === void 0 ? void 0 : _a2.remove();
          this.cursor = null;
        }
      } else {
        if (!this.cursor) {
          this.cursor = this.view.scrollDOM.appendChild(document.createElement('div'));
          this.cursor.className = 'cm-dropCursor';
        }
        if (update.startState.field(dropCursorPos) != cursorPos || update.docChanged || update.geometryChanged)
          this.view.requestMeasure(this.measureReq);
      }
    }
    readPos() {
      let pos = this.view.state.field(dropCursorPos);
      let rect = pos != null && this.view.coordsAtPos(pos);
      if (!rect) return null;
      let outer = this.view.scrollDOM.getBoundingClientRect();
      return {
        left: rect.left - outer.left + this.view.scrollDOM.scrollLeft,
        top: rect.top - outer.top + this.view.scrollDOM.scrollTop,
        height: rect.bottom - rect.top,
      };
    }
    drawCursor(pos) {
      if (this.cursor) {
        if (pos) {
          this.cursor.style.left = pos.left + 'px';
          this.cursor.style.top = pos.top + 'px';
          this.cursor.style.height = pos.height + 'px';
        } else {
          this.cursor.style.left = '-100000px';
        }
      }
    }
    destroy() {
      if (this.cursor) this.cursor.remove();
    }
    setDropPos(pos) {
      if (this.view.state.field(dropCursorPos) != pos) this.view.dispatch({ effects: setDropCursorPos.of(pos) });
    }
  },
  {
    eventHandlers: {
      dragover(event) {
        this.setDropPos(this.view.posAtCoords({ x: event.clientX, y: event.clientY }));
      },
      dragleave(event) {
        if (event.target == this.view.contentDOM || !this.view.contentDOM.contains(event.relatedTarget))
          this.setDropPos(null);
      },
      dragend() {
        this.setDropPos(null);
      },
      drop() {
        this.setDropPos(null);
      },
    },
  },
);
var UnicodeRegexpSupport = /x/.unicode != null ? 'gu' : 'g';
var Specials = new RegExp('[\0-\b\n--­؜​‎‏\u2028\u2029‭‮\uFEFF￹-￼]', UnicodeRegexpSupport);
var _supportsTabSize = null;
function supportsTabSize() {
  var _a2;
  if (_supportsTabSize == null && typeof document != 'undefined' && document.body) {
    let styles = document.body.style;
    _supportsTabSize = ((_a2 = styles.tabSize) !== null && _a2 !== void 0 ? _a2 : styles.MozTabSize) != null;
  }
  return _supportsTabSize || false;
}
var specialCharConfig = Facet.define({
  combine(configs) {
    let config = combineConfig(configs, {
      render: null,
      specialChars: Specials,
      addSpecialChars: null,
    });
    if ((config.replaceTabs = !supportsTabSize()))
      config.specialChars = new RegExp('	|' + config.specialChars.source, UnicodeRegexpSupport);
    if (config.addSpecialChars)
      config.specialChars = new RegExp(
        config.specialChars.source + '|' + config.addSpecialChars.source,
        UnicodeRegexpSupport,
      );
    return config;
  },
});
var plugin = ViewPlugin.fromClass(
  class {
    constructor() {
      this.height = 1e3;
      this.attrs = { style: 'padding-bottom: 1000px' };
    }
    update(update) {
      let height = update.view.viewState.editorHeight - update.view.defaultLineHeight;
      if (height != this.height) {
        this.height = height;
        this.attrs = { style: `padding-bottom: ${height}px` };
      }
    }
  },
);
var lineDeco = Decoration.line({ class: 'cm-activeLine' });
var activeLineHighlighter = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = this.getDeco(view);
    }
    update(update) {
      if (update.docChanged || update.selectionSet) this.decorations = this.getDeco(update.view);
    }
    getDeco(view) {
      let lastLineStart = -1,
        deco = [];
      for (let r of view.state.selection.ranges) {
        if (!r.empty) return Decoration.none;
        let line = view.lineBlockAt(r.head);
        if (line.from > lastLineStart) {
          deco.push(lineDeco.range(line.from));
          lastLineStart = line.from;
        }
      }
      return Decoration.set(deco);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

// ../../node_modules/.pnpm/@codemirror+language@0.19.10/node_modules/@codemirror/language/dist/index.js
var _a;
var languageDataProp = new NodeProp();
var Language = class {
  /**
  Construct a language object. You usually don't need to invoke
  this directly. But when you do, make sure you use
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet) to create
  the first argument.
  */
  constructor(data, parser, topNode, extraExtensions = []) {
    this.data = data;
    this.topNode = topNode;
    if (!EditorState.prototype.hasOwnProperty('tree'))
      Object.defineProperty(EditorState.prototype, 'tree', {
        get() {
          return syntaxTree(this);
        },
      });
    this.parser = parser;
    this.extension = [
      language.of(this),
      EditorState.languageData.of((state, pos, side) => state.facet(languageDataFacetAt(state, pos, side))),
    ].concat(extraExtensions);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(state, pos, side = -1) {
    return languageDataFacetAt(state, pos, side) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(state) {
    let lang = state.facet(language);
    if ((lang === null || lang === void 0 ? void 0 : lang.data) == this.data)
      return [{ from: 0, to: state.doc.length }];
    if (!lang || !lang.allowsNesting) return [];
    let result = [];
    let explore = (tree, from) => {
      if (tree.prop(languageDataProp) == this.data) {
        result.push({ from, to: from + tree.length });
        return;
      }
      let mount = tree.prop(NodeProp.mounted);
      if (mount) {
        if (mount.tree.prop(languageDataProp) == this.data) {
          if (mount.overlay) for (let r of mount.overlay) result.push({ from: r.from + from, to: r.to + from });
          else result.push({ from, to: from + tree.length });
          return;
        } else if (mount.overlay) {
          let size = result.length;
          explore(mount.tree, mount.overlay[0].from + from);
          if (result.length > size) return;
        }
      }
      for (let i = 0; i < tree.children.length; i++) {
        let ch = tree.children[i];
        if (ch instanceof Tree) explore(ch, tree.positions[i] + from);
      }
    };
    explore(syntaxTree(state), 0);
    return result;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return true;
  }
};
Language.setState = StateEffect.define();
function languageDataFacetAt(state, pos, side) {
  let topLang = state.facet(language);
  if (!topLang) return null;
  let facet = topLang.data;
  if (topLang.allowsNesting) {
    for (let node = syntaxTree(state).topNode; node; node = node.enter(pos, side, true, false))
      facet = node.type.prop(languageDataProp) || facet;
  }
  return facet;
}
function syntaxTree(state) {
  let field = state.field(Language.state, false);
  return field ? field.tree : Tree.empty;
}
var DocInput = class {
  constructor(doc2, length = doc2.length) {
    this.doc = doc2;
    this.length = length;
    this.cursorPos = 0;
    this.string = '';
    this.cursor = doc2.iter();
  }
  syncTo(pos) {
    this.string = this.cursor.next(pos - this.cursorPos).value;
    this.cursorPos = pos + this.string.length;
    return this.cursorPos - this.string.length;
  }
  chunk(pos) {
    this.syncTo(pos);
    return this.string;
  }
  get lineChunks() {
    return true;
  }
  read(from, to) {
    let stringStart = this.cursorPos - this.string.length;
    if (from < stringStart || to >= this.cursorPos) return this.doc.sliceString(from, to);
    else return this.string.slice(from - stringStart, to - stringStart);
  }
};
var currentContext = null;
var ParseContext = class _ParseContext {
  /**
  @internal
  */
  constructor(parser, state, fragments = [], tree, treeLen, viewport, skipped, scheduleOn) {
    this.parser = parser;
    this.state = state;
    this.fragments = fragments;
    this.tree = tree;
    this.treeLen = treeLen;
    this.viewport = viewport;
    this.skipped = skipped;
    this.scheduleOn = scheduleOn;
    this.parse = null;
    this.tempSkipped = [];
  }
  startParse() {
    return this.parser.startParse(new DocInput(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(until, upto) {
    if (upto != null && upto >= this.state.doc.length) upto = void 0;
    if (this.tree != Tree.empty && this.isDone(upto !== null && upto !== void 0 ? upto : this.state.doc.length)) {
      this.takeTree();
      return true;
    }
    return this.withContext(() => {
      var _a2;
      if (typeof until == 'number') {
        let endTime = Date.now() + until;
        until = () => Date.now() > endTime;
      }
      if (!this.parse) this.parse = this.startParse();
      if (upto != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > upto) && upto < this.state.doc.length)
        this.parse.stopAt(upto);
      for (;;) {
        let done = this.parse.advance();
        if (done) {
          this.fragments = this.withoutTempSkipped(
            TreeFragment.addTree(done, this.fragments, this.parse.stoppedAt != null),
          );
          this.treeLen = (_a2 = this.parse.stoppedAt) !== null && _a2 !== void 0 ? _a2 : this.state.doc.length;
          this.tree = done;
          this.parse = null;
          if (this.treeLen < (upto !== null && upto !== void 0 ? upto : this.state.doc.length))
            this.parse = this.startParse();
          else return true;
        }
        if (until()) return false;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let pos, tree;
    if (this.parse && (pos = this.parse.parsedPos) >= this.treeLen) {
      if (this.parse.stoppedAt == null || this.parse.stoppedAt > pos) this.parse.stopAt(pos);
      this.withContext(() => {
        while (!(tree = this.parse.advance())) {}
      });
      this.treeLen = pos;
      this.tree = tree;
      this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, true));
      this.parse = null;
    }
  }
  withContext(f) {
    let prev = currentContext;
    currentContext = this;
    try {
      return f();
    } finally {
      currentContext = prev;
    }
  }
  withoutTempSkipped(fragments) {
    for (let r; (r = this.tempSkipped.pop()); ) fragments = cutFragments(fragments, r.from, r.to);
    return fragments;
  }
  /**
  @internal
  */
  changes(changes, newState) {
    let { fragments, tree, treeLen, viewport, skipped } = this;
    this.takeTree();
    if (!changes.empty) {
      let ranges = [];
      changes.iterChangedRanges((fromA, toA, fromB, toB) => ranges.push({ fromA, toA, fromB, toB }));
      fragments = TreeFragment.applyChanges(fragments, ranges);
      tree = Tree.empty;
      treeLen = 0;
      viewport = { from: changes.mapPos(viewport.from, -1), to: changes.mapPos(viewport.to, 1) };
      if (this.skipped.length) {
        skipped = [];
        for (let r of this.skipped) {
          let from = changes.mapPos(r.from, 1),
            to = changes.mapPos(r.to, -1);
          if (from < to) skipped.push({ from, to });
        }
      }
    }
    return new _ParseContext(this.parser, newState, fragments, tree, treeLen, viewport, skipped, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(viewport) {
    if (this.viewport.from == viewport.from && this.viewport.to == viewport.to) return false;
    this.viewport = viewport;
    let startLen = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from, to } = this.skipped[i];
      if (from < viewport.to && to > viewport.from) {
        this.fragments = cutFragments(this.fragments, from, to);
        this.skipped.splice(i--, 1);
      }
    }
    if (this.skipped.length >= startLen) return false;
    this.reset();
    return true;
  }
  /**
  @internal
  */
  reset() {
    if (this.parse) {
      this.takeTree();
      this.parse = null;
    }
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(from, to) {
    this.skipped.push({ from, to });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(until) {
    return new (class extends Parser {
      createParse(input, fragments, ranges) {
        let from = ranges[0].from,
          to = ranges[ranges.length - 1].to;
        let parser = {
          parsedPos: from,
          advance() {
            let cx = currentContext;
            if (cx) {
              for (let r of ranges) cx.tempSkipped.push(r);
              if (until) cx.scheduleOn = cx.scheduleOn ? Promise.all([cx.scheduleOn, until]) : until;
            }
            this.parsedPos = to;
            return new Tree(NodeType.none, [], [], to - from);
          },
          stoppedAt: null,
          stopAt() {},
        };
        return parser;
      }
    })();
  }
  /**
  @internal
  */
  isDone(upto) {
    upto = Math.min(upto, this.state.doc.length);
    let frags = this.fragments;
    return this.treeLen >= upto && frags.length && frags[0].from == 0 && frags[0].to >= upto;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return currentContext;
  }
};
function cutFragments(fragments, from, to) {
  return TreeFragment.applyChanges(fragments, [{ fromA: from, toA: to, fromB: from, toB: to }]);
}
var LanguageState = class _LanguageState {
  constructor(context) {
    this.context = context;
    this.tree = context.tree;
  }
  apply(tr) {
    if (!tr.docChanged && this.tree == this.context.tree) return this;
    let newCx = this.context.changes(tr.changes, tr.state);
    let upto =
      this.context.treeLen == tr.startState.doc.length
        ? void 0
        : Math.max(tr.changes.mapPos(this.context.treeLen), newCx.viewport.to);
    if (!newCx.work(20, upto)) newCx.takeTree();
    return new _LanguageState(newCx);
  }
  static init(state) {
    let vpTo = Math.min(3e3, state.doc.length);
    let parseState = new ParseContext(
      state.facet(language).parser,
      state,
      [],
      Tree.empty,
      0,
      { from: 0, to: vpTo },
      [],
      null,
    );
    if (!parseState.work(20, vpTo)) parseState.takeTree();
    return new _LanguageState(parseState);
  }
};
Language.state = StateField.define({
  create: LanguageState.init,
  update(value, tr) {
    for (let e of tr.effects) if (e.is(Language.setState)) return e.value;
    if (tr.startState.facet(language) != tr.state.facet(language)) return LanguageState.init(tr.state);
    return value.apply(tr);
  },
});
var requestIdle = (callback) => {
  let timeout = setTimeout(
    () => callback(),
    500,
    /* MaxPause */
  );
  return () => clearTimeout(timeout);
};
if (typeof requestIdleCallback != 'undefined')
  requestIdle = (callback) => {
    let idle = -1,
      timeout = setTimeout(
        () => {
          idle = requestIdleCallback(callback, {
            timeout: 500 - 100,
            /* MinPause */
          });
        },
        100,
        /* MinPause */
      );
    return () => (idle < 0 ? clearTimeout(timeout) : cancelIdleCallback(idle));
  };
var isInputPending =
  typeof navigator != 'undefined' &&
  ((_a = navigator.scheduling) === null || _a === void 0 ? void 0 : _a.isInputPending)
    ? () => navigator.scheduling.isInputPending()
    : null;
var parseWorker = ViewPlugin.fromClass(
  class ParseWorker {
    constructor(view) {
      this.view = view;
      this.working = null;
      this.workScheduled = 0;
      this.chunkEnd = -1;
      this.chunkBudget = -1;
      this.work = this.work.bind(this);
      this.scheduleWork();
    }
    update(update) {
      let cx = this.view.state.field(Language.state).context;
      if (cx.updateViewport(update.view.viewport) || this.view.viewport.to > cx.treeLen) this.scheduleWork();
      if (update.docChanged) {
        if (this.view.hasFocus) this.chunkBudget += 50;
        this.scheduleWork();
      }
      this.checkAsyncSchedule(cx);
    }
    scheduleWork() {
      if (this.working) return;
      let { state } = this.view,
        field = state.field(Language.state);
      if (field.tree != field.context.tree || !field.context.isDone(state.doc.length))
        this.working = requestIdle(this.work);
    }
    work(deadline) {
      this.working = null;
      let now = Date.now();
      if (this.chunkEnd < now && (this.chunkEnd < 0 || this.view.hasFocus)) {
        this.chunkEnd = now + 3e4;
        this.chunkBudget = 3e3;
      }
      if (this.chunkBudget <= 0) return;
      let {
          state,
          viewport: { to: vpTo },
        } = this.view,
        field = state.field(Language.state);
      if (
        field.tree == field.context.tree &&
        field.context.isDone(
          vpTo + 1e5,
          /* MaxParseAhead */
        )
      )
        return;
      let endTime =
        Date.now() +
        Math.min(this.chunkBudget, 100, deadline && !isInputPending ? Math.max(25, deadline.timeRemaining() - 5) : 1e9);
      let viewportFirst = field.context.treeLen < vpTo && state.doc.length > vpTo + 1e3;
      let done = field.context.work(() => {
        return (isInputPending && isInputPending()) || Date.now() > endTime;
      }, vpTo + (viewportFirst ? 0 : 1e5));
      this.chunkBudget -= Date.now() - now;
      if (done || this.chunkBudget <= 0) {
        field.context.takeTree();
        this.view.dispatch({ effects: Language.setState.of(new LanguageState(field.context)) });
      }
      if (this.chunkBudget > 0 && !(done && !viewportFirst)) this.scheduleWork();
      this.checkAsyncSchedule(field.context);
    }
    checkAsyncSchedule(cx) {
      if (cx.scheduleOn) {
        this.workScheduled++;
        cx.scheduleOn
          .then(() => this.scheduleWork())
          .catch((err) => logException(this.view.state, err))
          .then(() => this.workScheduled--);
        cx.scheduleOn = null;
      }
    }
    destroy() {
      if (this.working) this.working();
    }
    isWorking() {
      return !!(this.working || this.workScheduled > 0);
    }
  },
  {
    eventHandlers: {
      focus() {
        this.scheduleWork();
      },
    },
  },
);
var language = Facet.define({
  combine(languages) {
    return languages.length ? languages[0] : null;
  },
  enables: [Language.state, parseWorker],
});
var indentService = Facet.define();
var indentUnit = Facet.define({
  combine: (values) => {
    if (!values.length) return '  ';
    if (!/^(?: +|\t+)$/.test(values[0])) throw new Error('Invalid indent unit: ' + JSON.stringify(values[0]));
    return values[0];
  },
});
var indentNodeProp = new NodeProp();
var foldService = Facet.define();
var foldNodeProp = new NodeProp();

// ../../node_modules/.pnpm/@codemirror+highlight@0.19.8/node_modules/@codemirror/highlight/dist/index.js
var nextTagID = 0;
var Tag = class _Tag {
  /**
  @internal
  */
  constructor(set, base2, modified) {
    this.set = set;
    this.base = base2;
    this.modified = modified;
    this.id = nextTagID++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and [highlight
  styles](https://codemirror.net/6/docs/ref/#highlight.HighlightStyle) that don't mention this tag
  will try to fall back to the parent tag (or grandparent tag,
  etc).
  */
  static define(parent) {
    if (parent === null || parent === void 0 ? void 0 : parent.base)
      throw new Error('Can not derive from a modified tag');
    let tag = new _Tag([], null, []);
    tag.set.push(tag);
    if (parent) for (let t2 of parent.set) tag.set.push(t2);
    return tag;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier() {
    let mod = new Modifier();
    return (tag) => {
      if (tag.modified.indexOf(mod) > -1) return tag;
      return Modifier.get(
        tag.base || tag,
        tag.modified.concat(mod).sort((a, b) => a.id - b.id),
      );
    };
  }
};
var nextModifierID = 0;
var Modifier = class _Modifier {
  constructor() {
    this.instances = [];
    this.id = nextModifierID++;
  }
  static get(base2, mods) {
    if (!mods.length) return base2;
    let exists = mods[0].instances.find((t2) => t2.base == base2 && sameArray2(mods, t2.modified));
    if (exists) return exists;
    let set = [],
      tag = new Tag(set, base2, mods);
    for (let m of mods) m.instances.push(tag);
    let configs = permute(mods);
    for (let parent of base2.set) for (let config of configs) set.push(_Modifier.get(parent, config));
    return tag;
  }
};
function sameArray2(a, b) {
  return a.length == b.length && a.every((x, i) => x == b[i]);
}
function permute(array) {
  let result = [array];
  for (let i = 0; i < array.length; i++) {
    for (let a of permute(array.slice(0, i).concat(array.slice(i + 1)))) result.push(a);
  }
  return result;
}
function styleTags(spec) {
  let byName = /* @__PURE__ */ Object.create(null);
  for (let prop in spec) {
    let tags2 = spec[prop];
    if (!Array.isArray(tags2)) tags2 = [tags2];
    for (let part of prop.split(' '))
      if (part) {
        let pieces = [],
          mode = 2,
          rest = part;
        for (let pos = 0; ; ) {
          if (rest == '...' && pos > 0 && pos + 3 == part.length) {
            mode = 1;
            break;
          }
          let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
          if (!m) throw new RangeError('Invalid path: ' + part);
          pieces.push(m[0] == '*' ? null : m[0][0] == '"' ? JSON.parse(m[0]) : m[0]);
          pos += m[0].length;
          if (pos == part.length) break;
          let next = part[pos++];
          if (pos == part.length && next == '!') {
            mode = 0;
            break;
          }
          if (next != '/') throw new RangeError('Invalid path: ' + part);
          rest = part.slice(pos);
        }
        let last = pieces.length - 1,
          inner = pieces[last];
        if (!inner) throw new RangeError('Invalid path: ' + part);
        let rule = new Rule(tags2, mode, last > 0 ? pieces.slice(0, last) : null);
        byName[inner] = rule.sort(byName[inner]);
      }
  }
  return ruleNodeProp.add(byName);
}
var ruleNodeProp = new NodeProp();
var highlightStyle = Facet.define({
  combine(stylings) {
    return stylings.length ? HighlightStyle.combinedMatch(stylings) : null;
  },
});
var fallbackHighlightStyle = Facet.define({
  combine(values) {
    return values.length ? values[0].match : null;
  },
});
function getHighlightStyle(state) {
  return state.facet(highlightStyle) || state.facet(fallbackHighlightStyle);
}
var Rule = class {
  constructor(tags2, mode, context, next) {
    this.tags = tags2;
    this.mode = mode;
    this.context = context;
    this.next = next;
  }
  sort(other) {
    if (!other || other.depth < this.depth) {
      this.next = other;
      return this;
    }
    other.next = this.sort(other.next);
    return other;
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
};
var HighlightStyle = class _HighlightStyle {
  constructor(spec, options) {
    this.map = /* @__PURE__ */ Object.create(null);
    let modSpec;
    function def(spec2) {
      let cls = StyleModule.newName();
      (modSpec || (modSpec = /* @__PURE__ */ Object.create(null)))['.' + cls] = spec2;
      return cls;
    }
    this.all = typeof options.all == 'string' ? options.all : options.all ? def(options.all) : null;
    for (let style of spec) {
      let cls = (style.class || def(Object.assign({}, style, { tag: null }))) + (this.all ? ' ' + this.all : '');
      let tags2 = style.tag;
      if (!Array.isArray(tags2)) this.map[tags2.id] = cls;
      else for (let tag of tags2) this.map[tag.id] = cls;
    }
    this.module = modSpec ? new StyleModule(modSpec) : null;
    this.scope = options.scope || null;
    this.match = this.match.bind(this);
    let ext = [treeHighlighter];
    if (this.module) ext.push(EditorView.styleModule.of(this.module));
    this.extension = ext.concat(
      options.themeType == null
        ? highlightStyle.of(this)
        : highlightStyle.computeN([EditorView.darkTheme], (state) => {
            return state.facet(EditorView.darkTheme) == (options.themeType == 'dark') ? [this] : [];
          }),
    );
    this.fallback = ext.concat(fallbackHighlightStyle.of(this));
  }
  /**
  Returns the CSS class associated with the given tag, if any.
  This method is bound to the instance by the constructor.
  */
  match(tag, scope) {
    if (this.scope && scope != this.scope) return null;
    for (let t2 of tag.set) {
      let match = this.map[t2.id];
      if (match !== void 0) {
        if (t2 != tag) this.map[tag.id] = match;
        return match;
      }
    }
    return (this.map[tag.id] = this.all);
  }
  /**
  Combines an array of highlight styles into a single match
  function that returns all of the classes assigned by the styles
  for a given tag.
  */
  static combinedMatch(styles) {
    if (styles.length == 1) return styles[0].match;
    let cache = styles.some((s) => s.scope) ? void 0 : /* @__PURE__ */ Object.create(null);
    return (tag, scope) => {
      let cached = cache && cache[tag.id];
      if (cached !== void 0) return cached;
      let result = null;
      for (let style of styles) {
        let value = style.match(tag, scope);
        if (value) result = result ? result + ' ' + value : value;
      }
      if (cache) cache[tag.id] = result;
      return result;
    };
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The spec must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighters
  like [`classHighlightStyle`](https://codemirror.net/6/docs/ref/#highlight.classHighlightStyle)
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(specs, options) {
    return new _HighlightStyle(specs, options || {});
  }
  /**
  Returns the CSS classes (if any) that the highlight styles
  active in the given state would assign to the given a style
  [tag](https://codemirror.net/6/docs/ref/#highlight.Tag) and (optional) language
  [scope](https://codemirror.net/6/docs/ref/#highlight.HighlightStyle^define^options.scope).
  */
  static get(state, tag, scope) {
    let style = getHighlightStyle(state);
    return style && style(tag, scope || NodeType.none);
  }
};
function highlightTree(tree, getStyle, putStyle, from = 0, to = tree.length) {
  highlightTreeRange(tree, from, to, getStyle, putStyle);
}
var TreeHighlighter = class {
  constructor(view) {
    this.markCache = /* @__PURE__ */ Object.create(null);
    this.tree = syntaxTree(view.state);
    this.decorations = this.buildDeco(view, getHighlightStyle(view.state));
  }
  update(update) {
    let tree = syntaxTree(update.state),
      style = getHighlightStyle(update.state);
    let styleChange = style != update.startState.facet(highlightStyle);
    if (tree.length < update.view.viewport.to && !styleChange && tree.type == this.tree.type) {
      this.decorations = this.decorations.map(update.changes);
    } else if (tree != this.tree || update.viewportChanged || styleChange) {
      this.tree = tree;
      this.decorations = this.buildDeco(update.view, style);
    }
  }
  buildDeco(view, match) {
    if (!match || !this.tree.length) return Decoration.none;
    let builder = new RangeSetBuilder();
    for (let { from, to } of view.visibleRanges) {
      highlightTreeRange(this.tree, from, to, match, (from2, to2, style) => {
        builder.add(from2, to2, this.markCache[style] || (this.markCache[style] = Decoration.mark({ class: style })));
      });
    }
    return builder.finish();
  }
};
var treeHighlighter = Prec.high(
  ViewPlugin.fromClass(TreeHighlighter, {
    decorations: (v) => v.decorations,
  }),
);
var nodeStack = [''];
var HighlightBuilder = class {
  constructor(at, style, span) {
    this.at = at;
    this.style = style;
    this.span = span;
    this.class = '';
  }
  startSpan(at, cls) {
    if (cls != this.class) {
      this.flush(at);
      if (at > this.at) this.at = at;
      this.class = cls;
    }
  }
  flush(to) {
    if (to > this.at && this.class) this.span(this.at, to, this.class);
  }
  highlightRange(cursor, from, to, inheritedClass, depth, scope) {
    let { type, from: start, to: end } = cursor;
    if (start >= to || end <= from) return;
    nodeStack[depth] = type.name;
    if (type.isTop) scope = type;
    let cls = inheritedClass;
    let rule = type.prop(ruleNodeProp),
      opaque = false;
    while (rule) {
      if (!rule.context || matchContext(rule.context, nodeStack, depth)) {
        for (let tag of rule.tags) {
          let st = this.style(tag, scope);
          if (st) {
            if (cls) cls += ' ';
            cls += st;
            if (rule.mode == 1) inheritedClass += (inheritedClass ? ' ' : '') + st;
            else if (rule.mode == 0) opaque = true;
          }
        }
        break;
      }
      rule = rule.next;
    }
    this.startSpan(cursor.from, cls);
    if (opaque) return;
    let mounted = cursor.tree && cursor.tree.prop(NodeProp.mounted);
    if (mounted && mounted.overlay) {
      let inner = cursor.node.enter(mounted.overlay[0].from + start, 1);
      let hasChild2 = cursor.firstChild();
      for (let i = 0, pos = start; ; i++) {
        let next = i < mounted.overlay.length ? mounted.overlay[i] : null;
        let nextPos = next ? next.from + start : end;
        let rangeFrom = Math.max(from, pos),
          rangeTo = Math.min(to, nextPos);
        if (rangeFrom < rangeTo && hasChild2) {
          while (cursor.from < rangeTo) {
            this.highlightRange(cursor, rangeFrom, rangeTo, inheritedClass, depth + 1, scope);
            this.startSpan(Math.min(to, cursor.to), cls);
            if (cursor.to >= nextPos || !cursor.nextSibling()) break;
          }
        }
        if (!next || nextPos > to) break;
        pos = next.to + start;
        if (pos > from) {
          this.highlightRange(
            inner.cursor,
            Math.max(from, next.from + start),
            Math.min(to, pos),
            inheritedClass,
            depth,
            mounted.tree.type,
          );
          this.startSpan(pos, cls);
        }
      }
      if (hasChild2) cursor.parent();
    } else if (cursor.firstChild()) {
      do {
        if (cursor.to <= from) continue;
        if (cursor.from >= to) break;
        this.highlightRange(cursor, from, to, inheritedClass, depth + 1, scope);
        this.startSpan(Math.min(to, cursor.to), cls);
      } while (cursor.nextSibling());
      cursor.parent();
    }
  }
};
function highlightTreeRange(tree, from, to, style, span) {
  let builder = new HighlightBuilder(from, style, span);
  builder.highlightRange(tree.cursor(), from, to, '', 0, tree.type);
  builder.flush(to);
}
function matchContext(context, stack, depth) {
  if (context.length > depth - 1) return false;
  for (let d = depth - 1, i = context.length - 1; i >= 0; i--, d--) {
    let check = context[i];
    if (check && check != stack[d]) return false;
  }
  return true;
}
var t = Tag.define;
var comment = t();
var name = t();
var typeName = t(name);
var propertyName = t(name);
var literal = t();
var string = t(literal);
var number = t(literal);
var content = t();
var heading = t(content);
var keyword = t();
var operator = t();
var punctuation = t();
var bracket = t(punctuation);
var meta = t();
var tags = {
  /**
  A comment.
  */
  comment,
  /**
  A line [comment](https://codemirror.net/6/docs/ref/#highlight.tags.comment).
  */
  lineComment: t(comment),
  /**
  A block [comment](https://codemirror.net/6/docs/ref/#highlight.tags.comment).
  */
  blockComment: t(comment),
  /**
  A documentation [comment](https://codemirror.net/6/docs/ref/#highlight.tags.comment).
  */
  docComment: t(comment),
  /**
  Any kind of identifier.
  */
  name,
  /**
  The [name](https://codemirror.net/6/docs/ref/#highlight.tags.name) of a variable.
  */
  variableName: t(name),
  /**
  A type [name](https://codemirror.net/6/docs/ref/#highlight.tags.name).
  */
  typeName,
  /**
  A tag name (subtag of [`typeName`](https://codemirror.net/6/docs/ref/#highlight.tags.typeName)).
  */
  tagName: t(typeName),
  /**
  A property or field [name](https://codemirror.net/6/docs/ref/#highlight.tags.name).
  */
  propertyName,
  /**
  An attribute name (subtag of [`propertyName`](https://codemirror.net/6/docs/ref/#highlight.tags.propertyName)).
  */
  attributeName: t(propertyName),
  /**
  The [name](https://codemirror.net/6/docs/ref/#highlight.tags.name) of a class.
  */
  className: t(name),
  /**
  A label [name](https://codemirror.net/6/docs/ref/#highlight.tags.name).
  */
  labelName: t(name),
  /**
  A namespace [name](https://codemirror.net/6/docs/ref/#highlight.tags.name).
  */
  namespace: t(name),
  /**
  The [name](https://codemirror.net/6/docs/ref/#highlight.tags.name) of a macro.
  */
  macroName: t(name),
  /**
  A literal value.
  */
  literal,
  /**
  A string [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  string,
  /**
  A documentation [string](https://codemirror.net/6/docs/ref/#highlight.tags.string).
  */
  docString: t(string),
  /**
  A character literal (subtag of [string](https://codemirror.net/6/docs/ref/#highlight.tags.string)).
  */
  character: t(string),
  /**
  An attribute value (subtag of [string](https://codemirror.net/6/docs/ref/#highlight.tags.string)).
  */
  attributeValue: t(string),
  /**
  A number [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  number,
  /**
  An integer [number](https://codemirror.net/6/docs/ref/#highlight.tags.number) literal.
  */
  integer: t(number),
  /**
  A floating-point [number](https://codemirror.net/6/docs/ref/#highlight.tags.number) literal.
  */
  float: t(number),
  /**
  A boolean [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  bool: t(literal),
  /**
  Regular expression [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  regexp: t(literal),
  /**
  An escape [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: t(literal),
  /**
  A color [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  color: t(literal),
  /**
  A URL [literal](https://codemirror.net/6/docs/ref/#highlight.tags.literal).
  */
  url: t(literal),
  /**
  A language keyword.
  */
  keyword,
  /**
  The [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) for the self or this
  object.
  */
  self: t(keyword),
  /**
  The [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) for null.
  */
  null: t(keyword),
  /**
  A [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) denoting some atomic value.
  */
  atom: t(keyword),
  /**
  A [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) that represents a unit.
  */
  unit: t(keyword),
  /**
  A modifier [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword).
  */
  modifier: t(keyword),
  /**
  A [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: t(keyword),
  /**
  A control-flow related [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword).
  */
  controlKeyword: t(keyword),
  /**
  A [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: t(keyword),
  /**
  A [keyword](https://codemirror.net/6/docs/ref/#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: t(keyword),
  /**
  An operator.
  */
  operator,
  /**
  An [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator) that defines something.
  */
  derefOperator: t(operator),
  /**
  Arithmetic-related [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  arithmeticOperator: t(operator),
  /**
  Logical [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  logicOperator: t(operator),
  /**
  Bit [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  bitwiseOperator: t(operator),
  /**
  Comparison [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  compareOperator: t(operator),
  /**
  [Operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator) that updates its operand.
  */
  updateOperator: t(operator),
  /**
  [Operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator) that defines something.
  */
  definitionOperator: t(operator),
  /**
  Type-related [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  typeOperator: t(operator),
  /**
  Control-flow [operator](https://codemirror.net/6/docs/ref/#highlight.tags.operator).
  */
  controlOperator: t(operator),
  /**
  Program or markup punctuation.
  */
  punctuation,
  /**
  [Punctuation](https://codemirror.net/6/docs/ref/#highlight.tags.punctuation) that separates
  things.
  */
  separator: t(punctuation),
  /**
  Bracket-style [punctuation](https://codemirror.net/6/docs/ref/#highlight.tags.punctuation).
  */
  bracket,
  /**
  Angle [brackets](https://codemirror.net/6/docs/ref/#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: t(bracket),
  /**
  Square [brackets](https://codemirror.net/6/docs/ref/#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: t(bracket),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](https://codemirror.net/6/docs/ref/#highlight.tags.bracket).
  */
  paren: t(bracket),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](https://codemirror.net/6/docs/ref/#highlight.tags.bracket).
  */
  brace: t(bracket),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content,
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that represents a heading.
  */
  heading,
  /**
  A level 1 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading1: t(heading),
  /**
  A level 2 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading2: t(heading),
  /**
  A level 3 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading3: t(heading),
  /**
  A level 4 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading4: t(heading),
  /**
  A level 5 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading5: t(heading),
  /**
  A level 6 [heading](https://codemirror.net/6/docs/ref/#highlight.tags.heading).
  */
  heading6: t(heading),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that represents a list.
  */
  list: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that represents a quote.
  */
  quote: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that is emphasized.
  */
  emphasis: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that is styled strong.
  */
  strong: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that is part of a link.
  */
  link: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: t(content),
  /**
  [Content](https://codemirror.net/6/docs/ref/#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: t(content),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: t(),
  /**
  Deleted text.
  */
  deleted: t(),
  /**
  Changed text.
  */
  changed: t(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: t(),
  /**
  Metadata or meta-instruction.
  */
  meta,
  /**
  [Metadata](https://codemirror.net/6/docs/ref/#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: t(meta),
  /**
  [Metadata](https://codemirror.net/6/docs/ref/#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: t(meta),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](https://codemirror.net/6/docs/ref/#highlight.tags.meta).
  */
  processingInstruction: t(meta),
  /**
  [Modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](https://codemirror.net/6/docs/ref/#highlight.tags.name) tags.
  */
  definition: Tag.defineModifier(),
  /**
  [Modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](https://codemirror.net/6/docs/ref/#highlight.tags.variableName).
  */
  constant: Tag.defineModifier(),
  /**
  [Modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) used to indicate that
  a [variable](https://codemirror.net/6/docs/ref/#highlight.tags.variableName) or [property
  name](https://codemirror.net/6/docs/ref/#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Tag.defineModifier(),
  /**
  [Modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) that can be applied to
  [names](https://codemirror.net/6/docs/ref/#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Tag.defineModifier(),
  /**
  [Modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) that indicates a given
  [names](https://codemirror.net/6/docs/ref/#highlight.tags.name) is local to some scope.
  */
  local: Tag.defineModifier(),
  /**
  A generic variant [modifier](https://codemirror.net/6/docs/ref/#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](https://codemirror.net/6/docs/ref/#highlight.tags.string) and
  [variable name](https://codemirror.net/6/docs/ref/#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Tag.defineModifier(),
};
var defaultHighlightStyle = HighlightStyle.define([
  {
    tag: tags.link,
    textDecoration: 'underline',
  },
  {
    tag: tags.heading,
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  {
    tag: tags.emphasis,
    fontStyle: 'italic',
  },
  {
    tag: tags.strong,
    fontWeight: 'bold',
  },
  {
    tag: tags.strikethrough,
    textDecoration: 'line-through',
  },
  {
    tag: tags.keyword,
    color: '#708',
  },
  {
    tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
    color: '#219',
  },
  {
    tag: [tags.literal, tags.inserted],
    color: '#164',
  },
  {
    tag: [tags.string, tags.deleted],
    color: '#a11',
  },
  {
    tag: [tags.regexp, tags.escape, tags.special(tags.string)],
    color: '#e40',
  },
  {
    tag: tags.definition(tags.variableName),
    color: '#00f',
  },
  {
    tag: tags.local(tags.variableName),
    color: '#30a',
  },
  {
    tag: [tags.typeName, tags.namespace],
    color: '#085',
  },
  {
    tag: tags.className,
    color: '#167',
  },
  {
    tag: [tags.special(tags.variableName), tags.macroName],
    color: '#256',
  },
  {
    tag: tags.definition(tags.propertyName),
    color: '#00c',
  },
  {
    tag: tags.comment,
    color: '#940',
  },
  {
    tag: tags.meta,
    color: '#7a757a',
  },
  {
    tag: tags.invalid,
    color: '#f00',
  },
]);
var classHighlightStyle = HighlightStyle.define([
  { tag: tags.link, class: 'cmt-link' },
  { tag: tags.heading, class: 'cmt-heading' },
  { tag: tags.emphasis, class: 'cmt-emphasis' },
  { tag: tags.strong, class: 'cmt-strong' },
  { tag: tags.keyword, class: 'cmt-keyword' },
  { tag: tags.atom, class: 'cmt-atom' },
  { tag: tags.bool, class: 'cmt-bool' },
  { tag: tags.url, class: 'cmt-url' },
  { tag: tags.labelName, class: 'cmt-labelName' },
  { tag: tags.inserted, class: 'cmt-inserted' },
  { tag: tags.deleted, class: 'cmt-deleted' },
  { tag: tags.literal, class: 'cmt-literal' },
  { tag: tags.string, class: 'cmt-string' },
  { tag: tags.number, class: 'cmt-number' },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: 'cmt-string2' },
  { tag: tags.variableName, class: 'cmt-variableName' },
  { tag: tags.local(tags.variableName), class: 'cmt-variableName cmt-local' },
  { tag: tags.definition(tags.variableName), class: 'cmt-variableName cmt-definition' },
  { tag: tags.special(tags.variableName), class: 'cmt-variableName2' },
  { tag: tags.definition(tags.propertyName), class: 'cmt-propertyName cmt-definition' },
  { tag: tags.typeName, class: 'cmt-typeName' },
  { tag: tags.namespace, class: 'cmt-namespace' },
  { tag: tags.className, class: 'cmt-className' },
  { tag: tags.macroName, class: 'cmt-macroName' },
  { tag: tags.propertyName, class: 'cmt-propertyName' },
  { tag: tags.operator, class: 'cmt-operator' },
  { tag: tags.comment, class: 'cmt-comment' },
  { tag: tags.meta, class: 'cmt-meta' },
  { tag: tags.invalid, class: 'cmt-invalid' },
  { tag: tags.punctuation, class: 'cmt-punctuation' },
]);
export { HighlightStyle, Tag, classHighlightStyle, defaultHighlightStyle, highlightTree, styleTags, tags };
//# sourceMappingURL=@codemirror_highlight.js.map
