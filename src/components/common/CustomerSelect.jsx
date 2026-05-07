import React, { useRef, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { searchCustomers } from '../../api/endpoints.js';

const CustomerSelect = ({ name, value, customerOptions, setCustomerOptions, onChange, readonly = false }) => {
  const debounceRef = useRef();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const processedValue = useMemo(() => {
    if (customerOptions.length === 0) {
      return value && typeof value === 'object' ? value : null;
    }

    if (value && typeof value === 'object' && value.id) {
      return customerOptions.find((option) => option.id === value.id) || null;
    }

    if (value) {
      return customerOptions.find((option) => option.id === value) || null;
    }

    return null;
  }, [value, customerOptions]);

  if (!debounceRef.current) {
    debounceRef.current = debounce((inputValue) => {
      if (inputValue.length < 2) {
        setCustomerOptions([]);
        return;
      }

      searchCustomers(inputValue)
        .then((res) => {
          setCustomerOptions(res.data.customers);
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });
    }, 300);
  }

  const handleInputChange = useCallback((inputValue) => {
    debounceRef.current(inputValue);
  }, []);

  const handleChange = (selectedOption) => {
    onChange(selectedOption);
    if (selectedOption && !customerOptions.some((option) => option.id === selectedOption.id)) {
      setCustomerOptions((prevOptions) => [...prevOptions, selectedOption]);
    }
  };

  return <Select name={name} value={processedValue} options={customerOptions} getOptionLabel={(option) => option.company_name} getOptionValue={(option) => option.id} isClearable onInputChange={handleInputChange} onChange={handleChange} noOptionsMessage={() => 'Start typing to find customers'} isDisabled={readonly} />;
};

export default CustomerSelect;
