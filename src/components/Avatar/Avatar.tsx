import { useEffect, useId, useRef, useState } from 'react'
import { clsx } from 'clsx'
import IconTheme from '../../assets/images/icon-theme.svg?react'
import IconLightTheme from '../../assets/images/icon-light-theme.svg?react'
import IconDarkTheme from '../../assets/images/icon-dark-theme.svg?react'
import IconLogout from '../../assets/images/icon-logout.svg?react'
import { useTheme } from '../../context/ThemeContext'
import './avatar.css'

type AvatarProps = {
  avatar: string,
  name?: string,
  email?: string,
  interactive?: boolean
}

const Avatar = ({ avatar, name, email, interactive = false }: AvatarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const menuId = useId();

  useEffect(() => {
    if (!interactive || !isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [interactive, isOpen]);

  const avatarStyles = clsx(
    'avatar',
    interactive && 'avatar--button',
    isOpen && 'avatar--expanded'
  );



  if (!interactive) {
    return (
      <div className={avatarStyles}>
        <img src={avatar} alt="User avatar" className="avatar__image" />
      </div>
    );
  }

  return (
    <div className="avatar-menu" ref={wrapperRef}>
      <button
        className={avatarStyles}
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img src={avatar} alt={`${name} avatar`} className="avatar__image" />
      </button>

      {isOpen && (
        <div className="avatar-dropdown" id={menuId} role="menu">
          <div className="avatar-dropdown__section avatar-dropdown__profile">
            <div className="avatar avatar--static">
              <img src={avatar} alt="" className="avatar__image" />
            </div>
            <div className="avatar-dropdown__details">
              <p className="fh-4 avatar-dropdown__name">{name}</p>
              <p className="fh-4-sb avatar-dropdown__email">{email}</p>
            </div>
          </div>

          <div className="avatar-dropdown__section avatar-dropdown__row">
            <div className="avatar-dropdown__label">
              <IconTheme className="icon" aria-hidden="true" />
              <span className='fh-4-sb'>Theme</span>
            </div>
            <div className="theme-toggle" aria-label="Theme options">
              <button type="button" onClick={() => setTheme('light')} className={`${theme === 'light' ? 'theme-toggle__button--active' : ''} theme-toggle__button`} aria-label="Light theme">
                <IconLightTheme className="icon" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setTheme('dark')} className={`${theme === 'dark' ? 'theme-toggle__button--active' : ''} theme-toggle__button`} aria-label="Dark theme">
                <IconDarkTheme className="icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <button type="button" className="avatar-dropdown__section avatar-dropdown__action" role="menuitem">
            <IconLogout className="icon" aria-hidden="true" />
            <span className='fh-4-sb'>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Avatar
