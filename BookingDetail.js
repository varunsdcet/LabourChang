import React, {Component} from 'react';
import { StyleSheet,Text,TextInput, View,Image ,Alert,FlatList,Dimensions ,TouchableOpacity,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
import { TextField } from 'react-native-material-textfield';
type Props = {};
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import stringsoflanguages from './Local';
import axios from 'react-native-axios';
const GLOBAL = require('./Global');
import DateTimePicker from "react-native-modal-datetime-picker";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Dropdown } from 'react-native-material-dropdown';
var moment = require('moment');
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Dialog, {DialogContent} from "react-native-popup-dialog";
import MaterialTabs from 'react-native-material-tabs';
var type = 0;
var count:'';
var tomorrow;
export default class BookingDetail extends Component {
    _menu = null;
    state = {
        name :'',
        email:'',
        phone :'',
        company :'',
        selectedTab:0,
        data:[],
        isDateTimePickerVisible: false,
        startDate:'',
        endDate:'',
        date :new Date(),
        mystart :'',
        value:1,
        values:1,
        visible:false,
        visibles:false,
        pop:'',
        done:false,



    };
    showDateTimePicker = (types) => {
        type =  types

        if (type == 0){
            var d = new Date();
            d.setDate(d.getDate() + 10);
            this.setState({date:d})
        }else{
            this.setState({date:this.state.mystart})

        }

        this.setState({ isDateTimePickerVisible: true });
    };
    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        if (type == 0){
            this.setState({mystart:date})
            this.setState({ startDate: date.toString() });
        }else{
            this.setState({ endDate: date.toString() });
        }

