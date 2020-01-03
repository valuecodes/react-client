import React, { Component } from 'react';
import './App.css';
import { NavBar } from './components/navBar/NavBar';
import { Header } from './components/header/Header';
import { Portfolios } from './components/mainSection/portfolios/Portfolios';
import { MainTickerList } from './components/mainSection/MainList/MainTickerList';
import { Calender } from './components/mainSection/calender/calender';


export class App extends Component {
  active=[];
  constructor() {
    super();
    this.state = {
      dividendData:[],
      portfolios:[],
      currentportfolio:[],
      monthStack:[],
    };
  }

  componentDidMount(){
    fetch('http://localhost:3000/portfolioList')
        .then(res => res.json())
        .then(portfolios => {
          let list=[];   
          for(var i=0;i<portfolios.length;i++){
            let data=portfolios[i].stocks.split(',');
            let array=[];             
            for(var j=0;j<data.length-1;j+=2){
              array.push([data[j],data[j+1]]);
            }
            list.push({
              id:portfolios[i].id,
              name:portfolios[i].name,
              tickers:array
            })
          }
          if(list.length===0){
            this.createPortfolio('My portfolio')
            this.createMonthStack();
          }else{
            this.setState({portfolios:list});
            this.setState({currentportfolio:list[0]});
            this.createMonthStack(list[0]);          
          }
          let activeList=[];
          for(var a=0;a<list.length;a++){
            for(var b=0;b<list[a].tickers.length;b++){
              if(!activeList.includes(list[a].tickers[b][0])){
                activeList.push(list[a].tickers[b][0]);
              }
            }
          }
          if(activeList.length>0){
            this.addDividendData(activeList);             
          }
        })
        
        
  }

  addTicker(id,shares){
    if(this.state.currentportfolio.name){
      if(shares===undefined){
        shares=0;
      }   
      let tickerFound=false;
      for(var i=0;i<this.state.currentportfolio.tickers.length;i++){
        if(this.state.currentportfolio.tickers[i][0]===id){
          tickerFound=true;
        }
      }    
      if(!tickerFound){
        // Add ticker to portfolio (name,shares)
        let newTicker=[id,shares];
        let updatedTickers=this.state.currentportfolio.tickers.concat([newTicker]);
        let updated=this.state.currentportfolio;
        updated.tickers=updatedTickers;
        this.setState({currentportfolio:updated});
        this.updatePortfolioList(updated);
        this.savePortfolioToDB(updated);
        this.addDividendData([id]);

        // Get ticker data
      //   this.active.push(id);
      //   let data={name:id};
      //   const options={
      //     method:'POST',
      //     headers: {
      //       'Content-Type': "application/json;charset=UTF-8"  
      //     },
      //     body: JSON.stringify(data)
      //   }
      //   fetch('http://localhost:3000/search',options)
      //     .then(res => res.json())
      //     .then(ticker => this.setState({activeList:[...this.state.activeList,ticker.data[0]]}));      
      }
    }
  }

  deleteTicker(id){
    for(var i=0;i<this.state.currentportfolio.tickers.length;i++){
      if(this.state.currentportfolio.tickers[i][0]===id){
        let updated=this.state.currentportfolio;
        updated.tickers.splice(i, 1);    
        this.setState({currentportfolio: updated});
        this.updatePortfolioList(updated);
        this.savePortfolioToDB(updated);
      }
    }
    
  }

  addShares(ticker,count){
    let amount=count.target.value===''? 0 :count.target.value;
    console.log(amount);    
    let current = this.state.currentportfolio.tickers;
    for(var i=0;i<current.length;i++){
      if(current[i][0]===ticker){
        current[i][1]=amount;
        break;
      }
    }
    let updated=this.state.currentportfolio;
    updated.tickers=current;
    this.setState({currentportfolio: updated});
    this.updatePortfolioList(updated);
    this.savePortfolioToDB(updated);
  }

