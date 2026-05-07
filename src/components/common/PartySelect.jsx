import React, { useRef, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { searchParties } from '../../api/endpoints.js';

const PartySelect = ({ name, value, partyOptions, setPartyOptions, onChange, readonly = false }) => {
  const debounceRef = useRef();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const processedValue = useMemo(() => {
    if (partyOptions.length === 0) {
      return value && typeof value === 'object' ? value : null;
    }

    if (value && typeof value === 'object' && value.id) {
      return partyOptions.find((option) => option.id === value.id) || null;
    }

    if (value) {
      return partyOptions.find((option) => option.id === value) || null;
    }

    return null;
  }, [value, partyOptions]);

  if (!debounceRef.current) {
    debounceRef.current = debounce((inputValue) => {
      if (inputValue.length < 2) {
        setPartyOptions([]);
        return;
      }

      searchParties(inputValue)
        .then((res) => {
          setPartyOptions(res.data.parties);
        })
        .catch((error) => {
          console.error('Error fetching parties:', error);
        });
    }, 300);
  }

  const handleInputChange = useCallback((inputValue) => {
    debounceRef.current(inputValue);
  }, []);

  const handleChange = (selectedOption) => {
    onChange(selectedOption);
    if (selectedOption && !partyOptions.some((option) => option.id === selectedOption.id)) {
      setPartyOptions((prevOptions) => [...prevOptions, selectedOption]);
    }
  };

  return <Select name={name} value={processedValue} options={partyOptions} getOptionLabel={(option) => option.company_name} getOptionValue={(option) => option.id} isClearable onInputChange={handleInputChange} onChange={handleChange} noOptionsMessage={() => 'Start typing to find parties'} isDisabled={readonly} />;
};

export default PartySelect;
