import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Dimensions,
    Text,
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    ScrollView,
    BackHandler,
    StatusBar,
    Image,
    SafeAreaView,
} from 'react-native'
import { commonsConfigs as configs } from '../../../commons/index'
import LinearGradient from 'react-native-linear-gradient';
import ImageBackground from '../../components/ImageBackground'
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconView from '../IconView';

const icon_nen = require('../../../assets/image/icon_nen.jpeg')

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: configs.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class OffCanvas3D extends Component {
    constructor(props) {
        super(props)

        this._hardwareBackHandler = this._hardwareBackHandler.bind(this)

        this.state = {
            activityLeftPos: new Animated.Value(0),
            scaleSize: new Animated.Value(1.0),
            rotate: new Animated.Value(0),
            animationDuration: 600,
            stagArr: [],
            animatedStagArr: [],
            menuItems: this.props.menuItems,
            activeMenu: 0
        }
    }

    // staggered animation configuration for menu items
    componentDidMount() {
        let stagArrNew = []
        for (let i = 0; i < this.state.menuItems.length; i++) stagArrNew.push(i)
        this.setState({ stagArr: stagArrNew })

        let animatedStagArrNew = []
        stagArrNew.forEach((value) => {
            animatedStagArrNew[value] = new Animated.Value(0)
        })
        this.setState({ animatedStagArr: animatedStagArrNew })
    }

    // any update to component will fire the animation
    componentDidUpdate() {
        this._animateStuffs()

        if (this.props.handleBackPress && this.props.active) {
            BackHandler.addEventListener('hardwareBackPress', this._hardwareBackHandler)
        }

        if (this.props.handleBackPress && !this.props.active) {
            BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackHandler)
        }
    }

    render() {
        const rotateVal = this.state.rotate.interpolate({
            inputRange: [2, 2],
            outputRange: ['0deg', '-30deg']
        })

        const staggeredAnimatedMenus = this.state.stagArr.map((index) => {
            return (
                <TouchableOpacity key={index} onPress={this._handlePress.bind(this, index)} style={{
                    borderBottomColor: 'white', borderBottomWidth: 1, 
                    // backgroundColor: 'rgba(0,0,0,0.20)',
                    borderTopColor: 'white', borderTopWidth: (index === 0 ? 1 : 0)
                }}>
                    <Animated.View
                        style={{ transform: [{ translateX: this.state.animatedStagArr[index] }] }}>
                        <View style={styles.menuItemContainer}>
                            {this.state.menuItems[index].icon}
                            <Text style={[styles.menuItem]}>
                                {this.state.menuItems[index].title}
                            </Text>
                            <IconView name="right-arrow1" size={20} color='#ffffff' />
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            )
        })

        return (
            <View style={[styles.offCanvasContainer, {
                flex: 1,
                // backgroundColor: this.props.backgroundColor
                // backgroundColor: 'rgba(0,0,0,0.20)',
                // position: 'relative'
            }]}>
                {/* <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 180 }}>
                    <Image source={icon_nen_bau_troi} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View> */}

                <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: Dimensions.get('window').height }}>
                    <Image source={icon_nen} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}>

                    <Animated.View style={styles.menuItemsContainer}>
                        {this.props.viewHead}
                        {staggeredAnimatedMenus}
                    </Animated.View>
                </ScrollView>

                <Animated.View
                    onStartShouldSetResponder={() => true}
                    onResponderTerminationRequest={() => true}
                    onResponderRelease={(evt) => this._gestureControl(evt)}
                    style={[styles.activityContainer, {
                        flex: 1,
                        backgroundColor: 'white',
                        transform: [
                            { translateX: this.state.activityLeftPos },
                            { scale: this.state.scaleSize },
                            { rotateY: rotateVal }
                        ]
                    }]}>

                    {this.state.menuItems[this.state.activeMenu].renderScene}
                </Animated.View>

            </View>
        )
    }

    // press on any menu item, render the respective scene
    _handlePress(index) {
        this.setState({ activeMenu: index })
        this.props.onMenuPress(index)
    }

    _hardwareBackHandler() {
        this.props.onMenuPress()
        return true
    }

    // control swipe left or right reveal for menu
    _gestureControl(evt) {
        const { locationX, pageX } = evt.nativeEvent

        if (!this.props.active) {
            if (locationX < 40 && pageX > 100) this.props.onMenuPress()
        } else {
            if (pageX) this.props.onMenuPress()
        }
    }

    // animate stuffs with hard coded values for fine tuning
    _animateStuffs() {
        const activityLeftPos = this.props.active ? 250 : 0
        const scaleSize = this.props.active ? .8 : 1
        const rotate = this.props.active ? 1 : 0
        const menuTranslateX = this.props.active ? 0 : -250

        Animated.parallel([
            Animated.timing(this.state.activityLeftPos, { toValue: activityLeftPos, duration: this.state.animationDuration }),
            Animated.timing(this.state.scaleSize, { toValue: scaleSize, duration: this.state.animationDuration }),
            Animated.timing(this.state.rotate, { toValue: rotate, duration: this.state.animationDuration }),
            Animated.stagger(50, this.state.stagArr.map((item) => {
                if (this.props.active) {
                    return Animated.timing(
                        this.state.animatedStagArr[item],
                        {
                            toValue: menuTranslateX,
                            duration: this.state.animationDuration,
                            delay: 250
                        }
                    )
                } else {
                    return Animated.timing(
                        this.state.animatedStagArr[item],
                        {
                            toValue: menuTranslateX,
                            duration: this.state.animationDuration,
                            delay: 400
                        }
                    )
                }
            }))
        ])
            .start()
    }
}

// validate props
OffCanvas3D.propTypes = {
    active: PropTypes.bool.isRequired,
    onMenuPress: PropTypes.func.isRequired,
    menuItems: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string,
    menuTextStyles: PropTypes.object,
    handleBackPress: PropTypes.bool
}

// set default props
OffCanvas3D.defaultProps = {
    backgroundColor: '#222222',
    menuTextStyles: { color: 'black' },
    handleBackPress: true
}

export default OffCanvas3D

// structure stylesheet
const styles = StyleSheet.create({
    offCanvasContainer: {

    },
    menuItemsContainer: {
        position: 'relative',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width * 3 / 4 + 5
    },
    menuItemContainer: {
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItem: {
        flex: 1,
        fontWeight: 'bold',
        paddingLeft: 12,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'white',
        fontFamily: 'Lato-Regular'
    },
    activityContainer: {

    }
})