import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Trades } from './Trades';
import { Trade } from './Trade';

const Disputes = () => {
  return (
    <Switch>
      <Route exact path="/admin/disputes" component={Trades} />
      <Route path="/admin/disputes/:id" component={Trade} />
    </Switch>
  );
};

export default Disputes;
