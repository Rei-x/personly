Always try to use built-in components like Button from shadcn/ui.

Always specify types, never use `any` type.

For event handlers, use name `event` instead `e`. For example:

```tsx
<Button onClick={(event) => console.log(event)} />
```

Project is in NextJS version 15 with React Server Components and App router.
