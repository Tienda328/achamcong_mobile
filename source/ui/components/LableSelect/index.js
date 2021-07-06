import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
import { commonsConfigs as configs } from '../../../commons'
import Styles, { IMG } from './LabelSelectStyle';
import IconView from '../IconView';

const select = require('../../../assets/image/select.png')
const un_select = require('../../../assets/image/un_select.png')

class LabelSelect extends Component {
  // addIcon = {
  //   uri: IMG.addIcon
  // }
  static propTypes = {
    title: PropTypes.string,
    readOnly: PropTypes.bool,
    enable: PropTypes.bool,
    onConfirm: PropTypes.func,
    enableAddBtn: PropTypes.bool,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string
  }
  static defaultProps = {
    style: {},
    customStyle: {},
    title: ' ',
    enable: true,
    readOnly: false,
    onConfirm: () => { },
    enableAddBtn: true,
    confirmText: 'Đồng ý',
    cancelText: 'Hủy'
  }
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
    this.selectedList = [];
    this.toggleSelect = this.toggleSelect.bind(this);
    this.cancelSelect = this.cancelSelect.bind(this);
    this.confirmSelect = this.confirmSelect.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  setModalVisible(isVisible) {
    this.setState({ isModalVisible: isVisible });
  }
  cancelSelect() {
    this.selectedList = [];
    this.setModalVisible(false);
  }
  confirmSelect() {
    this.props.onConfirm(this.selectedList)
    this.selectedList = [];
    this.cancelSelect();
  }
  openModal() {
    if (!React.Children.toArray(this.props.children).filter(item => item.type === ModalItem).length) {
    }
    this.props.enable && !this.props.readOnly && this.setModalVisible(true);
  }
  toggleSelect(time) {
    let index = this.selectedList.findIndex(item => item === time);
    if (~index) { this.selectedList.splice(index, 1); }
    else { this.selectedList.push(time); }
  }
  render() {
    let {
      readOnly,
      enable,
      title,
      style,
      enableAddBtn,
      customStyle,
      confirmText,
      cancelText
    } = this.props;
    let selectedLabels = React.Children.toArray(this.props.children)
      .filter(item => item.type === Label)
      .map((child, index) => {
        return React.cloneElement(child, {
          enable: enable,
          readOnly: readOnly
        });
      });

    let modalItems = this.state.isModalVisible ? React.Children.toArray(this.props.children)
      .filter(item => item.type === ModalItem)
      .map((child, index) => {
        return React.cloneElement(child, {
          toggleSelect: this.toggleSelect
        });
      }) : null;

    return (
      <View style={[Styles.selectedView, style]}>
        {enable && !readOnly && enableAddBtn &&
          <TouchableOpacity
            style={[Styles.selectedItem, { backgroundColor: configs.colorMain, borderWidth: 0 }, Styles.addItem]}
            // underlayColor="transparent"
            onPress={this.openModal}>
            <Image
              style={Styles.addIcon}
              source={select}
              resizeMode="cover"
            />
          </TouchableOpacity>
        }
        {selectedLabels}
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => { }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={Styles.modalMask}
              activeOpacity={1}
              underlayColor="#00000077"
            // onPress={this.cancelSelect}
            >
              <View style={Styles.modalContainer}>
                <View style={[Styles.modal, customStyle.modal || {}]}>
                  <View style={Styles.title}><Text style={Styles.titleText}>{title}</Text></View>
                  <View style={Styles.scrollView}>
                    <ScrollView>
                      {modalItems}
                    </ScrollView>
                  </View>
                  <View style={[Styles.buttonView, customStyle.buttonView || {}]}>
                    <TouchableOpacity
                      underlayColor="transparent"
                      activeOpacity={0.8}
                      onPress={this.cancelSelect}>
                      <View style={[Styles.modalButton, customStyle.cancelButton || {}]}>
                        <Text style={[Styles.buttonText, customStyle.cancelText || {}]}>{cancelText}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      underlayColor="transparent"
                      activeOpacity={0.8}
                      onPress={this.confirmSelect}>
                      <View style={[Styles.modalButton, Styles.confirmButton, customStyle.confirmButton || {}]}>
                        <Text style={[Styles.buttonText, customStyle.confirmText || {}]}>{confirmText}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

class Label extends Component {
  // closeIcon = {
  //   uri: IMG.closeIcon
  // }
  static propTypes = {
    onCancel: PropTypes.func,
    readOnly: PropTypes.bool,
    enable: PropTypes.bool
  }
  static defaultProps = {
    onCancel: () => { },
    enable: true,
    readOnly: false,
    customStyle: {}
  }
  constructor(props) {
    super(props);
  }
  render() {
    let { enable, readOnly, onCancel, customStyle } = this.props;
    return (
      <View style={[Styles.selectedItem, !enable && Styles.disableColor]}>
        <Text style={[Styles.labelText, !enable && Styles.disableText, customStyle.text || {}]}
          numberOfLines={1} ellipsisMode="tail">{this.props.children}</Text>
        {enable && !readOnly && <TouchableOpacity
          style={Styles.closeContainer}
          underlayColor="transparent"
          activeOpacity={0.5}
          onPress={onCancel}>
          <View>
            {/* <Image
              style={Styles.closeIcon}
              source={un_select}
              resizeMode="cover" /> */}

            <IconView
              // style={Styles.closeIcon}
              color='gray'
              name={"cancel"}
              size={configs.sizeIcon12}
            />
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}

class ModalItem extends Component {
  static propTypes = {
    toggleSelect: PropTypes.func
  }
  static defaultProps = {
    customStyle: {}
  }
  constructor(props) {
    super(props);
    this.isSelected = false;
    this._toggleSelect = this._toggleSelect.bind(this);
  }
  _toggleSelect() {
    this.isSelected = !this.isSelected;
    this.forceUpdate();
    this.props.toggleSelect(this.props.data);
  }
  render() {
    let {
      customStyle
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={this._toggleSelect}>
        <View style={Styles.modalItem}>
          <Text
            style={[Styles.modalText, customStyle.modalText || {}]}
          // numberOfLines={1}
          // ellipsisMode="tail"
          >
            {this.props.children}
          </Text>
          <View style={[Styles.outerCircle, this.isSelected ? Styles.enableCircle : {}, customStyle.outerCircle || {}]}>
            {this.isSelected && <View style={[Styles.innerCircle, customStyle.innerCircle || {}]} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

LabelSelect.Label = Label;
LabelSelect.ModalItem = ModalItem;

export default LabelSelect;