        this.hideDateTimePicker();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null,
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }

    getIndex = (index) => {

        GLOBAL.categoryid = this.state.data[index].id
        this.props.navigation.push('NewCate')
    }
    loadHome(selectes)
    {

        this.showLoading()
        var self=this;
        var url = GLOBAL.BASE_URL + 'assign_contractor';
        axios.post(url, {
            id: GLOBAL.bookingArray.id,


        })
            .then(function (response) {

                self.myCallbackFunctions(response.data)

            })
            .catch(function (error) {
                alert(error)
                //  self.myCallbackFunction()

            });
    }

    hideLoading() {
        this.setState({loading: false})
    }

    getSelection = (index) => {



        for(let i = 0; i < 2; i++){

            this.state.moviesList[i].selected = "";

        }

        this.setState({moviesList:this.state.moviesList})

        let indexs = this.state.moviesList;
        let targetPost = this.state.moviesList[index];
        if (targetPost.selected == ''){
            targetPost.selected = 'Y'
        }else{
            targetPost.selected = ''
        }
        indexs[index] = targetPost
        this.setState({moviesList:indexs})


    }

    _handlePresss =()=> {
        this.setState({visible:false})
        this.setState({done:true})



    }
    getSelections = (index) =>{
        this.setState({visibles:false})
        this.props.navigation.navigate('CreateRequest')
    }

    showLoading() {
        this.setState({loading: true})
    }


    myCallbackFunctionss = (res) => {

        this.hideLoading()
        if (res.status == 200){

            GLOBAL.requestid = res.request_id
            this.props.navigation.navigate('SucessBooking')

        }
        else{
            alert(stringsoflanguages.unable)
        }

    }

    myCallbackFunctionss = (res) => {


        this.hideLoading()
        if (res.status == 200){
          this.props.navigation.goBack()

        }
        else{
            alert(stringsoflanguages.unable)
        }

    }

    myCallbackFunctions = (res) => {
        alert(JSON.stringify(res))
       


        this.hideLoading()
        if (res.status == 200){
            this.setState({data:res.data})

        }
        else{
            alert(stringsoflanguages.unable)
        }

    }

    componentDidMount(){
        this.loadHome(0)




        var no = GLOBAL.bookingArray.no_labour

        if (no == ''){

        }else{
            var res = no.split(",")
            if (res.length == 1){
                count = res[0]
            }else{
                count = parseInt(res[0]) + parseInt(res[1])
            }
        }
        //  tomorrow = new Date();
        //  tomorrow = moment(tomorrow).add(1, 'day').format('yyyy-MM-dd\'T\'HH:mm:ss.SSSz')
        // const myDate = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss").toDate();
        //  alert(myDate)
        //   this.setState({date:myDate})
    }
    _handlePress() {



        if (this.state.done == true){

            var cid = '';
            var nol = '';

            for(let i = 0; i < GLOBAL.categoryArray.length; i++) {
                cid = cid + GLOBAL.categoryArray[i].id + ','
                nol = nol + GLOBAL.categoryArray[i].no_of_labour + ','
            }
            cid = cid.slice(0, -1);
            nol = nol.slice(0, -1);

            var self=this;
            var url = GLOBAL.BASE_URL + 'company_request';
            axios.post(url, {
                user_id: GLOBAL.userID,
                service_contract:this.state.name,
                start_date :this.state.startDate,
                end_date:this.state.endDate,
                accomodation_provided : this.state.value - 1,
                transport_provided :this.state.values - 1,
                request_type :GLOBAL.type,
                category_id :cid,
                no_of_labour:nol







            })
                .then(function (response) {

                    self.myCallbackFunctionss(response.data)

                })
                .catch(function (error) {
                    alert(error)
                    //  self.myCallbackFunction()

                });


        }else {
            this.setState({visible:true})
            if (this.state.value == 2 && this.state.values == 2) {
                this.setState({pop: stringsoflanguages.twotwo})

            } else if (this.state.value == 2 && this.state.values == 1) {
                this.setState({pop: stringsoflanguages.twoone})
            } else if (this.state.value == 1 && this.state.values == 2) {
                this.setState({pop: stringsoflanguages.onetwo})
            }
        }


        // this.props.navigation.navigate('Otp')
    }

    check = () => {
        this.setState({isSecure :!this.state.isSecure})
    }

    categorySelect = (index) =>{
        this.setState({selectedTab:index})
        this.loadHome(index)

    }
    _renderItems = ({item,index}) => {



        let cate = item.category.split(',')
        let no = item.no_labour.split(',')
        let nos = '';

        for (let i = 0;i <cate.length;i++){

            let acronym = cate[i].split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
            alert(acronym)

            let acronyms = no[i].split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
            nos = nos +  acronym  + ":" +  acronyms + ' , '
        }





        return (



            <View style = {{margin:10,borderRadius:16,backgroundColor:'white'}}>
                <Text style = {{fontSize : 18,color :'#042C5C', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4,marginBottom:3}}>
                    {index + 1}  #  {item.contractor_id} : {item.name}

                </Text>

                <Text style = {{fontSize : 18,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4,marginBottom:3}}>
                   {nos}

                </Text>



            </View>



        )
    }

    extend = () => {
        GLOBAL.mywhich = "1"
        this.setState({visibles:true})
        {this.hideMenu}
    }
    cancels (){
        this.hideMenu()
        this.showLoading()
        var self=this;
        var url = GLOBAL.BASE_URL + 'cancelorder';
        axios.post(url, {
            id: GLOBAL.bookingArray.id,


        })
            .then(function (response) {

                self.myCallbackFunctionss(response.data)

            })
            .catch(function (error) {
                alert(error)
                //  self.myCallbackFunction()

            });
    }
    cancel (){
        this.showMenu()

    }
    render() {
        let added_buttons_goes_here ;
        var cate = GLOBAL.bookingArray.category.split(",")
        var cats  = GLOBAL.bookingArray.no_labour.split(",")
        if (cate == "") {

        } else {

         added_buttons_goes_here = cate.map((data, index) => {
            return (
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop:12,
                    marginBottom:12,
                }}>
                    <Text style = {{alignSelf: 'center',fontSize : 14,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:15}}>
                        {data}

                    </Text>

                    <Text style = {{alignSelf: 'flex-end',fontSize : 14,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginRight:15}}>
                        {cats[index]}

                    </Text>

                </View>
            )
        });
    }


        var radio_props_one = [
            {label: 'Yes', value: 1 },
            {label: 'No', value: 2 },

        ];

        let datas= [];
        let { name } = this.state;

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}

                                       size="large" color='#006FA5' />
                </View>
            )
        }
        return (
            <SafeAreaView>
                <View style={styles.container}>

                    <KeyboardAwareScrollView>

                    <View style = {{backgroundColor:'#F6F8F9'}}>


                    <View style = {{flexDirection:  'row',marginTop:0,width:'100%',backgroundColor:'white'}}>

                        <View style = {{width:'90%',flexDirection:'row',marginTop:12}}>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()
                        }>




                            <Image style = {{width :30 ,height: 30,marginLeft:20,resizeMode: 'contain'}}
                                   source={require('./back.png')}/>

                        </TouchableOpacity>


                        <Text style = {{marginLeft: 12,width:200,color:'#042C5C',fontSize: 22,fontFamily:'AvenirLTStd-Heavy',marginTop:5}}>
                           # {GLOBAL.bookingArray.request_id}

                        </Text>

                        </View>
                        <TouchableOpacity onPress={() => this.cancel()
                        }>

                            {GLOBAL.bookingArray.status != 2 && GLOBAL.bookingArray.status != 3 && (
                                <View>

                        <Image style = {{width :20 ,height: 20,resizeMode: 'contain',marginTop:18}}
                               source={require('./dots-vertical.png')}/>


                                <Menu
                                ref={this.setMenuRef}

                                >
                                <MenuItem onPress={this.cancels}>Close</MenuItem>
                                <MenuItem onPress={this.extend}>Extend</MenuItem>


                                </Menu>
                                </View>

                            ) }

                        </TouchableOpacity>

                    </View>


                    <View style = {{margin:10,borderRadius:16,backgroundColor:'white'}}>

                        <View style = {{backgroundColor:"#f7fbfc",borderRadius:4,height:52,margin:10}}>

                            <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>



                                <Text style = {{alignSelf: 'center',fontSize : 12,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4}}>
                                    {stringsoflanguages.date} : {GLOBAL.bookingArray.request_date}

                                </Text>

                                <Text style = {{alignSelf: 'flex-end',fontSize : 12,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginRight:4}}>
                                    {stringsoflanguages.time} : {GLOBAL.bookingArray.request_time}

                                </Text>

                            </View>
                            <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>



                                <Text style = {{alignSelf: 'center',fontSize : 12,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4}}>
                                    {stringsoflanguages.requestno} : {GLOBAL.bookingArray.request_id}

                                </Text>

                                <Text style = {{alignSelf: 'flex-end',fontSize : 12,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginRight:4}}>
                                    {stringsoflanguages.bid} : {GLOBAL.bookingArray.booking_id}

                                </Text>

                            </View>

                        </View>

                        <View style = {{flexDirection:'row',marginLeft:14,marginTop:3}}>
                            <Image style = {{width :13 ,height: 13,marginLeft:4,resizeMode: 'contain'}}
                                   source={require('./tag.png')}/>

                            <Text style = {{alignSelf: 'center',fontSize : 14,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4}}>
                                {GLOBAL.bookingArray.category}

                            </Text>

                        </View>


                        <View style = {{flexDirection:'row',marginLeft:14,marginTop:12}}>
                            <Image style = {{width :13 ,height: 13,marginLeft:4,resizeMode: 'contain'}}
                                   source={require('./worker.png')}/>

                            <Text style = {{alignSelf: 'center',fontSize : 14,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4}}>
                                {count}

                            </Text>

                        </View>

                        <View style = {{flexDirection:'row',marginLeft:14,marginTop:12}}>
                            <Image style = {{width :13 ,height: 13,marginLeft:4,resizeMode: 'contain'}}
                                   source={require('./ic-outline-date-range.png')}/>

                            <Text style = {{alignSelf: 'center',fontSize : 14,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:4,marginBottom :8}}>
                                {GLOBAL.bookingArray.start_date} -  {GLOBAL.bookingArray.end_date}

                            </Text>

                        </View>
                        {GLOBAL.bookingArray.status == 2 && (
                            <Text style = {{fontSize : 14,color :'green', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:14,marginBottom :8}}>
                                Completed
                            </Text>
                        )}
                        {GLOBAL.bookingArray.status == 3 && (
                            <Text style = {{fontSize : 14,color :'red', height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:14,marginBottom :8}}>
                                Cancelled
                            </Text>
                        )}

                    </View>



                    <View style = {{margin:10,marginTop:8,borderRadius:16,backgroundColor:'white'}}>

                        <View style = {{backgroundColor:"#f7fbfc",borderRadius:4,height:40,margin:10}}>

                            <Text style = {{color:"#042C5C",fontSize : 18, height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:'5%',marginTop:12}}>
                                {stringsoflanguages.labourDetail}
                            </Text>

                        </View>


                        <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>


                            <Text style = {{marginLeft: '5%',width:'60%',color:'#042C5C',fontSize: 16,marginTop: '4%',fontFamily:'AvenirLTStd-Heavy'}}>
                                {stringsoflanguages.labourCategory}

                            </Text>

                            <Text style = {{marginRight: '5%',width:'40%',color:'#042C5C',fontSize: 16,marginTop: '4%',fontFamily:'AvenirLTStd-Heavy'}}>
                                {stringsoflanguages.nooflabour}

                            </Text>

                        </View>

                        {added_buttons_goes_here}

                    </View>



