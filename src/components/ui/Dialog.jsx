import { useEffect, useRef } from "react";

/**
 * Modal built on the native <dialog> element. The browser provides the focus
 * trap, the Escape key and the backdrop, and returns focus to the button that
 * opened it. Clicking the dark backdrop also closes it.
 */
export default function Dialog({ open, onClose, titleId, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      {open && <div className="dialog__body">{children}</div>}
    </dialog>
  );
}
