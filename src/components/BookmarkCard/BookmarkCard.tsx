import { useEffect, useId, useRef, useState } from "react";
import "./bookMarkCard.css";
import { FocusTrap } from 'focus-trap-react';
import Button from "../Buttons/Button";
import IconVisit from '../../assets/images/icon-eye.svg?react'
import IconTime from '../../assets/images/icon-time.svg?react'
import IconCalender from '../../assets/images/icon-calender.svg?react'
import IconPin from '../../assets/images/icon-pin.svg?react'
import type { Bookmark } from "../../types/bookmark";
import type { DialogAction } from "../DialogModal/DialogModal";
import {formatDate} from "../../utils/formatDate";
import { resolveFavicon } from "../../utils/resolveFavicon";

type ButtonIcon = 'visit' | 'copy' | 'unpin' | 'edit' | 'archive' | 'pin' | 'unarchive' | 'delete'

type BookmarkCardProps = {
  bookmarkData: Bookmark,
  openDialogModal: (bookmark: Bookmark, action: DialogAction) => void,
  togglePinnedBookmark: (id:string) => void
  addViewCount: (id:string) => void,
  getEditingBookmark: (bookmark: Bookmark) => void
}

type CardAction = {
  name: string
  icon?: ButtonIcon
  onClick: () => void
}

const BookmarkCard = ({ bookmarkData, openDialogModal, getEditingBookmark, togglePinnedBookmark, addViewCount }: BookmarkCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const faviconSrc = resolveFavicon(bookmarkData.favicon);
  const [_isCopied, setIsCopied] = useState(false);

  const handleCopy = async (textToCopy:string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      console.log('COPIED: ', textToCopy);
      setTimeout(() => setIsCopied(false), 2000); // Reset "Copied!" message after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    setIsMenuOpen(false);
  };

  const handleVisit = (id:string, urlToVisit:string) => {
    window.open(urlToVisit, '_blank', 'noopener,noreferrer');
    addViewCount(id);
    setIsMenuOpen(false);
  }

  const handleEditBookmark = (bookmark:Bookmark) => {
    getEditingBookmark(bookmark);
    setIsMenuOpen(false);
  };

  const requestDialogAction = (action: DialogAction) => {
    openDialogModal(bookmarkData, action)
    setIsMenuOpen(false);
  }

  const togglePinned = (id:string) => {
    togglePinnedBookmark(id);
    setIsMenuOpen(false);
  }

  const actions: CardAction[] = [
    { name: 'Visit', icon: 'visit', onClick: () => handleVisit(bookmarkData.id, bookmarkData.url) },
    { name: 'Copy URL', icon: 'copy', onClick: () => handleCopy(bookmarkData.url) },
    bookmarkData.pinned
      ? { name: 'Unpin', icon: 'unpin', onClick: () => togglePinned(bookmarkData.id) }
      : { name: 'Pin', icon: 'pin', onClick: () => togglePinned(bookmarkData.id) },
    { name: 'Edit', icon: 'edit', onClick: () => handleEditBookmark(bookmarkData) },
    bookmarkData.isArchived
      ? { name: 'Unarchive', icon: 'unarchive', onClick: () => requestDialogAction('Unarchive') }
      : { name: 'Archive', icon: 'archive', onClick: () => requestDialogAction('Archive') },
    { name: 'Delete', icon: 'delete', onClick: () => requestDialogAction('Delete') },
  ]
  

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  

  return (
    <div className="bookmark-card">
        <div className="bookmark-card__header">
            <div className="flex">
                <div className="bookmark-card__logo">
                    <img src={faviconSrc} alt={`${bookmarkData.title} favicon`} />
                </div>
                <div className="bookmark-card__info">
                    <p className="fh-2-sb">{bookmarkData.title}</p>
                    <p className="fh-5 bookmark-card__url">{bookmarkData.url}</p>
                </div>
            </div>
            <div className="bookmark-card__actions">
                <Button
                  ref={triggerRef}
                  icon="dots-vertical"
                  ariaLabel="Actions for bookmark"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  ariaExpanded={isMenuOpen}
                  ariaHaspopup="menu"
                  ariaControls={menuId}
                />
                {isMenuOpen && (
                    <FocusTrap>
                    <div className="bookmark-card__dropdown" id={menuId} role="menu" ref={menuRef}>
                    {actions.map((action) => (
                      <Button
                        key={action.name}
                        name={action.name}
                        icon={action.icon}
                        variant="tertiary"
                        onClick={action.onClick}
                      />
                    ))}
                    </div>
                   </FocusTrap>
                )}
            </div>
        </div>
        <div className="bookmark-card__body">
            <p className="ff-4-sb bookmark-card__description">{bookmarkData.description}</p>
            <div className="bookmark-card__tags">
                {bookmarkData.tags.map((tag:string) => {
                    return <span key={tag} className="ff-5 tag">{tag}</span>
                })}
            </div>
        </div>
        
        <div className="bookmark-card__footer">
            <div className="flex flex-center">
                <div className="footer-item ff-5"><IconVisit /><span>{bookmarkData.visitCount}</span></div>
                <div className="footer-item ff-5"><IconTime /><span>{formatDate(bookmarkData.createdAt)}</span></div>
                <div className="footer-item ff-5"><IconCalender /><span>{formatDate(bookmarkData.lastVisited)}</span></div>
            </div>
            {bookmarkData.pinned && <div className="pin"><IconPin /></div>}
        </div>
    </div>
  )
}

export default BookmarkCard
