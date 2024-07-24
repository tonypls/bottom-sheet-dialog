# bottom-sheet-dialog

[![npm version](https://img.shields.io/npm/v/bottom-sheet-dialog.svg)](https://www.npmjs.com/package/bottom-sheet-dialog)
[![npm downloads](https://img.shields.io/npm/dm/bottom-sheet-dialog.svg)](https://www.npmjs.com/package/bottom-sheet-dialog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

bottom-sheet-dialog is a lightweight JavaScript library that provides an easy-to-use bottom sheet dialog component for web applications. It's designed to be framework agnostic, flexible, customizable, and easy to integrate into any project.

This bottom sheet is designed to do as little as the styling as possible so this leaves the the styling almost completely up to the content of the bottom sheet that is passed in as a child.

[Repo](https://github.com/tonypls/bottom-sheet-dialog)

[NPM](https://www.npmjs.com/package/bottom-sheet-dialog)

## Features

- Customizable snap points
- Smooth animations and transitions
- Touch-enabled drag interactions
- Accessibility support
- Customizable background color
- Event callbacks for open, close, and snap events
- Exclude specific elements from touch interactions

## Installation

You can install bottom-sheet-dialog using npm:

### npm

```bash
npm install bottom-sheet-dialog
```

### yarn

```bash
yarn add bottom-sheet-dialog
```

### pnpm

```bash
pnpm install bottom-sheet-dialog
```

## Usage

Here's a basic example of how to use bottom-sheet-dialog:

### Vanilla JavaScript Example

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bottom Sheet Dialog Example</title>
    <style>
      #bottom-sheet {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        background-color: white;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <h1>Bottom Sheet Dialog Example</h1>

      <div id="bottom-sheet">
        <div class="sheet-content">
          <h2>Custom Component</h2>
          <p>This is a custom component inside the bottom sheet.</p>
        </div>
      </div>
    </div>

    <script type="module">
      import { createBottomSheet } from "../dist/index.js";

      const bottomSheetElement = document.getElementById("bottom-sheet");

      const bottomSheet = createBottomSheet(bottomSheetElement, {
        snapPoints: [100, 300, window.innerHeight - 50],
        backgroundColor: "white",
      });

      // Clean up on page unload
      window.addEventListener("unload", () => {
        bottomSheet.destroy();
      });
    </script>
  </body>
</html>
```

## API

### createBottomSheet(element, props)

Creates a new bottom sheet instance.

- `element`: The HTML element that will become the bottom sheet.
- `props`: An object with the following properties:
  - `snapPoints`: An array of numbers representing the snap points in pixels.
  - `backgroundColor`: The background color of the bottom sheet (default: 'white').
  - `excludeElement`: An HTML element to exclude from touch interactions.
  - `onOpen`: Callback function called when the bottom sheet is fully opened.
  - `onClose`: Callback function called when the bottom sheet is closed.
  - `onSnap`: Callback function called when the bottom sheet snaps to a point, receives the snap index as an argument.

Returns an object with the following methods:

- `snapTo(index)`: Moves the bottom sheet to the specified snap point index.
- `destroy()`: Removes all event listeners and cleans up the bottom sheet.

## Browser Support

bottom-sheet-dialog supports all modern browsers that are ES6-compatible.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
