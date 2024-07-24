# Directory Structure

```
.npmignore
LICENSE
README.md
bottomSheet.js
examples/
  vanillaJS.html
package.json
src/
  index.ts
tsconfig.json
```

## README.md

```md
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

### Vanilla JavaScript

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bottom Sheet Dialog Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        #app {
            padding: 20px;
        }
        #bottom-sheet {
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }
        .sheet-content {
            padding: 20px;
        }
        button {
            margin: 10px 0;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="app">
        <h1>Bottom Sheet Dialog Example</h1>
        <button id="open-sheet">Open Bottom Sheet</button>

        <div id="bottom-sheet">
            <div class="sheet-content">
                <h2>Custom Component</h2>
                <p>This is a custom component inside the bottom sheet.</p>
                <button id="close-sheet">Close Sheet</button>
            </div>
        </div>
    </div>

    <script type="module">
        import { createBottomSheet } from './bottom-sheet-dialog.js';

        const bottomSheetElement = document.getElementById('bottom-sheet');
        const openButton = document.getElementById('open-sheet');
        const closeButton = document.getElementById('close-sheet');

        const bottomSheet = createBottomSheet(bottomSheetElement, {
            snapPoints: [100, 300, window.innerHeight - 50],
            backgroundColor: "#ffffff",
            onOpen: () => console.log("Bottom sheet opened"),
            onClose: () => console.log("Bottom sheet closed"),
            onSnap: (snapIndex) => console.log(`Snapped to index ${snapIndex}`),
        });

        // Initially close the sheet
        bottomSheet.snapTo(0);

        openButton.addEventListener('click', () => {
            bottomSheet.snapTo(2); // Open to full height
        });

        closeButton.addEventListener('click', () => {
            bottomSheet.snapTo(0); // Close the sheet
        });

        // Clean up on page unload
        window.addEventListener('unload', () => {
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

```

## package.json

```json
{
  "name": "bottom-sheet-dialog",
  "version": "1.0.0",
  "description": "A lightweight TypeScript bottom sheet dialog component for web applications",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build"
  },
  "keywords": [
    "bottom-sheet",
    "dialog",
    "modal",
    "ui",
    "typescript",
    "touch",
    "mobile",
    "responsive",
    "web"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tonypls/bottom-sheet-dialog.git"
  },
  "bugs": {
    "url": "https://github.com/tonypls/bottom-sheet-dialog/issues"
  },
  "homepage": "https://github.com/tonypls/bottom-sheet-dialog#readme",
  "devDependencies": {
    "@types/node": "^14.18.63",
    "typescript": "^4.9.5"
  }
}

```

## bottomSheet.js

