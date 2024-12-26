# DesignBox

The DesignBox plugin enhances your app with a set of reusable, high-quality UI components designed to simplify development and improve consistency.

## Usage

```tsx
import { DesignBox } from '~/plugins/designbox'
```

### DesignBox.UserAvatar

A versatile component for displaying user information, including an avatar, title, and subtitle. Supports customization and interactivity.

```tsx
<DesignBox.UserAvatar
  pictureUrl="https://your-picture.png"
  title="Ernest"
  subtitle="Dupont"
  onClick={handleClick}
/>
```

### DesignBox.CardAirbnb

A card component for displaying titles, subtitles, images, and pricing.

```tsx
<DesignBox.CardAirbnb
  title="Dressrosa"
  subtitle="Doflamingo"
  coverUrl="https://i.pinimg.com/736x/e5/6d/7d/e56d7d3e68e063cd9f80e6c78c85b412.jpg"
  price="$2399"
  priceInfo="/ week"
/>
```

### DesignBox.Gallery

A grid layout for displaying a collection of items with custom child components.

```tsx
<DesignBox.Gallery items={items}>
  {item => <DesignBox.CardAirbnb {...item} />}
</DesignBox.Gallery>
```

### DesignBox.TooltipBadge

A badge a tooltip for additional context or information.

```tsx
<DesignBox.TooltipBadge
  tooltipContent="Welcome"
  propsTooltip={{ placement: 'right' }}
>
  <Button>Tooltip Badge</Button>
</DesignBox.TooltipBadge>
```
