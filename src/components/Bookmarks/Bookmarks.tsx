import { useState, useEffect, useId, useRef } from "react";
import BookmarkCard from "../BookmarkCard/BookmarkCard";
import Button from "../Buttons/Button";
import type { Bookmark } from "../../types/bookmark";
import type { DialogAction } from "../DialogModal/DialogModal";
import "./bookmarks.css";

type SortOption = 'default' | 'recently-added' | 'recently-visited' | 'most-visited';

type BookmarkProps = {
  title: string,
  bookmarks: Bookmark[],
  sortOption: SortOption,
  openDialogModal: (bookmark: Bookmark, action: DialogAction) => void,
  getEditingBookmark: (bookmark: Bookmark) => void,
  togglePinnedBookmark: (id:string) => void,
  addViewCount: (id:string) => void,
  setSortOption: (option: SortOption) => void
}
const Bookmarks = ({title, bookmarks, sortOption, setSortOption, openDialogModal, getEditingBookmark, togglePinnedBookmark, addViewCount}:BookmarkProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const handleSortSelect = (sortOption: SortOption) => {
    setSortOption(sortOption);
  };

  return (
    <div className="bookmarks__container">
      <div className="bookmarks__header">
        <h1 className="fh-1">{title}</h1>
        <span className="bookmarks__sortby">
          <Button 
          ref={triggerRef}
          variant="primary" 
          icon="sort"
          dropdown 
          name="Sort by"
          onClick={() => setIsMenuOpen((open) => !open)}
          ariaExpanded={isMenuOpen}
          ariaHaspopup="menu"
          ariaControls={menuId} />
          {isMenuOpen && (
              <div className="sortby__dropdown" id={menuId} role="menu" ref={menuRef}>
                  <Button
                    name="Default"
                    icon="check"
                    iconHidden={sortOption !== 'default'}
                    iconPosition="right"
                    variant="tertiary"
                    onClick={() => handleSortSelect('default')}
                  />
                  <Button
                    name="Recently added"
                    icon="check"
                    iconHidden={sortOption !== 'recently-added'}
                    iconPosition="right"
                    variant="tertiary"
                    onClick={() => handleSortSelect('recently-added')}
                  />
                  <Button
                    name="Recently visited"
                    icon="check"
                    iconHidden={sortOption !== 'recently-visited'}
                    iconPosition="right"
                    variant="tertiary"
                    onClick={() => handleSortSelect('recently-visited')}
                  />
                  <Button
                    name="Most visited"
                    icon="check"
                    iconHidden={sortOption !== 'most-visited'}
                    iconPosition="right"
                    variant="tertiary"
                    onClick={() => handleSortSelect('most-visited')}
                  />
              </div>
          )}
        </span>
      </div>
      <div className="bookmarks-grid">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmarkData={bookmark}
            openDialogModal={openDialogModal}
            addViewCount={addViewCount}
            togglePinnedBookmark={togglePinnedBookmark}
            getEditingBookmark={getEditingBookmark}
          />
        ))}
      </div>
    </div>
  )
}

export default Bookmarks
