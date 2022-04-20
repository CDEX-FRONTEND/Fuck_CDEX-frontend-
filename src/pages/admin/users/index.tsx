import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { User } from './User';
import { UserList } from './UserList';

const Users = () => {
  return (
    <Switch>
      <Route exact path="/admin/users" component={UserList} />
      <Route exact path="/admin/users/:id" component={User} />
    </Switch>
  );
};

export default Users;
