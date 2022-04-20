import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import View from '../../components/View';
import useAppSelector from '../../hooks/useAppSelector';
import { checkRoles } from '../../lib/checkRoles';
import { selectUser } from '../../store/userSlice';
import Users from './users';
import UserIcon from '../../icons/UserIcon.svg';
import StatIcon from '../../icons/StatIcon.svg';
import CashIcon from '../../icons/CashIcon.svg';
import MessageBubbleIcon from '../../icons/MessageBubbleIcon.svg';
import PreferencesIcon from '../../icons/PreferencesIcon.svg';
import Summary from './summary';
import Transactions from './transactions';
import Disputes from './disputes';
import complains from './complaints';
import { Route, Switch } from 'react-router-dom';
import { IMenuItem, Sidebar } from './Sidebar';
import Logo from '../../icons/Logo.svg';
import { Box } from '@material-ui/core';
import { styled } from '@mui/system';
// import { Acl } from './acl';

const Admin = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  // create menu
  let menu: IMenuItem[] = [];

  if (user) {
    const commonMenuItems = [
      {
        id: 'transactions',
        label: 'Транзакции',
        icon: CashIcon,
      },
      {
        id: 'disputes',
        label: 'Споры',
        icon: MessageBubbleIcon,
      },

    ]
    if (checkRoles(user.roles, ['operator'])) {
      menu = commonMenuItems;
    }
    if (checkRoles(user.roles, ['admin'])) {
      menu = [...commonMenuItems,
      {
        id: 'summary',
        label: 'Сводка',
        icon: StatIcon,
      },
      {
        id: 'users',
        label: 'Пользователи',
        icon: UserIcon,
      },
      {
        id: 'complaints',
        label: 'Жалобы',
        icon: MessageBubbleIcon,
      },
      {
        id: 'acl',
        label: 'ACL',
        icon: PreferencesIcon,
      }
      ]
    }
  }


  const onMenuItemClick = (item: IMenuItem) => {
    switch (item.id) {
      case 'transactions':
        history.push('/admin/transactions');
        break;
      case 'summary':
        history.push('/admin/summary');
        break;
      case 'users':
        history.push('/admin/users');
        break;
      case 'disputes':
        history.push('/admin/disputes');
        break;
      case 'complaints':
        history.push('/admin/complaints');
        break;
      case 'acl':
        history.push('/admin/acl');
        break;
    }
  };

  if (user && !checkRoles(user.roles, ['admin', 'operator'])) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Box display="flex" height="100%">
        <Sidebar
          header={
            <Box
              style={{
                cursor: 'pointer',
              }}
            >
              <img src={Logo} alt="" onClick={() => history.push('/')} />
            </Box>
          }
          footer={
            <>
              <div
                style={{
                  flex: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    color: '#132026',
                    opacity: 0.6,
                  }}
                >
                  {user && user.roles.length && user.roles[0].name}
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {user?.login}
                </div>
              </div>
            </>
          }
          menu={menu}
          onMenuItemClick={(item: IMenuItem) => {
            onMenuItemClick(item)
          }}
        />

        <Content>
          <Switch>
            <Route
              path="/admin/transactions"
              component={Transactions}
            />
            <Route exact path="/admin/summary" component={Summary} />
            <Route path="/admin/users" component={Users} />
            <Route path="/admin/disputes" component={Disputes} />
            <Route path="/admin/complaints" component={complains} />
            {/* <Route exact path="/admin/acl" component={Acl} /> */}
          </Switch>
        </Content>
      </Box>
    </View>
  );
};

const Content = styled(Box)`
  position: relative;
  background-color: #ffffff;
  flex: 3;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
`;

export default Admin;
