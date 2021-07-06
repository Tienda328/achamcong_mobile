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
    TouchableOpacity,
    Platform,
    Image
} from 'react-native'
import IconView from '../IconView'
import LinearGradient from 'react-native-linear-gradient';
import { commonsConfigs as configs } from '../../../commons'
import { models } from '../../../commons/model';

const logoDatViet = require("../../../assets/image/logodatviet.png")

class OffCanvas3D extends Component {
    constructor(props) {
        super(props)

        this._hardwareBackHandler = this._hardwareBackHandler.bind(this)

        this.state = {
            activityLeftPos: new Animated.Value(0),
            scaleSize: new Animated.Value(1.0),
            rotate: new Animated.Value(0),
            animationDuration: 500,
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
            inputRange: [0, 1],
            outputRange: ['0deg', Platform.OS === 'ios' ? '10deg' : '-10deg']
        })

        const staggeredAnimatedMenus = this.state.stagArr.map((index) => {
            return (
                <TouchableOpacity key={index} onPress={this._handlePress.bind(this, index)} style={{
                    borderBottomColor: 'white', borderBottomWidth: 0.5,
                    // backgroundColor: 'rgba(0,0,0,0.20)',
                    borderTopColor: 'white', borderTopWidth: (index === 0 ? 1 : 0)
                }}>
                    <Animated.View
                        style={{ transform: [{ translateX: this.state.animatedStagArr[index] }] }}>
                        <View style={styles.menuItemContainer}>
                            {this.state.menuItems[index].icon}
                            <Text style={[styles.menuItem, { ...this.props.menuTextStyles }]}>
                                {this.state.menuItems[index].title}
                            </Text>
                            {/* <IconView name="right-arrow1" size={20} color='#ffffff' /> */}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            )
        })

        // const colorsLinear = this.props.permission === 1 ? (models.getStatusAdmin() ? ['#6666ff', '#8080ff', '#ccccff'] : ['#888844', '#b2b266', '#c3c388']) : ['#6666ff', '#8080ff', '#ccccff']
        const colorsLinear = this.props.permission === 1 ? (models.getStatusAdmin() ? ['#24568f', '#2e6eb8', '#99bde6'] : ['#6600cc', '#8c1aff', '#b366ff']) : ['#24568f', '#2e6eb8', '#85afe0']

        return (
            <LinearGradient
                // colors={['#6666ff', '#8080ff', '#ccccff']}
                // colors={['#006699', '#0088cc', '#00aaff']}
                colors={colorsLinear}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 0.5, y: 1 }}
                // locations={[0, 0.1, 0.5]}

                style={[styles.offCanvasContainer, {
                    flex: 1,
                }]}>

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View style={styles.menuItemsContainer}>
                            {this.props.viewHead}
                            {staggeredAnimatedMenus}
                        </Animated.View>
                    </ScrollView>

                    {/* <Image
                        source={logoDatViet}
                        style={{ height: Dimensions.get('window').height/8, resizeMode: 'cover', width: '100%' }}
                    /> */}
                </View>

                <Animated.View
                    onStartShouldSetResponder={() => this.props.active}
                    onResponderTerminationRequest={() => true}
                    onResponderRelease={(evt) => this._gestureControl(evt)}
                    style={[styles.activityContainer, {
                        flex: 1,
                        transform: [
                            { translateX: this.state.activityLeftPos },
                            { scale: this.state.scaleSize },
                            { rotateY: rotateVal },
                            // { rotateY: "0deg" }
                        ]
                    }]}>

                    {this.state.menuItems[this.state.activeMenu].renderScene}
                </Animated.View>

            </LinearGradient>
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
            // if (locationX < 40 && pageX > 100) this.props.onMenuPress()
        } else {
            if (pageX) this.props.onMenuPress()
        }
    }

    // animate stuffs with hard coded values for fine tuning
    _animateStuffs() {
        const activityLeftPos = this.props.active ? 200 : 0
        const scaleSize = this.props.active ? .8 : 1
        const rotate = this.props.active ? 3 : 0
        const menuTranslateX = this.props.active ? 0 : -200

        Animated.parallel([
            Animated.timing(this.state.activityLeftPos, {
                toValue: activityLeftPos, duration: this.state.animationDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.scaleSize, {
                toValue: scaleSize, duration: this.state.animationDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.rotate, {
                toValue: rotate, duration: this.state.animationDuration,
                useNativeDriver: true
            }),
            Animated.stagger(50, this.state.stagArr.map((item) => {
                if (this.props.active) {
                    return Animated.timing(
                        this.state.animatedStagArr[item],
                        {
                            toValue: menuTranslateX,
                            duration: this.state.animationDuration,
                            delay: 300,
                            useNativeDriver: true
                        }
                    )
                } else {
                    return Animated.timing(
                        this.state.animatedStagArr[item],
                        {
                            toValue: menuTranslateX,
                            duration: this.state.animationDuration,
                            delay: 400,
                            useNativeDriver: true
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
    menuTextStyles: { color: 'white' },
    handleBackPress: true
}

export default OffCanvas3D

// structure stylesheet
const styles = StyleSheet.create({
    offCanvasContainer: {

    },
    menuItemsContainer: {
        paddingTop: 30
    },
    menuItemContainer: {
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuItem: {
        fontWeight: '500',
        paddingLeft: 12,
        paddingVertical: 15,
        fontSize: 15,
        flex: 1
    },
    activityContainer: {

    }
})