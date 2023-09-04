
# MDX Component


## Intro

<Intro>

Some things on the screen update in response to user input. For example,

</Intro>

## ConsoleBlock

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

## Note

<Note>

There is no one-to-one replacement for the old render callback API — it depends on your use case. See the working group post for [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5) for more information.

</Note>

## CodeBlock

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## blockquote

> Note
>
> `useId` is **not** for generating [keys in a list](/learn/rendering-lists#where-to-get-your-key). Keys should be generated from your data.

## hr

---

## img

![JS执行顺序](https://media.wangbaoqi.tech/assets/blog/browser/event_1.webp)


