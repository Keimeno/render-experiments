const uiController = (() => {
  const skybox = document.querySelector(".skybox");
  const skyboxWrapper = skybox.querySelector(".skybox__wrapper");
  const skyboxRotorX = skybox.querySelector(".skybox__rotor--x");
  const skyboxRotorY = skybox.querySelector(".skybox__rotor--y");

  const rotation = {
    x: 0,
    y: 0,
  };
  const previousPosition = {
    x: 0,
    y: 0,
  };
  let previousZoom = 1;
  let currentlyTracking = false;

  const maxZoom = 2;
  const minZoom = 0;
  const degreePerPixel = 2;
  const radianPerPixel = ((Math.PI / 180) * degreePerPixel) / 10;

  const interactionStart = (x, y) => {
    previousPosition.x = x;
    previousPosition.y = y;
    currentlyTracking = true;
    // cancel any animation
    skyboxRotorX.style.animation = "none";
    skyboxRotorY.style.animation = "none";
  };

  const interactionMove = (x, y) => {
    if (!currentlyTracking) {
      return;
    }

    const delta = {
      x: x - previousPosition.x,
      y: y - previousPosition.y,
    };

    rotation.y += delta.x * radianPerPixel * -1;
    rotation.x += delta.y * radianPerPixel;

    setRotation(rotation.y, rotation.x);

    previousPosition.x = x;
    previousPosition.y = y;
  };

  const interactionEnd = () => {
    currentlyTracking = false;
  };

  const setRotation = (angleY, angleX) => {
    skyboxRotorY.style.transform = "rotateY(" + angleY + "rad) translateZ(0)";
    skyboxRotorX.style.transform = "rotateX(" + angleX + "rad) translateZ(0)";
  };

  /**
   * @param {WheelEvent} event
   */
  const handleWheel = (event) => {
    const zoomDelta = event.deltaY * -1 * 0.001;
    const zoom = Math.min(Math.max(previousZoom + zoomDelta, minZoom), maxZoom);

    previousZoom = zoom;
    skyboxWrapper.style.transform = `translateZ(${500 * zoom}px)`;
  };

  const registerListeners = () => {
    const preventDefaultWrapper = (fn) => (event) => {
      fn(event);
      event.preventDefault();
    };

    skyboxWrapper.addEventListener(
      "mousedown",
      preventDefaultWrapper((event) =>
        interactionStart(event.clientX, event.clientY)
      )
    );
    skyboxWrapper.addEventListener(
      "mousemove",
      preventDefaultWrapper((event) =>
        interactionMove(event.clientX, event.clientY)
      )
    );
    document.addEventListener("mouseup", preventDefaultWrapper(interactionEnd));

    skyboxWrapper.addEventListener(
      "touchstart",
      preventDefaultWrapper((event) =>
        interactionStart(event.touches[0].clientX, event.touches[0].clientY)
      )
    );
    skyboxWrapper.addEventListener(
      "touchmove",
      preventDefaultWrapper((event) =>
        interactionMove(event.touches[0].clientX, event.touches[0].clientY)
      )
    );
    document.addEventListener(
      "touchend",
      preventDefaultWrapper(interactionEnd)
    );

    skyboxWrapper.addEventListener("wheel", handleWheel);
  };

  return {
    init: () => {
      registerListeners();
    },
  };
})();

uiController.init();
