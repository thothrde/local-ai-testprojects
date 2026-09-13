(() => {
  "use strict";
  const openers = new WeakMap();
  const nativeShowModal = window.HTMLDialogElement && HTMLDialogElement.prototype.showModal;
  if (nativeShowModal && !HTMLDialogElement.prototype.__ebaA11yWrapped) {
    HTMLDialogElement.prototype.showModal = function(...args) {
      const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (opener && !this.contains(opener)) openers.set(this, opener);
      return nativeShowModal.apply(this, args);
    };
    Object.defineProperty(HTMLDialogElement.prototype, "__ebaA11yWrapped", {value:true});
  }
  document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("close", () => {
      const opener = openers.get(dialog);
      openers.delete(dialog);
      if (opener && document.contains(opener) && typeof opener.focus === "function") {
        opener.focus({preventScroll:true});
      }
    });
  });
  window.__ebaAccessibilityRemediation = {version:"11AO-1.0", focusRestore:true};
})();