<View style = {{backgroundColor:'white',margin:12,borderRadius:16,height:150}}>


                        <View style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',

                            backgroundColor:'white',
                            marginBottom:8,
                            borderBottomWidth:1,
                            borderBottomColor:'#77869e',
                            marginTop:12,
                            margin:'5%',



                        }}>
                            <Text style = {{alignSelf: 'center',fontSize : 16,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
                                {stringsoflanguages.totalno}

                            </Text>

                            <Text style = {{alignSelf: 'flex-end',fontSize : 16,color :'#042C5C', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
                                {GLOBAL.bookingArray.total_no_days}

                            </Text>

                        </View>

    <View style={{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        backgroundColor:'white',
        marginBottom:8,
        borderBottomWidth:1,
        borderBottomColor:'#77869e',
        marginTop:12,
        margin:'5%',


    }}>
        <Text style = {{alignSelf: 'center',fontSize : 16,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
            {stringsoflanguages.noofday}

        </Text>

        <Text style = {{alignSelf: 'flex-end',fontSize : 16,color :'#042C5C', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
            {GLOBAL.bookingArray.total_worked_days}

        </Text>

    </View>

    <View style={{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        backgroundColor:'white',

        marginBottom:8,
        margin:'5%',
        borderBottomWidth:1,
        borderBottomColor:'#77869e',
        marginTop:12

    }}>
        <Text style = {{alignSelf: 'center',fontSize : 16,color :'#77869E', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
            {stringsoflanguages.remaing}

        </Text>

        <Text style = {{alignSelf: 'flex-end',fontSize : 16,color :'#042C5C', height:'auto',fontFamily:'AvenirLTStd-Medium'}}>
            {GLOBAL.bookingArray.total_remaining_days}

        </Text>

    </View>





</View>
                        <View style = {{backgroundColor:'white',margin:12,borderRadius:16}}>
                            <View style = {{backgroundColor:"#f7fbfc",borderRadius:4,height:40,margin:10}}>

                                <Text style = {{color:"#042C5C",fontSize : 18, height:'auto',fontFamily:'AvenirLTStd-Medium',marginLeft:'5%',marginTop:12}}>
                                    {stringsoflanguages.assocated}
                                </Text>

                            </View>

                        <FlatList style= {{marginTop:0}}
                                  data={this.state.data}
                                  numColumns={1}
                                  keyExtractor = { (item, index) => index.toString() }
                                  renderItem={this._renderItems}
                                  extraData={this.state}
                        />

                        </View>

</View>
                        <Dialog
                            visible={this.state.visibles}
                            onTouchOutside={() => {
                                this.setState({ visible: false });
                            }}
                        >
                            <DialogContent>

                                <View style = {{width: window.width - 100}}>

                                    <Image style = {{width :80 ,height :80,alignSelf:'center',resizeMode:'contain',marginTop:30}}
                                           source={require('./create-request-pop-img.png')}/>

                                    <Text style = {{margin:10,textAlign: 'center',color:'#006FA5',fontSize: 18,marginTop: 12,fontFamily:'AvenirLTStd-Heavy'}}>
                                        {stringsoflanguages.extend}

                                    </Text>


                                    <TouchableOpacity onPress={() => this.getSelections('2')
                                    }>
                                        <View style = {{flexDirection:'row'}}>

                                            <Image style = {{width :20 ,height :20,margin:10,resizeMode:'contain'}}
                                                   source={require('./checkbox-blank-outline.png')}/>

                                            <Text style = {{marginLeft:10,color:'#77869E',fontSize: 13,fontFamily:'AvenirLTStd-Heavy',marginTop:14}}>
                                                {stringsoflanguages.same}

                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.getSelections('1')
                                    }>

                                        <View style = {{flexDirection:'row'}}>

                                            <Image style = {{width :20 ,height :20,margin:10,resizeMode:'contain'}}
                                                   source={require('./checkbox-blank-outline.png')}/>

                                            <Text style = {{marginLeft:10,color:'#77869E',fontSize: 13,fontFamily:'AvenirLTStd-Heavy',marginTop:14}}>
                                                {stringsoflanguages.create}

                                            </Text>
                                        </View>
                                    </TouchableOpacity>




                                </View>
                            </DialogContent>
                        </Dialog>

                    </KeyboardAwareScrollView>


                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    container: {

        backgroundColor :'white',
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})