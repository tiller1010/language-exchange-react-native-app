import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import graphQLFetch from '../graphQLFetch.js';

import { Text, View, TextInput, Image, Button as TextButton } from 'react-native';
import { Checkbox } from 'react-native-paper';

export default class PremiumVideoChatListing extends React.Component {
  constructor(props){
    super(props);
    let state = {
      ownerDisplayName: '',
      timeSlots: [],
    }
    this.state = state;
    this.handleTimeSlotChange = this.handleTimeSlotChange.bind(this);
    this.getUserNameByID = this.getUserNameByID.bind(this);
    this.renderTimeSlots = this.renderTimeSlots.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
  }

  async componentWillMount(){
    let ownerDisplayName = '';
    if(this.props.premiumVideoChatListing.userID){
      ownerDisplayName = await this.getUserNameByID(this.props.premiumVideoChatListing.userID);
    }
    let propTimeSlots = this.props.premiumVideoChatListing.timeSlots;
    let newTimeSlots = [];
    for(let timeSlot of propTimeSlots){
      let newTimeSlot = { ...timeSlot };
      let customerDisplayName = '';
      if(timeSlot.customerUserID){
        customerDisplayName = await this.getUserNameByID(timeSlot.customerUserID);
      }
      newTimeSlot.customerDisplayName = customerDisplayName;
      newTimeSlots.push(newTimeSlot);
    }
    this.setState({
      ownerDisplayName,
      timeSlots: newTimeSlots,
    });
  }

