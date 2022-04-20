import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {ComplaintsList} from './complaintList'
import { ComplaintDetail } from './complaintDetail';

const Complaints = () => {
  return (
    <Switch>
      <Route exact path="/admin/complaints" component={ComplaintsList} />
      <Route exact path="/admin/complaints/:id" component={ComplaintDetail} />
    </Switch>
  );
};

export default Complaints;
