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

type BookmarkCardProps = {
  bookmarkData: Bookmark,
  openDialogModal: (bookmark: Bookmark, action: DialogAction) => void,
  togglePinnedBookmark: (id:string) => void
  addViewCount: (id:string) => void,
  getEditingBookmark: (bookmark: Bookmark) => void
}

const BookmarkCard = ({ bookmarkData, openDialogModal, getEditingBookmark, togglePinnedBookmark, addViewCount }: BookmarkCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const faviconSrc = resolveFavicon(bookmarkData.favicon);
  const [_isCopied, setIsCopied] = useState(false);

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

  const handleAction = (bookmark:Bookmark) => {
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

  return (
    <div className="bookmark-card">
        <div className="bookmark-card__header">
            <div className="flex">
                <div className="bookmark-card__logo">
                    <img src={faviconSrc} alt={`${bookmarkData.title} favicon`} />
                </div>
                <div className="bookmark-card__info">
                    <p className="fh-2-sb">{bookmarkData.title}</p>
                    <p className="fh-5 clr-100">{bookmarkData.url}</p>
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
                        <Button name="Visit" icon="visit" variant="tertiary" onClick={() => handleVisit(bookmarkData.id, bookmarkData.url)} />
                        <Button name="Copy URL" icon="copy" variant="tertiary" onClick={() => handleCopy(bookmarkData.url)} />
                        {bookmarkData.pinned ? <Button name="Unpin" icon="unpin" variant="tertiary" onClick={() => togglePinned(bookmarkData.id)} />
                        : <Button name="Pin" icon="pin" variant="tertiary" onClick={() => togglePinned(bookmarkData.id)} />}
                        <Button name="Edit" icon="edit" variant="tertiary" onClick={() => handleAction(bookmarkData)} />
                        {bookmarkData.isArchived ? (
                          <Button name="Unarchive" icon="archive" variant="tertiary" onClick={() => requestDialogAction('Unarchive')} />
                        ) : (
                          <Button name="Archive" icon="archive" variant="tertiary" onClick={() => requestDialogAction('Archive')} />
                        )}
                        {bookmarkData.isArchived &&
                          <Button name="Delete Permanently" icon="delete" variant="tertiary" onClick={() => requestDialogAction('Delete')} />
                        }
                    </div>
                   </FocusTrap>
                )}
            </div>
        </div>
        <div className="bookmark-card__body">
            <p className="ff-4-sb clr-100">{bookmarkData.description}</p>
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