```js
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBottomSheet = createBottomSheet;
function createBottomSheet(element, props) {
    var _a = props.backgroundColor, backgroundColor = _a === void 0 ? "white" : _a;
    var state = {
        currentSnap: 0,
        childrenHeight: 0,
        snapPointsWithChildHeight: [],
    };
    var backdropElement = createBackdropElement(backgroundColor);
    var childrenElement = element.children[0];
    function init() {
        setupElementStyles(element);
        element.appendChild(backdropElement);
        updateChildrenHeight();
        setSnap(0);
        setupAccessibility();
        return addEventListeners();
    }
    function setupAccessibility() {
        element.setAttribute("role", "dialog");
        element.setAttribute("aria-modal", "true");
    }
    function setupElementStyles(el) {
        Object.assign(el.style, {
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            touchAction: "none",
            transition: "height 0.3s ease-out",
        });
    }
    function createBackdropElement(bgColor) {
        var backdrop = document.createElement("div");
        Object.assign(backdrop.style, {
            position: "absolute",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: bgColor,
            transition: "height 0.3s ease-out",
        });
        return backdrop;
    }
    function updateChildrenHeight() {
        if (childrenElement) {
            var newChildrenHeight = childrenElement.offsetHeight;
            if (newChildrenHeight !== state.childrenHeight) {
                state.childrenHeight = newChildrenHeight;
                updateBackdropPosition();
                updateSnapPoints();
                adjustCurrentSnapPoint();
            }
        }
    }
    function adjustCurrentSnapPoint() {
        var currentSnapValue = state.snapPointsWithChildHeight[state.currentSnap];
        if (currentSnapValue === state.childrenHeight ||
            state.currentSnap === state.snapPointsWithChildHeight.length - 1) {
            // If the current snap point is set to the full height of the inner element,
            // or if it's the last snap point, adjust it to the new height
            setSnap(state.snapPointsWithChildHeight.length - 1);
        }
    }
    function updateSnapPoints() {
        if (props.snapPoints) {
            var maxSnapPoint_1 = Math.max.apply(Math, props.snapPoints);
            if (state.childrenHeight > maxSnapPoint_1) {
                state.snapPointsWithChildHeight = __spreadArray(__spreadArray([], props.snapPoints.filter(function (point) { return point !== maxSnapPoint_1; }), true), [
                    state.childrenHeight,
                ], false);
            }
            else {
                state.snapPointsWithChildHeight = __spreadArray([], props.snapPoints, true);
            }
        }
        else {
            var safeAreaBottom = getSafeAreaBottom();
            state.snapPointsWithChildHeight = [
                safeAreaBottom + 60,
                state.childrenHeight,
            ];
        }
    }
    function getSafeAreaBottom() {
        var windowHeight = window.innerHeight;
        var documentHeight = document.documentElement.clientHeight;
        return windowHeight - documentHeight;
    }
    function updateBackdropPosition() {
        var currentSheetHeight = parseFloat(element.style.height) || state.snapPointsWithChildHeight[0];
        var backdropHeight = Math.max(currentSheetHeight - state.childrenHeight + 1, 0);
        backdropElement.style.height = "".concat(backdropHeight, "px");
        backdropElement.style.bottom = "0px";
    }
    function addEventListeners() {
        var touchHandlers = createTouchHandlers();
        var resizeHandler = function () {
            updateChildrenHeight();
            setSnap(state.currentSnap);
        };
        element.addEventListener("touchstart", touchHandlers.start, {
            passive: true,
        });
        element.addEventListener("touchmove", touchHandlers.move, {
            passive: false,
        });
        element.addEventListener("touchend", touchHandlers.end, { passive: true });
        window.addEventListener("resize", resizeHandler);
        var resizeObserver = new ResizeObserver(updateChildrenHeight);
        resizeObserver.observe(childrenElement);
        return function () {
            element.removeEventListener("touchstart", touchHandlers.start);
            element.removeEventListener("touchmove", touchHandlers.move);
            element.removeEventListener("touchend", touchHandlers.end);
            window.removeEventListener("resize", resizeHandler);
            resizeObserver.disconnect();
        };
    }
    function createTouchHandlers() {
        var startY;
        var startHeight;
        var lastY;
        var lastTime;
        var velocity;
        var isExcludedTouch;
        function isExcludedElement(target) {
            if (!props.excludeElement || !target)
                return false;
            return props.excludeElement.contains(target);
        }
        return {
            start: function (e) {
                isExcludedTouch = isExcludedElement(e.target);
                if (isExcludedTouch)
                    return;
                startY = lastY = e.touches[0].clientY;
                startHeight = element.getBoundingClientRect().height;
                lastTime = Date.now();
                velocity = 0;
                element.style.transition = "none";
                backdropElement.style.transition = "none";
            },
            move: function (e) {
                if (isExcludedTouch)
                    return;
                var currentY = e.touches[0].clientY;
                var currentTime = Date.now();
                var deltaY = currentY - lastY;
                var deltaTime = currentTime - lastTime;
                if (deltaTime > 0) {
                    velocity = deltaY / deltaTime;
                }
                var newHeight = calculateNewHeight(startHeight - (currentY - startY));
                setHeight(newHeight);
                lastY = currentY;
                lastTime = currentTime;
                e.preventDefault();
            },
            end: function () {
                if (isExcludedTouch)
                    return;
                element.style.transition = "height 0.3s ease-out";
                backdropElement.style.transition = "height 0.3s ease-out";
                var currentHeight = element.getBoundingClientRect().height;
                var targetSnap = determineTargetSnap(currentHeight, velocity);
                setSnap(targetSnap);
            },
        };
    }
    function determineTargetSnap(currentHeight, velocity) {
        var closestSnapIndex = findClosestSnapIndex(currentHeight);
        var velocityThreshold = 0.5; // Adjust this value to change sensitivity
        if (Math.abs(velocity) > velocityThreshold) {
            // If flicking up
            if (velocity < 0 &&
                closestSnapIndex < state.snapPointsWithChildHeight.length - 1) {
                return closestSnapIndex + 1;
            }
            // If flicking down
            if (velocity > 0 && closestSnapIndex > 0) {
                return closestSnapIndex - 1;
            }
        }
        // If velocity is low, or at the edges, snap to closest
        return closestSnapIndex;
    }
    function calculateNewHeight(height) {
        var _a = [
            Math.min.apply(Math, state.snapPointsWithChildHeight),
            Math.max.apply(Math, state.snapPointsWithChildHeight),
        ], lowestSnapPoint = _a[0], highestSnapPoint = _a[1];
        if (height >= lowestSnapPoint && height <= highestSnapPoint) {
            return height;
        }
        var rubberBandFactor = 1;
        if (height > highestSnapPoint) {
            var overscroll = height - highestSnapPoint;
            return (highestSnapPoint +
                (1 - Math.exp(-overscroll / 200)) * 50 * rubberBandFactor);
        }
        var underscroll = lowestSnapPoint - height;
        return (lowestSnapPoint -
            (1 - Math.exp(-underscroll / 200)) * 50 * rubberBandFactor);
    }
    function findClosestSnapIndex(currentHeight) {
        return state.snapPointsWithChildHeight.reduce(function (prevIndex, curr, index) {
            var prevDiff = Math.abs(state.snapPointsWithChildHeight[prevIndex] - currentHeight);
            var currDiff = Math.abs(curr - currentHeight);
            return currDiff < prevDiff ? index : prevIndex;
        }, 0);
    }
    function setHeight(height) {
        element.style.height = "".concat(height, "px");
        updateBackdropPosition();
    }
    function setSnap(snapIndex) {
        var _a, _b, _c;
        state.currentSnap = snapIndex;
        var snapValue = state.snapPointsWithChildHeight[snapIndex];
        console.log("snapPointswithChildHeight", state.snapPointsWithChildHeight, state.currentSnap);
        setHeight(snapValue);
        (_a = props.onSnap) === null || _a === void 0 ? void 0 : _a.call(props, snapIndex);
        if (snapIndex === 0) {
            (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
        }
        else if (snapIndex === state.snapPointsWithChildHeight.length - 1) {
            (_c = props.onOpen) === null || _c === void 0 ? void 0 : _c.call(props);
        }
    }
    function snapTo(snapIndex) {
        if (snapIndex >= 0 && snapIndex < state.snapPointsWithChildHeight.length) {
            setSnap(snapIndex);
        }
    }
    var removeListeners = init();
    return {
        snapTo: snapTo,
        destroy: function () {
            removeListeners();
        },
    };
}

```

