type Pattern = {
  url: string;
  selector: string;
};

const patterns: Pattern[] = [
  {
    url: "^https://www.google.com/search\\?",
    selector: "a[jsname='UWckNb']",
  },
  {
    url: "^https://www.youtube.com/$",
    selector: "#video-title-link",
  },
  {
    url: "^https://www.youtube.com/@",
    selector: "#video-title",
  },
  {
    url: "^https://www.youtube.com/results\\?",
    selector: "#video-title",
  },{
    url: "^https://automaton-media.com/$",
    selector: ".td-pb-span8 .td-block-span12 .entry-title a",
  }
];

declare const navigation: any;

setupKeydownEventHandler();
navigation.addEventListener("currententrychange", () => {
  setupKeydownEventHandler();
});

function setupKeydownEventHandler() {
  patterns.forEach((pattern) => {
    if (!new RegExp(pattern.url).test(location.href)) {
      return;
    }

    const eventHandler = createKeydownEventHandler(pattern.selector);
    document.addEventListener("keydown", eventHandler, true);
    navigation.addEventListener("currententrychange", () => {
      document.removeEventListener("keydown", eventHandler, true);
    });
  });
}

function createKeydownEventHandler(selector: string) {
  return (event: KeyboardEvent) => {
    if (
      document.activeElement?.getAttribute("contenteditable") == "true" ||
      document.activeElement?.tagName == "INPUT" ||
      document.activeElement?.tagName == "TEXTAREA"
    ) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    let element;
    switch (event.key) {
      case "ArrowUp":
      case "k":
        element = findElement({ direction: "up", selector });
        break;
      case "ArrowDown":
      case "j":
        element = findElement({ direction: "down", selector });
        break;
      case "ArrowLeft":
      case "h":
        element = findElement({ direction: "left", selector });
        break;
      case "ArrowRight":
      case "l":
        element = findElement({ direction: "right", selector });
        break;
    }
    if (!element) {
      return;
    }

    const htmlElement = element as HTMLElement;
    htmlElement.focus();

    // Immitate the focus effect because the focus ring may not be visible (by bug?)
    // and focusVisible option is not supported for now.
    htmlElement.style.border = "5px solid rgb(94, 158, 214)";
    htmlElement.style.outline = "none";
    const onBlur = () => {
      htmlElement.style.border = "";
      htmlElement.style.outline = "";
      htmlElement?.removeEventListener("blur", onBlur);
    };
    htmlElement.addEventListener("blur", onBlur);

    // Prevent scrolling.
    event.preventDefault();

    // Prevent keyboard shortcuts provided by website.
    event.stopImmediatePropagation();
  };
}

function findElement({ direction, selector }: { direction: "up" | "down" | "left" | "right"; selector: string }) {
  if (!document.activeElement?.matches(selector)) {
    return document.querySelector(selector);
  }

  const activeRectangle = document.activeElement.getBoundingClientRect();
  return Array.from(document.querySelectorAll(selector)).filter((element) => {
    if (element == document.activeElement) {
      return false;
    }

    const elementRectangle = element.getBoundingClientRect();
    switch (direction) {
      case "up":
        return elementRectangle.bottom < activeRectangle.bottom &&
          elementRectangle.right >= activeRectangle.left &&
          elementRectangle.left <= activeRectangle.right;
      case "down":
        return elementRectangle.top > activeRectangle.top &&
          elementRectangle.right >= activeRectangle.left &&
          elementRectangle.left <= activeRectangle.right;
      case "left":
        return elementRectangle.right < activeRectangle.right &&
          elementRectangle.bottom >= activeRectangle.top &&
          elementRectangle.top <= activeRectangle.bottom;
      case "right":
        return elementRectangle.left > activeRectangle.left &&
          elementRectangle.bottom >= activeRectangle.top &&
          elementRectangle.top <= activeRectangle.bottom;
    }
  }).sort(byDistanceFromActiveElement)[0];
}

function byDistanceFromActiveElement(aElement: Element, bElement: Element) {
  return calculateDistance(aElement, document.activeElement!) - calculateDistance(bElement, document.activeElement!);
}

function calculateDistance(aElement: Element, bElement: Element) {
  const aRectangle = aElement.getBoundingClientRect();
  const bRectangle = bElement.getBoundingClientRect();
  return Math.hypot(
    aRectangle.top - bRectangle.top,
    aRectangle.left - bRectangle.left,
  );
}
