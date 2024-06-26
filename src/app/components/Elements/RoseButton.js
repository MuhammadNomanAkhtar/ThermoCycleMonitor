import React from 'react';
import { Button, Spinner } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import Colors from '../../../shared/constants/Colors';




export


    const RoseButton = props => {

        const LoadingIndicator = (props) => (
            <View style={[props.style, styles.indicator]}>
                <Spinner status='control' size='small' />
            </View>
        );

        return (
            <View style={[styles.controlContainer, { width: props.width ? props.width : 150, backgroundColor: props.backgroundColor ? props.backgroundColor : Colors.primary, }]}>
                <Button
                    style={styles.button}
                    status='control'
                    appearance='outline'
                    onPress={props.onPress}
                    accessoryLeft={props.isLoading && LoadingIndicator}
                    disabled={props.disabled}
                >
                    {props.isLoading ? '' : props.label}
                </Button>
            </View>
        );
    }

export default RoseButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        margin: 0,
        borderWidth: 0,
        color: 'red'

    },
    controlContainer: {
        borderRadius: 5,
        margin: 2,
        borderWidth: 0,
        padding: 0,
        justifyContent: 'center',

    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});