## src/index.ts

```ts
export type SnapPoint = number;

interface BottomSheetEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onSnap?: (snapIndex: number) => void;
}

export interface BottomSheetProps extends BottomSheetEvents {
  snapPoints?: SnapPoint[];
  backgroundColor?: string;
  excludeElement?: HTMLElement;
}

export function createBottomSheet(
  element: HTMLElement,
  props: BottomSheetProps
) {
  const { backgroundColor = "white" } = props;
  const state = {
    currentSnap: 0,
    childrenHeight: 0,
    snapPointsWithChildHeight: [] as number[],
  };

  const backdropElement = createBackdropElement(backgroundColor);
  const childrenElement = element.children[0] as HTMLElement;

  function init(): () => void {
    setupElementStyles(element);
    element.appendChild(backdropElement);
    updateChildrenHeight();
    setSnap(0);
    setupAccessibility();
    return addEventListeners();
  }

  function setupAccessibility(): void {
    element.setAttribute("role", "dialog");
    element.setAttribute("aria-modal", "true");
  }

  function setupElementStyles(el: HTMLElement): void {
    Object.assign(el.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      touchAction: "none",
      transition: "height 0.3s ease-out",
    });
  }

  function createBackdropElement(bgColor: string): HTMLDivElement {
    const backdrop = document.createElement("div");
    Object.assign(backdrop.style, {
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: bgColor,
      transition: "height 0.3s ease-out",
    });
    return backdrop;
  }

  function updateChildrenHeight(): void {
    if (childrenElement) {
      const newChildrenHeight = childrenElement.offsetHeight;
      if (newChildrenHeight !== state.childrenHeight) {
        state.childrenHeight = newChildrenHeight;
        updateBackdropPosition();
        updateSnapPoints();
        adjustCurrentSnapPoint();
      }
    }
  }

  function adjustCurrentSnapPoint(): void {
    const currentSnapValue = state.snapPointsWithChildHeight[state.currentSnap];
    if (
      currentSnapValue === state.childrenHeight ||
      state.currentSnap === state.snapPointsWithChildHeight.length - 1
    ) {
      // If the current snap point is set to the full height of the inner element,
      // or if it's the last snap point, adjust it to the new height
      setSnap(state.snapPointsWithChildHeight.length - 1);
    }
  }

  function updateSnapPoints(): void {
    if (props.snapPoints) {
      const maxSnapPoint = Math.max(...props.snapPoints);
      if (state.childrenHeight > maxSnapPoint) {
        state.snapPointsWithChildHeight = [
          ...props.snapPoints.filter((point) => point !== maxSnapPoint),
          state.childrenHeight,
        ];
      } else {
        state.snapPointsWithChildHeight = [...props.snapPoints];
      }
    } else {
      const safeAreaBottom = getSafeAreaBottom();
      state.snapPointsWithChildHeight = [
        safeAreaBottom + 60,
        state.childrenHeight,
      ];
    }
  }

  function getSafeAreaBottom(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.clientHeight;
    return windowHeight - documentHeight;
  }

  function updateBackdropPosition(): void {
    const currentSheetHeight =
      parseFloat(element.style.height) || state.snapPointsWithChildHeight[0];
    const backdropHeight = Math.max(
      currentSheetHeight - state.childrenHeight + 1,
      0
    );
    backdropElement.style.height = `${backdropHeight}px`;
    backdropElement.style.bottom = "0px";
  }

  function addEventListeners(): () => void {
    const touchHandlers = createTouchHandlers();
    const resizeHandler = () => {
      updateChildrenHeight();
      setSnap(state.currentSnap);
    };

    element.addEventListener("touchstart", touchHandlers.start, {
      passive: true,
    });
    element.addEventListener("touchmove", touchHandlers.move, {
      passive: false,
    });
    element.addEventListener("touchend", touchHandlers.end, { passive: true });

    window.addEventListener("resize", resizeHandler);

    const resizeObserver = new ResizeObserver(updateChildrenHeight);
    resizeObserver.observe(childrenElement);

    return () => {
      element.removeEventListener("touchstart", touchHandlers.start);
      element.removeEventListener("touchmove", touchHandlers.move);
      element.removeEventListener("touchend", touchHandlers.end);
      window.removeEventListener("resize", resizeHandler);
      resizeObserver.disconnect();
    };
  }

  function createTouchHandlers() {
    let startY: number;
    let startHeight: number;
    let lastY: number;
    let lastTime: number;
    let velocity: number;
    let isExcludedTouch: boolean;

    function isExcludedElement(target: EventTarget | null): boolean {
      if (!props.excludeElement || !target) return false;
      return props.excludeElement.contains(target as Node);
    }

    return {
      start: (e: TouchEvent) => {
        isExcludedTouch = isExcludedElement(e.target);
        if (isExcludedTouch) return;

        startY = lastY = e.touches[0].clientY;
        startHeight = element.getBoundingClientRect().height;
        lastTime = Date.now();
        velocity = 0;
        element.style.transition = "none";
        backdropElement.style.transition = "none";
      },
      move: (e: TouchEvent) => {
        if (isExcludedTouch) return;

        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = currentY - lastY;
        const deltaTime = currentTime - lastTime;

        if (deltaTime > 0) {
          velocity = deltaY / deltaTime;
        }

        const newHeight = calculateNewHeight(startHeight - (currentY - startY));
        setHeight(newHeight);

        lastY = currentY;
        lastTime = currentTime;

        e.preventDefault();
      },
      end: () => {
        if (isExcludedTouch) return;

        element.style.transition = "height 0.3s ease-out";
        backdropElement.style.transition = "height 0.3s ease-out";
        const currentHeight = element.getBoundingClientRect().height;

        const targetSnap = determineTargetSnap(currentHeight, velocity);
        setSnap(targetSnap);
      },
    };
  }

  function determineTargetSnap(
    currentHeight: number,
    velocity: number
  ): number {
    const closestSnapIndex = findClosestSnapIndex(currentHeight);
    const velocityThreshold = 0.5; // Adjust this value to change sensitivity

    if (Math.abs(velocity) > velocityThreshold) {
      // If flicking up
      if (
        velocity < 0 &&
        closestSnapIndex < state.snapPointsWithChildHeight.length - 1
      ) {
        return closestSnapIndex + 1;
      }
      // If flicking down
      if (velocity > 0 && closestSnapIndex > 0) {
        return closestSnapIndex - 1;
      }
    }

    // If velocity is low, or at the edges, snap to closest
    return closestSnapIndex;
  }

  function calculateNewHeight(height: number): number {
    const [lowestSnapPoint, highestSnapPoint] = [
      Math.min(...state.snapPointsWithChildHeight),
      Math.max(...state.snapPointsWithChildHeight),
    ];

    if (height >= lowestSnapPoint && height <= highestSnapPoint) {
      return height;
    }

    const rubberBandFactor = 1;
    if (height > highestSnapPoint) {
      const overscroll = height - highestSnapPoint;
      return (
        highestSnapPoint +
        (1 - Math.exp(-overscroll / 200)) * 50 * rubberBandFactor
      );
    }

    const underscroll = lowestSnapPoint - height;
    return (
      lowestSnapPoint -
      (1 - Math.exp(-underscroll / 200)) * 50 * rubberBandFactor
    );
  }

  function findClosestSnapIndex(currentHeight: number): number {
    return state.snapPointsWithChildHeight.reduce((prevIndex, curr, index) => {
      const prevDiff = Math.abs(
        state.snapPointsWithChildHeight[prevIndex] - currentHeight
      );
      const currDiff = Math.abs(curr - currentHeight);
      return currDiff < prevDiff ? index : prevIndex;
    }, 0);
  }

  function setHeight(height: number): void {
    element.style.height = `${height}px`;
    updateBackdropPosition();
  }

  function setSnap(snapIndex: number): void {
    state.currentSnap = snapIndex;
    let snapValue = state.snapPointsWithChildHeight[snapIndex];
    console.log(
      "snapPointswithChildHeight",
      state.snapPointsWithChildHeight,
      state.currentSnap
    );

    setHeight(snapValue);
    props.onSnap?.(snapIndex);
    if (snapIndex === 0) {
      props.onClose?.();
    } else if (snapIndex === state.snapPointsWithChildHeight.length - 1) {
      props.onOpen?.();
    }
  }

  function snapTo(snapIndex: number): void {
    if (snapIndex >= 0 && snapIndex < state.snapPointsWithChildHeight.length) {
      setSnap(snapIndex);
    }
  }

  const removeListeners = init();

  return {
    snapTo,
    destroy: () => {
      removeListeners();
    },
  };
}

```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"]
}

```

