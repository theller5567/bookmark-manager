import { clsx } from "clsx";
import { Link } from "react-router-dom";
import IconHome from '../../assets/images/icon-home.svg?react';
import IconArchive from  '../../assets/images/icon-archive.svg?react';
import InputField from "../Inputs/InputField";
import "./navItem.css";

type navItemProps = {
    checkbox?: boolean,
    icon?: 'home' | 'archive',
    name: string,
    numbered?: number,
    tag?: boolean
    active?: boolean
    checked?: boolean
    to?: string
    onCheckboxChange?: (name: string, checked: boolean) => void
}


const NavItem = ({name, checkbox, icon, numbered, tag, active, checked = false, to, onCheckboxChange}: navItemProps) => {
    const numberedCount = numbered || 0;

    const styles = clsx(
        'nav-item',
        checkbox && 'checkbox',
        icon === 'home' && 'home-icon',
        icon === 'archive' && 'archive-icon',
        numbered && 'numbered',
        tag && 'tag',
        (active || checked) && 'active'
    )
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target instanceof HTMLInputElement) {
            onCheckboxChange?.(name, event.target.checked);
        }
    }
    const content = (
      <>
        <div className="flex flex-center">
        {icon === 'home' && <IconHome className="icon home-icon" aria-hidden="true"/>}
        {icon === 'archive' && <IconArchive className="icon archive-icon" aria-hidden="true"/>}
        {checkbox && <InputField type={'checkbox'} checked={checked} onChange={handleCheckboxChange} ariaLabel={`Select ${name}`}/>}
        <span>{name}</span>
        </div>
        {numbered && <span className="numbered-count">{numberedCount}</span>}
      </>
    )

    if (to) {
      return (
        <Link className={styles} to={to}>
          {content}
        </Link>
      );
    }

  return (
    <div className={styles}>
        {content}
    </div>
  )
}

export default NavItem
