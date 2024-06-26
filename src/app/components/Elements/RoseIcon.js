import React from 'react';
import {Button, Icon } from '@ui-kitten/components';
import {View, StyleSheet } from 'react-native';
import Colors from '../../../shared/constants/Colors';


const StarIcon = (props) => (
    <Icon {...props} name='star' />
);

const RoseIcon = props => {
   
    return (
        <View style={[props.container ? props.container : styles.controlContainer]}>
            <Button
                style={styles.button}
                status='control'
                appearance='outline'
                size='small'
                onPress={props.onPress}
                accessoryRight={props.icon}
                disabled={props.disabled}
            />
        </View>
    );
}

export default RoseIcon;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        margin: 0,
        borderWidth: 0,
        

    },
    controlContainer: {
        borderRadius: 5,
        margin: 2,
        borderWidth: 0,
        padding: 0,
        justifyContent: 'center',
        height: 35,
        width: 35,
        backgroundColor: Colors.primary,
    },
   
});