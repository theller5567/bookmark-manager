import "./sidebar.css";
import NavItem from "../NavItem/NavItem";
import Logo from '../../assets/images/logo-dark-theme.svg?react'

type BookmarkPageMode = 'active' | 'archived'

type TagData = {
  tag: string,
  count: number
}

type SidebarProps = {
  currentMode: BookmarkPageMode,
  tagData: TagData[],
  selectedTags: string[],
  clearTags:() => void,
  onTagSelectionChange: (name: string, checked: boolean) => void
}

const Sidebar = ({ currentMode, tagData, selectedTags, clearTags, onTagSelectionChange }: SidebarProps) => {
  return (
    <aside className="sidebar">
        <div className="sidebar__header">
          <div className="logo">
            <Logo />
          </div>
        </div>
        <div className="sidebar__links">
          <NavItem name={'Home'} icon={'home'} active={currentMode === 'active'} to="/home" />
          <NavItem name={'Archive'} icon={'archive'} active={currentMode === 'archived'} to="/archived" />
        </div>
        <div className="sidebar__tags">
          <div className="flex flex-between-justify flex-start">
          <p className="fh-5-b clr-100">TAGS</p><button className="minimal fh-5 clr-100" onClick={clearTags}>Reset</button>
          </div>
          <ul>
            {tagData.map(({ tag, count }) => (
            <li key={tag}><NavItem
              key={tag}
              name={tag}
              numbered={count}
              checkbox
              checked={selectedTags.includes(tag)}
              onCheckboxChange={onTagSelectionChange}
            /></li>
          ))}
          </ul>
        </div>
    </aside>
  )
}

export default Sidebar