  createPortfolio(e){
    let newId;
    if(this.state.portfolios.length===0){
      newId=0
    }else{
      newId=(this.state.portfolios[this.state.portfolios.length-1].id)+1;
    }
    let newPortfolio={
      id:newId,
      name:e,
      tickers:[]
    }

    this.setState({portfolios:[...this.state.portfolios,newPortfolio]});

    // Save to database
    const options={
      method:'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"  
      },
      body: JSON.stringify(newPortfolio)
    }
    fetch('http://localhost:3000/createPortfolio',options)
      .then(res => res.json());
      // .then(newPortfolio => this.setState({portfolio:[...this.state.portfolio,newPortfolio]}));

  }

  selectPortfolio(name){
    let portfolios=this.state.portfolios;
    let selectPortfolio;
    for(var i=0;i<portfolios.length;i++){
      if(portfolios[i].name===name){
        selectPortfolio=portfolios[i];
      }
    }
    let selectedPortfolio={
      id:selectPortfolio.id,
      name:selectPortfolio.name,
      tickers:selectPortfolio.tickers     
    }
    console.log('test');
    this.setState({currentportfolio:selectedPortfolio});
    this.createMonthStack(selectedPortfolio);
  }

  deletePortfolio(name){
    let portfolio=this.getPortfolio(name);
    let updated=this.state.portfolios.filter(item => item.id !== portfolio.id);
    this.setState({portfolios:updated});
    this.setState({currentportfolio:[]})

    // Delete from database
    const options={
      method:'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"  
      },
      body: JSON.stringify({id:portfolio.id})
    }
    fetch('http://localhost:3000/deletePortfolio',options)
      .then(res => res.json())
      .then(message => console.log(message));
  }

  getPortfolio(name){
    let portfolios=this.state.portfolios;
    let selectPortfolio;        
    for(var i=0;i<portfolios.length;i++){
      if(portfolios[i].name===name){
        selectPortfolio=portfolios[i];
      }
    }
    let selectedPortfolio={
      id:selectPortfolio.id,
      name:selectPortfolio.name,
      tickers:selectPortfolio.tickers     
    }
    return selectedPortfolio;
  }

  updatePortfolioList(updated){
    this.state.portfolios.map(portfolio => {
      if(portfolio.id===updated.id){
        portfolio.tickers=updated.tickers;
      }
    })
  }

  addDividendData(tickers){
    if(this.state.dividendData[tickers]===undefined){
      let data={data:tickers};
      const options={
        method:'POST',
        headers: {
          'Content-Type': "application/json;charset=UTF-8"  
        },
        body: JSON.stringify(data)
      }
      fetch('http://localhost:3000/getDividendData',options)
        .then(res => res.json())
        .then(dividends => {
          class company{
            constructor(id,name,country,dividendType,exDiv,payDate,dividend){
                this.id=id;
                this.name = name;              
                this.country=country;
                this.dividendType=dividendType;              
                this.exDiv = [exDiv];
                this.payDate = [payDate];
                this.dividend = [dividend];
            }
          }
          // console.log(dividends)
          // console.log(this.state.dividendData['FTI'])
          let data=this.state.dividendData;
          for(var i=0;i<dividends.length;i++){
            let ticker = dividends[i].ticker;
            let id = dividends[i].id;
            let name = dividends[i].name;
            let country = dividends[i].country;
            let dividendType = dividends[i].dividendType;
            let exDiv = new Date(dividends[i].exDiv);
            let payDate = new Date(dividends[i].payDate)
            let dividend = Number(dividends[i].dividend);
            if(data[ticker]){
              data[ticker].exDiv.push(exDiv)
              data[ticker].payDate.push(payDate)
              data[ticker].dividend.push(dividend)
            }else{
                data[ticker] = new company(id,name,country,dividendType,exDiv,payDate,dividend);
            }  
          }
          this.setState({dividendData:data});
        });      
    }

  }

  savePortfolioToDB(updated){
    console.log(updated);
    const options={
      method:'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"  
      },
      body: JSON.stringify(updated)
    }
    fetch('http://localhost:3000/savePortfolio',options)
      .then(res => res.json())
      .then(message => console.log(message));
  }

  createMonthStack(portfolio){
    let tickers = portfolio.tickers;
    let data= this.state.dividendData

    let promise=new Promise((resolve,reject)=>{
      resolve(this.state.dividendData)
    })

    promise.then((value)=>{
      console.log(value)
    })
    // if(!Object.keys(data).length===true){
    //   this.createMonthStack(portfolio);
    // }
    

    // console.log(data);


    // class monthtTrack{
    //   constructor(id){
    //     this.id=id;
    //     this.data=[];
    //   }
    // }
    // let monthStackData={};
    // for(var a=0;a<12;a++){
    //     monthStackData[a]=new monthtTrack(a);
    // }

    // for(var i=0;i<tickers.length;i++){

    //     let len = data[tickers[i][0]].payDate.length;
    //     console.log(data[tickers[i][0]]);
    //     for(var j=0;j<len;j++){
    //         let d = new Date(data[tickers[i][0]].payDate[j]);
    //         monthStackData[d.getMonth()].data.push({
    //             ticker : tickers[i][0],
    //             name : data[tickers[i][0]].name,
    //             exDiv : data[tickers[i][0]].exDiv[j],
    //             payDate : data[tickers[i][0]].payDate[j],
    //             dividend : data[tickers[i][0]].dividend[j],
    //             country : data[tickers[i][0]].country,
    //             dividendType : data[tickers[i][0]].dividendType,
    //         });
    //     }
    // }
    // console.log(monthStackData);

    // // console.log(portfolio,this.state.dividendData);
    // console.log('Create Month stack');
  }

  render(){
    // console.log(this.state);
    return (
      <div className="App">
        <header className="App-header">
          <Header/>
          <NavBar addTicker={this.addTicker.bind(this)}/>
          <div className='mainSection'>
            <div className='mainList'>
              <Portfolios createPortfolio={this.createPortfolio.bind(this)} allPortfolios={this.state.portfolios} selectPortfolio={this.selectPortfolio.bind(this)} selectedPortfolio={this.state.currentportfolio.name} deletePortfolio={this.deletePortfolio.bind(this)}/>
              <MainTickerList onChange={this.currentportfolio} tickers={this.state.currentportfolio.tickers} deleteTicker={this.deleteTicker.bind(this)} addShares={this.addShares.bind(this)}/>
            </div>
              <Calender dividendData={this.state.dividendData} currentportfolio={this.state.currentportfolio}/>
          </div>
        </header>
      </div>
    )
  }
}

export default App;