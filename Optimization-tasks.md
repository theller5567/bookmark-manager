# Optimization Tasks

Use this as a working cleanup checklist.

<p>
  <span style="color:#22c55e;"><strong>High impact</strong></span> |
  <span style="color:#f59e0b;"><strong>Medium impact</strong></span> |
  <span style="color:#60a5fa;"><strong>Architecture</strong></span> |
  <span style="color:#f472b6;"><strong>UI/CSS</strong></span>
</p>

## <span style="color:#22c55e;">High Impact</span>

- [x] Extract a shared `BookmarkForm` component
- [x] Extract bookmark mutations from `BookmarksPage.tsx` into a hook or helper
- [x] Clean up edit flow semantics in `bookmarkApi.ts`
- [x] Replace edited bookmarks in state instead of prepending filtered results if any edge cases remain

## <span style="color:#22c55e;">Component Cleanup</span>

- [x] Simplify `BookmarkCard.tsx`
- [x] Move bookmark card actions into a derived action list
- [x] Reduce menu/action logic inside `BookmarkCard.tsx`
- [ ] Extract a dedicated `BookmarkSortMenu` from `Bookmarks.tsx`
- [ ] Review `Bookmarks.tsx` and keep it presentation-focused

## <span style="color:#f59e0b;">Input System</span>

- [ ] Refactor `InputField.tsx`
- [ ] Decide between:
- [ ] Split into `TextInput`, `TextareaField`, `CheckboxField`, `SearchInput`
- [ ] Or keep `InputField` and reduce branching with shared wrappers
- [ ] Keep validation, accessibility, and help text patterns consistent

## <span style="color:#f59e0b;">Type Cleanup</span>

- [x] Keep a single source of truth for bookmark form value types
- [ ] Add dedicated form/edit payload types where useful
- [x] Centralize shared unions:
- [x] `SortOption`
- [x] `BookmarkPageMode`
- [ ] dialog action types
- [x] form error types

## <span style="color:#f472b6;">CSS Cleanup</span>

- [ ] Consolidate repeated colors into variables
- [ ] Consolidate repeated spacing into variables
- [ ] Consolidate repeated borders and shadows into variables
- [ ] Remove repeated font declarations
- [ ] Normalize focus states across inputs and buttons
- [ ] Normalize hover states across inputs and buttons
- [ ] Normalize invalid/error states across inputs and buttons
- [ ] Review `App.css` for raw repeated values
- [ ] Review `inputs.css` for dead or overlapping rules
- [ ] Review modal styles shared by add/edit/dialog flows

## <span style="color:#60a5fa;">Architecture</span>

- [x] Extract a shared `ModalShell`
- [x] Reuse `ModalShell` in `AddBookmark.tsx`
- [x] Reuse `ModalShell` in `EditBookmark.tsx`
- [x] Reuse `ModalShell` in `DialogModal.tsx`
- [x] Continue moving pure logic out of page files
- [x] Keep filtering/sorting/counting logic in utils
- [x] Keep state transitions in hooks/helpers
- [x] Keep rendering logic in components

## <span style="color:#60a5fa;">Recommended Next 3</span>

- [x] Shared `ModalShell`
- [x] Shared `BookmarkForm`
- [x] `useBookmarksState` hook

## Notes

- Goal: reduce duplication, especially in modal and bookmark mutation flows.
- Priority order: shared form, shared state helpers, smaller presentational components.
