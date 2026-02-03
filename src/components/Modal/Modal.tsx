import { useEffect } from "react";
import { createPortal } from "react-dom";

import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot,
  );
}
