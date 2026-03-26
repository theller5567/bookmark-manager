import Avatar from "../Avatar/Avatar"; 
import "./header.css";
import Button from "../Buttons/Button";
import InputField from "../Inputs/InputField";
import avatarImage from '../../assets/images/image-avatar.webp'

type headerProps = {
  searchQuery: string,
  name?: string,
  email?: string,
  onAddBookmark: () => void,
  onSearchChange: (value: string) => void
}

const Header = ({searchQuery, name, email, onAddBookmark, onSearchChange}:headerProps) => {
  const handleQuery = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSearchChange(event.target.value);
  }
  return (
    <header>
        <InputField type={'search'} value={searchQuery} onChange={handleQuery} />
        <div className="header-content">
            <Button name={'Add Bookmark'} size={"large"} icon={"add"} variant={"primary"} onClick={onAddBookmark} />
            <Avatar avatar={avatarImage} name={name} email={email} interactive />
        </div>
    </header>
  )
}

export default Header
