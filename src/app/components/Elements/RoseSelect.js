import React from 'react';
import { Text,Select, SelectItem } from '@ui-kitten/components';

const RoseSelect = props => {
  return (
    <>
      <Select
        accessoryRight={props?.accessoryRight ? props?.accessoryRight : null}
        value={props.getSelectValue(props.selectedTreaments, props.itemOptions)}
        multiSelect={props.multiSelect ? props.multiSelect : false}
        selectedIndex={props.selectedTreaments}
        disabled={props.disabled}
        status={props.status ? 'danger' : 'basic'}
        onSelect={index => {
          props.setSelectedTreatments(index);
        }}
        placeholder={props.placeholder}>
        {props.itemOptions.map((tag, index) => (
          <SelectItem key={index} title={tag.val} />
        ))}
      </Select>
      {props.status && (
        <Text style={{ marginTop: 5, marginLeft: 1, color: 'red', fontSize: 11 }}>
          {props.errorMessage}
        </Text>
      )}
    </>
  );
};

export default RoseSelect;
