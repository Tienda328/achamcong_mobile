import React from "react"
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native"
import PropTypes from "prop-types"

class WiggleBox extends React.Component {
  constructor(props) {
    super(props)
    this.rotation = new Animated.ValueXY()
    this.bounce = new Animated.ValueXY({x: 0, y: 10})
  }

  triggerWiggle = () => {
    const { duration } = this.props
    Animated.sequence([
      Animated.timing(this.rotation, {
        toValue: -4,
        duration: duration
      }),
      Animated.timing(this.rotation, {
        toValue: 4,
        duration: duration
      }),
      Animated.timing(this.rotation, {
        toValue: -4,
        duration: duration
      }),
      Animated.timing(this.rotation, {
        toValue: 4,
        duration: duration
      }),
      Animated.timing(this.rotation, {
        toValue: 0,
        duration: duration
      })
    ]).start()
  }

  triggerBounce = () => {
    Animated.sequence([
      Animated.spring(this.bounce, {
        toValue: {x: 0, y: 0},
        velocity: 50,
        bounciness: 50
      })
    ]).start()
  }

  getWiggleStyle() {
    const rotation = this.rotation
    const rotate = rotation.x.interpolate({
      inputRange: [-50, 10, 50],
      outputRange: ['-50deg', '10deg', '50deg']
    })

    return {
      ...rotation.getLayout(),
      transform: [{ rotate }]
    }
  }

  getBounceStyle() {
    const bounce = this.bounce
    const translateY = bounce.y.interpolate({
      inputRange: [0, 10],
      outputRange: [0, -30]
    })

    return {
      ...bounce.getLayout(),
      transform: [{ translateY }]
    } 
  }

  componentDidMount() {
    const { active, type } = this.props

    if (active) {
      type === 'wiggle' ? this.triggerWiggle() : this.triggerBounce()
    }
  }

  renderActive = () => {
    const { handlePress, boxStyle } = this.props
    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={[boxStyle]}>{this.props.children}</View>
      </TouchableOpacity>
    )
  }

  renderInactive = () => {
    const { boxStyle } = this.props
    return <View style={[boxStyle]}>{this.props.children}</View>
  }

  render() {
    const { active, type } = this.props

    return (
      <Animated.View
        style={[styles.boxContainer, active ? (type === 'wiggle' ? this.getWiggleStyle() : this.getBounceStyle()) : null]}
      >
        {active ? this.renderActive() : this.renderInActive()}
      </Animated.View>
    )
  }
}

WiggleBox.defaultProps = {
  active: false,
  boxStyle: {},
  handlePress: () => {},
  duration: 100,
  type: 'wiggle'
}

WiggleBox.propTypes = {
  active: PropTypes.bool,
  boxStyle: PropTypes.object,
  handlePress: PropTypes.func,
  duration: PropTypes.number,
  type: PropTypes.string
}

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    margin: 10
  }
})

export default WiggleBox