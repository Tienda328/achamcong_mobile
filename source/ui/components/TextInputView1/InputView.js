import PropTypes from 'prop-types';
import React, { PureComponent, Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import IconView from '../IconView';
import { commonsConfigs as configs } from '../../../commons';

export default class InputView extends Component {
  inputRef = React.createRef();
  constructor(props) {
    super(props);
    this.eventCount = 0;
    this.state = {
      value: props.value,
      isPlaceholder: props.value && props.value.length > 0 ? false : true,
    };
    this.onChangeTextInput = this.onChangeTextInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.checkShowWarning = this.checkShowWarning.bind(this);
  }

  checkShowWarning = () => {
    let { id, onBlur, isSubmit, editable } = this.props;
    if (onBlur && isSubmit) {
      return !onBlur(this.state.value, id);
    }
    return false;
  };

  onChangeTextInput = (event) => {
    let convertText = event;
    if (this.props.onHandlerTextInput) {
      convertText = this.props.onHandlerTextInput(convertText, this.props.id);
    }
    this.setState((preState) => ({
      value: (preState.value = convertText),
      isPlaceholder: (preState.isPlaceholder =
        convertText && convertText.length > 0 ? false : true),
    }));
    if (this.props.onChangeText) {
      this.props.onChangeText(this.props.id, convertText);
    }
  };

  onChange = (event) => {
    let text = event.nativeEvent.text;
    this.eventCount = event.nativeEvent.eventCount;
  };

  componentWillReceiveProps(nextProps) {
    this.setState((preState) => ({
      value: (preState.value = nextProps.value),
      isPlaceholder: (preState.isPlaceholder =
        nextProps.value && nextProps.value.length > 0 ? false : true),
    }));
  }

  getWarningElement = (isWarning) => {
    const {
      messageWarning,
      styleWarning,
      styleMessage,
      onPressMessage,
      iconMessages,
    } = this.props;
    let style = [styles.styleWarning, styleWarning];
    let styleTextMessage = [styles.styleMessage, styleMessage];
    if (messageWarning && isWarning) {
      return messageWarning.props ? (
        messageWarning.props
      ) : (
        <View style={style} onStartShouldSetResponder={onPressMessage}>
          {iconMessages}
          <Text style={styleTextMessage}>{messageWarning}</Text>
        </View>
      );
    }
  };

  render() {
    const {
      style,
      styleTextInputElement,
      styleInput,
      leftElement,
      rightElement,
      labelUnit,
      styleUnit,
      styleLabelUnit,
      placeholderTextColor,
      isCleared,
      onPressText,
      //////
      isRequired,
      onPressIconLeft,
      iconLeft,
      editable = true,
      textTitle,
      maxLength = null,
    } = this.props;
    const { value, isPlaceholder } = this.state;
    let isWarning = this.checkShowWarning();
    let styleContainer = [styles.style, style];
    let styleContainerTextInput = [
      styles.styleTextInputElement,
      styleTextInputElement,
    ];
    let styleTextInput = [styles.styleInput, styleInput];
    let styleContainerUnit = [styles.styleUnit, styleUnit];
    let labelUnitStyle = [styles.styleLabelUnit, styleLabelUnit];
    let styleTextTitle = [styles.styleTextTitle, styleTextTitle];
    let colorHintText = placeholderTextColor || configs.colorHintText;
    let warningElement = this.getWarningElement(isWarning);
    /////////////
    let stylesIconLeft = [styles.stylesIconLeft, this.props.stylesIconLeft];
    let disableOnPress = onPressText ? false : true;
    let colorIcon =
      stylesIconLeft[1] && stylesIconLeft[1].color
        ? stylesIconLeft[1].color
        : configs.colorIcon;
    return (
      <View style={styleContainer}>
        {textTitle && <Text style={[styleTextTitle]}>{textTitle}</Text>}
        <View style={styleContainerTextInput}>
          {iconLeft && (
            <IconView
              isRequiredField={isRequired}
              onPress={onPressIconLeft}
              style={[stylesIconLeft, { height: '100%' }]}
              name={iconLeft}
              size={configs.sizeIcon16}
              color={colorIcon}
            />
          )}
          {leftElement}
          <TouchableOpacity
            style={{ flex: 1 }}
            disabled={disableOnPress}
            onPress={() => {
              onPressText && onPressText(this.props.id, value);
            }}>
            <TextInput
              {...this.props}
              onTouchStart={() => {
                onPressText && onPressText(this.props.id, value);
              }}
              style={styleTextInput}
              ref={this.props.inputRef}
              onChangeText={this.onChangeTextInput}
              onChange={this.onChange}
              value={value}
              editable={editable}
              maxLength={maxLength}
              keyboardType={
                this.props.keyboardType ? this.props.keyboardType : 'default'
              }
              underlineColorAndroid={
                this.props.underlineColorAndroid || 'transparent'
              }
              placeholderTextColor={colorHintText}
            />
          </TouchableOpacity>
          {labelUnit && (
            <View style={styleContainerUnit}>
              <Text style={labelUnitStyle}>{labelUnit}</Text>
            </View>
          )}
          {isCleared && !isPlaceholder && (
            <IconView
              onPress={() => this.onChangeTextInput('')}
              style={[styles.styleIconCleared, this.props.styleIconCleared]}
              name={'cancel'}
              size={configs.sizeIcon14}
              color={configs.colorIcon}
            />
          )}
          {rightElement}
        </View>
        {warningElement}
      </View>
    );
  }
}

InputView.propTypes = {
  iconCleaned: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  iconLeft: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),

  stylesIconLeft: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),

  iconRight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  iconMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

InputView.defaultProps = {
  colorIcon: configs.colorIcon,
  sizeIcon: configs.sizeIcon16,
  placeholderTextColor: configs.colorHintText,
};

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'transparent',
  },

  styleTextInputElement: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: configs.borderRadius4,
    borderColor: configs.colorBorderInput,
    borderWidth: configs.borderWidthInput,
  },

  styleInput: {
    // flex: 1,
    color: configs.colorText,
    backgroundColor: 'white',
    fontSize: configs.fontSize14,
    flexDirection: 'row',
    borderRadius: configs.borderRadius4,
    paddingLeft: 5,
    paddingVertical: 2,
  },

  stylesIconLeft: {
    backgroundColor: configs.bgIconInput,
    width: configs.widthIconInput,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: configs.borderRadius4,
    borderBottomLeftRadius: configs.borderRadius4,
    color: configs.colorMain,
  },

  styleIconCleared: {
    width: configs.widthIconInput,
    height: '100%',
    borderRadius: configs.borderRadius4,
    justifyContent: 'center',
    alignItems: 'center',
    color: configs.colorMain,
  },

  styleUnit: {
    height: '100%',
    minWidth: 30,
    justifyContent: 'center',
    borderTopRightRadius: configs.borderRadius4,
    borderBottomRightRadius: configs.borderRadius4,
  },

  styleLabelUnit: {
    fontSize: configs.fontSize12,
    fontFamily: 'Lato-Regular',
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  styleWarning: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleMessage: {
    color: 'red',
    fontSize: 10,
    fontStyle: 'italic',
  },
  styleTextTitle: {
    fontFamily: 'Lato-Regular',
    // color: 'black',
    fontSize: configs.fontSize10,
    fontStyle: 'italic',
    color: 'gray',
    marginBottom: 2,
  },
});
