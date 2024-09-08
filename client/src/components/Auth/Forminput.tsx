import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ChangeEventHandler } from 'react';
import './styles.scss'; 

interface FormInputProps {
  placeholder: string;
  name: string;
  type: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  icon: IconProp;
  id: string; 
}

const FormInput: React.FC<FormInputProps> = ({ placeholder, name, type, handleChange, icon, id }) => {
  return (
    <div className="form-floating mb-3">
      <FontAwesomeIcon icon={icon} className='form-control-icon' />
      <input
        placeholder={placeholder}
        className="form-control"
        id={id} 
        name={name}
        type={type}
        onChange={handleChange}
      />
      <label htmlFor={id}>{placeholder}</label> 
    </div>
  );
};

export default FormInput;
