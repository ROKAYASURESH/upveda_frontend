import React, { useMemo } from 'react';
import Select from 'react-select';

const CustomSelect = ({
  name,
  value,
  options = [],
  onChange,
  label = 'name',
  track_by = 'id',
  isClearable = true,
  isSearchable = true,
  isMulti = false,
  required = false,
  readonly = false,
  labelFormatter = null,
  placeholder = 'Select...',
  isLoading = false,
  menuPlacement = 'auto',
  noOptionsMessage = () => 'No options available',
  className = '',
  ...props
}) => {
  const processedValue = useMemo(() => {
    if (value == null) return isMulti ? [] : null;

    if (!isMulti) {
      return typeof value === 'object' ? value : options.find((opt) => opt[track_by] === value);
    }

    return Array.isArray(value) ? value.map((v) => (typeof v === 'object' ? v : options.find((opt) => opt[track_by] === v))).filter(Boolean) : [];
  }, [value, options, isMulti, track_by]);

  const handleChange = (selected) => {
    onChange(selected || (isMulti ? [] : null), { name });
  };

  const getLabel = (option) => labelFormatter?.(option) ?? option[label];

  return (
    <Select
      id={name}
      name={name}
      value={processedValue}
      options={options}
      getOptionLabel={getLabel}
      getOptionValue={(opt) => opt[track_by]}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isMulti={isMulti}
      required={required}
      isDisabled={readonly}
      closeMenuOnSelect={!isMulti}
      placeholder={placeholder}
      isLoading={isLoading}
      menuPlacement={menuPlacement}
      noOptionsMessage={noOptionsMessage}
      classNames={className}
      {...props}
    />
  );
};

export default React.memo(CustomSelect);
