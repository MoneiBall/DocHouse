import React, { Component, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import amber from '@material-ui/core/colors/amber';
import lime from '@material-ui/core/colors/lime';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Loading from './Loading';





const formLabelsTheme = createMuiTheme({
    palette: {
      error: {
        main: '#4caf50',
      },
        primary: amber,
        secondary: lime,
  }
})

const styles = theme => ({
  container: {
    display: 'flex',
    marginTop: '20px',
    marginBottom: '20px',
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 800,
    flexDirection: 'column',
    backgroundColor: 'theme.palette.background.paper',
    boxShadow: theme.shadows[5],
    transform: 'translate(0%, 250%)',
  },

  notFound: {
    marginBottom: '50px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(2),
    maxWidth: 800,
    transform: 'translate(0%, 250%)',
    boxShadow: theme.shadows[3],
    backgroundColor: 'theme.palette.background.paper'

    // display: 'flex',
    // marginBottom: '100px',
    // padding: theme.spacing(2),
    // margin: 'auto',
    // maxWidth: 800,
    // flexDirection: 'column',
    // backgroundColor: 'theme.palette.background.paper',
    // boxShadow: theme.shadows[5],
    // transform: 'translate(0%, 250%)',
  },
  img: {
    width: 128,
    height: 128,
  },
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -65%)',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: theme.spacing(50),
    backgroundColor: 'theme.palette.background.paper',
    boxShadow: theme.shadows[5]
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.warning.main
  },
  submit: {
    marginTop: theme.spacing(3)
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.success.main
  },
  footer: {
    marginTop: theme.spacing(2)
  },
  errorText: {
    color: '#4caf50',
    marginTop: '5px'
  }
});

class SearchDoctor extends Component {
  state = {
    searched: false,
    condition_docname: '',
    city_region: '',
    speciality: '',
    doctors: [],
    errors: {}
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(() => ({ [name]: value }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { condition_docname, city_region } = this.state;
    try {
      const token = localStorage.getItem('auth-token');
      // make appropriate search result
      const result = await axios.get('http://localhost:5000/doctors/',
        {headers: {"x-auth-token": token},
        params: {'condition_docname': condition_docname, 'city_region': city_region}
      });            
      
      this.setState({
        doctors: result.data
      });
    } catch (err) {
      console.log(err);
    }
    this.setState({searched: true})
  };

  render() {
    const {classes} = this.props;
    const {doctors,searched} = this.state;
    console.log(this.state)

    return (
      <React.Fragment>
        <Navbar/>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SearchIcon />
            </Avatar>
            <Typography variant="h5">Search for top doctors</Typography>
            <MuiThemeProvider theme={formLabelsTheme}>
            <form onSubmit={this.handleSubmit} noValidate>
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="condition_docname">Condition, procedure or doctor name</InputLabel>
                <Input
                  onChange={this.handleInputChange}
                  id="condition_docname"
                  name="condition_docname"
                  autoComplete="condition"
                  autoFocus
                />
              </FormControl>
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="city_region">City or region</InputLabel>
                <Input
                  onChange={this.handleInputChange}
                  name="city_region"
                  id="city_region"
                  autoComplete="current-city"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Search
              </Button>
            </form>
            </MuiThemeProvider>
          </Paper>
        </main>

     
    {doctors.length ? 
      doctors.map(
        doctor => 
      <Paper key={doctor._id} className={classes.container}>
        <Grid container spacing={6}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={require('../assets/avatarDoctor.png')} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                  Dr. {doctor.first_name} {doctor.last_name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {doctor.speciality}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  110 West 14th StreetNew YorkNY10011
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  * 4.41 (254 Reviews)
                </Typography>
              </Grid>
              <Grid item >
              <Button
                size="small"
                type="submit"
                variant="contained"
                color="primary"
              >
                View profile
              </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Free Consultation</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>)

    : 
      searched &&
      (<Paper className={classes.notFound}>
      <Typography variant="h6">Your search did not match any documents</Typography>
      <ul>
        <li><Typography variant="subtitle1">Make sure that all words spelled correctly. </Typography></li>
        <li><Typography variant="subtitle1">Try different keywords. </Typography></li>
        <li><Typography variant="subtitle1">Try more general keywords. </Typography></li>
      </ul>
    </Paper>)}

      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SearchDoctor);
