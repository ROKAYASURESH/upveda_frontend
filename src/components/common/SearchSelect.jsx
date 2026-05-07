import React, { useRef, useCallback, useMemo } from 'react';
import Select from 'react-select';
import {
  searchRoleName,
  searchUserName,
  searchLastName,
  searchFirstName,
  searchChildUser,
} from '../../api/endpoints.js';

const SearchSelect = ({ name, type, value, options, setOptions, onChange, label = 'name', track_by = 'id', placeholder = 'Start typing to search', readonly = false, isMulti = false }) => {
  const debounceRef = useRef();

  const fetchConfig = useMemo(
    () => ({
      role_names: { endpoint: searchRoleName, dataKey: 'role_name' },
      usernames: { endpoint: searchUserName, dataKey: 'username' },
      last_names: { endpoint: searchLastName, dataKey: 'last_name' },
      first_names: { endpoint: searchFirstName, dataKey: 'first_name' },
      child_users: { endpoint: searchChildUser, dataKey: 'child_users' },
    }),
    []
  );

  const fetchOptions = useMemo(() => {
    const config = fetchConfig[type];
    if (!config) {
      console.error(`Invalid type: ${type}`);
      return () => Promise.reject(new Error('Invalid type'));
    }
    return config.endpoint;
  }, [type, fetchConfig]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const processedValue = useMemo(() => {
    if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return isMulti ? [] : null;
    }
    if (options.length === 0) {
      return isMulti ? (Array.isArray(value) ? value : []) : value && typeof value === 'object' ? value : null;
    }

    if (isMulti) {
      if (!Array.isArray(value)) return [];

      return value
        .map((val) => {
          if (typeof val === 'object' && val[track_by]) {
            return options.find((option) => option[track_by] === val[track_by]) || val;
          }
          return options.find((option) => option[track_by] === val) || null;
        })
        .filter(Boolean);
    }

    if (value && typeof value === 'object' && value[track_by]) {
      return options.find((option) => option[track_by] === value[track_by]) || null;
    }

    if (value) {
      return options.find((option) => option[track_by] === value) || null;
    }

    return null;
  }, [value, options, track_by, isMulti]);

  if (!debounceRef.current) {
    debounceRef.current = debounce((inputValue) => {
      if (inputValue.length < 2) {
        setOptions([]);
        return;
      }

      const config = fetchConfig[type];
      if (!config) {
        console.error(`Invalid type: ${type}`);
        return;
      }

      fetchOptions(inputValue)
        .then((res) => {
          setOptions(res.data[config.dataKey] || []);
        })
        .catch((error) => {
          console.error(`Error fetching ${type}s:`, error);
        });
    }, 300);
  }

  const handleInputChange = useCallback((inputValue) => {
    debounceRef.current(inputValue);
  }, []);

  const handleChange = (selectedOption) => {
    onChange(selectedOption);

    if (isMulti) {
      const newOptions = (selectedOption || []).filter((option) => !options.some((existing) => existing[track_by] === option[track_by]));

      if (newOptions.length > 0) {
        setOptions((prevOptions) => [...prevOptions, ...newOptions]);
      }
    } else if (selectedOption && !options.some((option) => option[track_by] === selectedOption[track_by])) {
      setOptions((prevOptions) => [...prevOptions, selectedOption]);
    }
  };

  return (
    <Select
      name={name}
      value={processedValue}
      options={options}
      getOptionLabel={(option) => option[label]}
      getOptionValue={(option) => option[track_by]}
      isClearable
      isMulti={isMulti}
      onInputChange={handleInputChange}
      onChange={handleChange}
      noOptionsMessage={() => placeholder}
      isDisabled={readonly}
      placeholder={placeholder}
    />
  );
};

export default SearchSelect;
