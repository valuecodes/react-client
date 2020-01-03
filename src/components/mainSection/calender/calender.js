import React, { Component } from 'react';
import { Month } from './month';
import { MonthStack } from './monthStack'

export class Calender extends Component {
    constructor() {
        super();
        this.state = {
            monthsName:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            monthId:[0,1,2,3,4,5,6,7,8,9,10,11],
            monthStack:[],
            currentPortfolio:[],
            sum:[],
        };
    }

    // calculate(data,tickers){

    //     // let tickers = this.props.currentportfolio;
    //     // let data = this.props.dividendData;

    //     // console.log(tickers,data);
    //     class monthtTrack{
    //         constructor(id){
    //             this.id=id;
    //             this.data=[];
    //         }
    //     }
    //     let monthStackData={};
    //     for(var a=0;a<12;a++){
    //         monthStackData[a]=new monthtTrack(a);
    //     }

    //     // console.log(tickers.length)
    //     for(var i=0;i<tickers.length;i++){
    //         let len = data[tickers[i][0]].payDate.length;
    //         for(var j=0;j<len;j++){
    //             let d = new Date(data[tickers[i][0]].payDate[j]);
    //             monthStackData[d.getMonth()].data.push({
    //                 ticker : tickers[i][0],
    //                 name : data[tickers[i][0]].name,
    //                 exDiv : data[tickers[i][0]].exDiv[j],
    //                 payDate : data[tickers[i][0]].payDate[j],
    //                 dividend : data[tickers[i][0]].dividend[j],
    //                 country : data[tickers[i][0]].country,
    //                 dividendType : data[tickers[i][0]].dividendType,
    //             });
    //         }
    //     }





    //     // console.log(JSON.stringify(tickers)+'  '+JSON.stringify(this.state.currentPortfolio));
    //     if(JSON.stringify(tickers)!==JSON.stringify(this.state.currentPortfolio)){
    //         this.setState({monthStack:monthStackData})
    //         this.setState({currentPortfolio:tickers});            
    //     }
    //     console.log(this.state);
    //     // if(!(JSON.stringify(this.state.monthStack)===JSON.stringify(monthStackData))){
    //         // console.log('Updated');

    //         // if(!this.state.currentPortfolio===tickers){
    //         //     this.setState({currentPortfolio:tickers});                
    //         // }

    //     // }          
    // }

    static getDerivedStateFromProps(props, state) {
        // console.log(props.currentportfolio,state.currentPortfolio);
        if (props.currentportfolio !== state.currentportfolio) {
            // console.log(props.dividendData)
          return {
            currentportfolio: props.currentportfolio,
          };
        }
        // Return null if the state hasn't changed
        return null;
      }
    
    //   componentDidUpdate(prevProps, prevState) {
    //     // console.log(this.props.dividendData, prevProps.dividendData);

    //     if (JSON.stringify(this.props.currentportfolio.tickers)!==JSON.stringify(prevProps.currentportfolio.tickers)){
    //         console.log('test');
    //         this.setState({dividendData:this.props.dividendData})
    //     }
    //   }


    render() {

        // if(this.props.currentPortfolio){
            // console.log(!Object.keys(this.props.dividendData).length)            
        // }

        // if(!Object.keys(this.props.dividendData).length===false && !Object.keys(this.props.currentportfolio).length===false){
        //     this.calculate(this.props.dividendData,this.props.currentportfolio.tickers);            
        // }

        console.log(this.state)



        
        return (
            <div className='calender' onChange={this.test}>
                <div className='monthStack'>
                    {this.state.monthId.map(monthId =>
                        <MonthStack key={monthId} id={monthId} />
                    )}
                </div>
                <div className='monthNames'>
                    {this.state.monthsName.map(month =>
                        <Month key={month} month={month}/>
                    )}
                </div>
            </div>
        )
    }
}

export default Calender
