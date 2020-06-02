import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { actionCreators } from './store';
import { actionCreators as loginActionCreators } from '../../pages/login/store';
import { Link } from 'react-router-dom';
import {
  HeaderWrapper,
  Logo,
  Nav,
  NavItem,
  NavSearch,
  Addition,
  Button,
  SearchInfo,
  SearchInfoTitle,
  SearchInfoSwitch,
  SearchInfoList,
  SearchInfoItem,
  SearchWrapper } from './style';
import { IconFontStyle } from '../../static/iconfont/iconfont';

class Header extends Component {
  getListArea(){
    const { focused, mouseIn, list, page, totalPage, handleMouseEnter, handleMouseLeave, handleChangePage } = this.props;
    const newList = list.toJS();
    const pageList = [];

    if(newList.length){
      for (let i = page * 10; i < (page+1) * 10; i++){
        pageList.push(<SearchInfoItem key={newList[i]}>{newList[i]}</SearchInfoItem>)
      }
    }

    if (focused || mouseIn){
      return (
        <SearchInfo
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={()=>handleChangePage(page, totalPage, this.spinIcon)}
        >
          <SearchInfoTitle>
            热门搜索
            <SearchInfoSwitch>
              <span ref={(icon) => {this.spinIcon = icon}} className="iconfont spin">&#xe851;</span>
              换一批
            </SearchInfoSwitch>
            <SearchInfoList>
              {pageList}
            </SearchInfoList>
          </SearchInfoTitle>
        </SearchInfo>
      )
    }else{
      return null;
    }
  }

  render() {
    const { focused, handleInputFocus, handleInputBlur, list, login, logout } = this.props;

    return (
      <Fragment>
        <IconFontStyle />
        <HeaderWrapper>
          <Link to='/'>
            <Logo />
          </Link>
          <Nav >
            <Link to='/'>
              <NavItem className='left active'>首页</NavItem>
            </Link>
            <NavItem className='left'>下载App</NavItem>
            {
              login ?
                <NavItem onClick={logout} className='right'>退出</NavItem> :
                <Link to='/login'>
                  <NavItem className='right'>
                    登录
                  </NavItem>
                </Link>
            }
            <NavItem className='right'>
              <span className="iconfont">&#xe636;</span>
            </NavItem>
            <SearchWrapper>
              <CSSTransition
                in={focused}
                timeout={200}
                classNames='slide'
              >
                <NavSearch className={focused ? 'focused' : ''}
                           onFocus={() => handleInputFocus(list)}
                           onBlur={handleInputBlur}
                />
              </CSSTransition>
              <span className={focused ? 'focused iconfont zoom' : 'iconfont zoom'}>&#xe617;</span>
              {this.getListArea()}
            </SearchWrapper>
          </Nav>
          <Addition>
            <Link to='/write'>
              <Button className='writting'>
                <span className="iconfont">&#xe60e;</span>
                写文章
              </Button>
            </Link>
            <Button className='reg'>注册</Button>
          </Addition>
        </HeaderWrapper>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    focused: state.getIn(['header','focused']),
    list: state.getIn(['header','list']),
    page: state.getIn(['header','page']),
    totalPage: state.getIn(['header','totalPage']),
    mouseIn: state.getIn(['header','mouseIn']),
    login: state.getIn(['login', 'login'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputFocus(list){
      (list.size === 0) && dispatch(actionCreators.getList())
      dispatch(actionCreators.searchFocus());
    },
    handleInputBlur(){
      dispatch(actionCreators.searchBlur());
    },
    handleMouseEnter(){
      dispatch(actionCreators.mouseEnter());
    },
    handleMouseLeave(){
      dispatch(actionCreators.mouseLeave());
    },
    handleChangePage(page, totalPage, spin){
      let originAngle = spin.style.transform.replace(/[^0-9]/ig, '');
      if (originAngle){
        originAngle = parseInt(originAngle, 10);
      }else{
        originAngle = 0;
      }
      spin.style.transform = 'rotate(' + (originAngle + 360) + 'deg)';
      dispatch(actionCreators.changePageList((page+1) % totalPage));
    },
    logout(){
      dispatch(loginActionCreators.logout());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);