import './App.css';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
// import { APIKey } from './configs'
import SwipeableViews from 'react-swipeable-views';
import { AppBar, Toolbar } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import ClipLoader from "react-spinners/ClipLoader";
import { LocationSearchInput } from './Placesautocomplete';
import Rating from '@material-ui/lab/Rating';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 545,
    margin: '0 auto'
  },
  media: {
    // width: 500,
    height: 400,
    paddingTop: '56.25%', // 16:9
  },


  avatar: {
    backgroundColor: red[500],
  },
}));


const Header = () => {
  const displayDesktop = () => {
    return <Toolbar>Tinder for Restaurants</Toolbar>;
  };

  return (
    <header>
      <AppBar>{displayDesktop()}</AppBar>
    </header>
  );
}

function App() {

  const [data, setData] = useState(null)
  const [click, setClick] = useState(false)
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [latlng, setLatlng] = useState("")

  const [loading, setLoading] = useState(false);

  const classes = useStyles();


  const fetchData = async () => {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${APIKey}`);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    const targetUrl = `https://yelp-backend-test.herokuapp.com/api/v1/resturants?location=${city}&term=resturants&radius=8000&sort_by=best_match&categories=${search}&longitude=${latlng?.lng}&latitude=${latlng?.lat}`
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    fetch(targetUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        setClick(true)
        setData(result?.results?.businesses)
        setLoading(false)
      })
      .catch(error => console.log('error=', error));

  }

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          setLatlng({ lat: position.coords.latitude, lng: position.coords.longitude })
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true&key=${APIKey}`)
            .then(response => response.json())
            .then(result => {
              // console.log(result?.results[0]?.formatted_address);
              setCity(result?.results[0]?.formatted_address)
              // setData(result?.results?.businesses)
              // setLoading(false)
            })
            .catch(error => console.log('error=', error));
        }
        // console.log({lat: position.coords.latitude , lng: position.coords.longitude});

      }, () => {
        console.log('Unable to retrieve your location');
      });
    }
  }, []);

  const onSearch = () => {
    setLoading(true);
    setData(null);
    fetchData()
  };

  const handleChange = (val) => {
    // if (type == 'city') setCity(val)
    setSearch(val)
  }
  const handleChangeAddress = (val) => {
    setCity(val)
  }
  console.log(click, data, loading);
  return (<>
    <div style={{
      textAlign: 'center',
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"
    }}>
      <ClipLoader loading={loading} color="red" size={100} /></div>
    <div className="App container">
      <div className="mb-5">
        <Header />
      </div>
      <div className="row my-5 py-5 ">
        <div className="col-md-5">

          <label className="mb-0 d-block mt-2" style={{ fontSize: 20, fontWeight: 'bold' }}>Enter Search Place</label>
          <LocationSearchInput city={city} handleChangeAddress={handleChangeAddress} setLatlng={setLatlng} />
        </div>
        {/* <TextField onChange={(e) => handleChange('city', e.target.value)} style={{ width: 350, margin: 20 }} id="outlined-basic" label=" Enter City" variant="outlined" /> */}
        <div className="col-md-5">  <label className="mb-0 d-block mt-2" style={{ fontSize: 20, fontWeight: 'bold' }}>Enter Search Term</label>

          <input placeholder="Search Term ..." onChange={(e) => handleChange(e.target.value)} className="search-input" label=" Enter Search Term" />
        </div>
        {/* <TextField style={{ width: 300, margin: 20 }} id="outlined-basic" label=" Enter Zip code" variant="outlined" /> */}

        <div className="col-md-2">
          <Button className="btn btn-primary btn-lg margin-btn" type="primary" onClick={() => onSearch()}> Search</Button>
        </div>
      </div>
      {data && data?.length ?
        <div className="row  m-1">
          <SwipeableViews enableMouseEvents >
            {data?.map((item, i) => {
              return (
                <div key={i}>
                  <Card className={[classes.root], "card_root"}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                          {item?.name.charAt(0).toUpperCase()}
                        </Avatar>
                      }

                      title={item?.name}
                      subheader={<><span>{item?.phone}</span><br />
                        <Rating name="read-only" precision={0.5} value={item?.rating} size="small" readOnly /> </>}
                    />
                    <CardMedia
                      className={[classes.media, "card_media"]}
                      image={item?.image_url}
                    // title="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {`${item?.location?.address1} ${item?.location?.address2} ${item?.location?.address3}, ${item?.location?.city}, ${item?.location?.country}`}
                      </Typography>
                    </CardContent>
                    <div className="mb-3">
                      {item?.categories?.map((el, ind) => {
                        return (
                          <Chip label={el?.title} color="primary" className="m-1" key={ind} />
                        )
                      })

                      }</div>

                  </Card>
                </div>
              )
            }

            )}



          </SwipeableViews>
        </div>

        : (click == true && (!data || data.length == 0) && loading == false) ?
          <h3 className="mt-5"> No Record Found!</h3> : <></>
      }


    </div>
  </>);
}

export default App;
