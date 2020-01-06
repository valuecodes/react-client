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
              tickers:array,
              isActive:portfolios[i].isActive
            })
          }
          if(list.length===0){
            this.createPortfolio('My portfolio')
          }else{
            // console.log(list[0].name);
            this.setState({portfolios:list});
            // this.selectPortfolio(list[0].name)

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
            this.addDividendData(activeList,[]);             
          }
        })
  }

  addTicker(id,shares){
    let current = this.state.portfolios.filter(portfolio => portfolio.isActive===true);
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
      console.log(tickerFound);
      if(!tickerFound){
        // Add ticker to portfolio (name,shares)
        let newTicker=[id,shares];
        current[0].tickers.push(newTicker);
        let portfolios=this.state.portfolios.map(portfolio => portfolio.isActive===true ? portfolio=current[0] : portfolio)
        this.savePortfolioToDB(current[0]);
        this.addDividendData([id],current[0],portfolios);
      }else{
        console.log('test');
        this.savePortfolioToDB(current[0]);
        let portfolios=this.state.portfolios.map(portfolio => portfolio.isActive===true ? portfolio=current[0] : portfolio)
        this.setState({currentportfolio:current[0],portfolios:portfolios});
      }
    }
  }

  deleteTicker(id){
    for(var i=0;i<this.state.currentportfolio.tickers.length;i++){
      if(this.state.currentportfolio.tickers[i][0]===id){
        console.log(id);
        let updated=this.state.currentportfolio;
        updated.tickers.splice(i, 1);    
        this.setState({currentportfolio: updated});
        this.savePortfolioToDB(updated);
      }
    }
    
  }

  addShares(ticker,count){
    let amount=count.target.value===''? 0 :count.target.value; 
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
      tickers:[],
      isActive:false
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
      // .then(this.selectPortfolio(e));

  }

  selectPortfolio(name){
    let portfolios=this.state.portfolios;
    portfolios.forEach(portfolio => portfolio.name===name ?portfolio.isActive=true:portfolio.isActive=false);
    let selected=portfolios.filter(portfolio => portfolio.name===name);
    this.setState({currentportfolio:selected[0]});
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

  addDividendData(tickers,currentPortfolio,allPortfolios){
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
          // this.setState({dividendData:data});
          if(!Object.keys(this.state.currentportfolio).length===true){
            let portfolios=this.state.portfolios;
            portfolios.map(portfolio => {
              portfolio.dividendData=data;
            });
            portfolios[0].isActive=true;
            this.setState({currentportfolio:this.state.portfolios[0],portfolios:portfolios});
          }else{
            currentPortfolio.dividendData=data;
            this.setState({currentportfolio:currentPortfolio,portfolios:allPortfolios});
          }
        });      
    }

  }

  savePortfolioToDB(updated){
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

  render(){
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
              <Calender currentportfolio={this.state.currentportfolio}/>
          </div>
        </header>
      </div>
    )
  }
}

export default App;