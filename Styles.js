import { StyleSheet } from 'react-native';

export default Styles = StyleSheet.create({
	container: {
	    flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: '20 30px',
		backgroundColor: '#555',
		color: '#fff'
	},
	buttonStyles: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'skyblue',
		color: 'white',
		height: 150,
		width: 150
	},
	pad: {
		padding: 20
	},
	flex: {
		flex: 1,
		flexDirection: 'row'
	},
	column: {
		flexDirection: 'column'
	},
	xCenter: {
		justifyContent: 'center'
	},
	xSpaceBetween: {
		justifyContent: 'space-between'
	},
	fullWidth: {
		width: '100%'
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	subHeading: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});