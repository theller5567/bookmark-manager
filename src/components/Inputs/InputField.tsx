import './inputs.css'
import IconSearch from '../../assets/images/icon-search.svg?react'

type inputProps = {
    type: 'search' | 'text' | 'password' | 'email' | 'textarea' | 'checkbox',
    id?: string,
    name?: string,
    ariaLabel?: string,
    ariaDescribedby?: string,
    ariaInvalid?: boolean,
    placeholder?: string,
    value?: string,
    checked?: boolean,
    required?: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const InputField = ({type, id, name, ariaLabel, ariaDescribedby, ariaInvalid, placeholder, value, checked, required, onChange}: inputProps) => {
  
  const renderTextareaChar = () => {
    if(type !== 'textarea'){
      return
    }
    const charLength = value?.split('').length;
    return charLength;
  }

  const renderInput = () => {
    switch (type) {
      case 'search':
        return (<div className="search-input">
                <IconSearch className="search-icon" />
                <input id={id} name={name} type="text" placeholder={placeholder ?? "Search by title..."} aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} value={value} onChange={onChange} required={required} />
              </div>);
      case 'checkbox':
        return (<input id={id} name={name} type="checkbox" aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} checked={checked} onChange={onChange} required={required} />);
      case 'text':
        return (<input id={id} name={name} type="text" placeholder={placeholder} aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} value={value} onChange={onChange} required={required} />);
      case 'textarea':
        return (<><textarea id={id} name={name} placeholder={placeholder} aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} value={value} onChange={onChange} required={required} /><span className="charlength input-charlength fh-5">{renderTextareaChar()}/280</span></>)
      case 'email':
        return (<input id={id} name={name} type="email" placeholder={placeholder} aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} value={value} onChange={onChange} required={required} />)
      case 'password':
        return (<input id={id} name={name} type="password" placeholder={placeholder} aria-label={ariaLabel} aria-describedby={ariaDescribedby} aria-invalid={ariaInvalid} value={value} onChange={onChange} required={required} />)
      default:
        console.error(`Unsupported input type: ${type}`);
    }
  }

  return (
    renderInput()
  )
}

export default InputField
