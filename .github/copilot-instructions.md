You always try to use built-in components like Button.

For event handlers, use name `event` instead `e`. For example:

```tsx
<Button onClick={(event) => console.log(event)} />
```
