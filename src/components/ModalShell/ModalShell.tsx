import { type ReactNode } from 'react';
import { motion } from "motion/react";
import './modalShell.css'
import IconClose from "../../assets/images/icon-close.svg?react"

type ModalShellProps = {
    title: string,
    description: string,
    children: ReactNode,
    onClose: () => void
}

const ModalShell = ({onClose, title, description, children}:ModalShellProps) => {
  return (
    <motion.div
      className="add-bookmark-modal dialog-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      onClick={onClose}
    >
      <motion.div
        className="dialog-modal-container"
        initial={{ opacity: 0, y: -100, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close-modal"
          type="button"
          aria-label="Close add bookmark modal"
          onClick={onClose}
        >
          <IconClose aria-hidden="true" />
        </button>
        <div className="form-header">
            <h1 className="fh-1">{title}</h1>
            <h2 className="fh-4 modal-shell__description">
            {description}
            </h2>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default ModalShell
