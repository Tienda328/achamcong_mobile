import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, Dimensions, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { BarChart, PieChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient';

const data = [
    {
        name: "Đi muộn, Về sớm",
        population: 14,
        color: 'red',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: 'Hợp lệ',
        population: 24,
        color: 'rgb(54, 162, 235)',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Nghỉ không lý do",
        population: 12,
        color: 'rgb(255, 206, 86)',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: 'Xin nghỉ',
        population: 52,
        color: 'rgb(75, 192, 192)',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: 'Xin đi muộn, về sớm',
        population: 12,
        color: "gray",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }
];

class DetailNghiPhepScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.backPressed = this.backPressed.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Chi tiết nghỉ phép"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.backPressed}>
                        {/* <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30, tintColor: 'black' }}
                        /> */}

                        <IconView
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                            color='black'
                            name={"left-arrow"}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        />
                    </TouchableOpacity>
                }
            >

                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    colors={['#ccffff', '#99ffff', '#4dffff']}
                    style={{ margin: 12, borderRadius: 8, elevation: 3 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <PieChart
                            data={data}
                            style={{ flex: 1 }}
                            width={Dimensions.get('window').width / 2}
                            height={Dimensions.get('window').width / 2}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "white",
                                backgroundGradientTo: "white",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(54,64,81, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            absolute
                            avoidFalseZero={true}
                            hasLegend={false}
                            paddingLeft={Dimensions.get("window").width / 8}
                        />

                        <View style={{ justifyContent: 'space-around', flex: 1 }}>
                            {data.map((dataItem) => (
                                <View style={{
                                    marginHorizontal: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }} key={dataItem.name}>
                                    <View style={{ backgroundColor: dataItem.color, width: 12, height: 12, borderRadius: 6 }} />
                                    {/* <Text style={styles.legendItemValue}>
                                        {dataItem.population
                                            ? dataItem[dataItem.population]
                                            : `${percentages[dataItem.name]}%`}
                                    </Text> */}

                                    <Text style={[styles.styleTitle, { fontSize: 12, marginLeft: 8 }]}>{dataItem.population + ' - ' + dataItem.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </LinearGradient>
            </BaseView>
        )
    }
}
export const scrollX = new Animated.Value(0);

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    styleTitleToolbarBase: {
        color: 'black',
        fontSize: 18,
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailNghiPhepScreen)