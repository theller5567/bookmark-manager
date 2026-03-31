import "./sidebar.css";
import NavItem from "../NavItem/NavItem";
import LogoLight from '../../assets/images/logo-light-theme.svg?react'
import LogoDark from '../../assets/images/logo-dark-theme.svg?react'
import { useTheme } from '../../context/ThemeContext'

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
  const { theme } = useTheme()
  return (
    <aside className="sidebar">
        <div className="sidebar__header">
          <div className="logo">
            {theme === 'dark' ? <LogoDark /> : <LogoLight />}
          </div>
        </div>
        <div className="sidebar__links">
          <NavItem name={'Home'} icon={'home'} active={currentMode === 'active'} to="/home" />
          <NavItem name={'Archive'} icon={'archive'} active={currentMode === 'archived'} to="/archived" />
        </div>
        <div className="sidebar__tags">
          <div className="flex flex-between-justify flex-start">
          <p className="fh-5-b sidebar__tags-label">TAGS</p><button className="minimal fh-5 sidebar__reset" onClick={clearTags}>Reset</button>
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
