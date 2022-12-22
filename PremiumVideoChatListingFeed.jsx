import * as React from 'react';
import PremiumVideoChatListing from './PremiumVideoChatListing.jsx';
import graphQLFetch from './graphQLFetch.js';
import LanguageSelector from './LanguageSelector.jsx';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';

export default class PremiumVideoChatListingFeed extends React.Component {
	constructor(props){
		super(props);
		let state = {
			topic: '',
			languageOfTopic: '',
			premiumVideoChatListings: [],
			loaded: false,
		}
		this.state = state;
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	async componentDidMount(){

		const query = `query getRecentPremiumVideoChatListings{
			getRecentPremiumVideoChatListings{
				listings {
					_id
					topic
					languageOfTopic
					duration
					price
					currency
					thumbnailSrc
					userID
					timeSlots {
						date
						time
						customerUserID
						completed
						booked
						paid
					}
				}
			}
		}`;
		const data = await graphQLFetch(query);
		if(data.getRecentPremiumVideoChatListings){
			if(data.getRecentPremiumVideoChatListings.listings){
				this.setState({
					premiumVideoChatListings: data.getRecentPremiumVideoChatListings.listings,
					loaded: true,
				});
			}
		}
	}

	handleLanguageChange(event) {
		this.setState({ languageOfTopic: event.target.value });
		// const searchButton = event.target.form.querySelector('button[value="Search"]');
		// searchButton.contentEditable = true; // Trick browser to use ":focus-within" for outline effect
		// searchButton.focus();
		// setTimeout(() => {
		// 	searchButton.contentEditable = false;
		// }, 1)
	}

	async handleSearchSubmit(event){

		event.preventDefault();

		let {
			topic,
			languageOfTopic
		} = this.state;
		topic = topic.replace(/\s$/, '');

		const query = `query searchPremiumVideoChatListings($topic: String, $languageOfTopic: String){
			searchPremiumVideoChatListings(topic: $topic, languageOfTopic: $languageOfTopic){
				listings {
					_id
					topic
					languageOfTopic
					duration
					price
					currency
					thumbnailSrc
					userID
					timeSlots {
						date
						time
						customerUserID
						completed
						booked
						paid
					}
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			topic,
			languageOfTopic,
		});
		if(data.searchPremiumVideoChatListings){
			if(data.searchPremiumVideoChatListings.listings){
				this.setState({
					premiumVideoChatListings: data.searchPremiumVideoChatListings.listings
				});
			}
		}
	}

	render(){

		const { authenticatedUserID } = this.props;

		let {
			premiumVideoChatListings,
			topic,
			languageOfTopic,
			loaded,
		} = this.state;

		return(
			<View>
				<View className="page-form" style={{ marginBottom: '60px' }}>
					{ this.props.SearchFormHeading ? <Text style={{ textAlign: 'right' }}>{this.props.SearchFormHeading}</Text> : '' }
					<View className="fw-form search-form">
						<View className="flex-container flex-vertical-stretch">
							<View className="field text tablet-100">
								<Text htmlFor="topicField">Topic</Text>
								<Searchbar type="text" placeholder="Search" onChangeText={(text) => this.setState({topic: text})} value={topic}
									style={{
										borderWidth: 1,
										borderColor: 'black'
									}}
									onIconPress={this.handleSearchSubmit}
									onSubmitEditing={this.handleSearchSubmit}
								/>
							</View>
							<View className="flex-container tablet-100" style={{ flexWrap: 'nowrap' }}>
								<View className="tablet-100">
									<LanguageSelector name="languageOfTopic" id="videoChat_languageOfTopicField" onChange={this.handleLanguageChange} value={languageOfTopic} required={false}/>
								</View>
								<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={this.handleSubmit}>Search</Button>
							</View>
						</View>
					</View>
					{!this.props.HideClearFilters ?
						<View>
						{/*
							<a href="/chats" aria-label="Clear filters" className="button">
								Clear filters
							</a>
						*/}
						</View>
						:
						''
					}
				</View>
				{premiumVideoChatListings.length ?
					<ScrollView horizontal>
						{premiumVideoChatListings.map((listing) =>
							<View key={premiumVideoChatListings.indexOf(listing)}>
								<PremiumVideoChatListing premiumVideoChatListing={listing} authenticatedUserID={authenticatedUserID} view={authenticatedUserID == listing.userID ? 'owner' : 'customer'}/>
							</View>
						)}
					</ScrollView>
					:
					<>{loaded ? <Text>No video chats found</Text> : <View className="lds-facebook"><View></View><View></View><View></View></View>}</>
				}
			</View>
		);
	}
}