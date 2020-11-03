import React, {Component} from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Navbar from './Navbar';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {styles} from '../styles/styles';
import {TabPanel, a11yProps } from './TabPanel';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Loading from './Loading';
import { Alert } from '@material-ui/lab';

class UserDashboard extends Component {
    state = {
        loading:  true,
        activeTabValue: 0,
        index: 0,
        modalOpen: false,
        dialogOpen: false,
        target_id: '',
        modalInfo: {},
        requests: {}
    }


    fetchRequests = async (paramTabValue) => {     
        let status = '';   
        switch(paramTabValue) {
          case 0:
            status = 'pending'; break;
          case 1:
            status = 'accepted'; break;
          case 2:
            status = 'rejected'; break;
        }

        try {
            const token = localStorage.getItem('auth-token');  
            const userRes = await axios.get("http://localhost:5000/users/current-user", {
              headers: { "x-auth-token": token },});
            const creator_id = userRes.data.id;

            const result = await axios.get("http://localhost:5000/requests/user-request", {
              headers: {"x-auth-token": token },
              params:  {"creator_id": creator_id, "status": status}
            });
                                    
            this.setState({requests: result.data});
          } catch (err) {
            console.log(err);
          }
    }

  

  handleChange = (event, value) => {
    this.setState({activeTabValue: value})
  };

  handleChangeIndex = (index) => {
    this.setState({index: index})
  };

