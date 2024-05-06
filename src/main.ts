import { detectKeyString } from "./keyboard";
import { focusDown, focusLeft, focusRight, focusUp, isEditing } from "./youtube";

document.addEventListener("keydown", (event) => {
  if (isEditing()) {
    return;
  }

  switch (detectKeyString(event)) {
    case "arrowleft":
      focusLeft();
      break;
    case "arrowdown":
      focusDown();
      break;
    case "arrowup":
      focusUp();
      break;
    case "arrowright":
      focusRight();
      break;
    default:
      return;
  }

  // Prevent scrolling.
  event.preventDefault();

  // Prevent YouTube's keyboard shortcuts.
  event.stopImmediatePropagation();
}, true);
