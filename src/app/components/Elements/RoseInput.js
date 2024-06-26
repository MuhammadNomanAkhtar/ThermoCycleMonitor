import React, { useRef, useEffect } from 'react';
import { Text, Input,} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

const RoseInput = props => {
  const refinput = useRef();
  useEffect(() => {
    const isFocus = props?.isFocus;
    if (isFocus == true) {
      refinput.current.focus();
    }
  }, [props]);
  return (
    <>
      <Input
        multiline={props.multiline}
        textStyle={{
          minHeight: props.multiline ? 60 : 0,
          width: props.width && props.width,
          color: '#000',
          maxHeight: props.maxHeight,
        }}
        style={[props.status ? styles.Required : styles.NotRequired]}
        placeholder={props.placeholder ? props.placeholder : ''}
        placeholderTextColor={props?.placeholderTextColor ? props?.placeholderTextColor : "#9ea9bd"}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
        status={props.status ? 'basic' : 'danger'}
        disabled={props.disabled ? props.disabled : false}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        keyboardType={props.keyboard ? props.keyboard : 'default'}
        accessoryRight={props.loader ? props.loader : null}
        onSubmitEditing={props.onSubmitEditing}
        caption={props.caption ? props.caption : null}
        ref={refinput}
        maxLength={props?.maxLength}
        defaultValue={props?.defaultValue ? props?.defaultValue : ''}
        returnKeyType={'next'}
        // {...props}
      />
      {props.status && (
        <Text style={{ marginTop: 5, marginLeft: 1, color: 'red', fontSize: 11 }}>
          {props.errorMessage}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  Required: {
    borderColor: 'red',
    backgroundColor: '#fff',
  },
  NotRequired: {
    borderColor: '#f3f3f3',
  },
});

export default RoseInput;
