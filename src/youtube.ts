export function focusLeft() {
  focus(findLeft());
}

export function focusRight() {
  focus(findRight());
}

export function focusUp() {
  focus(findUp());
}

export function focusDown() {
  focus(findDown());
}

export function isForcusable() {
  return !isEditing() &&
    document.querySelectorAll(titleSelector).length > 1;
}

const rowSelector = "ytd-rich-grid-row";
const columnSelector = "ytd-rich-item-renderer";
const titleSelector = "a#video-title-link";

function isEditing() {
  return (
    document.activeElement?.getAttribute("contenteditable") == "true" ||
    document.activeElement?.tagName == "INPUT" ||
    document.activeElement?.tagName == "TEXTAREA"
  );
}

function focus(element: Element | null | undefined) {
  (element as HTMLElement | null)?.focus();
}

function findLeft() {
  return isActive()
    ? document.activeElement?.closest(columnSelector)?.previousElementSibling?.querySelector(titleSelector)
    : findFirst();
}

function findRight() {
  return isActive()
    ? document.activeElement?.closest(columnSelector)?.nextElementSibling?.querySelector(titleSelector)
    : findFirst();
}

function findUp() {
  return isActive()
    ? findActiveRow()?.previousElementSibling?.querySelector(`${columnSelector}:nth-child(${getActiveColumnIndex() + 1}) ${titleSelector}`)
    : findFirst();
}

function findDown() {
  return isActive()
    ? findActiveRow()?.nextElementSibling?.querySelector(`${columnSelector}:nth-child(${getActiveColumnIndex() + 1}) ${titleSelector}`)
    : findFirst();
}

function findActiveRow() {
  return document.activeElement?.closest(rowSelector);
}

function findFirst() {
  return document.querySelector(titleSelector);
}

function isActive() {
  return document.activeElement?.matches(titleSelector);
}

function getActiveColumnIndex() {
  const activeColumn = document.activeElement?.closest(columnSelector);
  if (!activeColumn) {
    return -1;
  }
  return Array.from(activeColumn?.parentElement?.children ?? []).indexOf(activeColumn);
}
