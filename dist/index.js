function createBackdropElement(bgColor) {
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
function getSafeAreaBottom() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.clientHeight;
    return windowHeight - documentHeight;
}
function isExcludedElement(props, target) {
    if (!props.excludeElement || !target) {
        return false;
    }
    return props.excludeElement.contains(target);
}
export function createBottomSheet(element, props) {
    const { backgroundColor = "white" } = props;
    const state = {
        currentSnap: 0,
        childrenHeight: 0,
        snapPointsWithChildHeight: [],
    };
    const backdropElement = createBackdropElement(backgroundColor);
    const childrenElement = element.children[0];
    function init() {
        setupElementStyles(element);
        element.append(backdropElement);
        updateChildrenHeight();
        setSnap(0);
        setupAccessibility();
        return addEventListeners();
    }
    function setupAccessibility() {
        element.setAttribute("role", "dialog");
        element.setAttribute("aria-modal", "true");
    }
    function setupElementStyles(element_) {
        Object.assign(element_.style, {
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            touchAction: "none",
            transition: "height 0.3s ease-out",
        });
    }
    function updateChildrenHeight() {
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
    function adjustCurrentSnapPoint() {
        const currentSnapValue = state.snapPointsWithChildHeight[state.currentSnap];
        if (currentSnapValue === state.childrenHeight ||
            state.currentSnap === state.snapPointsWithChildHeight.length - 1) {
            // If the current snap point is set to the full height of the inner element,
            // or if it's the last snap point, adjust it to the new height
            setSnap(state.snapPointsWithChildHeight.length - 1);
        }
    }
    function updateSnapPoints() {
        if (props.snapPoints) {
            const maxSnapPoint = Math.max(...props.snapPoints);
            state.snapPointsWithChildHeight =
                state.childrenHeight > maxSnapPoint
                    ? [
                        ...props.snapPoints.filter((point) => point !== maxSnapPoint),
                        state.childrenHeight,
                    ]
                    : [...props.snapPoints];
        }
        else {
            const safeAreaBottom = getSafeAreaBottom();
            state.snapPointsWithChildHeight = [
                safeAreaBottom + 60,
                state.childrenHeight,
            ];
        }
    }
    function updateBackdropPosition() {
        const currentSheetHeight = Number.parseFloat(element.style.height) ||
            state.snapPointsWithChildHeight[0];
        const backdropHeight = Math.max(currentSheetHeight - state.childrenHeight + 1, 0);
        backdropElement.style.height = `${backdropHeight}px`;
        backdropElement.style.bottom = "0px";
    }
    function addEventListeners() {
        const handlers = createHandlers();
        const resizeHandler = () => {
            updateChildrenHeight();
            setSnap(state.currentSnap);
        };
        // Touch events
        element.addEventListener("touchstart", handlers.start, { passive: true });
        element.addEventListener("touchmove", handlers.move, { passive: false });
        element.addEventListener("touchend", handlers.end, { passive: true });
        // Mouse events
        element.addEventListener("mousedown", handlers.start);
        window.addEventListener("mousemove", handlers.move);
        window.addEventListener("mouseup", handlers.end);
        window.addEventListener("resize", resizeHandler);
        const resizeObserver = new ResizeObserver(updateChildrenHeight);
        resizeObserver.observe(childrenElement);
        return () => {
            element.removeEventListener("touchstart", handlers.start);
            element.removeEventListener("touchmove", handlers.move);
            element.removeEventListener("touchend", handlers.end);
            element.removeEventListener("mousedown", handlers.start);
            window.removeEventListener("mousemove", handlers.move);
            window.removeEventListener("mouseup", handlers.end);
            window.removeEventListener("resize", resizeHandler);
            resizeObserver.disconnect();
        };
    }
    function createHandlers() {
        let startY;
        let startHeight;
        let lastY;
        let lastTime;
        let velocity;
        let isExcludedTouch;
        let isDragging = false;
        return {
            start: (event) => {
                isExcludedTouch = isExcludedElement(props, event.target);
                if (isExcludedTouch) {
                    return;
                }
                isDragging = true;
                startY = lastY =
                    "touches" in event ? event.touches[0].clientY : event.clientY;
                startHeight = element.getBoundingClientRect().height;
                lastTime = Date.now();
                velocity = 0;
                element.style.transition = "none";
                backdropElement.style.transition = "none";
                // Prevent text selection during drag
                event.preventDefault();
            },
            move: (event) => {
                if (isExcludedTouch || !isDragging) {
                    return;
                }
                const currentY = "touches" in event ? event.touches[0].clientY : event.clientY;
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
                event.preventDefault();
            },
            end: () => {
                if (isExcludedTouch || !isDragging) {
                    return;
                }
                isDragging = false;
                element.style.transition = "height 0.3s ease-out";
                backdropElement.style.transition = "height 0.3s ease-out";
                const currentHeight = element.getBoundingClientRect().height;
                const targetSnap = determineTargetSnap(currentHeight, velocity);
                setSnap(targetSnap);
            },
        };
    }
    function determineTargetSnap(currentHeight, velocity) {
        const closestSnapIndex = findClosestSnapIndex(currentHeight);
        const velocityThreshold = 0.5; // Adjust this value to change sensitivity
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
            return (highestSnapPoint +
                (1 - Math.exp(-overscroll / 200)) * 50 * rubberBandFactor);
        }
        const underscroll = lowestSnapPoint - height;
        return (lowestSnapPoint -
            (1 - Math.exp(-underscroll / 200)) * 50 * rubberBandFactor);
    }
    function findClosestSnapIndex(currentHeight) {
        let closestIndex = 0;
        let smallestDiff = Math.abs(state.snapPointsWithChildHeight[0] - currentHeight);
        for (let index = 1; index < state.snapPointsWithChildHeight.length; index++) {
            const currentDiff = Math.abs(state.snapPointsWithChildHeight[index] - currentHeight);
            if (currentDiff < smallestDiff) {
                smallestDiff = currentDiff;
                closestIndex = index;
            }
        }
        return closestIndex;
    }
    function setHeight(height) {
        element.style.height = `${height}px`;
        updateBackdropPosition();
    }
    function setSnap(snapIndex) {
        var _a, _b, _c;
        state.currentSnap = snapIndex;
        const snapValue = state.snapPointsWithChildHeight[snapIndex];
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
    const removeListeners = init();
    return {
        snapTo,
        destroy: () => {
            removeListeners();
        },
    };
}