  async componentWillReceiveProps(nextProps){
    if(this.state.timeSlots != nextProps.premiumVideoChatListing.timeSlots){
      let stateTimeSlots = this.state.timeSlots;
      let propTimeSlots = nextProps.premiumVideoChatListing.timeSlots;
      let newTimeSlots = [];
      for(let timeSlot of propTimeSlots){
        let newTimeSlot = {
          ...timeSlot,
          completed: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].completed : timeSlot.completed,
          booked: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].booked : timeSlot.booked,
          paid: stateTimeSlots[propTimeSlots.indexOf(timeSlot)] ? stateTimeSlots[propTimeSlots.indexOf(timeSlot)].paid : timeSlot.paid,
        };
        let customerDisplayName = '';
        if(timeSlot.customerUserID){
          customerDisplayName = await this.getUserNameByID(timeSlot.customerUserID);
        }
        newTimeSlot.customerDisplayName = customerDisplayName;
        newTimeSlots.push(newTimeSlot);
      }
      await this.setState({
        timeSlots: newTimeSlots,
      });
    }
  }

  async handleTimeSlotChange(checked, timeSlotIndex){

    const { authenticatedUserID } = this.props;

    if(authenticatedUserID){
      let { timeSlots } = this.state;
      let timeSlot = timeSlots[timeSlotIndex];
      let query = '';
      if(this.props.view == 'owner'){
        timeSlot.completed = checked;
        query = `mutation updatePremiumVideoChatListing($listingID: ID!, $premiumVideoChatListing: PremiumVideoChatListingInputs, $file: Upload){
          updatePremiumVideoChatListing(listingID: $listingID, premiumVideoChatListing: $premiumVideoChatListing, thumbnailFile: $file){
            timeSlots {
              customerUserID
              date
              time
              completed
              booked
              paid
            }
          }
        }`;
      } else {
        timeSlot.booked = checked;
        timeSlot.tempCustomerUserID = checked ? authenticatedUserID : null;
      }
      timeSlots[timeSlotIndex] = timeSlot;

      this.setState({
        timeSlots,
      });

      if(query){
        // Format timeSlots as VideoChatTimeSlotInputs
        let graphql_timeSlots = [];
        timeSlots.forEach((timeSlotData) => {
          graphql_timeSlots.push({
            customerUserID: timeSlotData.customerUserID,
            date: timeSlotData.date,
            time: timeSlotData.time,
            completed: timeSlotData.completed,
            booked: timeSlotData.booked,
            paid: timeSlotData.paid,
          });
        });
        const data = await graphQLFetch(query, {
          listingID: this.props.premiumVideoChatListing._id,
          premiumVideoChatListing: {
            timeSlots: graphql_timeSlots
          }
        }, false);
      }

    } else {
      alert('Must be signed in to buy.');
    }
  }

  async getUserNameByID(userID){
    const user = await fetch(`${process.env.APP_SERVER_URL}/user/${userID}`)
      .then((response) => response.json());
    if (user) {
      return user.displayName;
    }
    return '';
  }

  renderTimeSlots(){

    let { timeSlots } = this.state;

    switch(this.props.view){
      case 'owner':
      return timeSlots.map((timeSlot) =>
        <View key={timeSlots.indexOf(timeSlot)} style={{ margin: '10px 0', borderBottom: '1px dotted black' }}>
          {timeSlot.customerUserID ?
            <View>
              <Text>Video Chat with: {timeSlot.customerDisplayName}</Text>
              <Text>{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</Text>
              {timeSlot.booked && !timeSlot.paid ?
                <Text>!! CUSTOMER HAS NOT COMPLETED THIS PURCHASE !!</Text>
                :
                <Text></Text>
              }
              <a className="button" href={`/video-chat?forUserID=${timeSlot.customerUserID}`}>
                Go to Video Chat
              </a>
              <View className="field checkbox" style={{ whiteSpace: 'nowrap' }}>
                <Checkbox
                  status={timeSlot.completed ? 'checked' : 'unchecked'}
                  onPress={(e) => {
                    this.handleTimeSlotChange(timeSlot.completed, timeSlots.indexOf(timeSlot))
                  }}
                />
                <Text htmlFor={`timeSlot${timeSlots.indexOf(timeSlot)}`}>Mark Completed</Text>
              </View>
            </View>
            :
            <>
              {/* @ts-ignore */}
              <View style={{ margin: '10px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
                <Text>Available &nbsp;{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</Text>
              </View>
            </>
          }
        </View>
      );
      case 'customer':
      return timeSlots.map((timeSlot) =>
        <View key={timeSlots.indexOf(timeSlot)}>
          {timeSlot.customerUserID ?
            <Text></Text>
            :
            <View className="field checkbox" style={{ whiteSpace: 'nowrap' }}>
              <Checkbox
                status={timeSlot.booked ? 'checked' : 'unchecked'}
                onPress={(e) => {
                  this.handleTimeSlotChange(timeSlot.booked, timeSlots.indexOf(timeSlot))
                }}
              />
              <label htmlFor={`timeSlot${timeSlots.indexOf(timeSlot)}`}>{timeSlot.date} - {timeSlot.time.convertTo12HourTime()}</label>
            </View>
          }
        </View>
      );
    }
  }

  async handleBuyNow(e){

    // Mock submit for fw-form-process-event effect
    // const mockForm = document.createElement('form');
    // document.querySelector('.fw-form-process-event').append(mockForm);
    // let submitEvent = new Event('submit');
    // submitEvent.submitter = e.target;
    // mockForm.dispatchEvent(submitEvent);

    const { premiumVideoChatListing, authenticatedUserID } = this.props;
    const { timeSlots } = this.state;

    if(authenticatedUserID){
      const query = `mutation createProduct($productObjectCollection: String!, $productDescription: String!, $productObjectID: ID!, $userID: ID!, $productObjectUpdateData: String!){
        createProduct(productObjectCollection: $productObjectCollection, productDescription: $productDescription, productObjectID: $productObjectID, userID: $userID, productObjectUpdateData: $productObjectUpdateData){
          _id
          userID
          cost
          currency
          orderedOn
          productObject {
            ... on PremiumVideoChatListing{
              _id
              userID
              topic
              languageOfTopic
              duration
              thumbnailSrc
              price
              currency
            }
          }
          priceID
        }
      }`;
      let newTimeSlots = [];
      timeSlots.forEach((timeSlot) => {
        let newTimeSlot = {
          date: timeSlot.date,
          time: timeSlot.time,
          customerUserID: timeSlot.customerUserID,
          completed: timeSlot.completed,
          booked: timeSlot.booked,
          paid: timeSlot.paid,
          shouldAddProductID: false,
        }
        if(timeSlot.tempCustomerUserID){
          newTimeSlot.shouldAddProductID = true;
          newTimeSlot.customerUserID = timeSlot.tempCustomerUserID;
        }
        newTimeSlots.push(newTimeSlot);
      });
      const data = await graphQLFetch(query, {
        productObjectCollection: 'premium_video_chat_listings',
        productDescription: 'Premium Video Chat',
        productObjectID: premiumVideoChatListing._id,
        userID: authenticatedUserID,
        productObjectUpdateData: JSON.stringify({
          timeSlots: newTimeSlots,
        })
      });
      if(data.createProduct){
        if(data.createProduct.priceID && premiumVideoChatListing.userID){

          // Get the user that made the product
          const productUser = await fetch(`/user/${premiumVideoChatListing.userID}`)
            .then((response) => response.json());

          if(productUser.connectedStripeAccountID){

            const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

            fetch('/create-checkout-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                priceID: data.createProduct.priceID,
                connectedStripeAccountID: productUser.connectedStripeAccountID,
              })
            })
            .then(function(response) {
              return response.json();
            })
            .then(function(session) {
              return stripe.redirectToCheckout({ sessionId: session.id });
            })
            .then(function(result) {
              // If `redirectToCheckout` fails due to a browser or network
              // error, you should display the localized error message to your
              // customer using `error.message`.
              if (result.error) {
                alert(result.error.message);
              }
            });
          }

        }
      }
    } else {
      alert('Must be signed in to buy.');
    }
  }

  render(){

    const { ownerDisplayName } = this.state;

    let {
      topic,
      languageOfTopic,
      duration,
      price,
      currency,
      thumbnailSrc,
    } = this.props.premiumVideoChatListing;

    return(
      <View>
        <View className="fw-typography-spacing">
          <Text>{ownerDisplayName}</Text>
          <Text>{topic}</Text>
          <Text>{languageOfTopic}</Text>
          <Text>{duration}</Text>
          <Text>{price}&nbsp;{currency}</Text>
        </View>
        <View className="thumbnail-preview img-container">
          <Image source={{uri: process.env.APP_SERVER_URL + '/' + thumbnailSrc}}
            style={{height: 400, width: '100%'}}
          />
        </View>

        <Text style={{ margin: '35px 0 10px 0', fontSize: '1.5em' }}>Timeslots</Text>
        <View className="fw-form fw-form-process-event" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {this.renderTimeSlots()}
        </View>

        {/* Only Show Buy button if customer selected timeslots */}
        {this.props.view == 'customer' && this.state.timeSlots.filter(timeSlot => timeSlot.tempCustomerUserID).length ?
          <Button onPress={this.handleBuyNow}>
            Buy Now
          </Button>
          :
          ''
        }

      </View>
    );
  }
}
