import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopicLink from './TopicLink.jsx';
import LessonSearchForm from './LessonSearchForm.jsx';

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
				this.setState({
					levels,
					loaded: true,
					languageOfTopic,
				});
			})
			.catch((e) => console.log(e));
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
					<View style={{ ...Styles.pad, width: 400 }}>
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
							<Text style={Styles.subheading}>{level.attributes.Level}</Text>
							<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
									this.props.navigation.navigate('Level', {levelID: level.id})
								}
							>{`Level ${level.attributes.Level}`}</Button>
							</>
						}
						<View>
						</View>
						{level.attributes.topics.data ?
							<View>
								{this.randomTopics(level).map((topic) =>
									<View key={topic.id} style={Styles.pad}>
										<View>
											<TopicLink topic={topic} levelID={level.id} showChallenge={showChallenge} navigation={this.props.navigation}/>
										</View>
									</View>
								)}
							</View>
							:
							<>{loaded ? <Text>No topics</Text> : <View><View></View><View></View><View></View></View>}</>
						}
					</View>
				</View>
			)
		);
	}

	render(){

		const { levels, loaded, languageOfTopic, initialLoadView } = this.state;

		return (
			<ScrollView>
				<View style={Styles.pad}>

					<Text style={Styles.heading}>Lessons Feed</Text>
					<View>
						{ this.props.SearchFormHeading ? <Text>{this.props.SearchFormHeading}</Text> : '' }
						<LessonSearchForm
							onSubmit={this.onSeachSubmitCallback}
							languageOfTopic={languageOfTopic || null}
						/>
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
							<ScrollView horizontal>
								{this.renderLevels()}
							</ScrollView>
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
			</ScrollView>
		);
	}
}

export default LessonsFeed;