import * as React from 'react';
import graphQLFetch from '../graphQLFetch.js';
import LanguageSelector from './LanguageSelector.jsx';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import Styles from '../Styles.js';

export default class LessonSearchForm extends React.Component {
  constructor(props){
    super(props);
    let state = {
      topicQuery: '',
      languageOfTopic: '',
    }
    this.state = state;
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.languageOfTopic != this.state.languageOfTopic && this.props.languageOfTopic) {
      var context = this;
      this.setState({ languageOfTopic: this.props.languageOfTopic}, () => {
        context.handleSearchSubmit((new Event('submit')));
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.languageOfTopic != this.props.languageOfTopic && this.props.languageOfTopic) {
      var context = this;
      this.setState({ languageOfTopic: this.props.languageOfTopic}, () => {
        context.handleSearchSubmit((new Event('submit')));
      });
    }
  }

  handleLanguageChange(languageName) {
    this.setState({ languageOfTopic: languageName }, () => {
      this.handleSearchSubmit();
    });
  }

  async handleSearchSubmit() {
    let {
      topicQuery,
      languageOfTopic
    } = this.state;
    topicQuery = topicQuery.replace(/\s$/, '');

    const query = `query searchLessons($topicQuery: String, $languageOfTopic: String){
      searchLessons(topicQuery: $topicQuery, languageOfTopic: $languageOfTopic){
        levels {
          id
          attributes {
            Level
            topics {
              data {
                id
                attributes {
                  Topic
                  FeaturedMedia {
                    data {
                      attributes {
                        mime
                        url
                        alternativeText
                      }
                    }
                  }
                  challenges {
                    data {
                      attributes {
                        Title
                        Content
                        FeaturedMedia {
                          data {
                            attributes {
                              mime
                              url
                              alternativeText
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        showChallenge
      }
    }`;
    const data = await graphQLFetch(query, {
      topicQuery,
      languageOfTopic,
    });

    data.lessonLanguageFilter = languageOfTopic;

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  render(){

    const { topicQuery, languageOfTopic } = this.state;

    return(
      <View>
        <View>
          <Searchbar type="text" placeholder="Search" onChangeText={(text) => this.setState({topicQuery: text})} value={this.state.topicQuery}
            style={{
              borderWidth: 1,
              borderColor: 'black'
            }}
            onIconPress={this.handleSearchSubmit}
            onSubmitEditing={this.handleSearchSubmit}
          />
        </View>
        <View style={{...Styles.flex, ...Styles.xCenter}}>
          <View style={Styles.halfPad}>
            <LanguageSelector name="languageOfTopic" id="lessonContent_languageOfTopicField" onChange={this.handleLanguageChange} value={languageOfTopic} required={false}/>
          </View>
          <View style={Styles.halfPad}>
            <Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={this.handleSearchSubmit}>
              Search
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
