import { forwardRef, type ButtonHTMLAttributes } from 'react'
import IconAdd from '../../assets/images/icon-add.svg?react'
import IconDotsVertical from '../../assets/images/icon-dots-vertical.svg?react'
import IconVisit from '../../assets/images/icon-visit.svg?react'
import IconCopy from '../../assets/images/icon-copy.svg?react'
import IconClose from '../../assets/images/icon-close.svg?react'
import IconUnpin from '../../assets/images/icon-unpin.svg?react'
import IconPin from '../../assets/images/icon-pin.svg?react'
import IconEdit from '../../assets/images/icon-edit.svg?react'
import IconArchive from '../../assets/images/icon-archive.svg?react'
import IconUnarchive from '../../assets/images/icon-unarchive.svg?react'
import IconSort from '../../assets/images/icon-sort.svg?react'
import IconCheck from '../../assets/images/icon-check.svg?react'
import IconDelete from '../../assets/images/icon-delete.svg?react'

import './button.css'
import { clsx } from 'clsx'

type ButtonProps = {
  name?: string,
  size?: 'large',
  iconPosition?: 'left' | 'right',
  iconHidden?: boolean,
  icon?: 'add' | 'dots-vertical' | 'visit' | 'check' | 'close' | 'copy' | 'unpin' | 'edit' | 'archive' | 'unarchive' | 'sort' | 'pin' | 'delete',
  variant?: 'primary' | 'secondary' | 'tertiary' | 'active',
  ariaLabel?: string,
  textAlign?: 'center' | 'left' | 'right',
  dropdown?: boolean,
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'],
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'],
  ariaExpanded?: boolean,
  ariaHaspopup?: ButtonHTMLAttributes<HTMLButtonElement>['aria-haspopup'],
  ariaControls?: string,
  style?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ style, name, size, textAlign, icon, iconHidden, iconPosition, variant, ariaLabel, onClick, type = 'button', ariaExpanded, ariaHaspopup, ariaControls }, ref) => {
  const styles = clsx(
    'button',
    style,
    size === 'large' && 'button--large',
    icon,
    icon && !name && 'button--icon-only',
    iconHidden && 'button--icon-hidden',
    icon && iconPosition === 'right' && 'button--icon-right',
    variant === 'primary' && 'button--primary',
    variant === 'secondary' && 'button--secondary',
    variant === 'tertiary' && 'button--tertiary',
    variant === 'active' && 'button--active',
    textAlign === 'center' && 'text-align-center',
    textAlign === 'right' && 'text-align-right'
  );
  return (
    <button
      ref={ref}
      className={styles}
      aria-label={ariaLabel}
      onClick={onClick}
      type={type}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      {icon === 'add' && <IconAdd className="icon" aria-hidden="true" />}
      {icon === 'dots-vertical' && <IconDotsVertical className="icon" aria-hidden="true" />}
      {icon === 'visit' && <IconVisit className="icon" aria-hidden="true" />}
      {icon === 'copy' && <IconCopy className="icon" aria-hidden="true" />}
      {icon === 'unpin' && <IconUnpin className="icon" aria-hidden="true" />}
      {icon === 'pin' && <IconPin className="icon" aria-hidden="true" />}
      {icon === 'edit' && <IconEdit className="icon" aria-hidden="true" />}
      {icon === 'archive' && <IconArchive className="icon" aria-hidden="true" />}
      {icon === 'unarchive' && <IconUnarchive className="icon" aria-hidden="true" />}
      {icon === 'sort' && <IconSort className="icon" aria-hidden="true" />}
      {icon === 'check' && <IconCheck className="icon" aria-hidden="true" />}
      {icon === 'delete' && <IconDelete className="icon" aria-hidden="true" />}
      {icon === 'close' && <IconClose className="icon" aria-hidden="true" />}
      {name && <span>{name}</span>}
    </button>
  )
})

export default Button
