import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LessonsFeed extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			levels: [],
			loaded: false,
			showChallenge: false,
			initialLoadView: true,
			languageOfTopic: '',
		}
		this.onSeachSubmitCallback = this.onSeachSubmitCallback.bind(this);
		this.renderLevels = this.renderLevels.bind(this);
	}

	async componentDidMount(){
		const languageOfTopic = await AsyncStorage.getItem('@lessonLanguageFilter');
		console.log('Fetching from:', process.env.STRAPI_URL);
		axios.get(`${process.env.STRAPI_URL}/levels\
?populate[topics][populate]=FeaturedMedia\
&sort[0]=Level\
&filters[Level][$contains]=1\
`)
			.then(res => {
				const data = res.data;
				const levels = data.data;
				// console.log(data)
				this.setState({
					levels,
					loaded: true,
					// languageOfTopic,
				});
			})
			.catch((e) => console.log('THIS IS A BIG FAT ERROR MESSAGE', e));
	}

	randomTopics(level){
		if(level.attributes.topicsRandomized){
			return level.attributes.topics.data;
		} else {
			level.topicsRandomized = true;
			level.attributes.topics.data = level.attributes.topics.data.sort(() => .5 - Math.random()).slice(0, 5);
			return level.attributes.topics.data;
		}
	}

	onSeachSubmitCallback(data){
		if(data.searchLessons){
			if(data.searchLessons.levels){
				sessionStorage.setItem('lessonLanguageFilter', data.lessonLanguageFilter);
				this.setState({
					levels: data.searchLessons.levels,
					showChallenge: data.searchLessons.showChallenge,
					initialLoadView: false,
				});
			}
		}
	}

	renderLevels() {

		const { levels, loaded, showChallenge, initialLoadView } = this.state;

		return (
			levels.map((level) => 
				<View key={level.id}>
					{initialLoadView ?
						<>
						<Text>{level.attributes.Level.replace(/\d|\s/g, '')}</Text>
						<View>
							<Button icon="arrow-right" onPress={() => this.setState({ languageOfTopic: level.attributes.Level.replace(/\d|\s/g, '') })}>
								Load more {level.attributes.Level.replace(/\d|\s/g, '')}
							</Button>
						</View>
						</>
						:
						<>
						<Text>{level.attributes.Level}</Text>
						<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
								this.props.navigation.navigate('Level', {levelID: level.id})
							}
						>{`Level ${level.Level}`}</Button>
						</>
					}
					<View className="pure-u-1">
					</View>
					{level.attributes.topics.data ?
						<View>
							{this.randomTopics(level).map((topic) =>
								<View key={topic.id}>
									<View>
										{/*
										<TopicLink topic={topic} levelID={level.id} showChallenge={showChallenge}/>
										*/}
									</View>
								</View>
							)}
						</View>
						:
						<>{loaded ? <p>No topics</p> : <View><View></View><View></View><View></View></View>}</>
					}
				</View>
			)
		);
	}

	render(){

		const { levels, loaded, languageOfTopic, initialLoadView } = this.state;

		return (
			<View className="fw-container">

				<Text>LessonsFeed</Text>
				<View className="page-form">
					{ this.props.SearchFormHeading ? <Text>{this.props.SearchFormHeading}</Text> : '' }
					{/*
					<LessonSearchForm
						onSubmit={this.onSeachSubmitCallback}
						languageOfTopic={languageOfTopic || null}
					/>
					*/}
					{!this.props.HideClearFilters ?
						<View>
								<Text>Clear filters</Text>
						</View>
						:
						''
					}
				</View>

				{levels.length ?
					<>
					{initialLoadView ?
						<View>
							{this.renderLevels()}
						</View>
						:
						<>
							{this.renderLevels()}
						</>
					}
					</>
					:
					<>{loaded ? <Text>No levels</Text> : <View><View></View><View></View><View></View></View>}</>
				}

			</View>
		);
	}
}

export default LessonsFeed;