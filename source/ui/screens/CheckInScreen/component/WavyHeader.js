import React from 'react';
import { View, Dimensions } from 'react-native'
import Svg, { Path, } from 'react-native-svg';

const WIDTH_SCREEN = Dimensions.get('window').width
export default function WavyHeader({ customStyles, content }) {
    return (
        <View style={[customStyles]}>
            <Svg
                height={'100%'}
                width={WIDTH_SCREEN}
                viewBox="0 0 1440 320"
                xmlns="http://www.w3.org/2000/svg"
                style={{backgroundColor: 'gray'}}
            >
                <Path
                    fill="#059488"
                    d="M0,160L80,138.7C160,117,320,75,480,90.7C640,107,800,181,960,192C1120,203,1280,149,1360,122.7L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                />
            </Svg>
        </View>
    );
}