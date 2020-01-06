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
            sum:[],
        };
    }

    static getDerivedStateFromProps(props, state) {
        class monthtTrack{
            constructor(id){
                this.id=id;
                this.data=[];
            }
        }
        let monthStackData={};
        for(var a=0;a<12;a++){
            monthStackData[a]=new monthtTrack(a);
        }
        
        // console.log(Object.keys(state.monthStack));

        if(Object.keys(state.monthStack).length===0){         
            return {
                monthStack:monthStackData
            }
        }
        
        // console.log(Object.keys(props.currentportfolio).length!==0);
        if(Object.keys(props.currentportfolio).length!==0){
            // console.log('TEST');
            // let monthStackData=state.monthStack;
            

            let tickers = props.currentportfolio.tickers;
            let data = props.currentportfolio.dividendData;

            for(var i=0;i<tickers.length;i++){
                let len = data[tickers[i][0]].payDate.length;
                for(var j=0;j<len;j++){
                    let d = new Date(data[tickers[i][0]].payDate[j]);
                        monthStackData[d.getMonth()].data.push({
                        ticker : tickers[i][0],
                        name : data[tickers[i][0]].name,
                        exDiv : data[tickers[i][0]].exDiv[j],
                        payDate : data[tickers[i][0]].payDate[j],
                        dividend : data[tickers[i][0]].dividend[j],
                        country : data[tickers[i][0]].country,
                        dividendType : data[tickers[i][0]].dividendType,
                        sum : Math.round(([tickers[i][1]]*data[tickers[i][0]].dividend[j])*100)/100
                    });
                }
            }
            console.log(monthStackData);
            data=monthStackData;
            return {
                currentportfolio: props.currentportfolio,
                monthStack:data
            };           
        }
        return null;
    }

    render() {
        // console.log(this.state.monthStack);
        return (
            <div className='calender' onChange={this.test}>
                <div className='monthStack'>
                    {this.state.monthId.map(monthId =>
                        <MonthStack key={monthId} id={monthId} monthStack={this.state.monthStack[monthId]}/>
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
