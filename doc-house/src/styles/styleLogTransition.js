export const styles = theme => ({
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
      transform: 'translate(-50%, -50%)',
      padding: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: theme.spacing(50),
      backgroundColor: 'theme.palette.background.paper',
      boxShadow: theme.shadows[6]
    },
    submit: {
      marginTop: theme.spacing(3),
    },
    link: {
      textDecoration: 'none'
    },
    footer: {
      marginTop: theme.spacing(2)
    }
  });