import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, FlatList } from 'react-native';

// const buttonStyles = StyleSheet.create({
// 	container: {
// 	    flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		padding: '20 30px',
// 		backgroundColor: '#555',
// 		color: '#fff'
// 	}
// });

			// <ScrollView>
			// 	<View>
			// 	<FlatList
			// 		data={[
			// 			{key:'Wake up'},
			// 			{key:'Make coffee'},
			// 			{key:'Do sign'},
			// 			{key:'Turn on pc'},
			// 		]}
			// 		renderItem={({item}) => <Text>{item.key}</Text>}
			// 	/>
			// 	<Text>The currentPage is {this.state.currentPage}</Text>
			// 	<View>
			// 		<Button style={buttonStyles} onPress={this.nextPage} title="Next"/>
			// 	</View>
			// 	<Text>Your name: {this.state.name}</Text>
			// 	<TextInput style={{height: 40}} onChangeText={(text) => this.setState({name: text})} />
			// 	</View>
			// </ScrollView>


			// <div className="pad">
			// 	<h1>Video Submissions</h1>
			// 	<form action="/videos" method="GET">
			// 		<label htmlFor="keywords">Search Terms</label>
			// 		<input type="text" name="keywords"/>
			// 		<input type="submit" value="Search"/>
			// 	</form>
			//     <a href="/videos">View all videos</a>

			//     <hr/>

			//     {this.state.levels ?
			//     	this.state.levels.map((level) => 
			//     		<div key={this.state.levels.indexOf(level)} className="flex x-center">
			// 	    		<a href={`/level/${level.id}`} className="pure-u-1 text-center"><h2>Level {level.Level}</h2></a>
			// 	    		{level.topics ?
			// 	    			<div className="topics pure-u-1 flex x-space-around">
			// 		    			{level.topics.map((topic) =>
			// 	    					<a key={level.topics.indexOf(topic)} href={`/level/${level.id}/topics/${topic.id}`} className="topic pure-u-1-2">
			// 			    					<h3 className="text-center">{topic.Topic}</h3>
			// 			    					{this.renderMedia(topic)}
			// 	    					</a>
			// 	    				)}
			//     				</div>
			//     				:
			//     				<p>No topics</p>
			// 	    		}
			//     		</div>
		 //    		) 
			//     	:
			//     	<h2>No levels</h2>
			//     }
			// </div>

const buttonStyles = {
    display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'skyblue',
	color: 'white',
	height: 150,
	width: 150
}

const pad = {
	padding: 20
}

const flex = {
	flex: 1,
	flexDirection: 'row'
}

const fullWidth = {
	width: 100
}

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentPage: 1,
			name: ''
		}
		this.nextPage = this.nextPage.bind(this);
	}

	nextPage(){
		var currentPage = this.state.currentPage;
		this.setState({
			currentPage: currentPage + 1
		});
	}

	componentDidMount(){

		// axios.get('http://http://192.168.1.5:1337/levels')
		fetch('http://http://192.168.1.5:1337/levels')
			.then(res => {
				this.setState({
					levels: res.data
				});
			})
	}

	renderMedia(topic){
		if(topic.FeaturedImage){
			switch(topic.FeaturedImage.mime){
				case 'image/jpeg':
					return (
						<View className="img-container">
							<Image source={{uri: `http://http://192.168.1.5:1337${topic.FeaturedImage.url}`}}/>
						</View>
					);
				default:
					return <Text>Invalid media</Text>
			}
		}
	}

	render(){
		return(
			<View>
				<Text>Video Submissions</Text>
				<View action="/videos" method="GET">
					<Text htmlFor="keywords">Search Terms</Text>
					<TextInput type="text" name="keywords"></TextInput>
					<TextInput type="submit" value="Search"></TextInput>
				</View>
			    <Button title="View all videos" onPress={() =>
					this.props.navigation.navigate('VideosIndex')
				} href="/videos"/>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<View key={this.state.levels.indexOf(level)} className="flex x-center">
				    		<Button title="View all videos" onPress={() =>
									this.props.navigation.navigate('Level', {levelID: level.id})
								}
							/>
				    		{level.topics ?
				    			<View className="topics pure-u-1 flex x-space-around">
					    			{level.topics.map((topic) =>
				    					<View title="button" key={level.topics.indexOf(topic)} href={`/level/${level.id}/topics/${topic.id}`} className="topic pure-u-1-2">
						    					<Text className="text-center">{topic.Topic}</Text>
						    					{this.renderMedia(topic)}
				    					</View>
				    				)}
			    				</View>
			    				:
			    				<Text>No topics</Text>
				    		}
			    		</View>
		    		) 
			    	:
			    	<Text>No levels</Text>
			    }
			</View>
		);
	}
}

export default Home;