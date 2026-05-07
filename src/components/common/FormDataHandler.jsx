import { useState } from 'react';

const FormDataHandler = (initialState = {}) => {
  const [form, setForm] = useState(initialState);
  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (newValue, actionMeta) => {
    const { name } = actionMeta;
    setForm((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };
  const handleCustomerChange = (selectedOption) => {
    if (selectedOption) {
      setForm((prev) => ({
        ...prev,
        customer_name: selectedOption.contact_name || '',
        customer_contact_no: selectedOption.mobile || '',
        customer_address: selectedOption.address || '',
        customer: selectedOption || '',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        customer_name: '',
        customer_contact_no: '',
        customer_address: '',
        customer: '',
      }));
    }
  };
  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };
  const handlePartyChange = (selectedOption) => {
    if (selectedOption) {
      setForm((prev) => ({
        ...prev,
        contact_name: selectedOption.contact_name || '',
        contact_no: selectedOption.mobile_no || '',
        address: selectedOption.address || '',
        party: selectedOption || '',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        contact_name: '',
        contact_no: '',
        address: '',
        party: '',
      }));
    }
  };

  return { form, setForm, handleChange, handleSelectChange, handleFileChange, handleCustomerChange, handlePartyChange };
};

export default FormDataHandler;
