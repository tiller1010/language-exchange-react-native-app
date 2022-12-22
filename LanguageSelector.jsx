import { useState } from 'react';
const languages = require('language-list')();
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

export default function LanguageSelector(props) {
	const [languageControlStatus, toggleLanguageControls] = useState('')

	const { name, id, onChange, value } = props;

	// Required unless specified otherwise
	let required = true;
	if (props.required === false) {
		required = false;
	}

	// Get all languages and format the selection array
	let languagesArray = [];
	languages.getLanguageCodes().forEach((langCode) => {
		languagesArray.push({
			languageName: languages.getLanguageName(langCode),
			langCode,
		});
	});

	// Filter for select languages
	const validLanguages = [
		'English',
		'Spanish',
		'French',
		'German',
		'Italian',
		'Japanese',
		'Korean',
		'Russian',
		'Chinese',
		'Swedish',
		'Finnish',
		'Arabic',
	];
	languagesArray = languagesArray.filter((lang) => validLanguages.indexOf(lang.languageName) != -1);

	// Custom languages
	languagesArray.push({
		languageName: 'ASL',
		langCode: 'ASL',
	});
	languagesArray.push({
		languageName: 'Ukrainian',
		langCode: 'Ukrainian',
	});

	// Sort langauges by name
	languagesArray = languagesArray.sort((a, b) => a.languageName.localeCompare(b.languageName));

	return (
		<View className={`field dropdown ${props.className || ''}`}>
			<Text htmlFor={id}>Language</Text>
			<Menu
				anchor={<Button onPress={() => toggleLanguageControls(languageControlStatus ? '' : 'visible')} icon="tune" mode="contained" labelStyle={{color: 'white'}}>Language</Button>}
				visible={languageControlStatus}
			>
				<RadioButton.Group>
					<RadioButton.Item label="Select a language" value={''} onPress={onChange} />
					{languagesArray.map((lang) =>
						<RadioButton.Item label={lang.languageName} key={lang.langCode} value={lang.languageName} onPress={onChange} />
					)}
				</RadioButton.Group>
				<Menu.Item icon="close" title="Close" onPress={() => toggleLanguageControls(languageControlStatus ? '' : 'visible')}/>
			</Menu>
		</View>
	)
}