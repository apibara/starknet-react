import { StyleSheet } from 'react-native'

export const welcome_styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  container_1: {
    paddingHorizontal: 20,
    marginTop: 100,
  },
  container_2: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  container_3: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  button_container: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 12.5,
  },
  h4: {
    color: '#008080',
    fontSize: 18,
    fontWeight: '400',
  },
  title: {
    color: '#008080',
    fontSize: 25,
    fontWeight: '700',
  },
  welcome: {
    color: '#000000',
    fontSize: 25,
    fontWeight: '700',
  },
  app_name: {
    color: '#008080',
    fontSize: 25,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 250,
  },
})

export const setup_styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: '100%',
  },
  title: {
    color: '#008080',
    fontSize: 32,
    fontWeight: '700',
  },
  address: {
    marginTop: 25,
    color: '#FF8000',
    fontSize: 24,
    fontWeight: '700',
  },
  instruction: {
    marginTop: 25,
    color: '#000000',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  urlBox: {
    marginTop: 25,
    backgroundColor: '#FFE599',
    padding: 20,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: '#FF8000',
  },
  url: {
    color: '#FF8000',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 12.5,
    width: '100%',
  },
})
