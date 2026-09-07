# Extending base-ui

[Base UI](https://base-ui.com) covers a bunch of generic components that we use to build our own on.

Oftentimes you may want to implement base-ui as-is, but you need a generic way to apply generic styling or functionality to its compound components.  
This doc describes a good way to do that.

## Import and re-export

For example a menu's Trigger should always contain an arrow:

```tsx
import { Menu as BaseMenu } from '@base-ui/react/menu';
import ChevronRight from "assets/icons/chevron-right.svg?react";

const MenuTrigger = ({children, ...rest}: BaseMenu.Trigger.Props) =>
  <BaseMenu.Trigger {...rest}>{children}<ChevronRight /></BaseMenu.Trigger>

export default {
  ...BaseMenu,
  Trigger: MenuTrigger,
}
```

This way you only have to redefine the compound components that you change.  
The suffix format (in this case `Menu`Trigger), prevents issues with reserved component names (eg. Error from Field.Error).

## If you add props, always export a type

```tsx
//...

export type MenuTriggerProps = BaseMenu.Trigger.Props & { icon: "chevron" | "arrow" }
const MenuTrigger = ({children, icon, ...rest}: MenuTriggerProps) =>
  <BaseMenu.Trigger {...rest}>{children}{icon ? <ChevronRight /> : <Arrow />}</BaseMenu.Trigger>

//...
```
