import Button from "../Buttons/Button"
import { motion } from "motion/react"
import IconCheck from '../../assets/images/icon-check.svg?react'
import './toast.css'

type ToastProps = {
    onClose:() =>void
}

const Toast = ({onClose}:ToastProps) => {

  return (
    <motion.div className="toast-notification"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
    >
        <div className="toast-message fh-4">
            <IconCheck />
            <span>Bookmark added successfully.</span>
        </div>
        <Button onClick={onClose} icon="close" style="toast"  />
    </motion.div>
  )
}

export default Toast