  handleModalOpen = (request) => {
    this.setState({ modalInfo: request, modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleDialogOpen = (request) => {
    this.setState({ target_id: request._id, dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDeleteRequest = async(e) => {
    e.preventDefault();
      const {target_id} = this.state;
      const creator_visibility = false;
    try {
      const token = localStorage.getItem('auth-token');  
      axios.patch(`http://localhost:5000/requests/hide_creator/${target_id}`, {creator_visibility}, {headers: {"x-auth-token": token}})
      .then(() => {
        window.location.reload();
      })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount(){
    // console.log("component Did Mount")
    setTimeout(() => {
      this.fetchRequests(this.state.activeTabValue);
    }, 500); 
    this.setState({loading: false});
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("component Did Update")
    if (
      this.state.activeTabValue !== prevState.activeTabValue
    ) {
      this.setState({ requests: {},retrieved: false});
      setTimeout(() => {
        this.fetchRequests(this.state.activeTabValue);
      }, 500); 
      this.setState({ loading: false});
    }
  }

  render(){
    const {classes} = this.props;
    const {modalInfo, activeTabValue, requests, modalOpen, dialogOpen} = this.state;
    

    return (
        <React.Fragment>
        <Navbar/>
            <AppBar color="default" className={classes.appBar}>
                <Tabs
                value={activeTabValue}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                >
                <Tab label="Pending Requests" {...a11yProps(0)} />
                <Tab label="Accepted Requests" {...a11yProps(1)} />
                <Tab label="Rejected Requests" {...a11yProps(2)} />
                </Tabs>
            </AppBar>

            <Dialog
              open={dialogOpen}
              onClose={this.handleDialogClose}
              disableBackdropClick
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this item?"}</DialogTitle>
              <DialogActions>
                <Button className={classes.button} variant="contained" onClick={this.handleDialogClose}>
                  Cancel
                </Button>
                <Button className={classes.button} color="primary" variant="contained" onClick={this.handleDeleteRequest} >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            {modalInfo && <Modal
          open={modalOpen}
          onClose={this.handleModalClose}
        >
          <div className={classes.modalPaper}>
              <div className={classes.title}>
                <Typography variant="h4" gutterBottom> Appointment </Typography>
              </div>
              <Typography variant="h6" >Subject</Typography>
              <Typography variant="body1" gutterBottom>
                  {modalInfo.subject}
              </Typography>


              <Typography variant="h6" >Doctor</Typography>
              <Typography variant="body1" gutterBottom>
                  {modalInfo.receiver_name}
              </Typography>

              <Typography variant="h6" >Appointment Time</Typography>
              <Typography variant="body1" gutterBottom>
                  {modalInfo.time}
              </Typography>

              <Typography variant="h6" >Explanation</Typography>
              <Typography variant="body1" gutterBottom>
                  {modalInfo.explanation}
              </Typography>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                className={classes.modalButton}
                onClick={this.handleModalClose}
              >
                Close
              </Button>
          </div>
        </Modal> }
            <TabPanel value={activeTabValue} index={0}>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2} styles={{margin: "auto"}}>
                              <Grid xs={3} item>
                                  <Typography style={{fontWeight: "bold"}} variant="subtitle1">Subject</Typography>
                              </Grid>
                              <Grid xs={3} item >
                                  <Typography style={{fontWeight: "bold"}} variant="subtitle1">Applicant</Typography>
                              </Grid>
                              <Grid xs={3} item>
                                  <Typography style={{fontWeight: "bold"}} variant="subtitle1">Time</Typography>
                              </Grid>
                              <Grid xs={1} item>
                                  <Typography style={{fontWeight: "bold"}} variant="subtitle1">Status</Typography>
                              </Grid>
                            <Grid xs={2} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Actions</Typography>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    {requests.length >= 0 ? (requests.map(
                        request =>
                    <Paper key={request._id} className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2}>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.subject}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.receiver_name}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.time}</Typography>
                            </Grid>
                            <Grid xs={1} item>
                                <HourglassEmptyIcon className={classes.glassIcon}/>
                            </Grid>
                            <Grid xs={2} item >
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                onClick={() => this.handleModalOpen(request)}
                                startIcon={<VisibilityIcon />}
                              >
                                View
                          </Button>
                          <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                                disabled
                              >
                                Delete
                          </Button>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    )) : (<Loading/>)}
                </div>
            </TabPanel>
            <TabPanel value={activeTabValue} index={1}>
            <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2}>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Subject</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Applicant</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Time</Typography>
                            </Grid>
                            <Grid xs={1} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Status</Typography>
                            </Grid>
                            <Grid xs={2} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Actions</Typography>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    {requests.length >= 0 ? (requests.map(
                        request =>
                    <Paper key={request._id} className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2}>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.subject}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.receiver_name}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.time}</Typography>
                            </Grid>
                            <Grid xs={1} item>
                                <DoneIcon className={classes.doneIcon}/>
                            </Grid>
                            <Grid xs={2} item>
                                <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<VisibilityIcon />}
                                onClick={() => this.handleModalOpen(request)}
                              >
                                View
                          </Button>
                          <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                                onClick={() => this.handleDialogOpen(request)}
                              >
                                Delete
                          </Button>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    )) : (<Loading/>)}
                </div>
            </TabPanel>
            <TabPanel value={activeTabValue} index={2}>
            <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2}>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Subject</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Applicant</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography style={{fontWeight: "bold"}} variant="subtitle1">Time</Typography>
                            </Grid>
                            <Grid xs={1} item>
                              <Typography style={{fontWeight: "bold"}} variant="subtitle1">Status</Typography>
                            </Grid>
                            <Grid xs={2} item>
                              <Typography style={{fontWeight: "bold"}} variant="subtitle1">Actions</Typography>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    {requests.length >= 0 ? (requests.map(
                        request =>
                    <Paper key={request._id} className={classes.paper}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="row" spacing={2}>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.subject}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.receiver_name}</Typography>
                            </Grid>
                            <Grid xs={3} item>
                                <Typography variant="subtitle1">{request.time}</Typography>
                            </Grid>
                            <Grid xs={1} item>
                                <ClearIcon className={classes.clearIcon}/>
                            </Grid>
                            <Grid xs={2} item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<VisibilityIcon />}
                                onClick={() => this.handleModalOpen(request)}
                              >
                                View
                          </Button>
                          <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                                onClick={() => this.handleDialogOpen(request)}
                              >
                                Delete
                          </Button>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                    )) : (<Loading/>)}
                </div>
            </TabPanel>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(UserDashboard);
